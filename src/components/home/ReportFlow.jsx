import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Receipt, ShieldCheck, Clock3, BarChart3, UserCheck,
  Zap, CheckCircle2,
} from 'lucide-react';

/**
 * ReportFlow
 * Hub-and-spoke visual showing a single source report that auto-feeds
 * multiple downstream outputs (invoice, compliance log, weekly summary,
 * etc.). Data pulses travel along each connection line, illustrating
 * "write once, everything updates."
 */

const SOURCE_FIELDS = [
  { key: 'date', label: 'Date', value: '24 Apr 2026' },
  { key: 'team', label: 'Team', value: 'Dive Team A' },
  { key: 'vessel', label: 'Vessel', value: 'MV Horizon' },
  { key: 'hours', label: 'Hours', value: '6.5h' },
  { key: 'notes', label: 'Notes', value: 'Hull inspection complete · 3 minor issues flagged' },
];

// Node positions as percentages within a 100×100 viewBox for the SVG connector layer.
// Source is at x=25, y=50. Destinations fan out on the right.
const NODES = [
  {
    key: 'weekly',
    label: 'Weekly ops summary',
    sub: 'auto-rolled from daily reports',
    Icon: BarChart3,
    tone: 'border-blue-500/40 bg-blue-500/5 dark:bg-blue-500/10',
    dot: 'bg-blue-500',
    x: 80,
    y: 8,
  },
  {
    key: 'invoice',
    label: 'Client invoice',
    sub: 'hours × rate · pre-filled',
    Icon: Receipt,
    tone: 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10',
    dot: 'bg-emerald-500',
    x: 85,
    y: 28,
  },
  {
    key: 'compliance',
    label: 'Compliance log',
    sub: 'flagged items → audit trail',
    Icon: ShieldCheck,
    tone: 'border-amber-500/40 bg-amber-500/5 dark:bg-amber-500/10',
    dot: 'bg-amber-500',
    x: 86,
    y: 52,
  },
  {
    key: 'timesheet',
    label: 'Team timesheet',
    sub: 'hours → payroll export',
    Icon: Clock3,
    tone: 'border-violet-500/40 bg-violet-500/5 dark:bg-violet-500/10',
    dot: 'bg-violet-500',
    x: 85,
    y: 76,
  },
  {
    key: 'dashboard',
    label: 'Monthly dashboard',
    sub: 'live KPIs + charts',
    Icon: UserCheck,
    tone: 'border-primary/50 bg-primary/5 dark:bg-primary/10',
    dot: 'bg-primary',
    x: 80,
    y: 94,
  },
];

const SOURCE = { x: 22, y: 50 };

function buildPath(from, to) {
  // Cubic bezier curve from source to destination for a smooth "river" look
  const midX = (from.x + to.x) / 2;
  return `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;
}

export default function ReportFlow() {
  const [pulseKey, setPulseKey] = useState(0);
  const [highlightedIdx, setHighlightedIdx] = useState(null);
  const [savedMinutes, setSavedMinutes] = useState(182);

  // Repeat pulse animation every 4.5s; increment saved-time counter
  useEffect(() => {
    const id = setInterval(() => {
      setPulseKey((k) => k + 1);
      setSavedMinutes((m) => m + 1);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-xl bg-card border border-border shadow-2xl overflow-hidden">
      {/* Browser chrome */}
      <div className="h-8 bg-muted/60 border-b border-border flex items-center gap-1.5 px-3">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
        <div className="flex-1 flex justify-center">
          <div className="bg-background/80 rounded px-2 py-0.5 text-[10px] text-muted-foreground font-mono">
            fluxo.app/reports
          </div>
        </div>
      </div>

      {/* Header band */}
      <div className="px-4 py-3 border-b border-border bg-muted/20 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">Single source · auto-propagates</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono tabular-nums">
              <span className="text-foreground font-semibold">{savedMinutes}</span> min saved today
            </span>
          </span>
        </div>
      </div>

      {/* Graph area */}
      <div className="relative bg-background" style={{ aspectRatio: '5 / 3', minHeight: 320 }}>
        {/* SVG connector layer */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <defs>
            <linearGradient id="flow-line" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {NODES.map((node, i) => {
            const d = buildPath(SOURCE, node);
            const isHighlighted = highlightedIdx === i || highlightedIdx === 'source';
            return (
              <g key={node.key}>
                {/* Static line */}
                <path
                  d={d}
                  stroke="url(#flow-line)"
                  strokeWidth={isHighlighted ? '0.5' : '0.25'}
                  fill="none"
                  strokeDasharray="0.8 0.6"
                  style={{ transition: 'stroke-width 0.3s' }}
                />
                {/* Travelling pulse */}
                <motion.circle
                  key={`${pulseKey}-${node.key}`}
                  r="0.8"
                  fill="hsl(var(--primary))"
                  initial={{ offsetDistance: '0%', opacity: 0 }}
                  animate={{ offsetDistance: '100%', opacity: [0, 1, 1, 0] }}
                  transition={{
                    duration: 1.8,
                    delay: 0.15 + i * 0.12,
                    ease: 'easeInOut',
                    times: [0, 0.15, 0.85, 1],
                  }}
                  style={{
                    offsetPath: `path('${d}')`,
                    offsetRotate: '0deg',
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* Source card */}
        <div
          className="absolute"
          style={{ left: `${SOURCE.x}%`, top: `${SOURCE.y}%`, transform: 'translate(-50%, -50%)' }}
          onMouseEnter={() => setHighlightedIdx('source')}
          onMouseLeave={() => setHighlightedIdx(null)}
        >
          <motion.div
            className="w-48 sm:w-56 bg-card border-2 border-primary rounded-lg shadow-xl overflow-hidden cursor-pointer"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-3 py-2 bg-primary/10 border-b border-primary/20 flex items-center gap-1.5">
              <FileText className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-semibold">
                Source report
              </span>
              <motion.span
                className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <div className="p-3">
              <div className="text-xs font-bold text-foreground mb-1.5">Daily ops report</div>
              <div className="space-y-0.5">
                {SOURCE_FIELDS.map((f) => (
                  <div key={f.key} className="flex gap-2 text-[9px]">
                    <span className="text-muted-foreground w-10 flex-shrink-0">{f.label}</span>
                    <span className="text-foreground font-medium truncate">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Destination cards */}
        {NODES.map((node, i) => {
          const Icon = node.Icon;
          const isHighlighted = highlightedIdx === i || highlightedIdx === 'source';
          return (
            <div
              key={node.key}
              className="absolute"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onMouseEnter={() => setHighlightedIdx(i)}
              onMouseLeave={() => setHighlightedIdx(null)}
            >
              <motion.div
                className={`px-2.5 py-1.5 rounded-lg border-2 shadow-sm cursor-pointer min-w-[150px] sm:min-w-[170px] ${node.tone}`}
                animate={{
                  scale: isHighlighted ? 1.04 : 1,
                  boxShadow: isHighlighted
                    ? '0 8px 16px rgba(0,0,0,0.12)'
                    : '0 2px 4px rgba(0,0,0,0.05)',
                }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Icon className="w-3 h-3 text-foreground/80 flex-shrink-0" strokeWidth={2} />
                  <span className="text-[10px] font-semibold text-foreground truncate">
                    {node.label}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[8px] text-muted-foreground">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" strokeWidth={2.5} />
                  <span className="truncate">{node.sub}</span>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border bg-muted/10 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-muted-foreground">Write once · update</span>
          <span className="font-mono font-semibold text-foreground">5 downstream reports</span>
          <span className="text-muted-foreground hidden sm:inline">automatically.</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={highlightedIdx ?? 'idle'}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.2 }}
            className="text-[10px] text-muted-foreground font-mono"
          >
            {highlightedIdx === 'source'
              ? '→ all reports linked'
              : typeof highlightedIdx === 'number'
                ? `← sourced from daily report`
                : 'hover any node to trace the flow'}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
