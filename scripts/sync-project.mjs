#!/usr/bin/env node
/**
 * 把 content/projects/<slug>.md 同步成 Notion 项目页的正文。
 *
 *   node scripts/sync-project.mjs personal-portfolio           # 只解析并打印，不写
 *   node scripts/sync-project.mjs personal-portfolio --write    # 追加新块 → 归档旧块 → 更新封面
 *
 * 写入策略是「先加后删」：新内容全部追加成功后，才归档页面上原有的块，
 * 中途失败会保留旧正文，不会出现空页面。Notion 侧仍有页面历史可回滚。
 *
 * Markdown 只支持本项目用到的子集：标题、段落、引用、有序/无序列表、
 * 图片（可带标题作为图注）、代码块、分隔线、{{embed:URL}}。
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import dns from 'node:dns';
import notion from '@notionhq/client';

const { Client, extractNotionId, collectPaginatedAPI, isNotionClientError } = notion;

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

const ENV_FILE = '.env.local';

function loadDotEnv() {
  for (const file of [ENV_FILE, '.env']) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const match = /^\s*([A-Za-z0-9_]+)\s*=\s*(.*)$/.exec(line);
      if (!match) continue;
      const [, key, raw] = match;
      if (process.env[key] === undefined) process.env[key] = raw.trim().replace(/^(['"])(.*)\1$/, '$2');
    }
  }
}
loadDotEnv();

/* ── Markdown → 中间结构 ───────────────────────────────────── */

const CODE_LANGS = {
  yaml: 'yaml',
  yml: 'yaml',
  bash: 'bash',
  sh: 'shell',
  js: 'javascript',
  ts: 'typescript',
  json: 'json',
  html: 'html',
  css: 'css',
  md: 'markdown',
};

function inline(text) {
  // **粗体** / `代码` / [文字](链接)
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return parts
    .filter((part) => part !== '')
    .map((part) => {
      let m;
      if ((m = /^\*\*([^*]+)\*\*$/.exec(part))) {
        return { text: m[1], bold: true };
      }
      if ((m = /^`([^`]+)`$/.exec(part))) {
        return { text: m[1], code: true };
      }
      if ((m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part))) {
        return { text: m[1], href: m[2] };
      }
      return { text: part };
    });
}

function parse(markdown) {
  const lines = markdown.split(/\r?\n/);
  const blocks = [];
  let i = 0;

  const isSpecial = (line) =>
    /^\s*$/.test(line) ||
    /^```/.test(line) ||
    /^#{1,3}\s/.test(line) ||
    /^>\s?/.test(line) ||
    /^[-*]\s/.test(line) ||
    /^\d+\.\s/.test(line) ||
    /^---+$/.test(line.trim()) ||
    /^!\[[^\]]*\]\(/.test(line.trim()) ||
    /^\{\{embed:/.test(line.trim());

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trimEnd();
    if (!line.trim()) { i += 1; continue; }

    if (line.startsWith('```')) {
      const language = line.slice(3).trim();
      const body = [];
      i += 1;
      while (i < lines.length && !lines[i].trimEnd().startsWith('```')) {
        body.push(lines[i]);
        i += 1;
      }
      i += 1;
      blocks.push({ type: 'code', language: CODE_LANGS[language] ?? 'plain text', text: body.join('\n') });
      continue;
    }

    const embed = /^\{\{embed:(\S+)\}\}$/.exec(line.trim());
    if (embed) {
      blocks.push({ type: 'embed', url: embed[1] });
      i += 1;
      continue;
    }

    const image = /^!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]*)")?\)$/.exec(line.trim());
    if (image) {
      blocks.push({ type: 'image', url: image[2], alt: image[1], caption: image[3] ?? '' });
      i += 1;
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      blocks.push({ type: 'divider' });
      i += 1;
      continue;
    }

    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1].length, rich: inline(heading[2]) });
      i += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^>\s?/, ''));
        i += 1;
      }
      blocks.push({ type: 'quote', rich: inline(quote.join('\n')) });
      continue;
    }

    if (/^[-*]\s/.test(line)) {
      blocks.push({ type: 'bulleted_list_item', rich: inline(line.replace(/^[-*]\s+/, '')) });
      i += 1;
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      blocks.push({ type: 'numbered_list_item', rich: inline(line.replace(/^\d+\.\s+/, '')) });
      i += 1;
      continue;
    }

    const paragraph = [line];
    i += 1;
    while (i < lines.length && !isSpecial(lines[i])) {
      paragraph.push(lines[i].trimEnd());
      i += 1;
    }
    blocks.push({ type: 'paragraph', rich: inline(paragraph.join('\n')) });
  }

  return blocks;
}

/* ── 中间结构 → Notion blocks ─────────────────────────────── */

const chunk = (text, size = 1800) => {
  const out = [];
  for (let i = 0; i < text.length; i += size) out.push(text.slice(i, i + size));
  return out.length ? out : [''];
};

function richText(rich) {
  return rich.flatMap((item) =>
    chunk(item.text).map((content) => ({
      type: 'text',
      text: { content },
      annotations: {
        bold: Boolean(item.bold),
        code: Boolean(item.code),
      },
      ...(item.href ? { link: { url: item.href } } : {}),
    })),
  );
}

const captionText = (value) =>
  value ? [{ type: 'text', text: { content: value } }] : [];

const codeText = (value) =>
  chunk(value).map((content) => ({ type: 'text', text: { content } }));

function toNotionBlock(block) {
  switch (block.type) {
    case 'heading':
      return {
        object: 'block',
        type: `heading_${block.level}`,
        [`heading_${block.level}`]: { rich_text: richText(block.rich), color: 'default', is_toggleable: false },
      };
    case 'paragraph':
      return { object: 'block', type: 'paragraph', paragraph: { rich_text: richText(block.rich), color: 'default' } };
    case 'quote':
      return { object: 'block', type: 'quote', quote: { rich_text: richText(block.rich), color: 'default' } };
    case 'bulleted_list_item':
      return {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: richText(block.rich), color: 'default' },
      };
    case 'numbered_list_item':
      return {
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: { rich_text: richText(block.rich), color: 'default' },
      };
    case 'image':
      return {
        object: 'block',
        type: 'image',
        image: {
          type: 'external',
          external: { url: block.url },
          caption: captionText(block.caption || block.alt),
        },
      };
    case 'embed':
      return { object: 'block', type: 'embed', embed: { url: block.url } };
    case 'code':
      return {
        object: 'block',
        type: 'code',
        code: { rich_text: codeText(block.text), language: block.language, caption: [] },
      };
    case 'divider':
      return { object: 'block', type: 'divider', divider: {} };
    default:
      throw new Error(`未知块类型 ${block.type}`);
  }
}

/* ── 主流程 ─────────────────────────────────────────────── */

const args = process.argv.slice(2);
const slug = args.find((arg) => !arg.startsWith('--')) ?? 'personal-portfolio';
const write = args.includes('--write');
const file = `content/projects/${slug}.md`;

if (!existsSync(file)) {
  console.error(`找不到 ${file}`);
  process.exit(1);
}

const blocks = parse(readFileSync(file, 'utf8'));
const summary = blocks.reduce((acc, block) => {
  acc[block.type] = (acc[block.type] ?? 0) + 1;
  return acc;
}, {});
console.log(`解析 ${file}：${blocks.length} 块`);
console.log(summary);
console.log(`图片 ${blocks.filter((b) => b.type === 'image').length} 张，embed ${blocks.filter((b) => b.type === 'embed').length} 个`);

const jsonIndex = args.indexOf('--json');
if (jsonIndex >= 0 && args[jsonIndex + 1]) {
  writeFileSync(args[jsonIndex + 1], JSON.stringify(blocks, null, 2));
  console.log(`已导出 ${args[jsonIndex + 1]}`);
}

if (!write) {
  console.log('\n（只解析，未写入。加 --write 才会同步到 Notion）');
  process.exit(0);
}

if (!process.env.NOTION_API_KEY) {
  console.error('缺少 NOTION_API_KEY');
  process.exit(1);
}

const api = new Client({ auth: process.env.NOTION_API_KEY });
const dataSourceId = extractNotionId(process.env.NOTION_PROJECTS_ID);
const coverUrl = `https://freext-94.github.io/projects/personal-portfolio/00-cover.webp`;

const { results } = await api.dataSources.query({ data_source_id: dataSourceId, page_size: 100 });
const row = results.find((item) => {
  const value = (item.properties.Slug?.rich_text ?? []).map((t) => t.plain_text).join('').trim();
  return value === slug;
});
if (!row) {
  console.error(`Projects 库里找不到 Slug = ${slug} 的记录`);
  process.exit(1);
}

const pageId = row.id;
const existing = await collectPaginatedAPI(api.blocks.children.list, { block_id: pageId, page_size: 100 });
console.log(`\n目标页面 ${pageId}，现有 ${existing.length} 块`);

// 1) 先追加，失败就停在这里，旧内容不动
const payload = blocks.map(toNotionBlock);
for (let i = 0; i < payload.length; i += 50) {
  await api.blocks.children.append({ block_id: pageId, children: payload.slice(i, i + 50) });
  console.log(`已追加 ${Math.min(i + 50, payload.length)}/${payload.length}`);
}

// 2) 新内容确认写入后再归档旧块，避免中途失败留下空页面
let archived = 0;
for (const block of existing) {
  try {
    await api.blocks.delete({ block_id: block.id });
    archived += 1;
    if (archived % 20 === 0) console.log(`已归档 ${archived}/${existing.length}`);
    await new Promise((resolve) => setTimeout(resolve, 320));
  } catch (error) {
    const code = isNotionClientError(error) ? error.code : 'unknown';
    console.warn(`归档失败 ${block.id}（${code}），继续处理其余块`);
  }
}
console.log(`归档 ${archived}/${existing.length} 块`);

// 3) 封面默认不动：库里已经有图就不覆盖，只有显式 --cover 才换成 00-cover.webp
if (args.includes('--cover')) {
  await api.pages.update({
    page_id: pageId,
    properties: { 封面图片: { url: coverUrl } },
  });
  console.log(`封面已更新：${coverUrl}`);
} else {
  console.log('封面保持原样（加 --cover 可换成 00-cover.webp）');
}
console.log('\n完成。触发一次部署后，线上就会用新正文。');
