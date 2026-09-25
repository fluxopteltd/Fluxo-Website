// Server entry used only at build time by scripts/prerender.mjs to render
// every public route to static HTML (see that script for why).
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Helmet } from 'react-helmet';
import { AnimatedRoutes } from './App.jsx';
import { posts } from './content/posts.js';

export const routes = [
  '/',
  '/about',
  '/services',
  '/contact',
  '/blog',
  ...posts.map((p) => `/blog/${p.slug}`),
  '/privacy',
  '/terms',
];

export function render(url) {
  const html = renderToString(
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <StaticRouter location={url}>
        <AnimatedRoutes />
      </StaticRouter>
    </ThemeProvider>,
  );
  const helmet = Helmet.renderStatic();
  return {
    html,
    head: {
      title: helmet.title.toString(),
      meta: helmet.meta.toString(),
      link: helmet.link.toString(),
      script: helmet.script.toString(),
    },
  };
}
