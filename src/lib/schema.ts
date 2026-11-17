export type PropertySpec =
  | { kind: 'title' }
  | { kind: 'text' }
  | { kind: 'url' }
  | { kind: 'select'; options?: string[] }
  | { kind: 'multi_select'; options?: string[] }
  | { kind: 'checkbox' }
  | { kind: 'number'; format?: string };

export interface CollectionSpec {
  /** .env 中的键，值为 Notion 数据源 ID（或数据库 ID，会自动解析） */
  envKey: string;
  /** Notion 中的数据库标题，建库脚本使用 */
  title: string;
  icon: { type: 'emoji'; emoji: string };
  properties: Record<string, PropertySpec>;
}

export const PROP = {
  projects: {
    title: '作品名称',
    summary: '一句话简介',
    detail: '项目说明',
    tags: '标签',
    image: '封面图',
    live: '在线地址',
    repo: '源码地址',
    period: '时间',
    role: '我的角色',
    stack: '技术栈',
    featured: '首页展示',
    order: '排序',
  },
  skills: {
    title: '技能名称',
    category: '分类',
    level: '熟练度',
    note: '补充说明',
    icon: '图标',
    order: '排序',
  },
  experience: {
    title: '职位',
    org: '单位',
    period: '时间',
    location: '地点',
    highlights: '工作内容',
    current: '进行中',
    type: '类型',
    order: '排序',
  },
  links: {
    title: '名称',
    url: '地址',
    icon: '图标',
    handle: '展示文案',
    email: '是否邮箱',
    order: '排序',
  },
} as const satisfies Record<string, Record<string, string>>;

const EMOJI = ['🚀', '🛠️', '🎨', '📊', '🧩', '⚙️', '📱', '🤖', '🔧', '✨'];
const SKILL_CATEGORIES = ['语言', '框架', '工程', '工具', '其他'];
const EXP_TYPES = ['工作', '实习', '教育', '项目', '获奖'];
const ICONS = [
  'github',
  'twitter',
  'linkedin',
  'mail',
  'wechat',
  'blog',
  'zhihu',
  'juejin',
  'bilibili',
  'telegram',
  'link',
];

export const COLLECTIONS: Record<
  'projects' | 'skills' | 'experience' | 'links',
  CollectionSpec
> = {
  projects: {
    envKey: 'NOTION_PROJECTS_ID',
    title: '作品集',
    icon: { type: 'emoji', emoji: '🚀' },
    properties: {
      [PROP.projects.title]: { kind: 'title' },
      [PROP.projects.summary]: { kind: 'text' },
      [PROP.projects.detail]: { kind: 'text' },
      [PROP.projects.tags]: { kind: 'multi_select', options: [] },
      [PROP.projects.stack]: { kind: 'multi_select', options: [] },
      [PROP.projects.image]: { kind: 'url' },
      [PROP.projects.live]: { kind: 'url' },
      [PROP.projects.repo]: { kind: 'url' },
      [PROP.projects.period]: { kind: 'text' },
      [PROP.projects.role]: { kind: 'text' },
      [PROP.projects.featured]: { kind: 'checkbox' },
      [PROP.projects.order]: { kind: 'number', format: 'number' },
    },
  },
  skills: {
    envKey: 'NOTION_SKILLS_ID',
    title: '技能栈',
    icon: { type: 'emoji', emoji: '🛠️' },
    properties: {
      [PROP.skills.title]: { kind: 'title' },
      [PROP.skills.category]: { kind: 'select', options: SKILL_CATEGORIES },
      [PROP.skills.level]: { kind: 'number', format: 'percent' },
      [PROP.skills.note]: { kind: 'text' },
      [PROP.skills.icon]: { kind: 'select', options: EMOJI },
      [PROP.skills.order]: { kind: 'number', format: 'number' },
    },
  },
  experience: {
    envKey: 'NOTION_EXPERIENCE_ID',
    title: '经历',
    icon: { type: 'emoji', emoji: '📈' },
    properties: {
      [PROP.experience.title]: { kind: 'title' },
      [PROP.experience.org]: { kind: 'text' },
      [PROP.experience.period]: { kind: 'text' },
      [PROP.experience.location]: { kind: 'text' },
      [PROP.experience.highlights]: { kind: 'text' },
      [PROP.experience.current]: { kind: 'checkbox' },
      [PROP.experience.type]: { kind: 'select', options: EXP_TYPES },
      [PROP.experience.order]: { kind: 'number', format: 'number' },
    },
  },
  links: {
    envKey: 'NOTION_LINKS_ID',
    title: '联系方式',
    icon: { type: 'emoji', emoji: '✉️' },
    properties: {
      [PROP.links.title]: { kind: 'title' },
      [PROP.links.url]: { kind: 'url' },
      [PROP.links.icon]: { kind: 'select', options: ICONS },
      [PROP.links.handle]: { kind: 'text' },
      [PROP.links.email]: { kind: 'checkbox' },
      [PROP.links.order]: { kind: 'number', format: 'number' },
    },
  },
};

/** 把属性声明翻译成 Notion `databases.create` 需要的格式 */
export function toNotionPropertySchema(spec: PropertySpec) {
  switch (spec.kind) {
    case 'title':
      return { title: {} };
    case 'text':
      return { rich_text: {} };
    case 'url':
      return { url: {} };
    case 'checkbox':
      return { checkbox: {} };
    case 'number':
      return { number: { format: spec.format ?? 'number' } };
    case 'select':
      return { select: { options: (spec.options ?? []).map((name) => ({ name })) } };
    case 'multi_select':
      return {
        multi_select: { options: (spec.options ?? []).map((name) => ({ name })) },
      };
  }
}
