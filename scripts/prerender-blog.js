// Build-time prerender for the blog.
//
// The site is a client-rendered SPA, so every route is served as an empty
// <div id="root">. AI crawlers (GPTBot, OAI-SearchBot, ClaudeBot,
// PerplexityBot) and many search bots do not run JavaScript, which means they
// would see none of the article. After `vite build`, this plugin writes
// dist/blog/index.html and dist/blog/<slug>/index.html with the full article
// text, per-page <head> tags and JSON-LD baked in. Vercel serves those files
// before the SPA rewrite; in the browser, React then mounts over the same
// content.
import fs from 'node:fs';
import path from 'node:path';
import { posts, postJsonLd, formatPostDate, BLOG_INDEX_META, SITE_URL } from '../src/content/posts.js';
import { parseInline } from '../src/content/inline.js';

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function inline(text) {
  return parseInline(text)
    .map((t) => {
      if (t.type === 'bold') return `<strong>${esc(t.value)}</strong>`;
      if (t.type === 'link') return `<a href="${esc(t.href)}">${esc(t.value)}</a>`;
      return esc(t.value);
    })
    .join('');
}

function block(b) {
  if (b.p) return `<p>${inline(b.p)}</p>`;
  if (b.ul) return `<ul>${b.ul.map((i) => `<li>${inline(i)}</li>`).join('')}</ul>`;
  if (b.ol) return `<ol>${b.ol.map((i) => `<li>${inline(i)}</li>`).join('')}</ol>`;
  if (b.callout) return `<aside>${b.label ? `<p><strong>${esc(b.label)}</strong></p>` : ''}<p>${inline(b.callout)}</p></aside>`;
  if (b.quote) return `<blockquote><p>${inline(b.quote)}</p></blockquote>`;
  if (b.table) {
    const head = `<tr>${b.table.head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr>`;
    const rows = b.table.rows
      .map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th scope="row">${inline(c)}</th>` : `<td>${inline(c)}</td>`)).join('')}</tr>`)
      .join('');
    return `<table><caption>${esc(b.table.caption || '')}</caption><thead>${head}</thead><tbody>${rows}</tbody></table>`;
  }
  return '';
}

const NAV = `<header><nav aria-label="Main"><a href="/">Fluxo</a> · <a href="/about">About</a> · <a href="/services">Services</a> · <a href="/blog">Blog</a> · <a href="/contact">Contact</a></nav></header>`;

function postBody(post) {
  return `${NAV}<main><article>
<p><a href="/blog">All articles</a> · ${esc(post.category)}</p>
<h1>${esc(post.title)}</h1>
<p>${esc(post.dek)}</p>
<p>By ${esc(post.author.name)}, ${esc(post.author.role)} · <time datetime="${post.datePublished}">${esc(formatPostDate(post.datePublished))}</time> · ${post.readMinutes} min read</p>
<section aria-label="Summary"><h2>The short answer</h2><ul>${post.tldr.map((l) => `<li>${inline(l)}</li>`).join('')}</ul></section>
${post.sections.map((s) => `<section id="${s.id}"><h2>${esc(s.heading)}</h2>${s.blocks.map(block).join('')}</section>`).join('\n')}
<section id="faq"><h2>Frequently asked questions</h2>${post.faq.map((f) => `<h3>${esc(f.q)}</h3><p>${inline(f.a)}</p>`).join('')}</section>
<section><h2>${esc(post.cta.heading)}</h2><p>${esc(post.cta.body)}</p><p><a href="/contact">${esc(post.cta.button)}</a></p></section>
</article></main>
<footer><p>Fluxo Pte. Ltd. · Ark@KB, 68 Kaki Bukit Ave 6, #04-19, Singapore 417896 · <a href="mailto:business@fluxo.com.sg">business@fluxo.com.sg</a></p></footer>`;
}

function indexBody() {
  return `${NAV}<main><h1>The Fluxo blog</h1><p>${esc(BLOG_INDEX_META.description)}</p>
${posts.map((p) => `<article><h2><a href="/blog/${p.slug}">${esc(p.title)}</a></h2><p>${esc(p.dek)}</p><p><time datetime="${p.datePublished}">${esc(formatPostDate(p.datePublished))}</time></p></article>`).join('')}
</main>`;
}

function withPage(shell, { title, description, url, type = 'website', jsonLd, body }) {
  const head = [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:site_name" content="Fluxo" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta name="twitter:card" content="summary" />`,
    jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>` : '',
  ].join('\n    ');

  const out = shell
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(description)}" />`)
    .replace('</head>', `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);

  if (!out.includes(body)) throw new Error('prerender-blog: could not find <div id="root"></div> in dist/index.html');
  return out;
}

function write(outDir, route, html) {
  const file = path.join(outDir, route, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html, 'utf8');
}

export default function prerenderBlog() {
  let outDir = 'dist';
  return {
    name: 'fluxo-prerender-blog',
    apply: (_config, env) => env.command === 'build' || env.isPreview,
    // Mirror the vercel.json blog rewrites in `vite preview`, whose SPA
    // fallback would otherwise serve the empty shell for /blog/<slug>.
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        const [pathname, query] = req.url.split('?');
        if (/^\/blog(\/[^/.]+)?$/.test(pathname)) req.url = `${pathname}/index.html${query ? `?${query}` : ''}`;
        next();
      });
    },
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const shell = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');

      write(outDir, 'blog', withPage(shell, {
        title: BLOG_INDEX_META.title,
        description: BLOG_INDEX_META.description,
        url: `${SITE_URL}/blog`,
        body: indexBody(),
      }));

      for (const post of posts) {
        write(outDir, `blog/${post.slug}`, withPage(shell, {
          title: post.seoTitle,
          description: post.description,
          url: `${SITE_URL}/blog/${post.slug}`,
          type: 'article',
          jsonLd: postJsonLd(post),
          body: postBody(post),
        }));
      }
      console.log(`prerender-blog: wrote /blog and ${posts.length} article(s)`);
    },
  };
}
