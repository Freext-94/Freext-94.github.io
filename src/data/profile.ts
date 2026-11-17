interface Profile {
  name: string;
  shortName: string;
  title: string;
  tagline: string;
  roles: string[];
  avatar?: string;
  location: string;
  available: boolean;
  availableNote: string;
  email: string;
  resumeUrl?: string;
  summary: string[];
  seo: { description: string; ogImage?: string };
}

/**
 * 身份信息：改动频率低，放本地比走 Notion 更快（首屏不用等接口）。
 * 其余内容（作品 / 技能 / 经历 / 链接）都在 Notion 里维护。
 */
export const profile: Profile = {
  name: '你的名字',
  /** 用于导航栏 logo 与头像兜底 */
  shortName: 'YR',
  title: '前端工程师 · 交互设计爱好者',
  tagline: '把复杂的东西做得好用，把好用的东西做得好看。',
  /** 首屏打字机式轮换的关键词 */
  roles: ['前端工程师', '全栈开发', '交互设计', '开源爱好者'],
  avatar: undefined,
  location: '中国 · 杭州',
  available: true,
  availableNote: '开放远程合作与全职机会',
  email: 'hello@example.com',
  /** 简历 PDF，可放图床直链 */
  resumeUrl: undefined,
  summary: [
    '过去一年我在做三件事：把设计系统落地到多个产品线，用 Astro 重写个人站点，以及给团队搭内部效率工具。',
    '我喜欢那种「看得出想了很久」的界面——动效有理由，排版有节奏，性能也不将就。',
  ],
  seo: {
    description: '个人主页与作品集：项目经历、技能栈与联系方式。',
    ogImage: undefined,
  },
};
