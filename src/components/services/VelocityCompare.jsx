import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Check, AlertTriangle, Clock, Target } from 'lucide-react';

/**
 * VelocityCompare
 * Animated bar chart comparing three software-procurement options:
 * Enterprise Agency / Generic SaaS / Fluxo. Bars "fill" over a 5-second
 * animation that repeats, giving a sense of timeline race.
 */

const OPTIONS = [
  {
    key: 'agency',
    label: 'Enterprise agency',
    sublabel: 'Traditional custom build',
    timelineWeeks: 52,
    fit: 'Perfect fit',
    fitTone: 'good',
    fitIcon: Check,
    tone: 'border-slate-400 bg-slate-400/10 dark:border-slate-500 dark:bg-slate-500/10',
    barColor: 'from-slate-500 to-slate-600',
    caveat: 'If you can afford to wait a year',
  },
  {
    key: 'saas',
    label: 'Generic SaaS',
    sublabel: 'Off-the-shelf template',
    timelineWeeks: 1,
    fit: 'Generic fit',
    fitTone: 'warn',
    fitIcon: AlertTriangle,
    tone: 'border-amber-400 bg-amber-400/10 dark:border-amber-500 dark:bg-amber-500/10',
    barColor: 'from-amber-500 to-amber-600',
    caveat: 'Until you hit the first limitation',
  },
  {
    key: 'fluxo',
    label: 'Fluxo Studio',
    sublabel: 'Custom, modern delivery',
    timelineWeeks: 7,
    fit: 'Perfect fit',
    fitTone: 'good',
    fitIcon: Check,
    tone: 'border-primary bg-primary/10',
    barColor: 'from-primary to-[hsl(var(--fluxo-cyan))]',
    caveat: 'Weeks, not months. Built for your workflow.',
    highlight: true,
  },
];

const MAX_WEEKS = 52;
const RACE_DURATION = 5500; // ms
const PAUSE_AFTER = 2500;   // ms to hold full bars before restarting

function OptionRow({ option, progress, index }) {
  const weeksFilled = Math.min(
    option.timelineWeeks,
    progress * MAX_WEEKS,
  );
  const pct = (weeksFilled / MAX_WEEKS) * 100;
  const done = weeksFilled >= option.timelineWeeks;
  const FitIcon = option.fitIcon;

  return (
    <div
      className={`relative p-4 lg:p-5 rounded-xl border transition-colors ${option.tone} ${
        option.highlight ? 'shadow-sm ring-1 ring-primary/20' : ''
      }`}
    >
      {option.highlight && (
        <span className="absolute -top-2.5 left-5 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-mono uppercase tracking-wider">
          Fluxo
        </span>
      )}

      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <div>
          <div className="text-sm font-semibold text-foreground">{option.label}</div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            {option.sublabel}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-mono tabular-nums text-muted-foreground">
            {Math.round(weeksFilled)}w
            <span className="text-muted-foreground/60"> / {option.timelineWeeks}w</span>
          </div>
        </div>
      </div>

      {/* Bar */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-3">
        <motion.div
          className={`h-full bg-gradient-to-r ${option.barColor} rounded-full`}
          style={{ width: `${pct}%` }}
          transition={{ type: 'tween', duration: 0.05 }}
        />
        {done && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-background border-2 border-foreground"
            style={{ left: `calc(${(option.timelineWeeks / MAX_WEEKS) * 100}% - 6px)` }}
          />
        )}
      </div>

      {/* Metadata row */}
      <div className="grid grid-cols-2 gap-3 text-[11px]">
        <div>
          <div className="flex items-center gap-1 text-muted-foreground mb-0.5">
            <Clock className="w-2.5 h-2.5" /> Timeline
          </div>
          <div className="text-foreground font-semibold">{option.timelineWeeks} weeks</div>
        </div>
        <div>
          <div className="flex items-center gap-1 text-muted-foreground mb-0.5">
            <FitIcon
              className={`w-2.5 h-2.5 ${
                option.fitTone === 'warn' ? 'text-amber-500' : 'text-emerald-500'
              }`}
            />
            Fit to your workflow
          </div>
          <div className="text-foreground font-semibold">{option.fit}</div>
        </div>
      </div>

      <div className="mt-2 text-[10px] text-muted-foreground italic">{option.caveat}</div>
    </div>
  );
}

export default function VelocityCompare() {
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true, margin: '-100px' });
  const [progress, setProgress] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf;
    let start;
    const loop = (t) => {
      if (!start) start = t;
      const elapsed = t - start;
      const p = Math.min(1, elapsed / RACE_DURATION);
      setProgress(p);
      if (p < 1) {
        raf = requestAnimationFrame(loop);
      } else {
        setTimeout(() => {
          setProgress(0);
          setCycle((c) => c + 1);
        }, PAUSE_AFTER);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [inView, cycle]);

  return (
    <div
      ref={containerRef}
      className="bg-card border border-border rounded-2xl p-5 lg:p-7 shadow-sm"
    >
      <div className="flex items-start justify-between mb-5 flex-wrap gap-2">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
            Time to ship, compared
          </p>
          <h3 className="text-base font-bold text-foreground">
            How fast can you actually get operational software?
          </h3>
        </div>
        <div className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Race in progress · 52 weeks scale
        </div>
      </div>

      <div className="space-y-3">
        {OPTIONS.map((opt, i) => (
          <OptionRow key={opt.key} option={opt} progress={progress} index={i} />
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-border/60 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Based on typical engagement ranges for SMEs in Singapore & SEA.
        </p>
        <p className="text-[10px] font-mono text-muted-foreground">
          Auto-replays · cycle {cycle + 1}
        </p>
      </div>
    </div>
  );
}
