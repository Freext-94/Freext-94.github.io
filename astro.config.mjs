import { defineConfig } from 'astro/config';

// GitHub Pages 项目站点需要 base：https://<用户名>.github.io/<仓库名>/
// 如果部署到用户根站点（<用户名>.github.io），把 base 改成 '/'
export default defineConfig({
  site: 'https://your-username.github.io',
  base: '/portfolio-homepage',
  trailingSlash: 'ignore',
  compressHTML: true,
  prefetch: { prefetchAll: true },
  devToolbar: { enabled: false },
  build: {
    assets: '_astro',
    inlineStylesheets: 'auto',
  },
});
