// `vite preview` only: serve the prerendered dist/<route>/index.html files
// the same way vercel.json does in production, instead of Vite's SPA
// fallback (which would hand every route the home page).
import fs from 'node:fs';
import path from 'node:path';

export default function previewRoutes() {
  let outDir = 'dist';
  return {
    name: 'fluxo-preview-routes',
    apply: (_config, env) => Boolean(env.isPreview),
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        const [pathname, query] = req.url.split('?');
        if (pathname !== '/' && !path.extname(pathname)) {
          const clean = pathname.replace(/\/$/, '');
          const hit = fs.existsSync(path.join(outDir, clean, 'index.html'));
          req.url = `${hit ? `${clean}/index.html` : '/_spa.html'}${query ? `?${query}` : ''}`;
        }
        next();
      });
    },
  };
}
