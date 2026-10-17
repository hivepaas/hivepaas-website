// The sitemap, built with the site from its pages: every .astro page under
// src/pages, so a new page is listed without editing this file.
import type { APIRoute } from 'astro';

const paths = Object.keys(import.meta.glob('./**/*.astro'))
  .map(
    (file) =>
      file
        .replace(/^\./, '')
        .replace(/(index)?\.astro$/, '')
        .replace(/\/$/, '') || '/'
  )
  .sort();

export const GET: APIRoute = ({ site }) => {
  const urls = paths
    .map((path) => `  <url><loc>${new URL(path, site).href}</loc></url>`)
    .join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
