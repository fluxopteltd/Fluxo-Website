import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Quote, Anchor, Wrench, UtensilsCrossed, FileCheck,
  ChevronLeft, ChevronRight,
} from 'lucide-react';

/**
 * SocialProof
 * Auto-cycling testimonial carousel + aggregate metric strip.
 * All testimonials are anonymized to operator-role identifiers.
 */

const TESTIMONIALS = [
  {
    quote:
      "We went from five spreadsheets and a WhatsApp group to one dashboard the whole team actually trusts. Shipped in six weeks.",
    initials: 'OL',
    role: 'Operations lead',
    industry: 'Marine industry · Singapore',
    Icon: Anchor,
  },
  {
    quote:
      "Our bays used to sit empty because dispatch couldn't see who had capacity. Now nothing idles — and I can see every job from my phone.",
    initials: 'WM',
    role: 'Workshop manager',
    industry: 'Automotive · Singapore',
    Icon: Wrench,
  },
  {
    quote:
      "The floor manager used to call the kitchen twenty times a night. Now the board shows the ticket state and we argue about service, not status.",
    initials: 'FB',
    role: 'Restaurant owner',
    industry: 'F&B · Singapore',
    Icon: UtensilsCrossed,
  },
  {
    quote:
      "Claims used to sit in folders. Now they move through a pipeline I can point to — and SLA misses dropped by half in two months.",
    initials: 'CM',
    role: 'Claims manager',
    industry: 'Insurance · Singapore',
    Icon: FileCheck,
  },
];

const CYCLE_MS = 6500;

export default function SocialProof() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (paused) return;
    const start = Date.now();
    const tickId = setInterval(() => {
      setProgress(Math.min(1, (Date.now() - start) / CYCLE_MS));
    }, 60);
    const nextId = setTimeout(() => {
      setDirection(1);
      setIdx((i) => (i + 1) % TESTIMONIALS.length);
      setProgress(0);
    }, CYCLE_MS);
    return () => {
      clearInterval(tickId);
      clearTimeout(nextId);
    };
  }, [idx, paused]);

  const goPrev = () => {
    setDirection(-1);
    setPaused(true);
    setIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };
  const goNext = () => {
    setDirection(1);
    setPaused(true);
    setIdx((i) => (i + 1) % TESTIMONIALS.length);
  };
  const jumpTo = (i) => {
    setDirection(i > idx ? 1 : -1);
    setPaused(true);
    setIdx(i);
  };

  const active = TESTIMONIALS[idx];
  const slideVariants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Testimonial carousel */}
      <div
        className="relative bg-card border border-border rounded-2xl p-8 md:p-12 shadow-sm overflow-hidden mb-8 min-h-[240px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Corner gradients */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[hsl(var(--fluxo-cyan))]/8 rounded-full blur-3xl pointer-events-none" />

        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={active.role}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-start"
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-[hsl(var(--fluxo-cyan))] flex items-center justify-center">
                <Quote className="w-5 h-5 text-white" strokeWidth={2} fill="currentColor" />
              </div>
            </div>

            <div>
              <p className="text-xl md:text-2xl font-medium text-foreground leading-snug tracking-tight mb-5">
                "{active.quote}"
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-muted to-muted/60 border border-border flex items-center justify-center text-xs font-semibold text-foreground">
                  {active.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <active.Icon className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={2} />
                    {active.role}
                  </div>
                  <div className="text-xs text-muted-foreground">{active.industry}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel controls */}
        <div className="relative mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous testimonial"
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2">
            {TESTIMONIALS.map((_, i) => {
              const isActive = i === idx;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => jumpTo(i)}
                  aria-label={`Show testimonial ${i + 1}`}
                  className="relative h-2 flex items-center group"
                >
                  <span
                    className={`block rounded-full transition-all duration-500 ${
                      isActive
                        ? 'w-8 h-1 bg-muted'
                        : 'w-1.5 h-1.5 bg-muted-foreground/40 group-hover:bg-muted-foreground/70'
                    }`}
                  />
                  {isActive && !paused && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full transition-none"
                      style={{ width: `${progress * 32}px` }}
                    />
                  )}
                  {isActive && paused && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-8 bg-primary rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={goNext}
            aria-label="Next testimonial"
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
