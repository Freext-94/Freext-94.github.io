#!/usr/bin/env node
/**
 * 构建前把 Notion 里的 Canva 设计链接截成站内封面图。
 *
 *   node scripts/sync-canva-covers.mjs          # 生成 public/covers/canva/*.webp
 *   node scripts/sync-canva-covers.mjs --force  # 忽略缓存，全部重截
 *
 * 只处理 canva.com 的设计链接，出现在三处：
 *   1. Projects 的「封面图片」
 *   2. Projects 正文里的图片块
 *   3. Articles 的「封面图片」
 * 其他图床链接、演示地址、GitHub 等 URL 字段一律不处理。
 *
 * 产物写进 public/covers/（已 gitignore，不进仓库），同时生成 manifest.json，
 * 供 src/lib/notion.ts 在构建时把 Canva 链接替换成站内路径。
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import dns from 'node:dns';
import notion from '@notionhq/client';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import { canvaKey, isCanvaUrl } from '../src/lib/canva.ts';

const { Client, extractNotionId, collectPaginatedAPI } = notion;

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

const OUT_DIR = join('public', 'covers', 'canva');
const MANIFEST = join('public', 'covers', 'manifest.json');
const WIDTH = 1600;
const HEIGHT = 900;
const CROP_HEIGHT = 836; // 切掉 Canva 底部的翻页 / 缩放控制条
const WAIT_MS = 7000;

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const m = /^\s*([A-Za-z0-9_]+)\s*=\s*(.*)$/.exec(line);
      if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].trim();
    }
  }
}

function canvaEmbedUrl(url) {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split('/').filter(Boolean); // design / <id> / [token] / view
    if (parts.length >= 4) parts[3] = 'view';
    parsed.pathname = `/${parts.join('/')}`;
    parsed.search = 'embed';
    // 保留 #N：同一个多页设计的链接靠片段区分页
    return parsed.href;
  } catch {
    return undefined;
  }
}

const plain = (items) => (items ?? []).map((t) => t.plain_text ?? '').join('').trim();

async function collectJobs(api) {
  const jobs = new Map(); // designId -> { embed, source }
  const add = (url, source) => {
    if (!isCanvaUrl(url)) return;
    const key = canvaKey(url);
    const embed = key ? canvaEmbedUrl(url) : undefined;
    if (!key || !embed || jobs.has(key)) return;
    const [id, page] = key.split('#');
    jobs.set(key, { embed, source, file: `${id}-p${page}.webp` });
  };

  const { results: projects } = await api.dataSources.query({
    data_source_id: extractNotionId(process.env.NOTION_PROJECTS_ID),
    page_size: 100,
  });

  for (const row of projects) {
    const name = plain(row.properties['项目名称']?.title) || row.id;
    add(row.properties['封面图片']?.url, `项目封面 · ${name}`);
    const blocks = await collectPaginatedAPI(api.blocks.children.list, {
      block_id: row.id,
      page_size: 100,
    });
    for (const block of blocks) {
      if (block.type !== 'image') continue;
      const url = block.image?.external?.url ?? block.image?.file?.url;
      add(url, `项目正文 · ${name}`);
    }
  }

  if (process.env.NOTION_ARTICLES_ID) {
    try {
      const { results: articles } = await api.dataSources.query({
        data_source_id: extractNotionId(process.env.NOTION_ARTICLES_ID),
        page_size: 100,
      });
      for (const row of articles) {
        const title = plain(row.properties['文章标题']?.title) || row.id;
        add(row.properties['封面图片']?.url, `文章封面 · ${title}`);
        // 正文里的 Canva 图同样会带过期链接，必须一起截
        const blocks = await collectPaginatedAPI(api.blocks.children.list, {
          block_id: row.id,
          page_size: 100,
        });
        for (const block of blocks) {
          if (block.type !== 'image') continue;
          const url = block.image?.external?.url ?? block.image?.file?.url;
          add(url, `文章正文 · ${title}`);
        }
      }
    } catch (error) {
      console.warn(`[canva] 读取 Articles 失败，跳过：${error.message}`);
    }
  }

  return jobs;
}

async function shoot(page, job) {
  await page.goto(job.embed, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise((resolve) => setTimeout(resolve, WAIT_MS));
  const buffer = await page.screenshot({
    type: 'webp',
    quality: 90,
    clip: { x: 0, y: 0, width: WIDTH, height: CROP_HEIGHT },
  });
  const file = join(OUT_DIR, job.file);
  await sharp(buffer).resize({ width: WIDTH, withoutEnlargement: true }).webp({ quality: 82 }).toFile(file);
  return file;
}

async function main() {
  loadEnv();
  if (!process.env.NOTION_API_KEY) {
    console.error('[canva] 缺少 NOTION_API_KEY，跳过');
    return;
  }

  const api = new Client({ auth: process.env.NOTION_API_KEY });
  const jobs = await collectJobs(api);
  if (jobs.size === 0) {
    console.log('[canva] 没有需要截图的 Canva 链接');
    mkdirSync(join('public', 'covers'), { recursive: true });
    writeFileSync(MANIFEST, '{}\n');
    return;
  }

  const executablePath = CHROME_CANDIDATES.find((p) => existsSync(p));
  if (!executablePath) {
    console.warn('[canva] 找不到 Chrome，跳过截图；这些封面会退回原始 Canva 链接');
    return;
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const manifest = {};
  const queue = [...jobs.entries()];
  console.log(`[canva] 待截图 ${queue.length} 张，Chrome: ${executablePath}`);

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--lang=zh-CN'],
  });

  const results = [];
  const workers = Array.from({ length: Math.min(2, queue.length) }, async () => {
    const page = await browser.newPage();
    await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });
    while (queue.length) {
      const item = queue.shift();
      if (!item) break;
      const [key, job] = item;
      try {
        const file = await shoot(page, job);
        manifest[key] = `/covers/canva/${job.file}`;
        console.log(`  ✓ ${job.source} → ${file}`);
      } catch (error) {
        console.warn(`  ✗ ${job.source}：${error.message}`);
        const existing = join(OUT_DIR, job.file);
        if (existsSync(existing)) {
          manifest[key] = `/covers/canva/${job.file}`;
          console.warn('    沿用上一版文件');
        }
      }
      results.push(key);
    }
    await page.close();
  });
  await Promise.all(workers);
  await browser.close();

  // 清掉本次没有生成、也不在 manifest 里的旧图，避免改页号后留下孤儿文件
  const keep = new Set(Object.values(manifest).map((p) => p.split('/').pop()));
  for (const file of readdirSync(OUT_DIR)) {
    if (file.endsWith('.webp') && !keep.has(file)) unlinkSync(join(OUT_DIR, file));
  }

  mkdirSync(join('public', 'covers'), { recursive: true });
  writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`[canva] 完成 ${Object.keys(manifest).length}/${jobs.size}，manifest 已写入 ${MANIFEST}`);
}

await main();
