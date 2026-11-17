#!/usr/bin/env node
/**
 * 在指定的 Notion 页面下创建主页需要的四个数据库，并写回 .env.local。
 *
 *   node scripts/setup-notion.mjs <Notion 父页面链接> [--write]
 *   node scripts/setup-notion.mjs --check
 *
 * 前置条件：
 *   1. 在 https://www.notion.so/my-integrations 创建 Internal Integration 并拿到 token
 *   2. 打开父页面 → Connections → 添加刚创建的集成
 *   3. token 已写入 .env.local 或作为环境变量导出
 *
 * 重复执行 create 会再建一套同名数据库，不要当成同步命令用。
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import dns from 'node:dns';
// 该包只有 CJS 产物，Node 下必须走 default 再解构（Vite 里不需要）
import notion from '@notionhq/client';
import { COLLECTIONS, toNotionPropertySchema } from '../src/lib/schema.ts';

const { Client, extractNotionId, isNotionClientError } = notion;

// 本机 DNS 会返回 AAAA 和一个不可达的 A 记录，IPv4 优先能少撞超时
try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

const ENV_FILE = '.env.local';
const ORDER = ['profile', 'projects', 'skills', 'experience', 'articles'];

loadDotEnv();

let cachedClient;
function api() {
  requireToken();
  cachedClient ??= new Client({ auth: process.env.NOTION_API_KEY });
  return cachedClient;
}

function loadDotEnv() {
  for (const file of [ENV_FILE, '.env']) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const match = /^\s*([A-Za-z0-9_]+)\s*=\s*(.*)$/.exec(line);
      if (!match) continue;
      const [, key, rawValue] = match;
      if (process.env[key] !== undefined) continue;
      process.env[key] = rawValue.trim().replace(/^(['"])(.*)\1$/, '$2');
    }
  }
}

function requireToken() {
  if (!process.env.NOTION_API_KEY) {
    exit(
      `缺少 NOTION_API_KEY。请先复制 .env.example 为 ${ENV_FILE} 并填入 Internal Integration Token。`,
    );
  }
}

function exit(message, code = 1) {
  console.error(message);
  process.exit(code);
}

async function createDatabase(key, pageId) {
  const spec = COLLECTIONS[key];
  const properties = Object.fromEntries(
    Object.entries(spec.properties).map(([name, prop]) => [
      name,
      toNotionPropertySchema(prop),
    ]),
  );

  const created = await api().databases.create({
    parent: { type: 'page_id', page_id: pageId },
    title: [{ type: 'text', text: { content: spec.title } }],
    icon: spec.icon,
    initial_data_source: { properties },
  });

  const dataSourceId = created.data_sources?.[0]?.id;
  if (!dataSourceId) throw new Error(`「${spec.title}」创建后没有返回数据源 ID`);
  return { dataSourceId, url: created.url };
}

function writeEnvValues(values) {
  const lines = existsSync(ENV_FILE)
    ? readFileSync(ENV_FILE, 'utf8').split(/\r?\n/)
    : [];

  for (const [key, value] of Object.entries(values)) {
    const index = lines.findIndex((line) => new RegExp(`^\\s*${key}\\s*=`).test(line));
    if (index >= 0) lines[index] = `${key}=${value}`;
    else lines.push(`${key}=${value}`);
  }

  writeFileSync(ENV_FILE, `${lines.join('\n').replace(/\n*$/, '\n')}`, 'utf8');
}

async function commandCreate(target, shouldWrite) {
  requireToken();
  const pageId = extractNotionId(target ?? '');
  if (!pageId) {
    exit(
      '请提供父页面链接，例如：\n' +
        '  npm run notion:setup -- https://www.notion.so/My-Page-1a2b3c... --write',
    );
  }

  try {
    await api().pages.retrieve({ page_id: pageId });
  } catch (error) {
    exit(
      `读不到父页面 ${pageId}。请确认链接正确，并且已在该页面 Connections 里添加了这个集成。\n` +
        describe(error),
    );
  }

  const values = {};
  for (const key of ORDER) {
    const spec = COLLECTIONS[key];
    process.stdout.write(`创建「${spec.title}」… `);
    const { dataSourceId, url } = await createDatabase(key, pageId);
    values[spec.envKey] = dataSourceId;
    console.log('完成');
    console.log(`  数据源 ${dataSourceId}`);
    console.log(`  ${url}`);
  }

  if (shouldWrite) {
    writeEnvValues(values);
    console.log(`\n已把四个 ID 写入 ${ENV_FILE}（NOTION_API_KEY 需自己填）。`);
  } else {
    console.log(`\n把下面几行加到 ${ENV_FILE}：\n`);
    for (const [key, value] of Object.entries(values)) console.log(`${key}=${value}`);
    console.log('\n（加 --write 可以自动写入）');
  }

  console.log('\n去 Notion 里填几行内容，然后 npm run dev 就能看到真实数据。');
}

/**
 * 与 src/lib/notion.ts 保持一致：填数据源 ID 或数据库 ID 都能解析。
 * 只在确实「找不到」时才当数据库 ID 处理，网络故障要原样抛出。
 */
function isObjectNotFound(error) {
  return isNotionClientError(error) && error.code === 'object_not_found';
}

async function resolveDataSourceId(client, id) {
  try {
    await client.dataSources.retrieve({ data_source_id: id });
    return id;
  } catch (error) {
    if (!isObjectNotFound(error)) throw error;
  }
  const database = await client.databases.retrieve({ database_id: id });
  const [first] = database.data_sources ?? [];
  if (!first) throw new Error('数据库下没有可用的数据源');
  return first.id;
}

async function commandCheck() {
  requireToken();
  const client = api();
  let failed = false;

  for (const key of ORDER) {
    const spec = COLLECTIONS[key];
    const raw = process.env[spec.envKey];
    if (!raw) {
      console.log(`✗ ${spec.title}：${spec.envKey} 未配置`);
      failed = true;
      continue;
    }

    try {
      const dataSourceId = await resolveDataSourceId(client, extractNotionId(raw.trim()) ?? raw.trim());
      const source = await client.dataSources.retrieve({ data_source_id: dataSourceId });
      const { results } = await client.dataSources.query({
        data_source_id: dataSourceId,
        page_size: 100,
      });

      const expected = Object.keys(spec.properties);
      const missing = expected.filter((name) => !(name in source.properties));
      const label = missing.length === 0 ? '✓' : '⚠';

      console.log(`${label} ${spec.title}：${results.length} 行（${dataSourceId}）`);
      if (missing.length) {
        console.log(`   缺少字段：${missing.join('、')}`);
        console.log('   这些字段的内容不会显示，可在 Notion 里补上，或重建数据库');
        failed = true;
      }
    } catch (error) {
      console.log(`✗ ${spec.title}：${describe(error)}`);
      failed = true;
    }
  }

  process.exit(failed ? 1 : 0);
}

function describe(error) {
  if (isNotionClientError(error)) return `${error.code}: ${error.message}`;
  return error instanceof Error ? error.message : String(error);
}

const args = process.argv.slice(2);
const positional = args.find((arg) => !arg.startsWith('--'));

if (args.includes('--check')) {
  await commandCheck();
} else if (positional) {
  await commandCreate(positional, args.includes('--write'));
} else {
  exit(
    [
      '用法：',
      '  npm run notion:setup -- <Notion 父页面链接> [--write]   创建四个数据库',
      '  npm run notion:setup -- --check                          校验 .env.local 里的配置',
    ].join('\n'),
    2,
  );
}
