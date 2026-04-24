import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Anchor, ShieldCheck, TrendingUp } from 'lucide-react';

/**
 * HeroAmbient
 * Cinematic hero entrance:
 * 1. 4 cards fly in from off-screen corners
 * 2. CONVERGE at center hub (scale down, look like sparks)
 * 3. BURST — radial shockwave + flash at center
 * 4. EXPAND outward to final positions, growing to full size
 * 5. Cards dim to 35% opacity — push to background
 * 6. Gentle float loop begins
 *
 * No persistent lines. No text-blocking. Just drama.
 */

const HUB = { x: 50, y: 25 }; // centered behind the headline

// Fragment positions:
// - scatter: where each card first appears (not final, not off-screen) — "independent system" moment
// - hub: offset to the center-top convergence point
// - final: relative to the card's CSS position (translate 0, 0)
const FRAGMENTS = [
  {
    key: 'cert',
    position: 'top-[5%] sm:top-[12%] left-[2%] sm:left-[5%] md:left-[8%] xl:left-[12%]',
    scatter: { x: 190, y: 40 },          // card visible, inside hero, not at corner yet
    hub: { x: 440, y: 60 },              // fly into center near headline area
    rotateScatter: -8,
    rotateHub: 0,
    rotateFinal: -2,
    floatY: [-4, 5, -4],
    floatDuration: 7,
    width: 'w-[130px] sm:w-[170px]',
    delayOffset: 0,
  },
  {
    key: 'live',
    position: 'top-[5%] sm:top-[10%] right-[2%] sm:right-[5%] md:right-[8%] xl:right-[10%]',
    scatter: { x: -160, y: 50 },
    hub: { x: -440, y: 80 },
    rotateScatter: 8,
    rotateHub: 0,
    rotateFinal: 3,
    floatY: [3, -5, 3],
    floatDuration: 8,
    width: 'w-[120px] sm:w-[150px]',
    delayOffset: 0.06,
  },
  {
    key: 'job',
    position: 'top-[50%] left-[2%] md:left-[6%] xl:left-[9%]',
    scatter: { x: 210, y: -80 },
    hub: { x: 460, y: -180 },
    rotateScatter: -8,
    rotateHub: 0,
    rotateFinal: -4,
    floatY: [-6, 3, -6],
    floatDuration: 9,
    width: 'w-[180px]',
    hideBelow: 'hidden md:block',
    delayOffset: 0.12,
  },
  {
    key: 'trend',
    position: 'top-[52%] right-[3%] md:right-[7%] xl:right-[9%]',
    scatter: { x: -200, y: -90 },
    hub: { x: -460, y: -190 },
    rotateScatter: 8,
    rotateHub: 0,
    rotateFinal: 4,
    floatY: [5, -3, 5],
    floatDuration: 10,
    width: 'w-[170px]',
    hideBelow: 'hidden md:block',
    delayOffset: 0.18,
  },
];

// Story stage timings (seconds from page load) — 6-stage arc with a
// HOLD at hub so cards visibly merge into one point before splitting
const SCATTER_APPEAR_END = 0.55;   // cards fade in at scattered positions
const CONVERGE_END = 1.15;         // flown into hub (all overlapping at one point)
const HOLD_END = 1.6;              // 0.45s hold — cards are merged as ONE unified spark
const BURST_AT = CONVERGE_END;     // burst starts at hub arrival
const EXPAND_END = 2.25;           // cards emerge outward to final positions
const DIM_END = 2.5;
const TOTAL_ENTRY = DIM_END;       // 2.5s

// Fractional times (0–1 within TOTAL_ENTRY)
const T_SCATTER = SCATTER_APPEAR_END / TOTAL_ENTRY;  // ~0.22
const T_HUB = CONVERGE_END / TOTAL_ENTRY;             // ~0.46
const T_HOLD = HOLD_END / TOTAL_ENTRY;                // ~0.64
const T_EXPAND = EXPAND_END / TOTAL_ENTRY;            // ~0.90
const T_DIM = 1;

// ---------- Card content renderers ----------

function CertCard() {
  const [value, setValue] = useState(96);
  useEffect(() => {
    const id = setInterval(() => {
      setValue((v) => Math.max(92, Math.min(99, v + (Math.random() > 0.5 ? 1 : -1))));
    }, 3500);
    return () => clearInterval(id);
  }, []);
  return (
    <>
      <div className="flex items-center gap-1.5 mb-1.5">
        <ShieldCheck className="w-3 h-3 text-emerald-500" strokeWidth={2.5} />
        <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Compliance</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <motion.span key={value} initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="text-base font-bold text-foreground font-mono tabular-nums">
          {value}%
        </motion.span>
        <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium">▲ 2%</span>
      </div>
      <div className="mt-1.5 h-1 bg-muted rounded-full overflow-hidden">
        <motion.div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" animate={{ width: `${value}%` }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} />
      </div>
    </>
  );
}

function LiveCard() {
  const [count, setCount] = useState(12);
  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => Math.max(8, Math.min(18, c + (Math.random() > 0.5 ? 1 : -1))));
    }, 2800);
    return () => clearInterval(id);
  }, []);
  return (
    <>
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="relative flex h-1.5 w-1.5">
          <motion.span className="absolute inline-flex h-full w-full rounded-full bg-primary" animate={{ opacity: [0.8, 0.2, 0.8], scale: [1, 2.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
        </span>
        <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Live ops</span>
      </div>
      <div className="flex items-baseline gap-1">
        <motion.span key={count} initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="text-lg font-bold text-foreground font-mono tabular-nums">
          {count}
        </motion.span>
        <span className="text-[10px] text-muted-foreground">active</span>
      </div>
      <div className="text-[9px] text-muted-foreground mt-0.5">updated just now</div>
    </>
  );
}

function JobCard() {
  const STATUSES = [
    { label: 'Scheduled', pill: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:border-slate-500/30', dot: 'bg-slate-500' },
    { label: 'In progress', pill: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/30', dot: 'bg-blue-500' },
    { label: 'Completed', pill: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30', dot: 'bg-emerald-500' },
  ];
  const [i, setI] = useState(1);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % STATUSES.length), 3200);
    return () => clearInterval(id);
  }, []);
  const s = STATUSES[i];
  return (
    <>
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-mono text-[9px] text-muted-foreground">OP-184</span>
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
      </div>
      <div className="text-[11px] font-semibold text-foreground leading-tight mb-1">Hull inspection</div>
      <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
        <Anchor className="w-2.5 h-2.5" />
        <span>MV Horizon</span>
      </div>
      <motion.div key={s.label} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className={`mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[9px] font-medium ${s.pill}`}>
        <span className={`w-1 h-1 rounded-full ${s.dot}`} />
        {s.label}
      </motion.div>
    </>
  );
}

function TrendCard() {
  const [data, setData] = useState(() =>
    Array.from({ length: 8 }, (_, i) => 10 + Math.sin(i) * 5 + Math.random() * 4)
  );
  useEffect(() => {
    const id = setInterval(() => {
      setData((prev) => {
        const next = [...prev.slice(1), Math.max(4, Math.min(22, prev[prev.length - 1] + (Math.random() - 0.5) * 4))];
        return next;
      });
    }, 1500);
    return () => clearInterval(id);
  }, []);
  const maxV = Math.max(...data);
  const minV = Math.min(...data);
  const range = maxV - minV || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 22 - ((v - minV) / range) * 18;
    return `${x},${y}`;
  });
  const line = `M ${points.join(' L ')}`;
  const fill = `${line} L 100,24 L 0,24 Z`;
  return (
    <>
      <div className="flex items-center gap-1.5 mb-1.5">
        <TrendingUp className="w-3 h-3 text-primary" strokeWidth={2} />
        <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Throughput</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-base font-bold text-foreground font-mono tabular-nums">284h</span>
        <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium">+18%</span>
      </div>
      <svg viewBox="0 0 100 24" className="mt-1.5 w-full h-6" preserveAspectRatio="none">
        <defs>
          <linearGradient id="spark-fill-hero" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path d={fill} fill="url(#spark-fill-hero)" animate={{ d: fill }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} />
        <motion.path d={line} stroke="hsl(var(--primary))" strokeWidth="1.5" fill="none" strokeLinecap="round" animate={{ d: line }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} />
      </svg>
    </>
  );
}

const CARD_RENDERERS = {
  cert: CertCard,
  live: LiveCard,
  job: JobCard,
  trend: TrendCard,
};

const BLOBS = [
  {
    className: 'absolute top-[20%] -left-20 w-[320px] h-[320px] bg-primary/15 rounded-full blur-3xl pointer-events-none',
    animate: { x: [0, 40, 0], y: [0, -20, 0] },
    duration: 14,
  },
  {
    className: 'absolute top-[40%] -right-24 w-[380px] h-[380px] bg-[hsl(var(--fluxo-cyan))]/15 rounded-full blur-3xl pointer-events-none',
    animate: { x: [0, -30, 0], y: [0, 30, 0] },
    duration: 16,
  },
];

// ---------- Main ----------

export default function HeroAmbient() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Animated color blobs — always on */}
      {BLOBS.map((b, i) => (
        <motion.div key={i} className={b.className} animate={b.animate} transition={{ duration: b.duration, repeat: Infinity, ease: 'easeInOut' }} />
      ))}

      {/* Scan line — continuous after entry */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none"
        initial={{ top: '0%' }}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'linear', delay: 2 }}
      />

      {/* Central burst / shockwave — positioned behind the headline (top-[25%]) */}
      <motion.div
        className="absolute top-[25%] left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(closest-side, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.5) 40%, transparent 70%)',
          boxShadow: '0 0 60px 30px hsl(var(--primary) / 0.5)',
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0, 40, 80] }}
        transition={{
          duration: 1.1,
          delay: BURST_AT - 0.05,
          times: [0, 0.25, 1],
          ease: [0.16, 1, 0.3, 1],
        }}
      />

      {/* Secondary burst ring */}
      <motion.div
        className="absolute top-[25%] left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary/70 pointer-events-none"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 0.9, 0], scale: [0, 10, 16] }}
        transition={{
          duration: 1.0,
          delay: BURST_AT,
          times: [0, 0.2, 1],
          ease: [0.16, 1, 0.3, 1],
        }}
      />

      {/* Tertiary ring — delayed for layered shockwave feel */}
      <motion.div
        className="absolute top-[25%] left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[hsl(var(--fluxo-cyan))]/60 pointer-events-none"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 0.7, 0], scale: [0, 14, 22] }}
        transition={{
          duration: 1.2,
          delay: BURST_AT + 0.15,
          times: [0, 0.2, 1],
          ease: [0.16, 1, 0.3, 1],
        }}
      />

      {/* Unified core pulsing during the HOLD phase — visually one system at center */}
      <motion.div
        className="absolute top-[25%] left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(closest-side, #fff 0%, hsl(var(--primary)) 40%, transparent 80%)',
          boxShadow: '0 0 50px 15px hsl(var(--primary) / 0.6)',
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.8, 2.2, 0.4] }}
        transition={{
          duration: HOLD_END - CONVERGE_END + 0.3,
          delay: CONVERGE_END - 0.1,
          times: [0, 0.18, 0.75, 1],
          ease: 'easeInOut',
        }}
      />

      {/* RELEASE burst — second shockwave at end of hold, when cards launch out */}
      <motion.div
        className="absolute top-[25%] left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(closest-side, #fff 0%, hsl(var(--primary)) 30%, transparent 70%)',
          boxShadow: '0 0 80px 40px hsl(var(--primary) / 0.5)',
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0, 50, 100] }}
        transition={{
          duration: 1.1,
          delay: HOLD_END,
          times: [0, 0.2, 1],
          ease: [0.16, 1, 0.3, 1],
        }}
      />
      <motion.div
        className="absolute top-[25%] left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary/80 pointer-events-none"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 0.9, 0], scale: [0, 14, 22] }}
        transition={{
          duration: 1.0,
          delay: HOLD_END + 0.05,
          times: [0, 0.2, 1],
          ease: [0.16, 1, 0.3, 1],
        }}
      />

      {/* Floating UI fragments with convergence choreography */}
      {FRAGMENTS.map((f) => {
        const Renderer = CARD_RENDERERS[f.key];
        return (
          <motion.div
            key={f.key}
            initial={{
              opacity: 0,
              x: f.scatter.x,
              y: f.scatter.y,
              rotate: f.rotateScatter,
              scale: 0.22,
              filter: 'blur(6px) drop-shadow(0 0 14px hsl(var(--primary)))',
            }}
            animate={{
              // 6-stage STORY:
              //   0 → scatter (fading in)
              //   scatter → hub (converging, all arriving at SAME point)
              //   hub → hub (HOLD — 4 cards overlap as one unified spark)
              //   hub → final (emerging outward as 4 views of the system)
              //   final → dim
              x: [f.scatter.x, f.scatter.x, f.hub.x, f.hub.x, 0, 0],
              y: [f.scatter.y, f.scatter.y, f.hub.y, f.hub.y, 0, 0],
              rotate: [f.rotateScatter, f.rotateScatter, f.rotateHub, f.rotateHub, f.rotateFinal, f.rotateFinal],
              // Hub hold: scale pulses slightly (0.28 → 0.35) showing the merged "heartbeat"
              scale: [0.22, 0.3, 0.28, 0.38, 1.15, 1],
              opacity: [0, 0.85, 1, 1, 1, 0.35],
              filter: [
                'blur(6px) drop-shadow(0 0 14px hsl(var(--primary)))',
                'blur(4px) drop-shadow(0 0 18px hsl(var(--primary)))',
                'blur(3px) drop-shadow(0 0 30px hsl(var(--primary)))',
                'blur(2px) drop-shadow(0 0 40px hsl(var(--primary)))',
                'blur(0px) drop-shadow(0 0 4px hsl(var(--primary) / 0.3))',
                'blur(0px) drop-shadow(0 0 0 transparent)',
              ],
            }}
            transition={{
              duration: TOTAL_ENTRY,
              delay: f.delayOffset,
              ease: [0.16, 1, 0.3, 1],
              x: { times: [0, T_SCATTER, T_HUB, T_HOLD, T_EXPAND, T_DIM], duration: TOTAL_ENTRY },
              y: { times: [0, T_SCATTER, T_HUB, T_HOLD, T_EXPAND, T_DIM], duration: TOTAL_ENTRY },
              rotate: { times: [0, T_SCATTER, T_HUB, T_HOLD, T_EXPAND, T_DIM], duration: TOTAL_ENTRY },
              scale: { times: [0, T_SCATTER, T_HUB, T_HOLD, T_EXPAND, T_DIM], duration: TOTAL_ENTRY },
              opacity: { times: [0, T_SCATTER, T_HUB, T_HOLD, T_EXPAND, T_DIM], duration: TOTAL_ENTRY },
              filter: { times: [0, T_SCATTER, T_HUB, T_HOLD, T_EXPAND, T_DIM], duration: TOTAL_ENTRY },
            }}
            className={`absolute ${f.position} ${f.width} ${f.hideBelow || ''}`}
          >
            {/* Inner wrapper — gentle float after entry */}
            <motion.div
              animate={{ y: f.floatY }}
              transition={{
                duration: f.floatDuration,
                delay: TOTAL_ENTRY + 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative p-3 rounded-lg border border-border bg-card/80 backdrop-blur-sm shadow-lg"
            >
              {/* Holographic border shimmer — starts after entry */}
              <motion.div
                aria-hidden="true"
                className="absolute -inset-px rounded-lg pointer-events-none"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent, hsl(var(--primary) / 0.5), transparent 30%)',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  maskComposite: 'exclude',
                  padding: '1px',
                }}
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: [0, 0.7], rotate: 360 }}
                transition={{
                  opacity: { duration: 0.6, delay: TOTAL_ENTRY },
                  rotate: { duration: 6, repeat: Infinity, ease: 'linear', delay: TOTAL_ENTRY },
                }}
              />
              <div className="relative">
                <Renderer />
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
