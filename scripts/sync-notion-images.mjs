#!/usr/bin/env node
/**
 * 构建前把 Notion 正文里的图片下载到站内。
 *
 * 背景：Notion 上传的文件返回的是 S3 签名地址，一小时过期，不能直接写进 HTML。
 * 构建一开始就下载并转成 webp，落到 public/notion-assets/（gitignore），
 * 页面用 manifest 里的站内路径替换，仓库里因此不需要存这些图。
 *
 *   node scripts/sync-notion-images.mjs
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import dns from 'node:dns';
import notion from '@notionhq/client';
import sharp from 'sharp';

const { Client, extractNotionId, collectPaginatedAPI } = notion;

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

const OUT_DIR = join('public', 'notion-assets');
const MANIFEST = join(OUT_DIR, 'manifest.json');
const MAX_WIDTH = 1600;

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const m = /^\s*([A-Za-z0-9_]+)\s*=\s*(.*)$/.exec(line);
      if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].trim();
    }
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Notion 连接偶发超时，关键请求统一重试几次 */
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

const plain = (items) => (items ?? []).map((t) => t.plain_text ?? '').join('').trim();
const safe = (name) => name.replace(/[^A-Za-z0-9._-]/g, '-').slice(0, 80);

/** 从签名地址里取原始文件名，保留可读的目录结构 */
function assetName(url, fallback) {
  try {
    const last = new URL(url).pathname.split('/').filter(Boolean).pop();
    return safe(last || fallback);
  } catch {
    return safe(fallback);
  }
}

async function collect(api) {
  const items = [];
  const { results: projects } = await retry('查询项目', () =>
    api.dataSources.query({
      data_source_id: extractNotionId(process.env.NOTION_PROJECTS_ID),
      page_size: 100,
    }),
  );
  for (const row of projects) {
    const slug = plain(row.properties.Slug?.rich_text) || row.id;
    items.push({ pageId: row.id, dir: slug });
  }

  if (process.env.NOTION_ARTICLES_ID) {
    try {
      const { results: articles } = await retry('查询文章', () =>
        api.dataSources.query({
          data_source_id: extractNotionId(process.env.NOTION_ARTICLES_ID),
          page_size: 100,
        }),
      );
      for (const row of articles) {
        const slug = plain(row.properties.Slug?.rich_text);
        if (!slug) continue;
        items.push({ pageId: row.id, dir: `articles/${slug}` });
      }
    } catch (error) {
      console.warn(`[notion-images] 读取 Articles 失败：${error.message}`);
    }
  }
  return items;
}

async function main() {
  loadEnv();
  if (!process.env.NOTION_API_KEY) {
    console.warn('[notion-images] 缺少 NOTION_API_KEY，跳过');
    return;
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const api = new Client({ auth: process.env.NOTION_API_KEY, timeoutMs: 60000 });
  const targets = await collect(api);

  const manifest = {};
  let downloaded = 0;
  let failed = 0;

  for (const target of targets) {
    let blocks;
    try {
      blocks = await retry('读取正文', () =>
        collectPaginatedAPI(api.blocks.children.list, {
          block_id: target.pageId,
          page_size: 100,
        }),
      );
    } catch (error) {
      console.warn(`[notion-images] ${target.dir} 读取块失败：${error.code ?? error.message}`);
      continue;
    }

    for (const block of blocks) {
      if (block.type !== 'image') continue;
      // 只处理 Notion 自己托管的文件；外链（图床/Canva）保持原样
      if (block.image?.type !== 'file') continue;
      const url = block.image.file?.url;
      if (!url) continue;

      const filename = assetName(url, `${block.id}.webp`);
      const dir = join(OUT_DIR, ...target.dir.split('/'));
      mkdirSync(dir, { recursive: true });
      const file = join(dir, filename.replace(/\.[a-z0-9]+$/i, '.webp'));

      try {
        const res = await retry('下载图片', () => fetch(url), 3);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buffer = Buffer.from(await res.arrayBuffer());
        await sharp(buffer)
          .resize({ width: MAX_WIDTH, withoutEnlargement: true })
          .webp({ quality: 82 })
          .toFile(file);
        manifest[block.id] = `/${file.replace(/\\/g, '/').replace(/^public\//, '')}`;
        downloaded += 1;
        console.log(`  ✓ ${target.dir}/${filename}`);
      } catch (error) {
        failed += 1;
        console.warn(`  ✗ ${target.dir}/${filename}：${error.message}`);
      }
    }
  }

  // 清掉本次没有生成、也不再被引用的旧文件
  const keep = new Set(Object.values(manifest).map((p) => p.split('/').pop()));
  for (const entry of readdirSync(OUT_DIR, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const sub = join(OUT_DIR, entry.name);
      for (const f of readdirSync(sub)) {
        if (f.endsWith('.webp') && !keep.has(f)) rmSync(join(sub, f), { force: true });
      }
    }
  }

  writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`[notion-images] 完成 ${downloaded} 张，失败 ${failed} 张`);
  // 有失败就中断构建，避免页面里留下会过期的临时地址
  if (failed > 0) process.exitCode = 1;
}

await main();
