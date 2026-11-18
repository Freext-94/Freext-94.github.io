import pkg from '@notionhq/client';
import type { Client as NotionClient } from '@notionhq/client';
import dns from 'node:dns';
import {
  COLLECTIONS,
  COLLECTION_KEYS,
  PROP,
  type CollectionKey,
} from './schema';
import {
  isHidden,
  toArticle,
  toExperience,
  toProfile,
  toProject,
  toSkill,
  type NotionRow,
} from './normalize';
import type { Portfolio } from './types';
import type { ProjectDetailBlock } from './types';
import { SAMPLE_PORTFOLIO } from '@/data/fixtures';

const {
  Client,
  collectPaginatedAPI,
  extractNotionId,
  isFullDatabase,
  isFullDataSource,
  isNotionClientError,
} = pkg;

interface NotionConfig {
  token: string;
  ids: Record<CollectionKey, string>;
}

/**
 * 必须逐个用字面量取值：Vite 在构建期做静态替换，
 * `import.meta.env[key]` 这种动态写法在 dev 下正常、build 下全是 undefined。
 */
const ENV_IDS: Record<CollectionKey, string | undefined> = {
  profile: import.meta.env.NOTION_PROFILE_ID,
  projects: import.meta.env.NOTION_PROJECTS_ID,
  skills: import.meta.env.NOTION_SKILLS_ID,
  experience: import.meta.env.NOTION_EXPERIENCE_ID,
  articles: import.meta.env.NOTION_ARTICLES_ID,
};

/** 五个 ID 缺任意一个都视为未接入，退回示例数据 */
function readEnv(): NotionConfig | undefined {
  const token = import.meta.env.NOTION_API_KEY as string | undefined;
  if (!token) return undefined;
  const ids = {} as Record<CollectionKey, string>;
  for (const key of COLLECTION_KEYS) {
    const value = ENV_IDS[key];
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
 * Notion 2025-09-03 起 query 只认 data_source_id，所以先直接查，
 * 只有明确「找不到这个数据源」才退一步按数据库 ID 解析。
 * 网络故障必须原样抛出，否则会被 databases.retrieve 误报成 object_not_found。
 */
async function collectRows(api: NotionClient, data_source_id: string): Promise<NotionRow[]> {
  const rows = await collectPaginatedAPI(api.dataSources.query, {
    data_source_id,
    page_size: 100,
  });
  return rows as unknown as NotionRow[];
}

function isObjectNotFound(error: unknown): boolean {
  return isNotionClientError(error) && error.code === 'object_not_found';
}

/**
 * 本机 DNS 会返回 AAAA 和一个不可达的 A 记录，命中就要等满连接超时。
 * IPv4 优先能显著降低撞上坏地址的概率；CI 与海外网络下这行没有副作用。
 */
function preferIPv4() {
  try {
    dns.setDefaultResultOrder('ipv4first');
  } catch {
    // 运行环境不支持时保持默认解析顺序
  }
}

/** 只有网络与 5xx 这类瞬时故障才值得重试，凭证错误重试三次只是拖慢构建 */
function isTransient(error: unknown): boolean {
  // undici 的连接失败会包装成 TypeError: fetch failed，SDK 不会重试这一类
  if (error instanceof TypeError) return true;
  if (!isNotionClientError(error)) return false;
  switch (error.code) {
    case 'notionhq_client_request_timeout':
    case 'rate_limited':
    case 'internal_server_error':
    case 'service_overload':
    case 'service_unavailable':
    case 'gateway_timeout':
      return true;
    default:
      return false;
  }
}

/** fetch 层面的连接失败不在 SDK 的重试范围内，这里补一层 */
async function withRetry<T>(label: string, run: () => Promise<T>): Promise<T> {
  // 一次构建要打十几个请求，本机到 Notion 的链路又偶发抖动，
  // 只重试两次的话整站构建很容易因为一次抽风就失败
  const attempts = 5;
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await run();
    } catch (error) {
      if (attempt >= attempts || !isTransient(error)) throw error;
      console.warn(
        `[notion] ${label} 第 ${attempt}/${attempts} 次请求失败，${attempt * 600}ms 后重试…`,
      );
      await new Promise((r) => setTimeout(r, attempt * 600));
    }
  }
}

/** Notion 里的数据源名会直接当区块的英文小标题用，所以取回来要 trim */
function richTextName(value: unknown): string | undefined {
  if (!Array.isArray(value)) return undefined;
  const name = value
    .map((item) => (item as { plain_text?: string }).plain_text ?? '')
    .join('')
    .trim();
  return name || undefined;
}

interface Source {
  rows: NotionRow[];
  name: string;
}

/**
 * 数据源名跟着 Notion 走：你在库里改名，页面上的英文小标题同步变。
 * retrieve 顺带确认这个 ID 确实是数据源；取不到名字不影响内容，
 * 退回 schema 里配置的名字，因为标题只是装饰，不值得让整站构建失败。
 */
async function readSource(
  api: NotionClient,
  key: CollectionKey,
  configuredId: string,
): Promise<Source> {
  const fallback = COLLECTIONS[key].title;
  const id = notionId(configuredId);
  let data_source_id = id;
  let name = fallback;

  try {
    const source = await api.dataSources.retrieve({ data_source_id: id });
    // 小标题只是装饰，响应里没带 title 就退回配置值，不值得让整站构建失败
    name = (isFullDataSource(source) && richTextName(source.title)) || fallback;
  } catch (error) {
    // 只有明确「找不到」才当成数据库 ID，网络故障交给 withRetry
    if (!isObjectNotFound(error)) throw error;
    const database = await api.databases.retrieve({ database_id: id });
    if (!isFullDatabase(database)) throw new Error(`${id} 既不是数据源，也不是可读取的数据库`);
    const [first] = database.data_sources;
    if (!first) throw new Error(`数据库 ${id} 下没有可用的数据源`);
    data_source_id = first.id;
    name = richTextName(database.title) ?? fallback;
  }

  return { rows: await collectRows(api, data_source_id), name };
}

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

/**
 * 分类名按中文拼音升序（zh collation）。
 * 注意 ICU 的 zh 排序把拉丁字母排在汉字之后，所以「AI 应用与自动化」
 * 和「Web 开发与 API 集成」会落在最后，不是最前。
 */
const byCategory = (a: { category: string }, b: { category: string }) =>
  a.category.localeCompare(b.category, 'zh');

/** 没填标题的行是库里的占位行，直接丢掉 */
function hasTitle(row: NotionRow, property: string): boolean {
  return (row.properties[property]?.title ?? []).length > 0;
}

interface NotionBlock {
  type: string;
  [key: string]: unknown;
}

function blockText(block: NotionBlock): string {
  const value = block[block.type] as { rich_text?: Array<{ plain_text?: string }> } | undefined;
  return (value?.rich_text ?? []).map((item) => item.plain_text ?? '').join('').trim();
}

function imageUrl(block: NotionBlock): string | undefined {
  const value = block.image as
    | { external?: { url?: string }; file?: { url?: string } }
    | undefined;
  return value?.external?.url ?? value?.file?.url;
}

function toProjectDetails(blocks: NotionBlock[]): ProjectDetailBlock[] {
  const details: ProjectDetailBlock[] = [];
  for (const block of blocks) {
    const text = blockText(block);
    if (block.type === 'heading_1' || block.type === 'heading_2' || block.type === 'heading_3') {
      details.push({ type: 'heading', level: Number(block.type.at(-1)) as 1 | 2 | 3, text });
    } else if (block.type === 'paragraph' && text) {
      details.push({ type: 'paragraph', text });
    } else if (block.type === 'quote' && text) {
      details.push({ type: 'quote', text });
    } else if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
      const ordered = block.type === 'numbered_list_item';
      const previous = details.at(-1);
      if (previous?.type === 'list' && previous.ordered === ordered) previous.items.push(text);
      else details.push({ type: 'list', ordered, items: [text] });
    } else if (block.type === 'image') {
      const url = imageUrl(block);
      if (url) details.push({ type: 'image', url, caption: blockText(block) || undefined });
    }
  }
  return details;
}

async function readProjectDetails(api: NotionClient, pageId: string): Promise<ProjectDetailBlock[]> {
  const blocks = await collectPaginatedAPI(api.blocks.children.list, {
    block_id: pageId,
    page_size: 100,
  });
  return toProjectDetails(blocks as unknown as NotionBlock[]);
}

async function load(): Promise<Portfolio> {
  const config = readEnv();
  if (!config) {
    // 生产构建下静默用示例数据，等于把一个假人的简历发布上线，必须直接失败
    if (!import.meta.env.DEV) {
      throw new Error(
        '[notion] 缺少 NOTION_API_KEY 或五个数据源 ID，拒绝用示例数据构建生产站点。\n' +
          '本地预览请改用 npm run dev；CI 里请检查 Secret 与 Variable 是否都已配置。',
      );
    }
    console.warn('[notion] 未配置完整的 Notion 凭证，本次使用内置示例数据。');
    return { ...SAMPLE_PORTFOLIO, source: 'sample' };
  }

  preferIPv4();
  const api = new Client({ auth: config.token });

  try {
    const [srcProfile, srcProjects, srcSkills, srcExperience, srcArticles] =
      await Promise.all(
        COLLECTION_KEYS.map((key) =>
          withRetry(COLLECTIONS[key].title, () => readSource(api, key, config.ids[key])),
        ),
      );

    const dbNames = {
      profile: srcProfile.name,
      projects: srcProjects.name,
      skills: srcSkills.name,
      experience: srcExperience.name,
      articles: srcArticles.name,
    };

    const [profileRow] = srcProfile.rows;
    if (!profileRow) {
      throw new Error('Profile 库里没有任何记录，页面无法确定姓名与简介。');
    }

    const projects = srcProjects.rows
      .filter((row) => hasTitle(row, PROP.projects.title))
      .map(toProject)
      .sort(byOrder);

    await Promise.all(
      projects.map(async (project) => {
        if (!project.slug) return;
        const row = srcProjects.rows.find((item) => item.id === project.id);
        if (row) project.details = await withRetry(project.name, () => readProjectDetails(api, row.id));
      }),
    );

    return {
      profile: toProfile(profileRow),
      projects,
      // 分类名拼音升序，同组内按熟练度降序
      skills: srcSkills.rows
        .filter((row) => hasTitle(row, PROP.skills.title))
        .filter((row) => !isHidden(row, PROP.skills.visible))
        .map(toSkill)
        .sort((a, b) => byCategory(a, b) || b.level - a.level),
      // 库里 排序 1 就是最近一段，升序即倒序时间线
      experience: srcExperience.rows
        .filter((row) => hasTitle(row, PROP.experience.company))
        .filter((row) => !isHidden(row, PROP.experience.visible))
        .map(toExperience)
        .sort(byOrder),
      articles: srcArticles.rows
        .filter((row) => hasTitle(row, PROP.articles.title))
        .map(toArticle)
        .sort(byOrder),
      dbNames,
      source: 'notion',
    };
  } catch (error) {
    if (isNotionClientError(error)) {
      throw new Error(
        `[notion] 读取失败（${error.code}）：${error.message}\n` +
          '请确认 NOTION_API_KEY 有效，且五个数据库都已通过 ' +
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
