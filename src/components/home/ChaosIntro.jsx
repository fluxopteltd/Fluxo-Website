import React from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle, ShieldCheck, Activity, Users, Clock, TrendingDown,
  Calendar, FileX, Circle,
} from 'lucide-react';

/**
 * ChaosIntro — Story 1 (aesthetic-aligned)
 * "Chaos collapses into clarity."
 *
 * All fragments use Fluxo's own card language (bg-card, border, shadow,
 * rounded-lg, monospace, primary/destructive tokens) so they feel
 * on-brand. The chaos is "broken Fluxo cards" — the same visual system
 * you'll see in the hero dashboard, but in failure state.
 *
 * Beats:
 *   0.0 – 0.6s   fragments fly in from edges to scattered positions
 *   0.6 – 1.4s   peak chaos — jittering, subtle red ambient pulse
 *   1.4 – 2.0s   pulled to center, collapsing
 *   2.0 – 2.6s   central burst + glow
 *   2.6 – 3.2s   center resolves to a calm Fluxo mark that fades gracefully
 *   (hero content begins overlapping from ~3.0s)
 */

// Shared card styling — same as the rest of Fluxo's dashboards
const CARD = 'bg-card border border-border rounded-lg shadow-lg backdrop-blur-sm';

// ------- Fragment content snippets (Fluxo-aligned design) -------

function BrokenCompliance() {
  return (
    <div className={`${CARD} p-3 w-[165px] border-destructive/40`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <ShieldCheck className="w-3 h-3 text-destructive" strokeWidth={2.5} />
        <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Compliance</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-base font-bold text-destructive font-mono tabular-nums">—%</span>
        <span className="text-[9px] text-destructive font-semibold font-mono uppercase tracking-wider">Fail</span>
      </div>
      <div className="mt-1.5 h-1 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-destructive rounded-full"
          animate={{ width: ['18%', '35%', '8%', '24%', '3%'] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </div>
  );
}

function ErrorOp() {
  return (
    <div className={`${CARD} p-3 w-[180px] border-destructive/60`}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-mono text-[9px] text-destructive font-semibold">OP-???</span>
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-destructive"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 0.35, repeat: Infinity }}
        />
      </div>
      <div className="text-[11px] font-semibold text-foreground/70 line-through decoration-destructive/60 leading-tight mb-1">
        Hull inspection
      </div>
      <div className="text-[9px] text-destructive font-mono">#ERROR · data missing</div>
    </div>
  );
}

function GlitchingStat() {
  return (
    <div className={`${CARD} p-3 w-[140px]`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Activity className="w-3 h-3 text-destructive" />
        <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Active</span>
      </div>
      <motion.div
        className="text-lg font-bold text-foreground font-mono tabular-nums"
        animate={{
          textShadow: [
            '2px 0 0 hsl(var(--destructive)), -2px 0 0 hsl(var(--primary))',
            '0 0 0 transparent',
            '3px 0 0 hsl(var(--destructive)), -3px 0 0 hsl(var(--primary))',
            '0 0 0 transparent',
          ],
        }}
        transition={{ duration: 0.3, repeat: Infinity }}
      >
        ??
      </motion.div>
      <div className="text-[9px] text-muted-foreground">sync lost</div>
    </div>
  );
}

function ThrashingStatus() {
  return (
    <motion.div
      className={`${CARD} p-3 w-[150px]`}
      animate={{ borderColor: ['hsl(var(--destructive))', 'hsl(var(--border))', 'hsl(var(--destructive))'] }}
      transition={{ duration: 0.4, repeat: Infinity }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Status</span>
        <AlertTriangle className="w-3 h-3 text-destructive" />
      </div>
      <motion.div
        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium border"
        animate={{
          backgroundColor: [
            'hsl(0 84% 60% / 0.1)',
            'hsl(38 92% 50% / 0.1)',
            'hsl(0 84% 60% / 0.1)',
          ],
          color: [
            'hsl(0 84% 45%)',
            'hsl(38 92% 40%)',
            'hsl(0 84% 45%)',
          ],
          borderColor: [
            'hsl(0 84% 60% / 0.4)',
            'hsl(38 92% 50% / 0.4)',
            'hsl(0 84% 60% / 0.4)',
          ],
        }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        <span className="w-1 h-1 rounded-full bg-current" />
        Conflicting
      </motion.div>
    </motion.div>
  );
}

function NullDataRow() {
  return (
    <div className={`${CARD} p-3 w-[175px]`}>
      <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Job log</div>
      <div className="space-y-1 text-[10px] font-mono">
        <div className="flex justify-between border-b border-border/60 pb-0.5">
          <span className="text-muted-foreground">Vessel</span>
          <span className="text-destructive">—</span>
        </div>
        <div className="flex justify-between border-b border-border/60 pb-0.5">
          <span className="text-muted-foreground">Team</span>
          <span className="text-destructive">—</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Status</span>
          <span className="text-destructive">—</span>
        </div>
      </div>
    </div>
  );
}

function CalendarConflict() {
  return (
    <div className={`${CARD} p-3 w-[155px] border-destructive/40`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Calendar className="w-3 h-3 text-destructive" />
        <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Tue · 09:00</span>
      </div>
      <div className="text-[10px] font-bold text-destructive uppercase tracking-wider mb-1">
        3 overlapping
      </div>
      <div className="space-y-0.5 text-[9px] text-foreground/60 font-mono line-through decoration-destructive/60">
        <div>Dive · Team A</div>
        <div>Refit · Team A</div>
        <div>Audit · Team A</div>
      </div>
    </div>
  );
}

function ChaoticChart() {
  return (
    <div className={`${CARD} p-3 w-[160px]`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <TrendingDown className="w-3 h-3 text-destructive" />
        <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Throughput</span>
      </div>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-base font-bold text-foreground font-mono tabular-nums">??h</span>
        <span className="text-[9px] text-destructive font-medium font-mono">unknown</span>
      </div>
      <svg viewBox="0 0 100 20" className="w-full h-4" preserveAspectRatio="none">
        <motion.polyline
          stroke="hsl(var(--destructive))"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          animate={{
            points: [
              '0,10 15,5 30,15 45,2 60,18 75,7 90,16 100,10',
              '0,12 15,18 30,3 45,16 60,5 75,14 90,4 100,12',
              '0,8 15,14 30,6 45,12 60,3 75,17 90,8 100,10',
            ],
          }}
          transition={{ duration: 0.4, repeat: Infinity }}
        />
      </svg>
    </div>
  );
}

function ExpiredCert() {
  return (
    <div className={`${CARD} p-3 w-[160px] border-destructive/50`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <FileX className="w-3 h-3 text-destructive" />
        <span className="text-[9px] font-mono uppercase tracking-wider text-destructive font-semibold">Expired</span>
      </div>
      <div className="text-[11px] font-semibold text-foreground leading-tight mb-0.5">Dive medical · J. Tan</div>
      <div className="text-[9px] text-destructive font-mono">14 days ago</div>
    </div>
  );
}

function UnassignedTeam() {
  return (
    <div className={`${CARD} p-3 w-[145px]`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Users className="w-3 h-3 text-destructive" />
        <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Dispatch</span>
      </div>
      <div className="text-[11px] font-bold text-destructive mb-0.5">Unassigned</div>
      <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
        <Clock className="w-2.5 h-2.5" />
        <span className="font-mono">3h idle</span>
      </div>
    </div>
  );
}

// ------- Fragments config -------

const FRAGMENTS = [
  { key: 'compliance', from: { x: -520, y: -220 }, scatter: { x: -210, y: -120 }, rotateFrom: -20, rotateScatter: -6, delay: 0.05, Component: BrokenCompliance },
  { key: 'error-op', from: { x: 520, y: -240 }, scatter: { x: 200, y: -110 }, rotateFrom: 22, rotateScatter: 5, delay: 0.1, Component: ErrorOp },
  { key: 'glitch-stat', from: { x: -440, y: 220 }, scatter: { x: -230, y: 90 }, rotateFrom: -18, rotateScatter: -8, delay: 0.15, Component: GlitchingStat },
  { key: 'thrashing', from: { x: 480, y: 240 }, scatter: { x: 220, y: 110 }, rotateFrom: 18, rotateScatter: 6, delay: 0.2, Component: ThrashingStatus },
  { key: 'null-data', from: { x: 0, y: -340 }, scatter: { x: -60, y: -180 }, rotateFrom: -8, rotateScatter: -3, delay: 0.25, Component: NullDataRow },
  { key: 'calendar', from: { x: -580, y: 40 }, scatter: { x: -250, y: 0 }, rotateFrom: -12, rotateScatter: -4, delay: 0.3, Component: CalendarConflict },
  { key: 'chart', from: { x: 580, y: 60 }, scatter: { x: 240, y: 0 }, rotateFrom: 15, rotateScatter: 7, delay: 0.35, Component: ChaoticChart },
  { key: 'expired', from: { x: -60, y: 340 }, scatter: { x: 80, y: 170 }, rotateFrom: -5, rotateScatter: 3, delay: 0.4, Component: ExpiredCert },
  { key: 'unassigned', from: { x: 320, y: -360 }, scatter: { x: 110, y: -170 }, rotateFrom: 15, rotateScatter: 8, delay: 0.18, Component: UnassignedTeam },
];

const JITTER_X = [0, 2, -3, 1, -2, 3, -1, 0];
const JITTER_Y = [0, -1, 2, -1, 2, -2, 1, 0];

export const CHAOS_INTRO_DURATION = 3.2;
const FLY_DURATION = 2.1;
const T_FLY_END = 0.28;
const T_HOLD_END = 0.62;
const T_COLLAPSE_END = 0.88;
const T_GONE = 1;

export default function ChaosIntro() {
  return (
    <div className="relative w-full h-[440px] sm:h-[500px] overflow-hidden">
      {/* Subtle red ambient pulse during peak chaos */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          backgroundColor: [
            'hsl(var(--destructive) / 0)',
            'hsl(var(--destructive) / 0.05)',
            'hsl(var(--destructive) / 0)',
          ],
        }}
        transition={{ duration: 1.2, delay: 0.7, times: [0, 0.5, 1], ease: 'easeInOut' }}
      />

      {/* Faint static grid behind everything */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Chaotic fragments */}
      {FRAGMENTS.map((f) => (
        <motion.div
          key={f.key}
          className="absolute top-1/2 left-1/2"
          style={{ translate: '-50% -50%' }}
          initial={{ opacity: 0, scale: 0.6, rotate: f.rotateFrom }}
          animate={{
            x: [f.from.x, f.scatter.x, f.scatter.x, 0, 0],
            y: [f.from.y, f.scatter.y, f.scatter.y, 0, 0],
            opacity: [0, 1, 1, 0.9, 0],
            scale: [0.6, 1, 1, 0.22, 0],
            rotate: [f.rotateFrom, f.rotateScatter, f.rotateScatter, 0, 0],
          }}
          transition={{
            duration: FLY_DURATION,
            delay: f.delay,
            times: [0, T_FLY_END, T_HOLD_END, T_COLLAPSE_END, T_GONE],
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {/* Inner jitter wrapper */}
          <motion.div
            animate={{ x: JITTER_X, y: JITTER_Y }}
            transition={{
              duration: 0.38,
              delay: f.delay + 0.65,
              repeat: 2,
              ease: 'easeInOut',
            }}
          >
            <f.Component />
          </motion.div>
        </motion.div>
      ))}

      {/* Central burst — when fragments collapse inward */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(closest-side, #fff 0%, hsl(var(--primary)) 35%, transparent 75%)',
          boxShadow: '0 0 80px 40px hsl(var(--primary) / 0.5)',
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0, 30, 80, 110] }}
        transition={{
          duration: 1.3,
          delay: 1.9,
          times: [0, 0.25, 0.65, 1],
          ease: [0.16, 1, 0.3, 1],
        }}
      />

      {/* Secondary shockwave ring */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-primary pointer-events-none"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 0.9, 0], scale: [0, 12, 20] }}
        transition={{
          duration: 1.0,
          delay: 2.05,
          times: [0, 0.25, 1],
          ease: [0.16, 1, 0.3, 1],
        }}
      />

      {/* Calm Fluxo mark emerging — fades softly to hand off to hero text */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: [0, 0, 1, 0.9, 0], scale: [0.6, 0.6, 1, 1.05, 1.1] }}
        transition={{
          duration: 2.0,
          delay: 1.8,
          times: [0, 0.3, 0.55, 0.85, 1],
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <FluxoMark />
      </motion.div>
    </div>
  );
}

function FluxoMark() {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Abstract infinity-arrow mark echoing the logo */}
      <svg viewBox="0 0 140 60" className="w-28 h-12" fill="none">
        <defs>
          <linearGradient id="fluxo-mark-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--fluxo-cyan))" />
            <stop offset="100%" stopColor="hsl(var(--primary))" />
          </linearGradient>
        </defs>
        <motion.path
          d="M 35 30 A 17 17 0 1 1 35 29.5 M 105 30 A 17 17 0 1 0 105 30.5 M 52 30 L 88 30 M 80 24 L 88 30 L 80 36"
          stroke="url(#fluxo-mark-grad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-[10px] font-mono tracking-[0.4em] uppercase text-foreground"
      >
        Fluxo
      </motion.div>
    </div>
  );
}
