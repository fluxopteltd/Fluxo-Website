import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, Plus } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import Inline from '@/components/blog/Inline.jsx';
import { getPost, formatPostDate, postJsonLd, SITE_URL } from '@/content/posts.js';

function Block({ block }) {
  if (block.p) {
    return <p className="text-[17px] leading-[1.8] text-foreground/85 mb-6"><Inline text={block.p} /></p>;
  }
  if (block.ul || block.ol) {
    const items = block.ul || block.ol;
    const Tag = block.ul ? 'ul' : 'ol';
    return (
      <Tag className={`mb-7 space-y-3 ${block.ol ? 'list-decimal' : 'list-none'} pl-0`}>
        {items.map((item, i) => (
          <li key={i} className={`text-[17px] leading-[1.75] text-foreground/85 ${block.ol ? 'ml-6 pl-1 marker:text-primary marker:font-mono marker:text-sm' : 'relative pl-6'}`}>
            {block.ul && <span className="absolute left-0 top-[0.7em] w-2 h-2 rounded-sm bg-gradient-to-br from-[#2A9EFF] to-[#7C28D8]" aria-hidden="true" />}
            <Inline text={item} />
          </li>
        ))}
      </Tag>
    );
  }
  if (block.callout) {
    return (
      <aside className="my-8 rounded-2xl border border-primary/25 bg-primary/[0.06] p-6">
        {block.label && <p className="text-[10px] font-mono uppercase tracking-wider text-primary mb-2">{block.label}</p>}
        <p className="text-[16px] leading-[1.75] text-foreground/90"><Inline text={block.callout} /></p>
      </aside>
    );
  }
  if (block.quote) {
    return (
      <blockquote className="my-8 border-l-2 border-primary pl-6">
        <p className="text-xl md:text-2xl font-medium leading-snug text-foreground tracking-tight"><Inline text={block.quote} /></p>
        {block.cite && <footer className="mt-3 text-sm text-muted-foreground">{block.cite}</footer>}
      </blockquote>
    );
  }
  if (block.table) {
    return (
      <div className="my-8 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-sm min-w-[560px]">
          {block.table.caption && <caption className="sr-only">{block.table.caption}</caption>}
          <thead className="bg-muted/60">
            <tr>
              {block.table.head.map((h, i) => (
                <th key={i} scope="col" className={`px-4 py-3 font-semibold text-foreground ${i === block.table.highlight ? 'text-primary' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.table.rows.map((row, r) => (
              <tr key={r} className="border-t border-border">
                {row.map((cell, c) => {
                  const Cell = c === 0 ? 'th' : 'td';
                  return (
                    <Cell key={c} scope={c === 0 ? 'row' : undefined} className={`px-4 py-3 align-top leading-relaxed ${c === 0 ? 'font-medium text-foreground' : 'text-foreground/80'} ${c === block.table.highlight ? 'bg-primary/[0.05]' : ''}`}>
                      <Inline text={cell} />
                    </Cell>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return null;
}

function Toc({ sections, activeId }) {
  return (
    <nav aria-label="On this page" className="sticky top-28">
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-4">On this page</p>
      <ol className="space-y-2.5 border-l border-border">
        {sections.map((s, i) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={`block -ml-px border-l pl-4 text-sm leading-snug transition-colors ${
                activeId === s.id ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="font-mono text-[10px] mr-2 opacity-60">{String(i + 1).padStart(2, '0')}</span>
              {s.toc || s.heading}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -70% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids.join('|')]);
  return active;
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-32 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">Article not found</h1>
        <Link to="/blog" className="text-primary underline underline-offset-4">Back to the blog</Link>
      </main>
      <Footer />
    </div>
  );
}

function BlogPostPage() {
  const { slug } = useParams();
  const post = getPost(slug);
  const activeId = useActiveSection(post ? post.sections.map((s) => s.id) : []);
  if (!post) return <NotFound />;

  const url = `${SITE_URL}/blog/${post.slug}`;

  return (
    <>
      <Helmet>
        <title>{post.seoTitle}</title>
        <meta name="description" content={post.description} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:url" content={url} />
        <script type="application/ld+json">{JSON.stringify(postJsonLd(post))}</script>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
        <Header />

        <main className="flex-1">
          <article>
            {/* HERO */}
            <header className="relative pt-16 lg:pt-24 pb-12 lg:pb-16 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[380px] bg-gradient-to-b from-primary/15 via-primary/5 to-transparent blur-3xl rounded-full pointer-events-none" />
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
                <div className="hidden lg:block" />
                <div className="max-w-3xl">
                  <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-10">
                    <ArrowLeft className="w-4 h-4" /> All articles
                  </Link>
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
                    <p className="text-[11px] font-mono uppercase tracking-wider text-primary mb-5">{post.category}</p>
                    <h1 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-bold text-foreground tracking-[-0.03em] leading-[1.06] mb-6 text-balance">
                      {post.title}
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">{post.dek}</p>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                      <span className="text-foreground font-medium">{post.author.name}, {post.author.role}</span>
                      <time dateTime={post.datePublished}>{formatPostDate(post.datePublished)}</time>
                      <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{post.readMinutes} min read</span>
                    </div>
                  </motion.div>
                </div>
                </div>
              </div>
            </header>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
              <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
                <div className="hidden lg:block">
                  <Toc sections={post.sections} activeId={activeId} />
                </div>

                <div className="max-w-3xl">
                  {/* TL;DR */}
                  <section aria-label="Summary" className="relative rounded-2xl border border-border bg-card p-6 md:p-8 mb-14 overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#2A9EFF] via-[#5358E2] to-[#7C28D8]" />
                    <p className="text-[10px] font-mono uppercase tracking-wider text-primary mb-4">The short answer</p>
                    <ul className="space-y-3">
                      {post.tldr.map((line, i) => (
                        <li key={i} className="flex gap-3 text-[16px] leading-relaxed text-foreground/90">
                          <span className="font-mono text-xs text-primary pt-1">{String(i + 1).padStart(2, '0')}</span>
                          <span><Inline text={line} /></span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {post.sections.map((s) => (
                    <section key={s.id} id={s.id} className="scroll-mt-28 mb-14">
                      <h2 className="text-2xl md:text-[2rem] font-bold text-foreground tracking-tight leading-tight mb-6">{s.heading}</h2>
                      {s.blocks.map((b, i) => <Block key={i} block={b} />)}
                    </section>
                  ))}

                  {/* FAQ — native <details> so it works without JS and stays crawlable */}
                  {post.faq?.length > 0 && (
                    <section id="faq" className="scroll-mt-28 mb-14">
                      <h2 className="text-2xl md:text-[2rem] font-bold text-foreground tracking-tight leading-tight mb-6">Frequently asked questions</h2>
                      <div className="divide-y divide-border border-y border-border">
                        {post.faq.map((f, i) => (
                          <details key={i} className="group py-5">
                            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[17px] font-semibold text-foreground">
                              {f.q}
                              <Plus className="w-4 h-4 mt-1.5 shrink-0 text-muted-foreground transition-transform group-open:rotate-45" />
                            </summary>
                            <p className="mt-3 text-[16px] leading-[1.75] text-foreground/80"><Inline text={f.a} /></p>
                          </details>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* CTA */}
                  <section className="relative rounded-3xl border border-border bg-card p-8 md:p-10 overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-[#2A9EFF]/25 to-[#7C28D8]/25 blur-3xl pointer-events-none" />
                    <p className="relative text-[10px] font-mono uppercase tracking-wider text-primary mb-3">{post.cta.eyebrow}</p>
                    <h2 className="relative text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-3">{post.cta.heading}</h2>
                    <p className="relative text-foreground/80 leading-relaxed mb-7 max-w-xl">{post.cta.body}</p>
                    <Link
                      to="/contact"
                      className="relative inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      {post.cta.button} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </section>
                </div>
              </div>
            </div>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default BlogPostPage;
