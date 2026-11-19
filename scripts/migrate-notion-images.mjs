#!/usr/bin/env node
/**
 * 把项目正文里指向本站的图片迁到 Notion 自己托管。
 *
 *   node scripts/migrate-notion-images.mjs --slug=public-opinion-analysis --write
 *
 * 不传 --write 时只打印将要迁移的块。
 * 迁移后图片块变成 file 类型（Notion 托管），构建时由
 * scripts/sync-notion-images.mjs 下载到 public/notion-assets/。
 */
import { existsSync, readFileSync } from 'node:fs';
import dns from 'node:dns';
import notion from '@notionhq/client';

const { Client, extractNotionId, collectPaginatedAPI } = notion;

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

for (const file of ['.env.local', '.env']) {
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = /^\s*([A-Za-z0-9_]+)\s*=\s*(.*)$/.exec(line);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].trim();
  }
}

const args = process.argv.slice(2);
const slug = args.find((a) => a.startsWith('--slug='))?.slice('--slug='.length);
const write = args.includes('--write');
if (!slug) {
  console.error('用法：node scripts/migrate-notion-images.mjs --slug=<项目 Slug> [--write]');
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const plain = (items) => (items ?? []).map((t) => t.plain_text ?? '').join('').trim();

async function retry(label, fn, attempts = 4) {
  for (let i = 1; i <= attempts; i += 1) {
    try {
      return await fn();
    } catch (error) {
      const code = error.code ?? error.message;
      console.warn(`  ${label} 第 ${i}/${attempts} 次失败：${code}`);
      if (i === attempts) throw error;
      await sleep(3000);
    }
  }
}

const api = new Client({ auth: process.env.NOTION_API_KEY, timeoutMs: 60000 });

const { results } = await retry('查询项目', () =>
  api.dataSources.query({
    data_source_id: extractNotionId(process.env.NOTION_PROJECTS_ID),
    page_size: 100,
  }),
);
const row = results.find((r) => plain(r.properties.Slug?.rich_text) === slug);
if (!row) {
  console.error(`找不到 Slug 为 ${slug} 的项目`);
  process.exit(1);
}

const blocks = await retry('读取正文', () =>
  collectPaginatedAPI(api.blocks.children.list, { block_id: row.id, page_size: 100 }),
);

const targets = blocks.filter(
  (b) =>
    b.type === 'image' &&
    b.image?.type === 'external' &&
    (b.image.external?.url ?? '').startsWith(`https://freext-94.github.io/projects/${slug}/`),
);

console.log(`项目：${slug}，待迁移 ${targets.length} 张${write ? '' : '（预演，不写入）'}`);
for (const block of targets) {
  const url = block.image.external.url;
  const name = decodeURIComponent(new URL(url).pathname.split('/').pop() || 'image.webp');
  console.log(`  - ${name}`);
  if (!write) continue;

  try {
    const upload = await retry(`上传 ${name}`, () =>
      api.fileUploads.create({ mode: 'external_url', external_url: url, filename: name }),
    );

    let status = upload.status;
    for (let i = 0; i < 12 && status !== 'uploaded'; i += 1) {
      await sleep(1500);
      const current = await retry('查询上传状态', () =>
        api.fileUploads.retrieve({ file_upload_id: upload.id }),
      );
      status = current.status;
    }
    if (status !== 'uploaded') throw new Error(`上传未完成，状态 ${status}`);

    await retry('更新块', () =>
      api.blocks.update({ block_id: block.id, image: { file_upload: { id: upload.id } } }),
    );
    console.log(`    ✓ 已迁移`);
  } catch (error) {
    console.warn(`    ✗ 跳过：${error.message}`);
  }
  await sleep(600);
}
