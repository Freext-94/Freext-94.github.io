/**
 * 站点路径拼接。BASE_URL 在 trailingSlash: 'ignore' 下不带尾斜杠，
 * 直接拼会少一个 /（favicon 就踩过这个坑），所以统一走这里。
 */
const base = () => import.meta.env.BASE_URL.replace(/\/?$/, '/');

export const siteRoot = base;

/** 项目详情页地址；没填 Slug 就没有详情页 */
export function projectPath(slug?: string): string | undefined {
  const key = slug?.trim();
  return key ? `${base()}projects/${encodeURIComponent(key)}` : undefined;
}

/** 首页上的锚点，从任意页面都能跳回去 */
export function homeAnchor(hash: string): string {
  return `${base()}${hash}`;
}
