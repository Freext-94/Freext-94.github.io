/**
 * Canva 设计链接的识别与归一化。
 *
 * 站点只在「图片位置」处理 Canva 链接：构建时截图成本地 webp，
 * 其他图床链接、以及演示地址 / GitHub 这类 URL 字段一律不碰。
 */

const CANVA_HOSTS = new Set(['www.canva.com', 'canva.com']);

/** 是否是 Canva 设计页（/design/<id>/...），不是图片直链 */
export function isCanvaUrl(url?: string | null): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return (
      CANVA_HOSTS.has(parsed.hostname.toLowerCase()) &&
      /^\/design\/[A-Za-z0-9_-]+/.test(parsed.pathname)
    );
  } catch {
    return false;
  }
}

/** 取设计 ID，用作本地文件名与 manifest 的键 */
export function canvaDesignId(url: string): string | undefined {
  try {
    return /\/design\/([A-Za-z0-9_-]+)/.exec(new URL(url).pathname)?.[1];
  } catch {
    return undefined;
  }
}
