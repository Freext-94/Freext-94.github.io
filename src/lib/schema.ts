export type PropertySpec =
  | { kind: 'title' }
  | { kind: 'text' }
  | { kind: 'url' }
  | { kind: 'email' }
  | { kind: 'select'; options?: string[] }
  | { kind: 'status'; options?: string[] }
  | { kind: 'multi_select'; options?: string[] }
  | { kind: 'checkbox' }
  | { kind: 'number'; format?: string }
  | { kind: 'date' }
  | { kind: 'place' }
  | { kind: 'created_time' };

export interface CollectionSpec {
  /** .env 中的键，值为 Notion 数据源 ID（或数据库 ID，会自动解析） */
  envKey: string;
  /** Notion 中的数据库标题 */
  title: string;
  icon: { type: 'emoji'; emoji: string };
  properties: Record<string, PropertySpec>;
}

/**
 * 属性名与 Notion 里的实际字段一一对应，改 Notion 字段名时同步改这里。
 * 用 `npm run notion:setup -- --check` 可以校验两边是否还一致。
 */
export const PROP = {
  profile: {
    record: '资料名称',
    name: '姓名',
    positioning: '职业定位',
    summary: '个人简介',
    city: '所在城市',
    email: '联系邮箱',
    github: 'GitHub',
    avatar: '头像',
    degree: '学历',
    school: '毕业院校',
    gradYear: '毕业年份',
    // 库里实际建的是这两个名字（一个英文一个中文），代码跟随库
    wechatQr: 'wechat',
    douyinQr: '抖音',
  },
  projects: {
    title: '项目名称',
    summary: '摘要',
    category: '分类',
    stack: '技术栈',
    image: '封面图片',
    demo: '演示地址',
    repo: 'GitHub',
    slug: 'Slug',
    status: '发布状态',
    featured: '精选项目',
    order: '排序',
  },
  skills: {
    title: '技能',
    category: '分类',
    position: '技能定位',
    level: '熟悉程度',
    note: '技能描述',
    tags: '技能标签',
    visible: '是否展示',
  },
  experience: {
    company: '公司名称',
    role: '职位',
    start: '开始时间',
    end: '结束时间',
    duties: '工作职责',
    achievements: '工作成果',
    visible: '是否展示',
    order: '排序',
  },
  articles: {
    title: '文章标题',
    summary: '摘要',
    category: '分类',
    tags: '标签',
    image: '封面图片',
    featured: '精选文章',
    publishedAt: '发布时间',
    status: '发布状态',
    order: '排序',
  },
} as const satisfies Record<string, Record<string, string>>;

const SKILL_POSITIONS = [
  '既有职业能力',
  '职业经验沉淀',
  '当前技术探索方向',
  '个人项目实践',
  '实际动手能力',
  '辅助技能',
];
const STATUSES = ['未开始', '进行中', '完成'];

export const COLLECTIONS = {
  profile: {
    envKey: 'NOTION_PROFILE_ID',
    title: 'Profile',
    icon: { type: 'emoji', emoji: '🪪' },
    properties: {
      [PROP.profile.record]: { kind: 'title' },
      [PROP.profile.name]: { kind: 'text' },
      [PROP.profile.positioning]: { kind: 'text' },
      [PROP.profile.summary]: { kind: 'text' },
      [PROP.profile.city]: { kind: 'place' },
      [PROP.profile.email]: { kind: 'email' },
      [PROP.profile.github]: { kind: 'url' },
      [PROP.profile.avatar]: { kind: 'url' },
      [PROP.profile.degree]: { kind: 'select' },
      [PROP.profile.school]: { kind: 'text' },
      [PROP.profile.wechatQr]: { kind: 'url' },
      [PROP.profile.douyinQr]: { kind: 'url' },
      [PROP.profile.gradYear]: { kind: 'number', format: 'number' },
    },
  },
  projects: {
    envKey: 'NOTION_PROJECTS_ID',
    title: 'Projects',
    icon: { type: 'emoji', emoji: '🚀' },
    properties: {
      [PROP.projects.title]: { kind: 'title' },
      [PROP.projects.summary]: { kind: 'text' },
      [PROP.projects.category]: { kind: 'select' },
      [PROP.projects.stack]: { kind: 'multi_select' },
      [PROP.projects.image]: { kind: 'url' },
      [PROP.projects.demo]: { kind: 'url' },
      [PROP.projects.repo]: { kind: 'url' },
      [PROP.projects.slug]: { kind: 'text' },
      [PROP.projects.status]: { kind: 'status', options: STATUSES },
      [PROP.projects.featured]: { kind: 'checkbox' },
      [PROP.projects.order]: { kind: 'number', format: 'number' },
    },
  },
  skills: {
    envKey: 'NOTION_SKILLS_ID',
    title: 'Skills',
    icon: { type: 'emoji', emoji: '🛠️' },
    properties: {
      [PROP.skills.title]: { kind: 'title' },
      [PROP.skills.category]: { kind: 'select' },
      [PROP.skills.position]: { kind: 'select', options: SKILL_POSITIONS },
      [PROP.skills.level]: { kind: 'number', format: 'percent' },
      [PROP.skills.note]: { kind: 'text' },
      [PROP.skills.tags]: { kind: 'multi_select' },
      [PROP.skills.visible]: { kind: 'checkbox' },
    },
  },
  experience: {
    envKey: 'NOTION_EXPERIENCE_ID',
    title: 'Experience',
    icon: { type: 'emoji', emoji: '📈' },
    properties: {
      [PROP.experience.company]: { kind: 'title' },
      [PROP.experience.role]: { kind: 'text' },
      [PROP.experience.start]: { kind: 'date' },
      [PROP.experience.end]: { kind: 'date' },
      [PROP.experience.duties]: { kind: 'text' },
      [PROP.experience.achievements]: { kind: 'text' },
      [PROP.experience.visible]: { kind: 'checkbox' },
      [PROP.experience.order]: { kind: 'number', format: 'number' },
    },
  },
  articles: {
    envKey: 'NOTION_ARTICLES_ID',
    title: 'Articles',
    icon: { type: 'emoji', emoji: '📝' },
    properties: {
      [PROP.articles.title]: { kind: 'title' },
      [PROP.articles.summary]: { kind: 'text' },
      [PROP.articles.category]: { kind: 'select' },
      [PROP.articles.tags]: { kind: 'multi_select' },
      [PROP.articles.image]: { kind: 'url' },
      [PROP.articles.featured]: { kind: 'checkbox' },
      [PROP.articles.publishedAt]: { kind: 'created_time' },
      [PROP.articles.status]: { kind: 'status', options: STATUSES },
      [PROP.articles.order]: { kind: 'number', format: 'number' },
    },
  },
} satisfies Record<string, CollectionSpec>;

export type CollectionKey = keyof typeof COLLECTIONS;
export const COLLECTION_KEYS = Object.keys(COLLECTIONS) as CollectionKey[];

/** 把属性声明翻译成 Notion `databases.create` 需要的格式 */
export function toNotionPropertySchema(spec: PropertySpec) {
  switch (spec.kind) {
    case 'title':
      return { title: {} };
    case 'text':
      return { rich_text: {} };
    case 'url':
      return { url: {} };
    case 'email':
      return { email: {} };
    case 'checkbox':
      return { checkbox: {} };
    case 'number':
      return { number: { format: spec.format ?? 'number' } };
    case 'date':
      return { date: {} };
    case 'place':
      return { place: {} };
    case 'created_time':
      return { created_time: { date: {} } };
    case 'select':
      return { select: { options: (spec.options ?? []).map((name) => ({ name })) } };
    case 'status':
      return { status: { options: (spec.options ?? []).map((name) => ({ name })) } };
    case 'multi_select':
      return {
        multi_select: { options: (spec.options ?? []).map((name) => ({ name })) },
      };
  }
}
