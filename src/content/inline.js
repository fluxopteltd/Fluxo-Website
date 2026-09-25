// Tiny inline-markup parser shared by the React blog pages and the build-time
// prerender (vite.config.js), so crawlers and browsers see the same text.
// Supports **bold** and [label](href) — nothing else, on purpose.
const INLINE = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;

export function parseInline(text) {
  const tokens = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index > last) tokens.push({ type: 'text', value: text.slice(last, m.index) });
    if (m[1] !== undefined) tokens.push({ type: 'bold', value: m[1] });
    else tokens.push({ type: 'link', value: m[2], href: m[3] });
    last = m.index + m[0].length;
  }
  if (last < text.length) tokens.push({ type: 'text', value: text.slice(last) });
  return tokens;
}

export function stripInline(text) {
  return parseInline(text).map((t) => t.value).join('');
}
