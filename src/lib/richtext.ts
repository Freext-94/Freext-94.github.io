/**
 * Notion rich text → 受限 HTML。
 *
 * 产物会被 set:html 直接插进页面，所以这个函数是唯一的注入防线：
 * 文本一律先转义，只按固定白名单包标签，链接只放行安全协议。
 */

interface Annotations {
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  underline?: boolean;
  code?: boolean;
  color?: string;
}

export interface RichTextItem {
  type?: string;
  plain_text?: string;
  href?: string | null;
  annotations?: Annotations;
}

const ESCAPES: ReadonlyArray<readonly [RegExp, string]> = [
  [/&/g, '&amp;'],
  [/</g, '&lt;'],
  [/>/g, '&gt;'],
  [/"/g, '&quot;'],
  [/'/g, '&#39;'],
];

export function escapeHtml(value: string): string {
  return ESCAPES.reduce((out, [re, to]) => out.replace(re, to), value);
}

/** 只放行这几种协议，其余（比如 javascript:）当普通文字渲染，不进 href */
function safeHref(href: string): string | undefined {
  try {
    const url = new URL(href);
    return ['http:', 'https:', 'mailto:'].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}

/** 由内到外的包裹顺序：code 最里，bold 最外，嵌套结果才和 Notion 里的观感一致 */
const WRAPPERS = [
  ['code', 'code'],
  ['underline', 'u'],
  ['strikethrough', 's'],
  ['italic', 'em'],
  ['bold', 'strong'],
] as const satisfies ReadonlyArray<readonly [keyof Annotations, string]>;

export function richTextToHtml(items: RichTextItem[] | undefined): string {
  if (!items?.length) return '';
  return items.map(renderItem).join('');
}

function renderItem(item: RichTextItem): string {
  let html = escapeHtml(item.plain_text ?? '');
  if (!html) return '';

  const a = item.annotations;
  if (a) {
    for (const [key, tag] of WRAPPERS) {
      if (a[key] === true) html = `<${tag}>${html}</${tag}>`;
    }
    // 颜色只传出名字，具体表现交给 CSS，不写内联样式
    if (a.color && a.color !== 'default') {
      html = `<span data-color="${escapeHtml(a.color)}">${html}</span>`;
    }
  }

  const href = item.href ? safeHref(item.href) : undefined;
  if (href) {
    html = `<a href="${escapeHtml(href)}" rel="noopener noreferrer" target="_blank">${html}</a>`;
  }
  return html;
}
