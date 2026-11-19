/**
 * 把 Notion Projects 库里每个项目页的正文抓成本地文本，方便离线看内容、定位插图位置。
 *
 *   node scripts/dump-notion-projects.mjs
 *
 * 产物：scripts/.notion-dump/<slug>.md（不进仓库，仅本地参考）
 * 每行形如：  [block-id] type :: text
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import notion from '@notionhq/client';

const { Client, extractNotionId, collectPaginatedAPI } = notion;

for (const file of ['.env.local', '.env']) {
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = /^\s*([A-Za-z0-9_]+)\s*=\s*(.*)$/.exec(line);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].trim();
  }
}

const api = new Client({ auth: process.env.NOTION_API_KEY });
const { results } = await api.dataSources.query({
  data_source_id: extractNotionId(process.env.NOTION_PROJECTS_ID),
  page_size: 100,
});

const plain = (rich) => (rich ?? []).map((t) => t.plain_text ?? '').join('');
const OUT = join('scripts', '.notion-dump');
mkdirSync(OUT, { recursive: true });

for (const row of results) {
  const name = plain(row.properties['项目名称']?.title).trim();
  const slug = plain(row.properties.Slug?.rich_text).trim();
  if (!slug) continue;

  const blocks = await collectPaginatedAPI(api.blocks.children.list, {
    block_id: row.id,
    page_size: 100,
  });

  const lines = [`# ${name} (${slug})`, `# page: ${row.id}`, `# blocks: ${blocks.length}`, ''];
  for (const block of blocks) {
    const data = block[block.type] ?? {};
    let text = plain(data.rich_text);
    if (block.type === 'image') {
      text = `[IMAGE ${data.type}] ${data.external?.url ?? data.file?.url} | caption: ${plain(data.caption)}`;
    }
    if (block.type === 'embed') text = `[EMBED] ${data.url}`;
    if (block.type === 'code') text = `[CODE ${data.language}]\n${text}`;
    lines.push(`[${block.id}] ${block.type} :: ${text.replace(/\n/g, ' ⏎ ')}`);
  }

  writeFileSync(join(OUT, `${slug}.md`), `${lines.join('\n')}\n`);
  console.log(`${slug.padEnd(32)} ${blocks.length} 块 → ${join(OUT, `${slug}.md`)}`);
}
