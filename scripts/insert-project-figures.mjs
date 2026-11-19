/**
 * 把配图作为图片块插入 Notion 项目页的指定段落之后。
 *
 *   node scripts/insert-project-figures.mjs            # 只打印计划
 *   node scripts/insert-project-figures.mjs --write    # 真正写入
 *
 * 只做插入，不改动原有正文：每张图挂在一个固定的 anchor 块后面。
 * 重复执行会跳过已存在的同 URL 图片。图片走 GitHub Pages 外链，
 * 因为 Notion 自己托管的文件链接一小时后会失效，构建时会变成坏图。
 */
import { readFileSync, existsSync } from 'node:fs';
import notion from '@notionhq/client';

const { Client, extractNotionId, collectPaginatedAPI } = notion;

const BASE = 'https://freext-94.github.io/projects';

/** slug → 两张图：文件、anchor 块、图注 */
const PLAN = [
  {
    slug: 'city-service-operations',
    items: [
      {
        file: 'fig-01-journey-matrix.webp',
        after: '41dc81d5-c69b-8130-8a65-ed59daf9ada7',
        caption: '供给、入口、内容三条线，落在同一条用户路径上。',
      },
      {
        file: 'fig-02-vendor-list.webp',
        after: '41dc81d5-c69b-8176-93bc-d04fc1b86ab8',
        caption: '服务商资源清单：接入方式、结算规则、服务标准三列不能空。',
      },
    ],
  },
  {
    slug: 'digital-operations',
    items: [
      {
        file: 'fig-01-requirement-channel.webp',
        after: '41cc81d5-c69b-8124-8d08-da72aaa2653d',
        caption: '需求从基层走到版本的四步，每一步都有交付物。',
      },
      {
        file: 'fig-02-training-loop.webp',
        after: '41cc81d5-c69b-8193-9380-e2229e68f13f',
        caption: '培训现场的高频问题，如何回流成下一版的需求。',
      },
    ],
  },
  {
    slug: 'engineering-procurement',
    items: [
      {
        file: 'fig-01-ledger-chain.webp',
        after: '41dc81d5-c69b-8198-a45e-c97bee2b18ec',
        caption: '六步流程全部写入同一本台账，账实才对得上。',
      },
      {
        file: 'fig-02-three-questions.webp',
        after: '41dc81d5-c69b-81cc-80ff-d6deab7a25e2',
        caption: '每一笔物资都要能回答：从哪来、到哪去、还剩多少。',
      },
    ],
  },
  {
    slug: 'ict-procurement',
    items: [
      {
        file: 'fig-01-institution-layers.webp',
        after: '41cc81d5-c69b-814b-980c-c961027173b5',
        caption: '制度、工具、培训三层，决定流程能不能真的跑起来。',
      },
      {
        file: 'fig-02-traceability.webp',
        after: '41cc81d5-c69b-812e-995d-d0b171946b31',
        caption: '一笔需求、一次采购、一张结算，靠项目编号串起来。',
      },
    ],
  },
  {
    slug: 'product-operations',
    items: [
      {
        file: 'fig-01-capability-pipeline.webp',
        after: '41cc81d5-c69b-81a0-afdb-f19416a7abfd',
        caption: '从 HIS、LIS、PACS 的原子能力，到可上架的产品目录。',
      },
      {
        file: 'fig-02-analysis-to-action.webp',
        after: '41cc81d5-c69b-81e2-90e1-c7625abdc585',
        caption: '经营分析的三层：数据、判断、动作。',
      },
    ],
  },
  {
    slug: 'public-opinion-analysis',
    items: [
      {
        file: 'fig-01-time-window.webp',
        after: '41dc81d5-c69b-81d7-b217-e71a055ca6c3',
        caption: '舆情声量曲线与可处置窗口：越早发现，空间越大。',
      },
      {
        file: 'fig-02-risk-gauge.webp',
        after: '41dc81d5-c69b-81fc-9c79-e965729eca3a',
        caption: '风险等级由三个维度交叉判断，再决定上报对象与时效。',
      },
    ],
  },
  {
    slug: 'delivery-robot-commissioning',
    items: [
      {
        file: 'fig-01-delivery-steps.webp',
        after: '41dc81d5-c69b-81d5-91c1-f49a8931c311',
        caption: '现场交付六步，每一步都带验收口径。',
      },
      {
        file: 'fig-02-pyramid.webp',
        after: '41dc81d5-c69b-81d4-8546-f0eb8c30296d',
        caption: '建图、路线、培训三层，分别决定上限、体验与成本。',
      },
    ],
  },
  {
    slug: 'personal-portfolio',
    items: [
      {
        file: 'fig-01-cost-sheet.webp',
        after: '41cc81d5-c69b-81e3-b35f-c79f53050b8f',
        caption: '成本结构：七项全部为零，代价写在最后一行。',
      },
      {
        file: 'fig-02-pitfalls.webp',
        after: '41cc81d5-c69b-8034-905f-f0ddef284dda',
        caption: '五个坑与对应解法，每个都藏在「不报错」的地方。',
      },
    ],
  },
];

for (const file of ['.env.local', '.env']) {
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = /^\s*([A-Za-z0-9_]+)\s*=\s*(.*)$/.exec(line);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].trim();
  }
}

const write = process.argv.includes('--write');
const api = new Client({ auth: process.env.NOTION_API_KEY });

const { results } = await api.dataSources.query({
  data_source_id: extractNotionId(process.env.NOTION_PROJECTS_ID),
  page_size: 100,
});

const pageBySlug = new Map();
for (const row of results) {
  const slug = (row.properties.Slug?.rich_text ?? []).map((t) => t.plain_text).join('').trim();
  if (slug) pageBySlug.set(slug, row.id);
}

let inserted = 0;
let skipped = 0;

for (const group of PLAN) {
  const pageId = pageBySlug.get(group.slug);
  if (!pageId) {
    console.warn(`✗ 找不到页面：${group.slug}`);
    continue;
  }

  const blocks = await collectPaginatedAPI(api.blocks.children.list, {
    block_id: pageId,
    page_size: 100,
  });
  const existing = new Set(
    blocks
      .filter((b) => b.type === 'image')
      .map((b) => b.image?.external?.url ?? b.image?.file?.url ?? ''),
  );
  const ids = new Set(blocks.map((b) => b.id));

  for (const item of group.items) {
    const url = `${BASE}/${group.slug}/${item.file}`;

    if (existing.has(url)) {
      console.log(`· 已存在，跳过 ${group.slug}/${item.file}`);
      skipped += 1;
      continue;
    }
    if (!ids.has(item.after)) {
      console.warn(`✗ anchor 不存在 ${group.slug}/${item.file} → ${item.after}`);
      continue;
    }

    if (!write) {
      console.log(`+ 计划插入 ${group.slug}/${item.file}（after ${item.after}）`);
      continue;
    }

    await api.blocks.children.append({
      block_id: pageId,
      after: item.after,
      children: [
        {
          object: 'block',
          type: 'image',
          image: {
            type: 'external',
            external: { url },
            caption: [{ type: 'text', text: { content: item.caption } }],
          },
        },
      ],
    });
    existing.add(url);
    inserted += 1;
    console.log(`✓ ${group.slug}/${item.file}`);
    await new Promise((r) => setTimeout(r, 350));
  }
}

console.log(
  write
    ? `\n完成：插入 ${inserted} 张，跳过 ${skipped} 张`
    : `\n只打印计划（${PLAN.reduce((n, g) => n + g.items.length, 0)} 张）。加 --write 才写入。`,
);
