import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Hammer, Eye, Layers, Rocket, ArrowRight, Anchor, Wrench, UtensilsCrossed, FileCheck,
} from 'lucide-react';

/**
 * IndustryFlywheel
 * Visual explaining how Fluxo's industry-specific platforms emerge.
 * Four-step journey: custom build → learn → extract → platform.
 * Plus a pipeline showing where each Fluxo industry sits in the cycle.
 */

const PHASES = [
  {
    key: 'build',
    num: '01',
    Icon: Hammer,
    title: 'Build custom',
    sub: 'Studio engagement',
    body: 'We build a tailored system for one operator. Every field, workflow, and edge case maps to how they actually run.',
    color: 'from-slate-500 to-slate-600',
    dot: 'bg-slate-500',
  },
  {
    key: 'learn',
    num: '02',
    Icon: Eye,
    title: 'Learn the industry',
    sub: 'Deep immersion',
    body: 'Running the system daily reveals what matters. Compliance rules, sector quirks, unspoken norms — things you only learn by being in the work.',
    color: 'from-blue-500 to-blue-600',
    dot: 'bg-blue-500',
  },
  {
    key: 'extract',
    num: '03',
    Icon: Layers,
    title: 'Extract the patterns',
    sub: '80% common · 20% unique',
    body: 'After two or three builds in the same industry, patterns repeat. We extract the common 80% into a platform template.',
    color: 'from-violet-500 to-violet-600',
    dot: 'bg-violet-500',
  },
  {
    key: 'platform',
    num: '04',
    Icon: Rocket,
    title: 'Launch the platform',
    sub: 'SaaS for the industry',
    body: 'The platform ships with proven patterns baked in. New operators deploy in hours with the compliance, workflows, and quirks already handled.',
    color: 'from-primary to-[hsl(var(--fluxo-cyan))]',
    dot: 'bg-primary',
  },
];

const PIPELINE = [
  {
    industry: 'Marine',
    Icon: Anchor,
    studio: { name: 'Dive operations system', status: 'live' },
    platform: { name: 'Naming in progress', status: 'building' },
  },
  {
    industry: 'Automotive',
    Icon: Wrench,
    studio: { name: 'Workshop management system', status: 'building' },
    platform: { name: 'To be named', status: 'pending' },
  },
  {
    industry: 'F&B',
    Icon: UtensilsCrossed,
    studio: { name: 'F&B operations system', status: 'building' },
    platform: { name: 'To be named', status: 'pending' },
  },
  {
    industry: 'Insurance',
    Icon: FileCheck,
    studio: { name: 'Claims processing system', status: 'prototype' },
    platform: { name: 'To be named', status: 'pending' },
  },
];

const STATUS_STYLES = {
  live: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-300',
  building: 'bg-primary/15 text-primary border-primary/30',
  prototype: 'bg-amber-500/15 text-amber-700 border-amber-500/30 dark:text-amber-300',
  pending: 'bg-muted text-muted-foreground border-border',
};

const AUTO_MS = 3200;

export default function IndustryFlywheel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => {
      setActive((i) => (i + 1) % PHASES.length);
    }, AUTO_MS);
    return () => clearTimeout(id);
  }, [active, paused]);

  const phase = PHASES[active];

  return (
    <div className="space-y-8" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {/* Four-step journey */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-0.5">
              The cycle
            </p>
            <div className="text-base font-bold text-foreground">How industry software emerges</div>
          </div>
          <p className="text-[10px] font-mono text-muted-foreground">
            Auto · hover to pause
          </p>
        </div>

        {/* Phase track */}
        <div className="px-3 sm:px-5 pt-5 pb-4 border-b border-border overflow-x-auto">
          <div className="flex items-stretch gap-2 min-w-[560px]">
            {PHASES.map((p, i) => {
              const isActive = i === active;
              const isPast = i < active;
              return (
                <React.Fragment key={p.key}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    className="flex-1 text-left group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                          isActive || isPast
                            ? `bg-gradient-to-br ${p.color} text-white shadow-sm`
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <p.Icon className="w-4 h-4" strokeWidth={2} />
                      </div>
                      <div>
                        <div className="text-[9px] font-mono text-muted-foreground">{p.num}</div>
                        <div
                          className={`text-[11px] font-semibold ${
                            isActive || isPast ? 'text-foreground' : 'text-muted-foreground'
                          }`}
                        >
                          {p.title}
                        </div>
                      </div>
                    </div>
                    <div className={`h-0.5 rounded-full ${isActive || isPast ? `bg-gradient-to-r ${p.color}` : 'bg-muted'}`} />
                  </button>
                  {i < PHASES.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/60 mt-2 flex-shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Active phase detail */}
        <div className="p-5 lg:p-7 min-h-[160px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={phase.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-start gap-4"
            >
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center text-white flex-shrink-0`}
              >
                <phase.Icon className="w-5 h-5" strokeWidth={2} />
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    STEP {phase.num}
                  </span>
                  <span className="text-[10px] text-muted-foreground">·</span>
                  <span className="text-[10px] text-muted-foreground">{phase.sub}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1.5">{phase.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{phase.body}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Pipeline: where each industry sits */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-border">
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-0.5">
            Where we are right now
          </p>
          <div className="text-base font-bold text-foreground">Fluxo's industry pipeline</div>
        </div>

        <div className="divide-y divide-border/60">
          {PIPELINE.map((row, i) => {
            const Icon = row.Icon;
            return (
              <motion.div
                key={row.industry}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="grid grid-cols-[auto_1fr] md:grid-cols-[140px_1fr_auto_1fr] items-center gap-3 px-5 py-4"
              >
                {/* Industry name */}
                <div className="flex items-center gap-2 md:col-span-1 col-span-2">
                  <div className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-foreground/70" strokeWidth={2} />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{row.industry}</span>
                </div>

                {/* Studio */}
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] font-mono text-muted-foreground flex-shrink-0">Studio:</span>
                  <span className="text-sm text-foreground truncate">{row.studio.name}</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border flex-shrink-0 ${STATUS_STYLES[row.studio.status]}`}>
                    {row.studio.status}
                  </span>
                </div>

                {/* Arrow */}
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/60 hidden md:block" />

                {/* Platform */}
                <div className="flex items-center gap-2 min-w-0 md:col-span-1 col-span-2">
                  <span className="text-[10px] font-mono text-muted-foreground flex-shrink-0">Platform:</span>
                  <span className="text-sm text-foreground truncate">{row.platform.name}</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border flex-shrink-0 ${STATUS_STYLES[row.platform.status]}`}>
                    {row.platform.status}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="px-5 py-3 border-t border-border bg-muted/10 text-[11px] text-muted-foreground">
          One custom build is a product. Three custom builds become a platform. That's the flywheel.
        </div>
      </div>
    </div>
  );
}
