import type { CollectionKey } from './schema';

/** 社交媒体条目：库里每个平台一个 URL 字段，存二维码图片直链 */
export interface SocialEntry {
  key: string;
  label: string;
  icon: string;
  qr: string;
}

export interface ProfileInfo {
  name: string;
  /** 首屏大字，来自「职业定位」 */
  positioning: string;
  /** 「个人简介」按空行拆成的段落 */
  summary: string[];
  city: string;
  email: string;
  github?: string;
  avatar?: string;
  degree?: string;
  school?: string;
  gradYear?: number;
  /** 头像为空时用来当圆形徽标 */
  initials: string;
  /** 只包含至少填了账号或二维码的平台 */
  socials: SocialEntry[];
}

export interface Project {
  id: string;
  name: string;
  summary: string;
  category?: string;
  stack: string[];
  image?: string;
  demo?: string;
  repo?: string;
  slug?: string;
  /** 「发布状态」原样透出，未填写时为 undefined */
  status?: string;
  details?: ProjectDetailBlock[];
  featured: boolean;
  order: number;
}

/**
 * 详情页正文块。html / items 是已经转义并包好标签的片段，
 * 渲染时必须用 set:html，不能用 {value} 插值（否则会把标签显示出来）。
 */
export type ProjectDetailBlock =
  | { type: 'heading'; level: 1 | 2 | 3; html: string }
  | { type: 'paragraph' | 'quote'; html: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'image'; url: string; caption?: string };

export interface Skill {
  id: string;
  name: string;
  category: string;
  /** 「技能定位」，同一个分类下取值一致，用作分组的一句话描述 */
  position?: string;
  /** 「熟悉程度」百分比字段，0–100 */
  level: number;
  note?: string;
  tags: string[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  /** 已经拼好的「2022.05 — 2024.06」，结束时间为空则是「至今」 */
  period: string;
  start?: string;
  end?: string;
  current: boolean;
  duties: string[];
  achievements: string[];
  order: number;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  category?: string;
  tags: string[];
  image?: string;
  featured: boolean;
  /** ISO 日期，来自 created_time */
  publishedAt?: string;
  status?: string;
  order: number;
}

/** Notion 里各数据源的真实名称，用作区块的英文小标题 */
export type DbNames = Record<CollectionKey, string>;

export interface Portfolio {
  profile: ProfileInfo;
  projects: Project[];
  skills: Skill[];
  experience: ExperienceItem[];
  articles: Article[];
  dbNames: DbNames;
  /** sample 表示未配置 Notion，使用了内置示例数据 */
  source: 'notion' | 'sample';
}
