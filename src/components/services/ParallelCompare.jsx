import React from 'react';
import { motion } from 'framer-motion';
import {
  Layers, Wrench, Check, Sparkles, ArrowRight, Clock,
  Search, Hammer, Rocket, Flag, Anchor, Ship, Compass,
} from 'lucide-react';

/**
 * ParallelCompare
 * Full-page Studio vs Platform comparison in two parallel vertical columns.
 * Every row compares the same concept (header, elevator, how it works,
 * what you get, commitment, best for, CTA). On mobile, columns stack —
 * all of Platform, then all of Studio.
 */

const PLATFORM = {
  key: 'platform',
  label: 'Fluxo Platform',
  tagline: 'Proven SaaS, ready to deploy.',
  Icon: Layers,
  accent: 'from-[hsl(var(--fluxo-cyan))] to-sky-400',
  bgTint: 'bg-gradient-to-br from-[hsl(var(--fluxo-cyan))]/[0.04] to-transparent',
  status: { label: 'Launching 2027', cls: 'bg-secondary/15 text-foreground border-secondary/30' },
  elevator:
    'Multi-tenant SaaS distilled from the custom systems we\'ve shipped. Standard patterns, industry modules, self-service deploy.',
  steps: [
    { Icon: Anchor, when: 'Q4 2026', title: 'Dive alpha', detail: 'Closed partners validate the core' },
    { Icon: Ship, when: 'Q1 2027', title: 'Marine beta', detail: 'Studio alumni + waitlist access' },
    { Icon: Rocket, when: 'Q2 2027', title: 'Public launch', detail: 'Open signup, 7-day free trial' },
    { Icon: Compass, when: 'Q3 2027+', title: 'Expansion', detail: 'New verticals by demand' },
  ],
  features: [
    'Industry-specific templates (Dive, Marine)',
    'Multi-tenant with role-based access',
    'Proven modules shipped in Studio builds',
    'Self-service deploy in hours',
    'Standard integrations (accounting, class)',
    'Community support + shared roadmap',
  ],
  commitment: [
    { label: 'Pricing', value: 'Monthly subscription' },
    { label: 'Timeline', value: 'Hours to onboard' },
    { label: 'Commitment', value: 'Month-to-month' },
    { label: 'Infrastructure', value: 'Shared, multi-tenant' },
  ],
  bestFor: [
    'You want to get operational fast, with proven patterns',
    'Your workflow is mostly standard for your industry',
    'You prefer predictable monthly cost and flexibility',
  ],
  cta: { href: '/contact', label: 'Join the waitlist', primary: false },
};

const STUDIO = {
  key: 'studio',
  label: 'Fluxo Studio',
  tagline: 'Custom-built to your operation.',
  Icon: Wrench,
  accent: 'from-primary to-[hsl(var(--fluxo-cyan))]',
  bgTint: 'bg-gradient-to-br from-primary/[0.04] to-transparent',
  status: { label: 'Available now', cls: 'bg-primary/10 text-primary border-primary/20' },
  elevator:
    'Custom software, mapped to your specific workflow. Dedicated infrastructure, full data ownership, ongoing team access.',
  steps: [
    { Icon: Search, when: 'Week 1–2', title: 'Discovery', detail: 'Map workflows, scope, fix price' },
    { Icon: Hammer, when: 'Week 3–4', title: 'Core build', detail: 'Dashboards, data, staging live' },
    { Icon: Rocket, when: 'Week 5–6', title: 'Iterate', detail: 'Real-data trials, UX refinement' },
    { Icon: Flag, when: 'Week 7–8+', title: 'Launch & support', detail: 'Go live, train, ongoing partnership' },
  ],
  features: [
    'Custom-built for your specific operation',
    'Dedicated deployment and infrastructure',
    'Full data ownership and control',
    'Direct access to the development team',
    'Iterative build from your feedback',
    'Ongoing maintenance and support',
  ],
  commitment: [
    { label: 'Pricing', value: 'Setup fee + monthly subscription' },
    { label: 'Timeline', value: '4–8 weeks to go live' },
    { label: 'Commitment', value: '24-month support minimum' },
    { label: 'Infrastructure', value: 'Dedicated per client' },
  ],
  bestFor: [
    'Your workflows can\'t be modelled by off-the-shelf tools',
    'You want full control over features, data, roadmap',
    'Your operation is the competitive advantage',
  ],
  cta: { href: '/contact', label: 'Discuss your project', primary: true },
};

function RowLabel({ children }) {
  return (
    <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">
      {children}
    </p>
  );
}

function Column({ plan, side }) {
  const { Icon } = plan;
  return (
    <div className={`flex flex-col ${plan.bgTint}`}>
      {/* HEADER */}
      <div className="p-6 lg:p-8 border-b border-border">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.accent} flex items-center justify-center text-white flex-shrink-0`}
          >
            <Icon className="w-5 h-5" strokeWidth={2} />
          </div>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider border ${plan.status.cls}`}
          >
            {plan.key === 'platform' && <Sparkles className="w-3 h-3" />}
            {plan.status.label}
          </span>
        </div>
        <h3 className="text-2xl font-bold text-foreground">{plan.label}</h3>
        <p className="text-sm text-muted-foreground mt-1">{plan.tagline}</p>
      </div>

      {/* ELEVATOR */}
      <div className="p-6 lg:p-8 border-b border-border">
        <RowLabel>What it is</RowLabel>
        <p className="text-base text-foreground leading-relaxed">{plan.elevator}</p>
      </div>

      {/* HOW IT WORKS */}
      <div className="p-6 lg:p-8 border-b border-border">
        <RowLabel>How it works</RowLabel>
        <div className="space-y-3">
          {plan.steps.map((step, i) => {
            const StepIcon = step.Icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: side === 'left' ? -10 : 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="flex items-start gap-3"
              >
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${plan.accent} flex items-center justify-center text-white flex-shrink-0`}
                >
                  <StepIcon className="w-4 h-4" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground">{step.title}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">{step.when}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.detail}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* WHAT YOU GET */}
      <div className="p-6 lg:p-8 border-b border-border">
        <RowLabel>What you get</RowLabel>
        <ul className="space-y-2">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-foreground">
              <Check className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" strokeWidth={2.5} />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* COMMITMENT */}
      <div className="p-6 lg:p-8 border-b border-border">
        <RowLabel>Commitment</RowLabel>
        <div className="divide-y divide-border/60">
          {plan.commitment.map((c) => (
            <div key={c.label} className="flex justify-between items-baseline py-2 first:pt-0 last:pb-0 gap-3">
              <span className="text-[11px] font-medium text-muted-foreground flex-shrink-0">{c.label}</span>
              <span className="text-xs font-medium text-foreground text-right">{c.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* BEST FOR */}
      <div className="p-6 lg:p-8 border-b border-border">
        <RowLabel>Best fit if…</RowLabel>
        <ul className="space-y-2">
          {plan.bestFor.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-foreground">
              <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${plan.accent} flex-shrink-0 mt-1.5`} />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="p-6 lg:p-8 mt-auto">
        <a
          href={plan.cta.href}
          className={`inline-flex items-center justify-center gap-1.5 w-full h-11 px-4 rounded-full text-sm font-medium transition-colors ${
            plan.cta.primary
              ? 'bg-foreground text-background hover:bg-foreground/90'
              : 'bg-background text-foreground border border-border hover:bg-muted'
          }`}
        >
          {plan.cta.label} <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

export default function ParallelCompare() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      {/* Mini-header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-0.5">
            Side by side
          </p>
          <div className="text-base font-bold text-foreground">
            Compare Platform and Studio, row by row
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span className="font-mono">Updated continuously</span>
        </div>
      </div>

      {/* Parallel columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
        <Column plan={PLATFORM} side="left" />
        <Column plan={STUDIO} side="right" />
      </div>
    </div>
  );
}
