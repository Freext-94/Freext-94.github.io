import { PROP, type PropertySpec } from './schema';
import type { ExperienceItem, Project, Skill, SocialLink } from './types';

/**
 * 只声明用到的字段，避免和 SDK 生成的巨型联合类型纠缠。
 * Notion 响应的运行时形状是稳定的。
 */
interface RichTextItem {
  plain_text?: string;
  href?: string | null;
}

interface NotionProperty {
  type: string;
  title?: RichTextItem[];
  rich_text?: RichTextItem[];
  url?: string | null;
  select?: { name?: string } | null;
  multi_select?: { name?: string }[];
  checkbox?: boolean;
  number?: number | null;
}

export interface NotionRow {
  id: string;
  cover?:
    | { type: 'external'; external: { url: string } }
    | { type: 'file'; file: { url: string } }
    | null;
  properties: Record<string, NotionProperty>;
}

const text = (items?: RichTextItem[]) =>
  (items ?? [])
    .map((t) => t.plain_text ?? '')
    .join('')
    .trim();

/** 多行文本按行拆开，空行丢弃，行首的 - / • / * 项目符号去掉 */
const lines = (value: string): string[] =>
  value
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*[-•*]\s*/, '').trim())
    .filter(Boolean);

/** Notion 属性 type 字符串与内部 kind 不同名（text → rich_text），统一在这里映射 */
function read(row: NotionRow, name: string, spec: PropertySpec): unknown {
  const prop = row.properties[name];
  if (!prop) return undefined;
  switch (spec.kind) {
    case 'title':
      return text(prop.title);
    case 'text':
      return text(prop.rich_text);
    case 'url':
      return prop.url ?? undefined;
    case 'select':
      return prop.select?.name ?? undefined;
    case 'multi_select':
      return (prop.multi_select ?? []).map((o) => o.name).filter(Boolean);
    case 'checkbox':
      return prop.checkbox ?? false;
    case 'number':
      return prop.number ?? undefined;
  }
}

const str = (v: unknown) => (typeof v === 'string' ? v : '');
const num = (v: unknown, fallback = 0) =>
  typeof v === 'number' && Number.isFinite(v) ? v : fallback;
const bool = (v: unknown) => v === true;
const arr = (v: unknown) => (Array.isArray(v) ? (v as string[]) : []);

/** 封面优先取"封面图"URL 字段，留空时退回页面封面 */
function coverOf(row: NotionRow): string | undefined {
  if (row.cover?.type === 'external') return row.cover.external.url;
  if (row.cover?.type === 'file') return row.cover.file.url;
  return undefined;
}

export function toProject(row: NotionRow): Project {
  const p = PROP.projects;
  const image = read(row, p.image, { kind: 'url' });
  return {
    id: row.id,
    name: str(read(row, p.title, { kind: 'title' })),
    summary: str(read(row, p.summary, { kind: 'text' })),
    detail: lines(str(read(row, p.detail, { kind: 'text' }))),
    tags: arr(read(row, p.tags, { kind: 'multi_select' })),
    stack: arr(read(row, p.stack, { kind: 'multi_select' })),
    image: (typeof image === 'string' && image) || coverOf(row),
    live: read(row, p.live, { kind: 'url' }) as string | undefined,
    repo: read(row, p.repo, { kind: 'url' }) as string | undefined,
    period: str(read(row, p.period, { kind: 'text' })) || undefined,
    role: str(read(row, p.role, { kind: 'text' })) || undefined,
    featured: bool(read(row, p.featured, { kind: 'checkbox' })),
    order: num(read(row, p.order, { kind: 'number' })),
  };
}

export function toSkill(row: NotionRow): Skill {
  const p = PROP.skills;
  const level = num(read(row, p.level, { kind: 'number' }));
  return {
    id: row.id,
    name: str(read(row, p.title, { kind: 'title' })),
    category: str(read(row, p.category, { kind: 'select' })) || '其他',
    // Notion 百分比格式下 0.9 表示 90%，两种写法都兼容
    level: level > 1 ? Math.min(100, Math.round(level)) : Math.round(level * 100),
    note: str(read(row, p.note, { kind: 'text' })) || undefined,
    icon: str(read(row, p.icon, { kind: 'select' })) || undefined,
    order: num(read(row, p.order, { kind: 'number' })),
  };
}

export function toExperience(row: NotionRow): ExperienceItem {
  const p = PROP.experience;
  return {
    id: row.id,
    role: str(read(row, p.title, { kind: 'title' })),
    org: str(read(row, p.org, { kind: 'text' })),
    period: str(read(row, p.period, { kind: 'text' })),
    location: str(read(row, p.location, { kind: 'text' })) || undefined,
    highlights: lines(str(read(row, p.highlights, { kind: 'text' }))),
    current: bool(read(row, p.current, { kind: 'checkbox' })),
    type: str(read(row, p.type, { kind: 'select' })) || '工作',
    order: num(read(row, p.order, { kind: 'number' })),
  };
}

export function toLink(row: NotionRow): SocialLink | undefined {
  const p = PROP.links;
  const name = str(read(row, p.title, { kind: 'title' }));
  const target = read(row, p.url, { kind: 'url' }) as string | undefined;
  if (!name || !target) return undefined;
  const checked = bool(read(row, p.email, { kind: 'checkbox' }));
  return {
    id: row.id,
    name,
    url: target,
    icon: str(read(row, p.icon, { kind: 'select' })) || 'link',
    handle: str(read(row, p.handle, { kind: 'text' })) || undefined,
    isEmail: checked || target.startsWith('mailto:'),
    order: num(read(row, p.order, { kind: 'number' })),
  };
}
