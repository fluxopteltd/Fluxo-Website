import React from 'react';
import { Link } from 'react-router-dom';
import { parseInline } from '@/content/inline.js';

function Inline({ text }) {
  return parseInline(text).map((t, i) => {
    if (t.type === 'bold') return <strong key={i} className="font-semibold text-foreground">{t.value}</strong>;
    if (t.type === 'link') {
      const cls = 'text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary';
      return t.href.startsWith('/')
        ? <Link key={i} to={t.href} className={cls}>{t.value}</Link>
        : <a key={i} href={t.href} className={cls} target="_blank" rel="noopener noreferrer">{t.value}</a>;
    }
    return <React.Fragment key={i}>{t.value}</React.Fragment>;
  });
}

export default Inline;
