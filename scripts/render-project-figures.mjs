/**
 * 把 figures/project-figures.mjs 里的定义渲染成配图。
 *
 *   node scripts/render-project-figures.mjs                # 全部重渲
 *   node scripts/render-project-figures.mjs --only=city    # 只渲 slug 含 city 的
 *
 * 输出：public/projects/<slug>/<file>.webp（1600×1000，2 倍屏渲染后缩放）
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import { figures, CSS, THEMES } from './figures/project-figures.mjs';

const W = 1600;
const H = 1000;
const TMP = resolve('scripts/.figure-out');

const FONT_DIR = resolve('node_modules/@fontsource-variable/noto-sans-sc');
const fontCss = readFileSync(join(FONT_DIR, 'index.css'), 'utf8').replace(
  /url\(\.\/files\/([^)]+)\)/g,
  (_, file) => `url("${pathToFileURL(join(FONT_DIR, 'files', file)).href}")`,
);

const CHROME = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean).find((p) => existsSync(p));

const only = process.argv.find((a) => a.startsWith('--only='))?.slice(7);
const queue = figures.filter((f) => !only || f.slug.includes(only));

if (!queue.length) {
  console.error(`没有匹配的项目：${only ?? '(全部)'}`);
  process.exit(1);
}
if (!CHROME) {
  console.error('找不到 Chrome，设置 CHROME_PATH 后再试');
  process.exit(1);
}

const head = (fig) => `
  <div class="head">
    <div>
      <div class="kicker">${fig.kicker}</div>
      <h1>${fig.title}</h1>
      <div class="sub">${fig.sub}</div>
    </div>
    <div class="tag">${fig.tag}</div>
  </div>`;

const foot = (fig) => `<div class="foot"><span>${fig.footLeft}</span><span>${fig.footRight}</span></div>`;

const doc = (fig) => `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="utf-8">
<style>${fontCss}</style>
<style>${CSS}</style>
<style>:root{--accent:${THEMES[fig.theme]};--mono:ui-monospace,'SFMono-Regular',Consolas,monospace}</style>
</head><body>
<div class="fig">
  <div class="wrap">
    ${head(fig)}
    <div class="stage">${fig.body}</div>
    ${foot(fig)}
  </div>
</div>
</body></html>`;

mkdirSync(TMP, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--lang=zh-CN', '--allow-file-access-from-files'],
});

const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 });

let done = 0;
for (const fig of queue) {
  const base = fig.file.replace(/\.png$/, '');
  const tmpFile = join(TMP, `${fig.slug}--${base}.html`);
  writeFileSync(tmpFile, doc(fig));

  await page.goto(pathToFileURL(tmpFile).href, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 200));

  const png = await page.screenshot({ type: 'png' });
  const outDir = join('public', 'projects', fig.slug);
  mkdirSync(outDir, { recursive: true });
  const outFile = join(outDir, `${base}.webp`);

  await sharp(png).resize({ width: W }).webp({ quality: 90, effort: 5 }).toFile(outFile);
  done += 1;
  console.log(`  ✓ ${fig.slug}/${base}.webp`);
}

await browser.close();
console.log(`\n完成 ${done} 张 → public/projects/`);
