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

/**
 * 同一个设计链接可能带 #N 指向第 N 页（多页设计常用同一个链接）。
 * 没有片段时按第 1 页处理，保证 key 稳定。
 */
export function canvaPage(url: string): string {
  try {
    const page = Number.parseInt(new URL(url).hash.replace(/^#/, ''), 10);
    return Number.isFinite(page) && page > 0 ? String(page) : '1';
  } catch {
    return '1';
  }
}

/** manifest 的键：设计 ID + 页号 */
export function canvaKey(url: string): string | undefined {
  const id = canvaDesignId(url);
  return id ? `${id}#${canvaPage(url)}` : undefined;
}
