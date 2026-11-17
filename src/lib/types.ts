export interface Project {
  id: string;
  name: string;
  summary: string;
  detail: string[];
  tags: string[];
  stack: string[];
  image?: string;
  live?: string;
  repo?: string;
  period?: string;
  role?: string;
  featured: boolean;
  order: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  /** 0–100，来自 Notion 百分比数字属性 */
  level: number;
  note?: string;
  icon?: string;
  order: number;
}

export interface ExperienceItem {
  id: string;
  role: string;
  org: string;
  period: string;
  location?: string;
  highlights: string[];
  current: boolean;
  type: string;
  order: number;
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  handle?: string;
  isEmail: boolean;
  order: number;
}

export interface Portfolio {
  projects: Project[];
  skills: Skill[];
  experience: ExperienceItem[];
  links: SocialLink[];
  /** sample 表示未配置 Notion，使用了内置示例数据 */
  source: 'notion' | 'sample';
}
