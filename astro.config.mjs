import { defineConfig } from 'astro/config';

// GitHub Pages 项目站点：https://<用户名>.github.io/<仓库名>/
// 若把仓库改名为 Freext-94.github.io 做用户根站点，把 base 改成 '/'
export default defineConfig({
  site: 'https://freext-94.github.io',
  base: '/freext-portfolio',
  trailingSlash: 'ignore',
  compressHTML: true,
  prefetch: { prefetchAll: true },
  devToolbar: { enabled: false },
  build: {
    assets: '_astro',
    inlineStylesheets: 'auto',
  },
});
