import React from 'react';
import { motion } from 'framer-motion';
import {
  Tag, Headphones, Zap, Gift, ArrowRight,
} from 'lucide-react';

/**
 * WaitlistPerks
 * Turns the "join waitlist" CTA from a form prompt into a real offer —
 * four concrete perks for founding customers who commit before launch.
 */

const PERKS = [
  {
    Icon: Tag,
    accent: 'text-primary',
    label: 'Founding pricing',
    detail: 'Year-1 rate locked for waitlist members, regardless of public launch pricing.',
  },
  {
    Icon: Zap,
    accent: 'text-violet-500',
    label: 'Early access',
    detail: 'First look at Alpha and Beta before anyone else — shape the product while it\'s being built.',
  },
  {
    Icon: Headphones,
    accent: 'text-emerald-500',
    label: 'Direct founder line',
    detail: 'Feature requests and support go straight to the team, not a ticket queue.',
  },
  {
    Icon: Gift,
    accent: 'text-amber-500',
    label: 'Free migration',
    detail: 'We help move your data off spreadsheets, Google Sheets, or existing tools at no extra cost.',
  },
];

export default function WaitlistPerks() {
  return (
    <div className="relative bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-[hsl(var(--fluxo-cyan))]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative px-5 py-4 border-b border-border">
        <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-0.5">
          Waitlist · founding 50
        </p>
        <div className="text-base font-bold text-foreground">
          Why join the waitlist?
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          First 50 companies on the waitlist unlock these — not "just a newsletter signup".
        </p>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
        {PERKS.map((p, i) => {
          const { Icon } = p;
          const isLastRow = i >= PERKS.length - 2;
          return (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`p-5 ${!isLastRow ? 'md:border-b md:border-border' : ''}`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 ${p.accent} flex-shrink-0 mt-0.5`} strokeWidth={2} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground mb-1">{p.label}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.detail}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="relative px-5 py-5 bg-muted/20 border-t border-border flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-foreground">
          <span className="font-semibold">Ship when we ship.</span>{' '}
          <span className="text-muted-foreground">No deposit, no commitment — just priority when launch day comes.</span>
        </p>
        <a
          href="/contact"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
        >
          Join the waitlist <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
