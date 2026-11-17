// 该包只发 CJS 产物，Node 下必须走 default 再解构，具名导入会在构建期报错
import pkg from '@notionhq/client';
import type { Client as NotionClient } from '@notionhq/client';
import { COLLECTIONS } from './schema';
import { toExperience, toLink, toProject, toSkill, type NotionRow } from './normalize';
import type { Portfolio } from './types';
import { SAMPLE_PORTFOLIO } from '@/data/fixtures';

const {
  Client,
  collectPaginatedAPI,
  extractNotionId,
  isFullDatabase,
  isNotionClientError,
} = pkg;

type CollectionKey = keyof typeof COLLECTIONS;
const KEYS = Object.keys(COLLECTIONS) as CollectionKey[];

interface NotionConfig {
  token: string;
  ids: Record<CollectionKey, string>;
}

/** 四个 ID 缺任意一个都视为未接入，退回示例数据 */
function readEnv(): NotionConfig | undefined {
  const token = import.meta.env.NOTION_API_KEY as string | undefined;
  if (!token) return undefined;
  const ids = {} as Record<CollectionKey, string>;
  for (const key of KEYS) {
    const value = import.meta.env[COLLECTIONS[key].envKey] as string | undefined;
    if (!value) return undefined;
    ids[key] = value;
  }
  return { token, ids };
}

/** 兼容直接粘贴 Notion 链接和只填 ID 两种写法 */
function notionId(input: string): string {
  const id = extractNotionId(input.trim());
  if (!id) throw new Error(`无法从「${input}」中解析出 Notion ID`);
  return id;
}

/**
 * 配置项既可以填数据源 ID，也可以填数据库 ID。
 * Notion 2025-09-03 起 query 只认 data_source_id，数据库要多解一层。
 */
async function resolveDataSourceId(api: NotionClient, id: string): Promise<string> {
  try {
    await api.dataSources.retrieve({ data_source_id: id });
    return id;
  } catch {
    const database = await api.databases.retrieve({ database_id: id });
    if (!isFullDatabase(database)) {
      throw new Error(`数据库 ${id} 未返回数据源，请改为直接填数据源 ID`);
    }
    const [first] = database.data_sources;
    if (!first) throw new Error(`数据库 ${id} 下没有可用的数据源`);
    return first.id;
  }
}

async function queryRows(api: NotionClient, configuredId: string): Promise<NotionRow[]> {
  const data_source_id = await resolveDataSourceId(api, notionId(configuredId));
  const rows = await collectPaginatedAPI(api.dataSources.query, {
    data_source_id,
    page_size: 100,
  });
  return rows as unknown as NotionRow[];
}

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;
const byOrderDesc = <T extends { order: number }>(a: T, b: T) => b.order - a.order;

async function load(): Promise<Portfolio> {
  const config = readEnv();
  if (!config) {
    console.warn(
      '[notion] 未配置 NOTION_API_KEY 与四个数据源 ID，本次使用内置示例数据。',
    );
    return { ...SAMPLE_PORTFOLIO, source: 'sample' };
  }

  const api = new Client({ auth: config.token });
  try {
    const [projects, skills, experience, linkRows] = await Promise.all(
      KEYS.map((key) => queryRows(api, config.ids[key])),
    );

    return {
      projects: projects.map(toProject).sort(byOrder),
      skills: skills.map(toSkill).sort(byOrder),
      experience: experience.map(toExperience).sort(byOrderDesc),
      links: linkRows
        .map(toLink)
        .filter((l): l is NonNullable<typeof l> => l !== undefined)
        .sort(byOrder),
      source: 'notion',
    };
  } catch (error) {
    if (isNotionClientError(error)) {
      throw new Error(
        `[notion] 读取失败（${error.code}）：${error.message}\n` +
          '请确认 NOTION_API_KEY 有效，且四个数据库都已通过 ' +
          'Connections → 添加集成 授权给这个 Internal Integration。',
      );
    }
    throw error;
  }
}

let cache: Promise<Portfolio> | undefined;

/** 构建时从 Notion 拉取全部内容，同一次构建只请求一次 */
export function getPortfolio(): Promise<Portfolio> {
  cache ??= load();
  return cache;
}
