import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, MapPin, Clock, ArrowRight } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ContactForm from '@/components/ContactForm.jsx';

function GridPattern({ opacity = 0.25 }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="contact-grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
        <radialGradient id="contact-fade" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="black" stopOpacity="1" />
          <stop offset="70%" stopColor="black" stopOpacity="0.3" />
          <stop offset="100%" stopColor="black" stopOpacity="0" />
        </radialGradient>
        <mask id="contact-mask">
          <rect width="100%" height="100%" fill="url(#contact-fade)" />
        </mask>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="url(#contact-grid)"
        mask="url(#contact-mask)"
        style={{ color: `hsl(var(--primary) / ${opacity})` }}
      />
    </svg>
  );
}

function StaggerHeadline({ lines, baseDelay = 0.55, gradientLast = true }) {
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
          className={`block ${gradientLast && i === lines.length - 1 ? 'text-gradient' : ''}`}
        >
          {line}
        </motion.span>
      ))}
    </>
  );
}

function ContactPage() {
  return (
    <>
      <Helmet>
        <title>Contact Fluxo — Get in touch</title>
        <meta name="description" content="Contact Fluxo to discuss your operational software needs. Based in Singapore, serving businesses across Southeast Asia." />
        <link rel="canonical" href="https://fluxo.com.sg/contact" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contact Fluxo',
          url: 'https://fluxo.com.sg/contact',
          mainEntity: {
            '@type': 'Organization',
            name: 'Fluxo',
            email: 'business@fluxo.com.sg',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Ark@KB, 68 Kaki Bukit Ave 6, #04-19',
              addressLocality: 'Singapore',
              postalCode: '417896',
              addressCountry: 'SG',
            },
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'Sales',
              email: 'business@fluxo.com.sg',
              areaServed: 'SG',
              availableLanguage: ['English'],
            },
          },
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
              <div className="max-w-3xl mx-auto text-center">
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
                  Let's talk
                </motion.div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-[-0.03em] leading-[1.05] md:leading-[1.02] mb-6 sm:mb-8">
                  <StaggerHeadline lines={['Tell us about', 'your', 'operation.']} />
                </h1>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                >
                  Send us a message, share what you're building, or ask anything. We respond within 24 hours on business days.
                </motion.p>
              </div>
            </div>
          </section>

          {/* CONTACT DETAILS + FORM */}
          <section className="py-20 lg:py-28 border-t border-border/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
                {/* Contact info (left, 2 cols) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="lg:col-span-2 flex flex-col gap-4"
                >
                  <div className="mb-2">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">How to reach us</p>
                    <h2 className="text-2xl font-bold text-foreground tracking-tight">Contact information</h2>
                  </div>

                  {[
                    { Icon: Mail, label: 'Email', value: 'business@fluxo.com.sg', href: 'mailto:business@fluxo.com.sg' },
                    { Icon: MapPin, label: 'Office', value: 'Fluxo Pte. Ltd.\nArk@KB, 68 Kaki Bukit Ave 6, #04-19\nSingapore 417896' },
                    { Icon: Clock, label: 'Response time', value: 'Within 24 hours on business days' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                        <item.Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-0.5">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-sm font-medium text-foreground hover:text-primary transition-colors break-all">
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-foreground whitespace-pre-line">{item.value}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Contact form (right, 3 cols) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="lg:col-span-3"
                >
                  <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                    <div className="mb-6">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Send a message</p>
                      <h2 className="text-2xl font-bold text-foreground tracking-tight">We'll get back to you shortly.</h2>
                    </div>
                    <ContactForm />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* WHAT HAPPENS NEXT */}
          <section className="py-24 lg:py-32 border-t border-border/50 bg-muted/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto mb-16"
              >
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">The process</p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-[1.15]">
                  What happens after <span className="text-gradient">you send it.</span>
                </h2>
              </motion.div>

              <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {[
                  { num: '01', title: 'We read it', body: 'Every inquiry is read carefully to understand your operation and your needs.' },
                  { num: '02', title: 'Initial reply', body: 'You hear back within 24 business hours with next steps tailored to your situation.' },
                  { num: '03', title: 'Discovery call', body: 'We scope the work together on a 30-minute call — no pitch, no pressure.' },
                ].map((step, i) => (
                  <motion.div
                    key={step.num}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className="relative p-6 lg:p-7 rounded-2xl border border-border bg-card hover:border-primary/40 transition-colors"
                  >
                    <p className="text-[10px] font-mono tracking-wider text-muted-foreground mb-4">{step.num}</p>
                    <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="max-w-5xl mx-auto mt-12 flex items-center justify-center gap-2 text-sm text-muted-foreground"
              >
                <span>Prefer email?</span>
                <a
                  href="mailto:business@fluxo.com.sg"
                  className="inline-flex items-center gap-1 font-medium text-foreground hover:text-primary transition-colors"
                >
                  business@fluxo.com.sg
                  <ArrowRight className="w-3.5 h-3.5" />
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

export default ContactPage;
