import { defineConfig } from 'astro/config';

// 用户根站点：仓库名为 Freext-94.github.io，直接部署在域名根路径，base 必须是 '/'
export default defineConfig({
  site: 'https://freext-94.github.io',
  base: '/',
  trailingSlash: 'ignore',
  compressHTML: true,
  prefetch: { prefetchAll: true },
  devToolbar: { enabled: false },
  build: {
    assets: '_astro',
    inlineStylesheets: 'auto',
  },
});
