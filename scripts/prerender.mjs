// Build-time prerender for every public route.
//
// The site is a client-rendered SPA, so without this every URL is served as
// an empty <div id="root">. AI crawlers (GPTBot, OAI-SearchBot, ClaudeBot,
// PerplexityBot) and many search bots do not run JavaScript, so they would
// see none of the content. `npm run build` runs the normal client build, then
// an SSR build of src/entry-server.jsx, then this script, which renders each
// route with React and writes dist/<route>/index.html with the page's text,
// <title>, description, canonical, Open Graph tags and JSON-LD baked in.
//
// In the browser, main.jsx mounts React over the same markup as before.
// dist/_spa.html keeps the untouched shell for the SPA fallback rewrite.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const SITE_URL = 'https://fluxo.com.sg';
const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const { render, routes } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);

const shell = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
fs.writeFileSync(path.join(dist, '_spa.html'), shell, 'utf8');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const unesc = (s) => s.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

function pick(re, text) {
  const m = text.match(re);
  return m ? unesc(m[1]) : null;
}

function setMeta(html, attr, key, value) {
  const re = new RegExp(`<meta ${attr}="${key}" content="[^"]*" />`);
  if (!re.test(html)) throw new Error(`prerender: shell is missing <meta ${attr}="${key}">`);
  return html.replace(re, `<meta ${attr}="${key}" content="${esc(value)}" />`);
}

for (const route of routes) {
  const { html, head } = render(route);

  const title = pick(/<title[^>]*>([\s\S]*?)<\/title>/, head.title);
  const description = pick(/<meta[^>]*name="description"[^>]*content="([^"]*)"/, head.meta);
  const canonical = pick(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/, head.link) || `${SITE_URL}${route === '/' ? '/' : route}`;
  if (!title || !description) throw new Error(`prerender: ${route} has no <Helmet> title/description`);

  // Helmet's own description is written via setMeta below; drop it from the
  // extra tags so the page doesn't carry two.
  const extraMeta = head.meta.replace(/<meta[^>]*name="description"[^>]*\/?>/, '');

  let page = shell.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  page = setMeta(page, 'name', 'description', description);
  page = setMeta(page, 'property', 'og:title', title);
  page = setMeta(page, 'property', 'og:description', description);
  page = setMeta(page, 'property', 'og:url', canonical);
  page = page.replace('</head>', `  ${extraMeta}${head.link}${head.script}\n  </head>`);

  if (!page.includes('<div id="root"></div>')) throw new Error('prerender: shell is missing <div id="root"></div>');
  page = page.replace('<div id="root"></div>', `<div id="root">${html}</div>`);

  const file = route === '/' ? path.join(dist, 'index.html') : path.join(dist, route, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, page, 'utf8');
  console.log(`prerender: ${route.padEnd(70)} ${(page.length / 1024).toFixed(1)} kB`);
}

fs.rmSync(ssrDir, { recursive: true, force: true });
