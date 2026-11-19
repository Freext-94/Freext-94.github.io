/**
 * 站点路径拼接。BASE_URL 在 trailingSlash: 'ignore' 下不带尾斜杠，
 * 直接拼会少一个 /（favicon 就踩过这个坑），所以统一走这里。
 */
const base = () => import.meta.env.BASE_URL.replace(/\/?$/, '/');

export const siteRoot = base;

/** 项目清单页 */
export function projectsPath(): string {
  return `${base()}projects/`;
}

/** 项目详情页地址；没填 Slug 就没有详情页。带尾斜杠，与 sitemap 一致 */
export function projectPath(slug?: string): string | undefined {
  const key = slug?.trim();
  return key ? `${base()}projects/${encodeURIComponent(key)}/` : undefined;
}

/** 首页上的锚点，从任意页面都能跳回去 */
export function homeAnchor(hash: string): string {
  return `${base()}${hash}`;
}

/** 文章清单页 */
export function articlesPath(): string {
  return `${base()}articles/`;
}

/** 文章详情页地址；没填 Slug 就没有详情页。带尾斜杠，与 sitemap 一致 */
export function articlePath(slug?: string): string | undefined {
  const key = slug?.trim();
  return key ? `${base()}articles/${encodeURIComponent(key)}/` : undefined;
}
