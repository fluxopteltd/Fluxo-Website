import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Handshake, Puzzle, HeartHandshake, Plus } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import CoFounderCard from '@/components/CoFounderCard.jsx';
import IndustryFlywheel from '@/components/about/IndustryFlywheel.jsx';
import OriginTimeline from '@/components/about/OriginTimeline.jsx';

function GridPattern({ opacity = 0.25 }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="about-grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
        <radialGradient id="about-fade" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="black" stopOpacity="1" />
          <stop offset="70%" stopColor="black" stopOpacity="0.3" />
          <stop offset="100%" stopColor="black" stopOpacity="0" />
        </radialGradient>
        <mask id="about-mask">
          <rect width="100%" height="100%" fill="url(#about-fade)" />
        </mask>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="url(#about-grid)"
        mask="url(#about-mask)"
        style={{ color: `hsl(var(--primary) / ${opacity})` }}
      />
    </svg>
  );
}

function StaggerHeadline({ lines, baseDelay = 0.55, gradientIndex }) {
  return (
    <>
      {lines.map((line, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 28, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            delay: baseDelay + i * 0.28,
            duration: 1.3,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`block ${i === gradientIndex ? 'text-gradient' : ''}`}
        >
          {line}
        </motion.span>
      ))}
    </>
  );
}

function PrincipleCard({ principle, index }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-2xl border border-border bg-card hover:border-primary/40 transition-colors group overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left p-6 lg:p-7"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
            <principle.Icon className="w-4.5 h-4.5" strokeWidth={2} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-muted-foreground">{principle.fig}</span>
            <motion.span
              animate={{ rotate: expanded ? 45 : 0 }}
              transition={{ duration: 0.25 }}
              className={`flex items-center justify-center w-6 h-6 rounded-full border transition-colors ${
                expanded ? 'border-primary text-primary bg-primary/5' : 'border-border text-muted-foreground'
              }`}
            >
              <Plus className="w-3 h-3" strokeWidth={2.5} />
            </motion.span>
          </div>
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">{principle.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{principle.body}</p>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="example"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 lg:px-7 pb-6 lg:pb-7 pt-0">
              <div className="border-l-2 border-primary/40 pl-4 py-1">
                <p className="text-[10px] font-mono tracking-wider text-primary mb-2">IN PRACTICE</p>
                <p className="text-sm text-foreground leading-relaxed">{principle.example}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AboutPage() {
  const coFounders = [
    {
      name: 'Jay',
      role: 'Technical Lead',
      bio:
        "Jay leads Fluxo's product and technical delivery. He combines modern AI-assisted development with careful product judgment to deliver custom software faster and more affordably than traditional agencies — the approach that makes Fluxo's pricing possible.",
      initials: 'JY',
      colorClass: 'bg-primary text-primary-foreground',
      imageUrl: 'https://horizons-cdn.hostinger.com/8f55ef6f-5309-4b13-9798-cfdd2e348dec/7119735afb44a5f0f39f646fb7f4b4fe.png',
    },
    {
      name: 'Daniel',
      role: 'Commercial Lead',
      bio:
        "Daniel leads Fluxo's commercial relationships. He runs an operational business himself, which gives Fluxo a direct, unfiltered view of what SMEs actually need from software — and what they don't.",
      initials: 'DN',
      colorClass: 'bg-secondary text-secondary-foreground',
      imageUrl: 'https://horizons-cdn.hostinger.com/8f55ef6f-5309-4b13-9798-cfdd2e348dec/98264a6a87e6b7b3325faa1605886079.png',
    },
  ];

  const principles = [
    {
      fig: '01',
      Icon: Handshake,
      title: 'Operators, not observers',
      body: "One co-founder runs an operational business. Every decision is pressure-tested against that reality — not against what sounds good in a pitch deck.",
      example: "In a recent Studio build, we dropped a suggested feature the day our operator said 'my crew won't actually use that — they'd rather do it on paper.' Sounds obvious. Agencies without an operator in the room ship it anyway.",
    },
    {
      fig: '02',
      Icon: Zap,
      title: 'Weeks, not months',
      body: 'Modern development has changed the economics. What used to require agency teams and year-long timelines now ships in a fraction of the time — without skipping the rigour.',
      example: "Our first Studio client went from signing the scope to running the system in production in 42 days. Same scope quoted elsewhere at 9–12 months. The difference isn't skipping steps — it's not carrying the overhead of a traditional agency.",
    },
    {
      fig: '03',
      Icon: Puzzle,
      title: 'Fit over features',
      body: 'Your workflow is your competitive advantage. Software should fit around how your team actually works — not force them to adapt to a generic template.',
      example: "A marine operator had a specific 4-stage cert renewal process nobody else uses. Generic SaaS would have forced them to 'map it onto' a standard flow. We built their flow — because that flow is why their clients pick them.",
    },
    {
      fig: '04',
      Icon: HeartHandshake,
      title: 'We stay after launch',
      body: "Operational software is infrastructure. We partner long-term so the system evolves as your business does — not a one-shot delivery and goodbye.",
      example: "Every Studio engagement includes a monthly partnership retainer. Bug fixes, small features, scaling tweaks — all covered. When your operation changes (new compliance rule, new team, new service line), we evolve the system with you.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>About Fluxo — Software shaped by operational reality</title>
        <meta
          name="description"
          content="Fluxo builds custom operational software for SMEs. Meet the founders and learn what we believe about building software that fits real operations."
        />
        <link rel="canonical" href="https://fluxo.com.sg/about" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
        <Header />

        <main className="flex-1 overflow-hidden">
          {/* HERO */}
          <section className="relative pt-24 lg:pt-32 pb-16 lg:pb-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30" />
            <div className="absolute inset-0 text-primary/60"><GridPattern opacity={0.25} /></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-primary/15 via-primary/5 to-transparent blur-3xl rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border mb-8 text-xs font-mono tracking-wide text-muted-foreground shadow-sm"
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                  </span>
                  Our story
                </motion.div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold text-foreground tracking-[-0.03em] leading-[1.05] md:leading-[1.02] mb-6 sm:mb-8">
                  <StaggerHeadline
                    lines={['Software shaped by', 'operational', 'reality.']}
                    gradientIndex={2}
                  />
                </h1>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                >
                  Built by people who run operations. For people who run operations.
                </motion.p>
              </div>
            </div>
          </section>

          {/* ORIGIN STORY — milestone timeline */}
          <section className="py-24 lg:py-32 relative border-t border-border/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto mb-14"
              >
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">Our journey so far</p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-[1.15] mb-5">
                  The old rules no longer <span className="text-gradient">have to apply.</span>
                </h2>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  Fluxo exists because modern development has compressed what used to take agency teams a year into what a small, senior team can ship in weeks. Here's how we got from observation to operating across four industries.
                </p>
              </motion.div>

              <OriginTimeline />
            </div>
          </section>

          {/* INDUSTRY FLYWHEEL */}
          <section id="flywheel" className="py-24 lg:py-32 relative border-t border-border/50 bg-muted/20 scroll-mt-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto mb-16"
              >
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">The flywheel</p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-[1.15]">
                  One custom build is a product. <br className="hidden sm:inline" />
                  <span className="text-gradient">Three become a platform.</span>
                </h2>
                <p className="text-lg text-muted-foreground mt-4">
                  Our industry-specific platforms aren't built in a lab. They grow out of real operations — from custom Studio work with real operators, in real industries, against real constraints.
                </p>
              </motion.div>

              <div className="max-w-5xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <IndustryFlywheel />
                </motion.div>
              </div>
            </div>
          </section>

          {/* FOUNDERS */}
          <section className="py-24 lg:py-32 relative border-t border-border/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto mb-16"
              >
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">The founders</p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-[1.15]">
                  Technical delivery meets <br className="hidden sm:inline" />
                  <span className="text-gradient">operational reality.</span>
                </h2>
                <p className="text-lg text-muted-foreground mt-4">
                  One of us runs operations. The other ships software. Together, every product decision is pressure-tested against reality from both sides.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {coFounders.map((founder, index) => (
                  <motion.div
                    key={founder.name}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <CoFounderCard {...founder} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* WHAT WE BELIEVE */}
          <section className="py-24 lg:py-32 relative border-t border-border/50 bg-muted/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto mb-16"
              >
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">What we believe</p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-[1.15]">
                  <span className="text-foreground font-bold">Four principles.</span>{' '}
                  <span className="text-muted-foreground">They shape how we scope, build, price, and show up.</span>
                </h2>
              </motion.div>

              <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                {principles.map((p, i) => (
                  <PrincipleCard key={p.fig} principle={p} index={i} />
                ))}
              </div>
              <p className="text-center text-[11px] font-mono text-muted-foreground mt-6">
                click a card to see how it shows up in practice
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="py-24 lg:py-32 relative border-t border-border/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/30" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-primary/10 to-transparent blur-3xl rounded-full pointer-events-none" />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-2xl mx-auto text-center"
              >
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-[1.1] mb-6">
                  Think we could work <span className="text-gradient">together?</span>
                </h2>
                <p className="text-base md:text-lg text-muted-foreground mb-8">
                  Tell us about your operation. We'll tell you honestly whether Fluxo fits.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 h-12 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
                >
                  Get in touch →
                </a>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default AboutPage;
