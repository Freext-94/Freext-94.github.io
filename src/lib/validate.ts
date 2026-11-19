/**
 * Slug 唯一性校验。
 *
 * Slug 决定静态路由的文件名，重复时后生成的页面会覆盖前一个，
 * 而且不会有任何报错——所以必须在 getStaticPaths 阶段直接拦住。
 */
export function assertUniqueSlugs<T>(
  items: T[],
  label: string,
  labelOf: (item: T) => string,
  slugOf: (item: T) => string | undefined,
): void {
  const seen = new Map<string, T>();
  const conflicts: string[] = [];

  for (const item of items) {
    const slug = slugOf(item)?.trim();
    if (!slug) continue;
    // 路由层面大小写不敏感，统一按小写比较
    const key = slug.toLowerCase();
    const previous = seen.get(key);
    if (previous) {
      conflicts.push(`「${slug}」→ ${labelOf(previous)} / ${labelOf(item)}`);
      continue;
    }
    seen.set(key, item);
  }

  if (conflicts.length > 0) {
    throw new Error(
      `[${label}] Slug 重复，构建已中止：\n${conflicts.map((line) => `  - ${line}`).join('\n')}\n` +
        '请到 Notion 修改重复的 Slug，一模一样的路由只会保留其中一个。',
    );
  }
}
