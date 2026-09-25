import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { posts, formatPostDate, BLOG_INDEX_META, SITE_URL } from '@/content/posts.js';

function BlogIndexPage() {
  return (
    <>
      <Helmet>
        <title>{BLOG_INDEX_META.title}</title>
        <meta name="description" content={BLOG_INDEX_META.description} />
        <link rel="canonical" href={`${SITE_URL}/blog`} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
        <Header />

        <main className="flex-1">
          <section className="relative pt-20 lg:pt-28 pb-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[380px] bg-gradient-to-b from-primary/15 via-primary/5 to-transparent blur-3xl rounded-full pointer-events-none" />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="max-w-3xl mx-auto text-center">
                <p className="text-[11px] font-mono uppercase tracking-wider text-primary mb-5">The Fluxo blog</p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-[-0.03em] leading-[1.05] mb-6">
                  Notes on building software <span className="text-gradient">that fits.</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  What we have learned building operational systems for Singapore businesses, written plainly.
                </p>
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-28">
            <div className="max-w-3xl mx-auto space-y-6">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="group block rounded-2xl border border-border bg-card p-7 md:p-9 hover:border-primary/40 transition-colors"
                >
                  <p className="text-[10px] font-mono uppercase tracking-wider text-primary mb-3">{post.category}</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-tight mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-foreground/75 leading-relaxed mb-6">{post.dek}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-4">
                      <time dateTime={post.datePublished}>{formatPostDate(post.datePublished)}</time>
                      <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{post.readMinutes} min read</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-primary font-medium">
                      Read <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default BlogIndexPage;
