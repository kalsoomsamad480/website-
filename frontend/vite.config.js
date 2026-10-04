import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Public pages listed in the sitemap (account and admin pages are excluded)
const PUBLIC_ROUTES = ['/', '/menu', '/study-space', '/about', '/gallery', '/contact', '/reserve'];

/** Writes sitemap.xml and robots.txt into the build, using VITE_SITE_URL as the origin. */
function seoFiles(siteUrl) {
  const origin = siteUrl.replace(/\/$/, '');
  return {
    name: 'study-mind-seo-files',
    apply: 'build',
    generateBundle() {
      const urls = PUBLIC_ROUTES.map(
        (route) => `  <url><loc>${origin}${route}</loc><changefreq>weekly</changefreq></url>`,
      ).join('\n');
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      });
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /profile\nDisallow: /checkout\n\nSitemap: ${origin}/sitemap.xml\n`,
      });
    },
  };
}

function siteOrigin(env) {
  if (env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return env.VITE_SITE_URL || 'http://localhost:5173';
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    // On Vercel, the production domain is always the real one, so it wins over VITE_SITE_URL
    plugins: [react(), seoFiles(siteOrigin(env))],
    server: {
      port: 5173,
      proxy: {
        '/api': 'http://localhost:5000',
      },
    },
  };
});
