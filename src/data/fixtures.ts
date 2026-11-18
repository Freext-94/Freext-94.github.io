import type {
  Article,
  ExperienceItem,
  ProfileInfo,
  Project,
  Skill,
} from '@/lib/types';

/** 内联占位二维码，只为验证正反面切换，不依赖外部图片 */
const QR_PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29"><rect width="29" height="29" fill="#fff"/><g fill="#111"><path fill-rule="evenodd" d="M2 2h9v9H2zM4 4v5h5V4zM18 2h9v9h-9zM20 4v5h5V4zM2 18h9v9H2zM4 20v5h5V20z"/><rect x="14" y="3" width="2" height="2"/><rect x="14" y="7" width="2" height="2"/><rect x="16" y="14" width="2" height="2"/><rect x="20" y="15" width="2" height="2"/><rect x="24" y="18" width="2" height="2"/><rect x="22" y="22" width="2" height="2"/><rect x="26" y="24" width="2" height="2"/><rect x="14" y="20" width="2" height="2"/><rect x="17" y="25" width="2" height="2"/></g></svg>',
)}`;

/**
 * 未配置 Notion 凭证时的兜底数据，让 `npm run dev` 开箱就能看到布局。
 * 字段形状与真实库一致，但内容是虚构的——不要把个人信息写在这里。
 */
const profile: ProfileInfo = {
  name: 'Sample Name',
  positioning: '示例身份 · 未接入 Notion',
  summary: [
    '这是一段占位简介。配置 .env.local 里的五个数据源 ID 后，这里会换成 Notion Profile 库中的「个人简介」。',
    '技能、项目、经历、文章同理，都来自对应的数据源。',
  ],
  city: '示例城市',
  email: 'sample@example.com',
  github: 'https://github.com/',
  avatar: undefined,
  degree: '示例学历',
  school: '示例大学',
  gradYear: 2020,
  initials: 'S',
  socials: [
    { key: 'wechat', label: '微信', icon: 'wechat', qr: QR_PLACEHOLDER },
    { key: 'douyin', label: '抖音', icon: 'douyin', qr: QR_PLACEHOLDER },
  ],
};

const projects: Project[] = [
  {
    id: 'sample-1',
    name: '示例项目：流程从 0 到 1',
    summary: '这里显示 Notion「摘要」字段的内容，一句话说清做了什么、解决了什么问题。',
    category: '示例分类',
    stack: ['工具 A', '工具 B'],
    image: undefined,
    demo: undefined,
    repo: 'https://github.com/',
    slug: 'sample-one',
    status: '已发布',
    featured: true,
    order: 1,
  },
  {
    id: 'sample-2',
    name: '示例项目：数据整理与分析',
    summary: '「发布状态」字段会原样显示成右上角的徽章，未填写时不显示。',
    category: '示例分类',
    stack: ['工具 C'],
    slug: 'sample-two',
    status: '进行中',
    featured: true,
    order: 2,
  },
  {
    id: 'sample-3',
    name: '示例项目：培训与推广',
    summary: '没有封面图时，卡片会用项目首字生成一张渐变底图。',
    category: '示例分类',
    stack: ['工具 D', '工具 E'],
    slug: 'sample-three',
    featured: false,
    order: 3,
  },
];

const skills: Skill[] = [
  { id: 's1', name: '示例技能 A', category: '分组一', position: '既有职业能力', level: 85, note: '这里显示 Notion「技能描述」字段的内容。', tags: ['标签一', '标签二'] },
  { id: 's2', name: '示例技能 B', category: '分组一', position: '既有职业能力', level: 70, note: '「技能定位」在同一分类下取值一致，用作分组的一句话描述。', tags: [] },
  { id: 's3', name: '示例技能 C', category: '分组二', position: '当前技术探索方向', level: 55, note: '进度条长度来自「熟悉程度」百分比字段。', tags: ['标签三'] },
  { id: 's4', name: '示例技能 D', category: '分组二', position: '当前技术探索方向', level: 40, tags: [] },
  { id: 's5', name: '示例技能 E', category: '分组三', position: '辅助技能', level: 65, note: '未配置 Notion 时看到的是这份占位数据，内容与真实库无关。', tags: ['标签四', '标签五'] },
];

const experience: ExperienceItem[] = [
  {
    id: 'e1',
    company: '示例公司甲',
    role: '示例职位',
    period: '2022.05 — 2024.06',
    start: '2022-05-01',
    end: '2024-06-01',
    current: false,
    duties: ['「工作职责」里一行一条，会自动拆成要点。', '整段用句号连接也能拆开。'],
    achievements: ['「工作成果」单独成块，显示在职责下方。'],
    order: 1,
  },
  {
    id: 'e2',
    company: '示例公司乙',
    role: '示例职位',
    period: '2020.04 — 至今',
    start: '2020-04-01',
    end: undefined,
    current: true,
    duties: ['结束时间留空时，右侧会显示「至今」并让时间线节点呼吸。'],
    achievements: [],
    order: 2,
  },
];

const articles: Article[] = [];

export const SAMPLE_PORTFOLIO = { profile, projects, skills, experience, articles };
