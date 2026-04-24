import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Hammer, Rocket, Users, CheckCircle2, Clock,
  ChevronRight, Flag,
} from 'lucide-react';

/**
 * StudioRoadmap
 * Interactive 8-week timeline showing what a Fluxo Studio engagement
 * looks like week-by-week. Auto-progresses through phases; user can
 * click any phase to jump.
 */

const PHASES = [
  {
    key: 'discovery',
    label: 'Discovery',
    weeks: 'Week 1–2',
    Icon: Search,
    accent: 'from-slate-400 to-slate-500',
    dot: 'bg-slate-500',
    activities: [
      'Map current workflows, friction points, shadow processes',
      'Interview team members actually doing the work',
      'Document operational requirements and edge cases',
      'Scope the build · fix a price · agree timeline',
    ],
    deliverable: 'Scope document + fixed quote',
  },
  {
    key: 'core-build',
    label: 'Core build',
    weeks: 'Week 3–4',
    Icon: Hammer,
    accent: 'from-blue-500 to-blue-600',
    dot: 'bg-blue-500',
    activities: [
      'Build primary dashboards and core workflows',
      'Wire up database + authentication',
      'Stand up staging environment for live preview',
      'Weekly demo calls with feedback loop',
    ],
    deliverable: 'Working system you can click through',
  },
  {
    key: 'iterate',
    label: 'Iterate & refine',
    weeks: 'Week 5–6',
    Icon: Users,
    accent: 'from-violet-500 to-violet-600',
    dot: 'bg-violet-500',
    activities: [
      'Your team trials on real data',
      'Refine UX based on actual usage',
      'Add reports, exports, integrations',
      'Tune for speed, mobile, edge cases',
    ],
    deliverable: 'Refined system matched to how you actually work',
  },
  {
    key: 'launch',
    label: 'Launch & train',
    weeks: 'Week 7–8',
    Icon: Rocket,
    accent: 'from-primary to-[hsl(var(--fluxo-cyan))]',
    dot: 'bg-primary',
    activities: [
      'Production deployment · DNS · backups',
      'Team training sessions (per role)',
      'Migration from old tools / spreadsheets',
      'Go-live support + on-call cover',
    ],
    deliverable: 'Live system, trained team, support in place',
  },
  {
    key: 'ongoing',
    label: 'Ongoing partnership',
    weeks: 'Beyond',
    Icon: Flag,
    accent: 'from-emerald-500 to-emerald-600',
    dot: 'bg-emerald-500',
    activities: [
      'Monthly roadmap reviews',
      'Feature requests + enhancements',
      'Monitoring + incident response',
      'Scale with your operation',
    ],
    deliverable: 'System that keeps up as you grow',
  },
];

const AUTO_MS = 4200;

export default function StudioRoadmap() {
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
            Your first 60 days
          </p>
          <div className="text-base font-bold text-foreground">Fluxo Studio engagement, week-by-week</div>
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
                      <div className="text-[9px] font-mono text-muted-foreground">{p.weeks}</div>
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
                {i < PHASES.length - 1 && (
                  <div className="w-2 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Active phase detail */}
      <div className="p-5 lg:p-7 min-h-[240px]">
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
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-0.5">
                  {phase.weeks}
                </div>
                <h3 className="text-lg font-bold text-foreground">{phase.label}</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-6">
              {/* Activities */}
              <div>
                <p className="text-[10px] font-mono tracking-wider text-muted-foreground mb-3">
                  WHAT HAPPENS
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

              {/* Deliverable */}
              <div className="p-4 rounded-lg bg-muted/40 border border-border">
                <p className="text-[10px] font-mono tracking-wider text-muted-foreground mb-2">
                  YOU GET
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
