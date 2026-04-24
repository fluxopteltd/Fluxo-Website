import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Wrench, Layers } from 'lucide-react';

/**
 * PlansCompare
 * Interactive Studio vs Platform feature matrix. Shows all rows side by
 * side on desktop, with a mobile-friendly tab toggle that animates
 * between the two columns.
 */

const FEATURES = [
  { key: 'custom', label: 'Custom-built to your workflow', studio: 'full', platform: 'partial' },
  { key: 'data', label: 'Full data ownership', studio: 'full', platform: 'full' },
  { key: 'speed', label: 'Time to deploy', studio: '4–8 weeks', platform: 'Hours' },
  { key: 'infra', label: 'Dedicated infrastructure', studio: 'full', platform: 'none' },
  { key: 'integration', label: 'Custom integrations', studio: 'full', platform: 'partial' },
  { key: 'support', label: 'Dedicated team access', studio: 'full', platform: 'none' },
  { key: 'price-shape', label: 'Pricing model', studio: 'Setup + monthly', platform: 'Subscription' },
  { key: 'commitment', label: 'Commitment', studio: '24-month minimum', platform: 'Month-to-month' },
  { key: 'avail', label: 'Available', studio: 'Now', platform: '2027' },
];

const PLANS = {
  studio: {
    key: 'studio',
    label: 'Fluxo Studio',
    sub: 'Custom-built for your operation',
    Icon: Wrench,
    status: 'Available now',
    statusTone: 'bg-primary/10 text-primary border-primary/20',
    accent: 'from-primary to-[hsl(var(--fluxo-cyan))]',
    cta: { href: '/contact', label: 'Discuss your project' },
    bestFor: [
      'You have specific workflows that off-the-shelf tools can\'t model',
      'You want full control over features, data, and roadmap',
      'Your operation is the competitive advantage — software should fit it',
    ],
  },
  platform: {
    key: 'platform',
    label: 'Fluxo Platform',
    sub: 'Proven SaaS, ready to deploy',
    Icon: Layers,
    status: 'Launching 2027',
    statusTone: 'bg-secondary/15 text-secondary-foreground border-secondary/30',
    accent: 'from-[hsl(var(--fluxo-cyan))] to-sky-400',
    cta: { href: '/contact', label: 'Join the waitlist' },
    bestFor: [
      'You need to get operational fast, with proven patterns',
      'Your workflow is mostly standard for your industry',
      'You want predictable monthly cost and month-to-month flexibility',
    ],
  },
};

function CellValue({ value }) {
  if (value === 'full') {
    return <Check className="w-4 h-4 text-emerald-500" strokeWidth={2.5} />;
  }
  if (value === 'partial') {
    return (
      <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400">Partial</span>
    );
  }
  if (value === 'none') {
    return <X className="w-4 h-4 text-muted-foreground/50" strokeWidth={2.5} />;
  }
  return <span className="text-xs font-medium text-foreground">{value}</span>;
}

function PlanHeader({ plan, active, onClick, tabMode }) {
  const Icon = plan.Icon;
  return (
    <button
      type={tabMode ? 'button' : 'button'}
      onClick={onClick}
      className={`relative text-left w-full p-4 lg:p-5 transition-colors ${
        tabMode
          ? active
            ? 'bg-card'
            : 'bg-muted/40 hover:bg-muted/60'
          : active
            ? 'bg-primary/5'
            : ''
      }`}
    >
      <div className="flex items-center gap-2.5 mb-2">
        <div
          className={`w-8 h-8 rounded-lg bg-gradient-to-br ${plan.accent} flex items-center justify-center text-white flex-shrink-0`}
        >
          <Icon className="w-4 h-4" strokeWidth={2} />
        </div>
        <div>
          <div className="text-sm font-bold text-foreground">{plan.label}</div>
          <div className="text-[10px] text-muted-foreground">{plan.sub}</div>
        </div>
      </div>
      <span
        className={`inline-flex px-1.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider border ${plan.statusTone}`}
      >
        {plan.status}
      </span>
      {tabMode && active && (
        <motion.div
          layoutId="plan-tab-underline"
          className="absolute left-0 right-0 bottom-0 h-0.5 bg-foreground"
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        />
      )}
    </button>
  );
}

export default function PlansCompare() {
  const [active, setActive] = useState('studio');
  const plan = PLANS[active];

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-0.5">
          Studio vs Platform
        </p>
        <div className="text-base font-bold text-foreground">
          Which Fluxo option fits your operation?
        </div>
      </div>

      {/* Desktop: side-by-side matrix */}
      <div className="hidden md:grid md:grid-cols-[minmax(0,1fr)_180px_180px] md:gap-0 border-b border-border">
        <div className="px-5 py-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground flex items-end">
          Feature
        </div>
        <PlanHeader plan={PLANS.studio} active={active === 'studio'} onClick={() => setActive('studio')} />
        <PlanHeader plan={PLANS.platform} active={active === 'platform'} onClick={() => setActive('platform')} />
      </div>

      {/* Mobile: tab toggle */}
      <div className="md:hidden grid grid-cols-2 border-b border-border">
        <PlanHeader
          plan={PLANS.studio}
          active={active === 'studio'}
          onClick={() => setActive('studio')}
          tabMode
        />
        <PlanHeader
          plan={PLANS.platform}
          active={active === 'platform'}
          onClick={() => setActive('platform')}
          tabMode
        />
      </div>

      {/* Feature rows */}
      <div className="divide-y divide-border/60">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.key}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04, duration: 0.4 }}
            className="md:grid md:grid-cols-[minmax(0,1fr)_180px_180px] items-center"
          >
            {/* Feature name */}
            <div className="px-5 py-3 text-sm text-foreground">{f.label}</div>

            {/* Desktop: both columns */}
            <div
              className={`hidden md:flex items-center justify-center px-4 py-3 ${
                active === 'studio' ? 'bg-primary/[0.03]' : ''
              }`}
            >
              <CellValue value={f.studio} />
            </div>
            <div
              className={`hidden md:flex items-center justify-center px-4 py-3 ${
                active === 'platform' ? 'bg-primary/[0.03]' : ''
              }`}
            >
              <CellValue value={f.platform} />
            </div>

            {/* Mobile: only the selected one */}
            <div className="md:hidden px-5 pb-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <CellValue value={f[active]} />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Best-for footer */}
      <div className="px-5 py-5 bg-muted/20 border-t border-border">
        <AnimatePresence mode="wait">
          <motion.div
            key={plan.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">
              {plan.label} is right if…
            </p>
            <ul className="space-y-2">
              {plan.bestFor.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <a
                href={plan.cta.href}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
              >
                {plan.cta.label} →
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
