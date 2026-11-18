import type { APIRoute } from 'astro';
import { getPortfolio } from '@/lib/notion';

/**
 * 静态 sitemap：首页、作品集清单，以及所有填了 Slug 的项目详情页。
 * 站点部署在用户根域名，不需要拼接 base 前缀。
 */
export const GET: APIRoute = async ({ site }) => {
  const { projects } = await getPortfolio();
  const origin = (site ?? new URL('https://freext-94.github.io')).origin;

  const urls = [
    `${origin}/`,
    `${origin}/projects/`,
    ...projects
      .filter((project) => project.slug?.trim())
      .map((project) => `${origin}/projects/${encodeURIComponent(project.slug!.trim())}/`),
  ];

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((loc) => `  <url><loc>${loc}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
