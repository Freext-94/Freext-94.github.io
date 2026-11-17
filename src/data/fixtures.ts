import type { ExperienceItem, Project, Skill, SocialLink } from '@/lib/types';

/**
 * 未配置 Notion 凭证时使用的兜底数据，让 `npm run dev` 开箱就能看效果。
 * 配置好 .env 后这份数据不会被引用到产物里。
 */
const projects: Project[] = [
  {
    id: 'sample-1',
    name: '星云设计系统',
    summary: '服务 6 条产品线的跨端设计系统，覆盖 120+ 组件与一套主题令牌。',
    detail: [
      '从零搭建 token → 组件 → 文档 → 变更发布的全链路，设计稿与代码共用同一套语义变量。',
      '把暗色模式成本从「每个组件改一遍」降到「换一层 token」。',
    ],
    tags: ['设计系统', '组件库', '开源'],
    stack: ['TypeScript', 'React', 'Vite', 'Style Dictionary'],
    live: 'https://example.com',
    repo: 'https://github.com/example/design-system',
    period: '2025.03 — 至今',
    role: '主导者',
    featured: true,
    order: 1,
  },
  {
    id: 'sample-2',
    name: '实时协作白板',
    summary: '支持 50 人同时编辑的白板，冲突合并走 CRDT，端到端延迟低于 80ms。',
    detail: [
      '用 Yjs 做文档同步，自研渲染层把 Canvas 绘制与命中检测合并到一帧。',
      '离线编辑后重连可自动合并，冲突不需要用户感知。',
    ],
    tags: ['实时', 'Canvas', '协作'],
    stack: ['TypeScript', 'Yjs', 'WebSocket', 'Canvas'],
    live: 'https://example.com',
    period: '2024.09 — 2025.02',
    role: '前端负责人',
    featured: true,
    order: 2,
  },
  {
    id: 'sample-3',
    name: 'AI 写作助手',
    summary: '把长文档拆段做上下文检索，配合流式输出与可回溯的改写历史。',
    detail: ['设计了分段缓存与增量重绘策略，长文改写时不再整页闪烁。'],
    tags: ['AI', '流式', '生产力'],
    stack: ['Astro', 'SSE', 'SQLite', 'Embedding'],
    live: 'https://example.com',
    repo: 'https://github.com/example/writer',
    period: '2024.04 — 2024.08',
    role: '独立开发',
    featured: true,
    order: 3,
  },
  {
    id: 'sample-4',
    name: '移动端打卡小程序',
    summary: '日活 3000 的习惯打卡小程序，首屏 1.1s，包体控制在 900KB。',
    detail: ['用本地优先的写入策略解决弱网重复提交，配合后台批量补传。'],
    tags: ['小程序', '性能优化'],
    stack: ['微信小程序', 'Skyline', '云开发'],
    period: '2023.10 — 2024.03',
    role: '独立开发',
    featured: false,
    order: 4,
  },
];

const skills: Skill[] = [
  { id: 's1', name: 'TypeScript', category: '语言', level: 92, icon: '🧩', order: 1 },
  { id: 's2', name: 'Vue / Nuxt', category: '框架', level: 88, icon: '⚙️', order: 2 },
  { id: 's3', name: 'React / Next', category: '框架', level: 84, icon: '⚛️', order: 3 },
  { id: 's4', name: 'Astro', category: '框架', level: 80, note: '本就是这个站点', icon: '🚀', order: 4 },
  { id: 's5', name: 'CSS / 动效', category: '工程', level: 90, icon: '🎨', order: 5 },
  { id: 's6', name: 'Node / FastAPI', category: '工程', level: 76, icon: '🔧', order: 6 },
  { id: 's7', name: '性能优化', category: '工程', level: 85, icon: '📊', order: 7 },
  { id: 's8', name: '设计系统', category: '其他', level: 87, icon: '✨', order: 8 },
];

const experience: ExperienceItem[] = [
  {
    id: 'e1',
    role: '高级前端工程师',
    org: '某某科技',
    period: '2024.06 — 至今',
    location: '杭州',
    highlights: [
      '主导设计系统建设，组件复用率从 34% 提升到 78%',
      '把核心页面 LCP 从 3.4s 优化到 1.2s',
      '带 3 人小组，负责前端规范与评审机制',
    ],
    current: true,
    type: '工作',
    order: 4,
  },
  {
    id: 'e2',
    role: '前端工程师',
    org: '某某网络',
    period: '2022.07 — 2024.05',
    location: '上海',
    highlights: ['负责中台表单引擎，支撑 40+ 业务表单配置化', '推动构建从 Webpack 迁到 Vite，冷启动快 8 倍'],
    current: false,
    type: '工作',
    order: 3,
  },
  {
    id: 'e3',
    role: '前端实习生',
    org: '某某信息',
    period: '2021.12 — 2022.06',
    location: '远程',
    highlights: ['独立交付内部数据看板 v1'],
    current: false,
    type: '实习',
    order: 2,
  },
  {
    id: 'e4',
    role: '计算机科学与技术 本科',
    org: '某某大学',
    period: '2018.09 — 2022.06',
    location: '南京',
    highlights: ['校 ACM 队员，专注人机交互方向课程设计'],
    current: false,
    type: '教育',
    order: 1,
  },
];

const links: SocialLink[] = [
  { id: 'l1', name: 'GitHub', url: 'https://github.com/', icon: 'github', handle: '@yourname', isEmail: false, order: 1 },
  { id: 'l2', name: '邮箱', url: 'mailto:hello@example.com', icon: 'mail', handle: 'hello@example.com', isEmail: true, order: 2 },
  { id: 'l3', name: '掘金', url: 'https://juejin.cn/', icon: 'juejin', handle: '@yourname', isEmail: false, order: 3 },
  { id: 'l4', name: '博客', url: 'https://example.com', icon: 'blog', handle: 'example.com', isEmail: false, order: 4 },
];

export const SAMPLE_PORTFOLIO = {
  projects,
  skills,
  experience,
  links,
};
