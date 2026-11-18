import { PROP, type PropertySpec } from './schema';
import type {
  Article,
  ExperienceItem,
  ProfileInfo,
  Project,
  Skill,
  SocialEntry,
} from './types';

/**
 * 只声明用到的字段，避免和 SDK 生成的巨型联合类型纠缠。
 * Notion 响应的运行时形状是稳定的。
 */
interface RichTextItem {
  plain_text?: string;
}

interface NotionProperty {
  type: string;
  title?: RichTextItem[];
  rich_text?: RichTextItem[];
  url?: string | null;
  email?: string | null;
  select?: { name?: string } | null;
  status?: { name?: string } | null;
  multi_select?: { name?: string }[];
  checkbox?: boolean;
  number?: number | null;
  date?: { start?: string; end?: string | null } | null;
  place?: { name?: string; address?: string } | null;
  created_time?: string | { date?: string } | null;
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
    .map((item) => item.plain_text ?? '')
    .join('')
    .trim();

/** 「个人简介」这类长文本按空行切段 */
function paragraphs(value: string): string[] {
  return value
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, '\n').trim())
    .filter(Boolean);
}

/**
 * 「工作职责 / 成果」有两种写法：一行一条，或整段用句号连接。
 * 先按换行拆，只有一行时再按句号拆，两种排版都能得到要点列表。
 */
function bullets(value: string): string[] {
  const byLine = value
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*[-•*]\s*/, '').trim())
    .filter(Boolean);
  if (byLine.length > 1) return byLine;
  return (byLine[0] ?? '')
    .split(/[。；]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** 2022-05-01 → 2022.05 */
function yearMonth(iso?: string): string | undefined {
  if (!iso) return undefined;
  const [, year, month] = /^(\d{4})-(\d{2})/.exec(iso) ?? [];
  return year ? `${year}.${month}` : undefined;
}

function read(row: NotionRow, name: string, kind: PropertySpec['kind']): unknown {
  const prop = row.properties[name];
  if (!prop) return undefined;
  switch (kind) {
    case 'title':
      return text(prop.title);
    case 'text':
      return text(prop.rich_text);
    case 'url':
      return prop.url ?? undefined;
    case 'email':
      return prop.email ?? undefined;
    case 'select':
      return prop.select?.name ?? undefined;
    case 'status':
      return prop.status?.name ?? undefined;
    case 'multi_select':
      return (prop.multi_select ?? []).map((o) => o.name).filter(Boolean);
    case 'checkbox':
      return prop.checkbox ?? false;
    case 'number':
      return prop.number ?? undefined;
    case 'date':
      return prop.date?.start ?? undefined;
    case 'place':
      return prop.place?.name ?? prop.place?.address ?? undefined;
    case 'created_time': {
      const value = prop.created_time;
      return typeof value === 'string' ? value : value?.date;
    }
  }
}

const str = (v: unknown) => (typeof v === 'string' ? v : '');
const opt = (v: unknown) => (typeof v === 'string' && v ? v : undefined);
const num = (v: unknown, fallback = 0) =>
  typeof v === 'number' && Number.isFinite(v) ? v : fallback;
const bool = (v: unknown) => v === true;
const arr = (v: unknown) => (Array.isArray(v) ? (v as string[]) : []);

/** place 字段通常带国家前缀，页面上只想要城市名 */
function cityName(raw: string): string {
  return raw.replace(/^(中华人民共和国|中国大陆|中国)/, '').replace(/市$/, '').trim();
}

/** 拉丁名取首字母大写，中文名取最后一个字，都能撑住圆形徽标 */
function initials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '·';
  return /^[A-Za-z]/.test(trimmed) ? trimmed[0].toUpperCase() : trimmed.slice(-1);
}

/**
 * 加新平台就在这个表里加一行，并在 PROP.profile 补上对应字段；
 * 账号与二维码都没填的平台不会出现在页面上。
 */
const SOCIALS = [
  { key: 'wechat', label: '微信', icon: 'wechat', account: PROP.profile.wechat, qr: PROP.profile.wechatQr },
  { key: 'douyin', label: '抖音', icon: 'douyin', account: PROP.profile.douyin, qr: PROP.profile.douyinQr },
] as const;

function toSocials(row: NotionRow): SocialEntry[] {
  return SOCIALS.map((s) => ({
    key: s.key,
    label: s.label,
    icon: s.icon,
    account: opt(read(row, s.account, 'text')),
    qr: opt(read(row, s.qr, 'url')),
  })).filter((s) => s.account || s.qr);
}

export function toProfile(row: NotionRow): ProfileInfo {
  const p = PROP.profile;
  const name = str(read(row, p.name, 'text')) || str(read(row, p.record, 'title'));
  return {
    name,
    positioning: str(read(row, p.positioning, 'text')),
    summary: paragraphs(str(read(row, p.summary, 'text'))),
    city: cityName(str(read(row, p.city, 'place'))),
    email: str(read(row, p.email, 'email')),
    github: opt(read(row, p.github, 'url')),
    avatar: opt(read(row, p.avatar, 'url')),
    degree: opt(read(row, p.degree, 'select')),
    school: str(read(row, p.school, 'text')) || undefined,
    gradYear: read(row, p.gradYear, 'number') as number | undefined,
    initials: initials(name),
    socials: toSocials(row),
  };
}

export function toProject(row: NotionRow): Project {
  const p = PROP.projects;
  const image = opt(read(row, p.image, 'url'));
  const cover =
    row.cover?.type === 'external'
      ? row.cover.external.url
      : row.cover?.type === 'file'
        ? row.cover.file.url
        : undefined;
  return {
    id: row.id,
    name: str(read(row, p.title, 'title')),
    summary: str(read(row, p.summary, 'text')),
    category: opt(read(row, p.category, 'select')),
    stack: arr(read(row, p.stack, 'multi_select')),
    image: image ?? cover,
    demo: opt(read(row, p.demo, 'url')),
    repo: opt(read(row, p.repo, 'url')),
    slug: opt(read(row, p.slug, 'text')),
    status: opt(read(row, p.status, 'status')),
    featured: bool(read(row, p.featured, 'checkbox')),
    order: num(read(row, p.order, 'number')),
  };
}

/**
 * 「是否展示」取消即隐藏。属性本身不存在时视为可见——
 * 否则字段一旦被删掉，整个区块会莫名清空。
 */
export function isHidden(row: NotionRow, property: string): boolean {
  const prop = row.properties[property];
  if (!prop) return false;
  return prop.checkbox === false;
}

export function toSkill(row: NotionRow): Skill {
  const p = PROP.skills;
  const raw = num(read(row, p.level, 'number'));
  return {
    id: row.id,
    name: str(read(row, p.title, 'title')),
    category: str(read(row, p.category, 'select')) || '其他',
    position: opt(read(row, p.position, 'select')),
    // Notion 百分比格式返回 0.85，手工填 85 也认
    level: raw > 1 ? Math.min(100, Math.round(raw)) : Math.round(raw * 100),
    note: opt(read(row, p.note, 'text')),
    tags: arr(read(row, p.tags, 'multi_select')),
  };
}

export function toExperience(row: NotionRow): ExperienceItem {
  const p = PROP.experience;
  const start = opt(read(row, p.start, 'date'));
  const end = opt(read(row, p.end, 'date'));
  const from = yearMonth(start);
  const to = end ? yearMonth(end) : undefined;
  return {
    id: row.id,
    company: str(read(row, p.company, 'title')),
    role: str(read(row, p.role, 'text')),
    period: [from, to ?? '至今'].filter(Boolean).join(' — '),
    start,
    end,
    current: !end,
    duties: bullets(str(read(row, p.duties, 'text'))),
    achievements: bullets(str(read(row, p.achievements, 'text'))),
    order: num(read(row, p.order, 'number')),
  };
}

export function toArticle(row: NotionRow): Article {
  const p = PROP.articles;
  const image = opt(read(row, p.image, 'url'));
  return {
    id: row.id,
    title: str(read(row, p.title, 'title')),
    summary: str(read(row, p.summary, 'text')),
    category: opt(read(row, p.category, 'select')),
    tags: arr(read(row, p.tags, 'multi_select')),
    image,
    featured: bool(read(row, p.featured, 'checkbox')),
    publishedAt: opt(read(row, p.publishedAt, 'created_time')),
    status: opt(read(row, p.status, 'status')),
    order: num(read(row, p.order, 'number')),
  };
}
