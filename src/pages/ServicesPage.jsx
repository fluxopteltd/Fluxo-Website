import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import StudioRoadmap from '@/components/services/StudioRoadmap.jsx';
import VelocityCompare from '@/components/services/VelocityCompare.jsx';
import PlatformRoadmap from '@/components/services/PlatformRoadmap.jsx';
import PlatformOrigin from '@/components/services/PlatformOrigin.jsx';
import WaitlistPerks from '@/components/services/WaitlistPerks.jsx';
import ParallelCompare from '@/components/services/ParallelCompare.jsx';

function GridPattern({ opacity = 0.25 }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="svc-grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
        <radialGradient id="svc-fade" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="black" stopOpacity="1" />
          <stop offset="70%" stopColor="black" stopOpacity="0.3" />
          <stop offset="100%" stopColor="black" stopOpacity="0" />
        </radialGradient>
        <mask id="svc-mask">
          <rect width="100%" height="100%" fill="url(#svc-fade)" />
        </mask>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="url(#svc-grid)"
        mask="url(#svc-mask)"
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

function ServicesPage() {
  return (
    <>
      <Helmet>
        <title>Services — Fluxo Studio and Platform</title>
        <meta
          name="description"
          content="Custom operational software via Fluxo Studio, or join the waitlist for Fluxo Platform launching in 2027."
        />
        <link rel="canonical" href="https://fluxo.com.sg/services" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Service',
              '@id': 'https://fluxo.com.sg/services#studio',
              name: 'Fluxo Studio',
              serviceType: 'Custom software development',
              provider: { '@type': 'Organization', name: 'Fluxo', url: 'https://fluxo.com.sg' },
              areaServed: { '@type': 'Country', name: 'Singapore' },
              description: 'Custom operational software built end-to-end for SMEs — from process discovery through delivery and ongoing support.',
              url: 'https://fluxo.com.sg/services',
            },
            {
              '@type': 'Service',
              '@id': 'https://fluxo.com.sg/services#platform',
              name: 'Fluxo Platform',
              serviceType: 'Business management SaaS',
              provider: { '@type': 'Organization', name: 'Fluxo', url: 'https://fluxo.com.sg' },
              areaServed: { '@type': 'Country', name: 'Singapore' },
              description: 'Template-based operational SaaS for SMEs — opinionated, ready-to-deploy modules covering common business workflows. Launching 2027.',
              url: 'https://fluxo.com.sg/services',
            },
          ],
        })}</script>
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
                  How we work with you
                </motion.div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold text-foreground tracking-[-0.03em] leading-[1.05] md:leading-[1.02] mb-6 sm:mb-8">
                  <StaggerHeadline
                    lines={['Two ways to get', 'operational', 'clarity.']}
                    gradientIndex={2}
                  />
                </h1>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                >
                  <span className="text-foreground font-medium">Fluxo Studio</span> for custom systems shaped around your operation. <span className="text-foreground font-medium">Fluxo Platform</span> for proven SaaS you can deploy fast.
                </motion.p>
              </div>
            </div>
          </section>

          {/* PARALLEL COMPARE — Studio and Platform side by side */}
          <section id="compare" className="py-24 lg:py-28 relative border-t border-border/50 scroll-mt-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto mb-12 text-center"
              >
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">Your decision, made simple</p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-[1.15]">
                  Two paths, <span className="text-gradient">compared row by row.</span>
                </h2>
                <p className="text-base md:text-lg text-muted-foreground mt-4">
                  Same operation, two delivery models. Scroll down either column — same questions answered for both.
                </p>
              </motion.div>

              <div className="max-w-6xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ParallelCompare />
                </motion.div>
              </div>
            </div>
          </section>

          {/* DEEP DIVE: STUDIO */}
          <section id="studio" className="py-24 lg:py-32 relative border-t border-border/50 scroll-mt-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto mb-12"
              >
                <div className="flex items-center gap-3 mb-3">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Fluxo Studio · deeper look</p>
                  <span className="inline-flex px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-mono uppercase tracking-wider border border-primary/20">
                    Available now
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-[1.1]">
                  Custom-built, in weeks not <span className="text-gradient">months.</span>
                </h2>
                <p className="mt-4 text-base lg:text-lg text-muted-foreground leading-relaxed">
                  How Studio engagements compare — and what week-by-week delivery actually looks like.
                </p>
              </motion.div>

              <div className="max-w-5xl mx-auto space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <VelocityCompare />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <StudioRoadmap />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex justify-center"
                >
                  <Button size="lg" className="h-12 px-6 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 rounded-full" asChild>
                    <a href="/contact">Discuss your project <ArrowRight className="ml-1.5 h-4 w-4" /></a>
                  </Button>
                </motion.div>
              </div>
            </div>
          </section>

          {/* DEEP DIVE: PLATFORM */}
          <section id="platform" className="py-24 lg:py-32 relative border-t border-border/50 bg-muted/20 scroll-mt-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto mb-12"
              >
                <div className="flex items-center gap-3 mb-3">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Fluxo Platform · deeper look</p>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/15 text-secondary-foreground text-[10px] font-mono uppercase tracking-wider border border-secondary/30">
                    <Sparkles className="w-3 h-3" />
                    Launching 2027
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-[1.1]">
                  Built from real <span className="text-gradient">operations.</span>
                </h2>
                <p className="mt-4 text-base lg:text-lg text-muted-foreground leading-relaxed">
                  The rollout plan, the modules we're shipping, and what waitlist members unlock.
                </p>
              </motion.div>

              <div className="max-w-5xl mx-auto space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <PlatformRoadmap />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <PlatformOrigin />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                  <WaitlistPerks />
                </motion.div>
              </div>
            </div>
          </section>

          {/* CLOSING CTA */}
          <section className="py-28 lg:py-36 relative border-t border-border/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/40" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-primary/15 to-transparent blur-3xl rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-3xl mx-auto text-center"
              >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 text-foreground tracking-tight leading-[1.05]">
                  Ready when <br />
                  <span className="text-gradient">you are.</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
                  Discovery calls are free. The first one usually tells us — and you — whether we're the right fit.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <Button size="lg" className="h-12 px-6 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 rounded-full" asChild>
                    <a href="/contact">Book a discovery call <ArrowRight className="ml-1.5 h-4 w-4" /></a>
                  </Button>
                  <Button size="lg" variant="outline" className="h-12 px-6 text-sm font-medium rounded-full" asChild>
                    <a href="mailto:business@fluxo.com.sg">business@fluxo.com.sg</a>
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default ServicesPage;
