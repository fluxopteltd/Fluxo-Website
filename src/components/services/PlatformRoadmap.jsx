import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Anchor, Ship, Rocket, Compass, CheckCircle2, Clock, ChevronRight,
} from 'lucide-react';

/**
 * PlatformRoadmap
 * Vertical rollout timeline for Fluxo Platform. Parallels StudioRoadmap
 * stylistically but tells a different story: "here's the sequence of
 * verticals we're launching and when."
 */

const PHASES = [
  {
    key: 'dive-alpha',
    label: 'Dive Services · Alpha',
    when: 'Q4 2026',
    Icon: Anchor,
    accent: 'from-slate-400 to-slate-500',
    dot: 'bg-slate-500',
    status: 'Closed',
    activities: [
      'Onboard early partner companies from Studio relationships',
      'Validate multi-tenant architecture with real shared data',
      'Harden the core: PMS, compliance, scheduling, reports',
      'Tight feedback loop — weekly calls with partners',
    ],
    deliverable: 'Dive template proven on live operations',
  },
  {
    key: 'marine-beta',
    label: 'Marine Services · Beta',
    when: 'Q1 2027',
    Icon: Ship,
    accent: 'from-blue-500 to-blue-600',
    dot: 'bg-blue-500',
    status: 'Studio alumni + waitlist',
    activities: [
      'Extend platform to ship services / marine ops verticals',
      'Open beta to existing Studio customers + waitlist',
      'Refine role-based access for multi-entity operators',
      'Build out integrations (accounting, class societies, etc.)',
    ],
    deliverable: 'Second industry template live in production',
  },
  {
    key: 'public-launch',
    label: 'Public Launch',
    when: 'Q2 2027',
    Icon: Rocket,
    accent: 'from-primary to-[hsl(var(--fluxo-cyan))]',
    dot: 'bg-primary',
    status: 'Open signup',
    activities: [
      'Self-service onboarding with 7-day free trial',
      'Dive + Marine templates available to all',
      'Public pricing, SLA commitments, uptime dashboard',
      'Founding-customer pricing locked for Year 1 waitlist members',
    ],
    deliverable: 'Fluxo Platform generally available',
  },
  {
    key: 'expand',
    label: 'Vertical Expansion',
    when: 'Q3 2027 →',
    Icon: Compass,
    accent: 'from-violet-500 to-violet-600',
    dot: 'bg-violet-500',
    status: 'By demand',
    activities: [
      'New verticals selected from Studio pipeline (construction, F&B ops, field services)',
      'Platform modules contributed back from Studio builds',
      'API + integration marketplace for partner ecosystem',
      'Regional expansion beyond Singapore',
    ],
    deliverable: 'Industry-specific SaaS, built from real operations',
  },
];

const AUTO_MS = 4500;

export default function PlatformRoadmap() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (paused) return;
    const startT = Date.now();
    const tick = setInterval(() => {
      const p = Math.min(1, (Date.now() - startT) / AUTO_MS);
      setProgress(p);
    }, 60);
    const next = setTimeout(() => {
      setActive((i) => (i + 1) % PHASES.length);
      setProgress(0);
    }, AUTO_MS);
    return () => {
      clearInterval(tick);
      clearTimeout(next);
    };
  }, [active, paused]);

  const phase = PHASES[active];

  return (
    <div
      className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-0.5">
            The rollout plan
          </p>
          <div className="text-base font-bold text-foreground">Platform launches, vertical by vertical</div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span className="font-mono">Auto · hover to pause</span>
        </div>
      </div>

      {/* Phase track */}
      <div className="px-3 sm:px-5 pt-5 pb-4 border-b border-border overflow-x-auto">
        <div className="flex items-stretch gap-0 min-w-[560px]">
          {PHASES.map((p, i) => {
            const isActive = i === active;
            const isPast = i < active;
            const pct = isActive ? progress * 100 : isPast ? 100 : 0;
            return (
              <React.Fragment key={p.key}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  className="flex-1 text-left group"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                        isActive || isPast
                          ? `bg-gradient-to-br ${p.accent} text-white shadow-sm`
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {isPast ? (
                        <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                      ) : (
                        <span className="font-mono text-[10px] font-semibold">{i + 1}</span>
                      )}
                    </div>
                    <div>
                      <div
                        className={`text-[11px] font-semibold ${
                          isActive
                            ? 'text-foreground'
                            : isPast
                              ? 'text-foreground/70'
                              : 'text-muted-foreground'
                        }`}
                      >
                        {p.label}
                      </div>
                      <div className="text-[9px] font-mono text-muted-foreground">{p.when}</div>
                    </div>
                  </div>
                  {/* Progress line */}
                  <div className="h-1 bg-muted rounded-full overflow-hidden mx-1">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${p.accent}`}
                      style={{ width: `${pct}%` }}
                      transition={{ type: 'tween', duration: 0.1 }}
                    />
                  </div>
                </button>
                {i < PHASES.length - 1 && <div className="w-2 flex-shrink-0" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Active phase detail */}
      <div className="p-5 lg:p-7 min-h-[260px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-start gap-4 mb-5">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${phase.accent} flex items-center justify-center text-white flex-shrink-0`}
              >
                <phase.Icon className="w-5 h-5" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    {phase.when}
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-muted/60 text-foreground/70 border border-border">
                    {phase.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">{phase.label}</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-6">
              <div>
                <p className="text-[10px] font-mono tracking-wider text-muted-foreground mb-3">
                  WHAT'S HAPPENING
                </p>
                <ul className="space-y-2.5">
                  {phase.activities.map((a, i) => (
                    <motion.li
                      key={a}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{a}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-muted/40 border border-border">
                <p className="text-[10px] font-mono tracking-wider text-muted-foreground mb-2">
                  MILESTONE
                </p>
                <div className="flex items-start gap-2">
                  <span className={`w-2 h-2 rounded-full ${phase.dot} mt-1.5 flex-shrink-0`} />
                  <span className="text-sm font-medium text-foreground leading-snug">
                    {phase.deliverable}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
