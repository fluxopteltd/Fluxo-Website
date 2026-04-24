import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import {
  Check, Clock, AlertCircle, Sparkles, TrendingUp,
  ShieldCheck, Calendar, Users, ChevronRight,
} from 'lucide-react';

/**
 * TransformSlider
 * Drag-to-reveal before/after:
 *   Left  (BEFORE) — messy SME tools: Excel grid, WhatsApp chat, paper form,
 *                    sticky notes, email. Off-angle, cluttered, paper-ish tones.
 *   Right (AFTER)  — clean Fluxo dashboard: organized grid, KPIs, live metrics.
 *
 * Auto-oscillates gently until the user interacts. Then stays where they
 * put it.
 */

export default function TransformSlider() {
  const containerRef = useRef(null);
  const [userInteracting, setUserInteracting] = useState(false);
  const position = useMotionValue(0.5); // 0 = all before, 1 = all after

  // Derived clip-path percentages for each side
  const leftClip = useTransform(position, (p) => `inset(0 ${(1 - p) * 100}% 0 0)`);
  const rightClip = useTransform(position, (p) => `inset(0 0 0 ${p * 100}%)`);
  const handleLeft = useTransform(position, (p) => `${p * 100}%`);

  // Auto-oscillate between 0.35 and 0.65 until user interacts
  useEffect(() => {
    if (userInteracting) return;
    let direction = 1;
    let cancelled = false;

    const loop = () => {
      if (cancelled || userInteracting) return;
      const target = direction > 0 ? 0.65 : 0.35;
      const controls = animate(position, target, {
        duration: 3.5,
        ease: 'easeInOut',
        onComplete: () => {
          direction *= -1;
          loop();
        },
      });
      return controls;
    };

    const controls = loop();
    return () => {
      cancelled = true;
      if (controls && controls.stop) controls.stop();
    };
  }, [userInteracting, position]);

  const getPositionFromEvent = (clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return 0.5;
    const x = clientX - rect.left;
    return Math.max(0, Math.min(1, x / rect.width));
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    setUserInteracting(true);
    const pos = getPositionFromEvent(e.clientX);
    position.set(pos);

    const handleMove = (ev) => {
      const p = getPositionFromEvent(ev.clientX);
      position.set(p);
    };
    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  return (
    <div className="w-full">
      {/* Captions above */}
      <div className="flex items-center justify-between mb-3 text-[10px] font-mono uppercase tracking-wider">
        <span className="text-muted-foreground">How most SMEs run today</span>
        <span className="text-primary font-semibold">How it should run</span>
      </div>

      {/* Slider container */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        className="relative w-full h-[420px] md:h-[480px] rounded-2xl overflow-hidden border border-border shadow-2xl cursor-ew-resize select-none"
      >
        {/* BEFORE side — messy SME tools */}
        <motion.div
          style={{ clipPath: leftClip }}
          className="absolute inset-0 bg-[#f3ebdb] dark:bg-[#2a251c]"
        >
          <BeforeLayout />
        </motion.div>

        {/* AFTER side — clean Fluxo dashboard */}
        <motion.div
          style={{ clipPath: rightClip }}
          className="absolute inset-0 bg-background"
        >
          <AfterLayout />
        </motion.div>

        {/* Drag handle */}
        <motion.div
          style={{ left: handleLeft }}
          className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-[hsl(var(--fluxo-cyan))] to-primary pointer-events-none shadow-[0_0_20px_rgba(46,127,203,0.6)]"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-[hsl(var(--fluxo-cyan))] shadow-lg flex items-center justify-center border-2 border-background">
            <div className="flex items-center gap-0.5 text-white">
              <ChevronLeft />
              <ChevronRightSmall />
            </div>
          </div>
        </motion.div>

        {/* Hint overlay — fades out once user interacts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: userInteracting ? 0 : [0, 1, 1, 0] }}
          transition={{ duration: 4, times: [0, 0.2, 0.8, 1], delay: 0.8 }}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur text-[11px] font-medium text-foreground border border-border shadow-md pointer-events-none"
        >
          ← drag to compare →
        </motion.div>
      </div>

      {/* Captions below */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="text-muted-foreground leading-relaxed">
          Scattered across spreadsheets, chat threads, paper logs, and sticky notes. Every question takes a WhatsApp reply.
        </div>
        <div className="text-foreground leading-relaxed font-medium">
          One system. Everything traceable, searchable, up to date. Questions answered before they're asked.
        </div>
      </div>
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function ChevronRightSmall() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// ---------- BEFORE side ----------

function BeforeLayout() {
  return (
    <div className="relative w-full h-full p-5 md:p-8 overflow-hidden">
      {/* Paper-ish texture grid background */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Excel spreadsheet */}
      <div
        className="absolute top-5 left-5 w-[340px] bg-white dark:bg-neutral-900 shadow-lg border border-neutral-300 dark:border-neutral-700 rounded-sm"
        style={{ transform: 'rotate(-2deg)' }}
      >
        <div className="px-2 py-1 bg-[#e8e4d9] dark:bg-neutral-800 border-b border-neutral-300 dark:border-neutral-700 flex items-center gap-1.5 text-[10px] text-neutral-700 dark:text-neutral-300 font-mono">
          <span className="w-2 h-2 bg-green-600 rounded-sm" />
          operations-tracker-FINAL-v3.xlsx
        </div>
        <div className="grid grid-cols-[20px_1.4fr_1fr_0.8fr_0.7fr]">
          {['', 'Vessel', 'Status', 'Team', 'Date'].map((h, i) => (
            <div key={i} className="bg-neutral-200 dark:bg-neutral-800 text-[9px] font-semibold text-neutral-600 dark:text-neutral-400 px-1.5 py-1 border-b border-neutral-300 dark:border-neutral-700 border-r">
              {h}
            </div>
          ))}
          {[
            ['1', 'MV Horizon', 'Pending', 'Team A', '14/4'],
            ['2', 'Vessel 04', 'Done', 'Team B', '12/4'],
            ['3', 'MV Pioneer', '???', 'Bob?', ''],
            ['4', 'Oceanic', 'In Prog', 'A', '14/4'],
            ['5', '', '', '', ''],
            ['6', 'Vessel 7', 'Cancel', 'B', '15/4'],
          ].map((row, ri) =>
            row.map((cell, ci) => (
              <div
                key={`${ri}-${ci}`}
                className={`text-[10px] px-1.5 py-1 border-b border-neutral-200 dark:border-neutral-800 border-r truncate ${
                  ci === 0 ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-center font-mono' : 'text-neutral-700 dark:text-neutral-300'
                } ${cell === '???' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' : ''} ${cell === 'Done' ? 'text-green-700 dark:text-green-300' : ''}`}
              >
                {cell}
              </div>
            ))
          )}
        </div>
      </div>

      {/* WhatsApp chat */}
      <div
        className="absolute top-6 right-6 w-[220px] bg-[#e4e4dd] dark:bg-[#1a1a1a] rounded-lg p-2.5 shadow-lg space-y-1.5"
        style={{ transform: 'rotate(3deg)' }}
      >
        <div className="text-[9px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Dive Team Group (8 members)
        </div>
        <div className="flex justify-end">
          <div className="bg-[#dcf8c6] dark:bg-[#056162] text-[10px] text-neutral-800 dark:text-neutral-100 rounded-lg rounded-tr-sm px-2 py-1 max-w-[85%]">
            hull inspection done or not ah?
          </div>
        </div>
        <div className="flex justify-start">
          <div className="bg-white dark:bg-neutral-800 text-[10px] text-neutral-800 dark:text-neutral-100 rounded-lg rounded-tl-sm px-2 py-1 max-w-[85%]">
            which vessel
          </div>
        </div>
        <div className="flex justify-end">
          <div className="bg-[#dcf8c6] dark:bg-[#056162] text-[10px] text-neutral-800 dark:text-neutral-100 rounded-lg rounded-tr-sm px-2 py-1 max-w-[85%]">
            MV horizon, client asking
          </div>
        </div>
        <div className="flex justify-start">
          <div className="bg-white dark:bg-neutral-800 text-[10px] text-neutral-800 dark:text-neutral-100 rounded-lg rounded-tl-sm px-2 py-1 max-w-[85%]">
            check with bob, he did it i think
          </div>
        </div>
      </div>

      {/* Yellow sticky note */}
      <div
        className="absolute bottom-20 left-12 w-[150px] h-[120px] bg-[#fde68a] shadow-lg p-3 text-[11px] text-neutral-900 font-medium leading-snug"
        style={{ transform: 'rotate(-6deg)', fontFamily: 'Caveat, cursive' }}
      >
        CALL JOHN
        <br />
        re permit for
        <br />
        MV Victory
        <br />
        (expired??)
        <br />
        <span className="text-red-600 text-lg">URGENT!!</span>
      </div>

      {/* Paper timesheet */}
      <div
        className="absolute bottom-5 right-16 w-[200px] bg-[#faf5e8] dark:bg-[#3d3424] shadow-lg border border-neutral-300 dark:border-neutral-600 p-3"
        style={{ transform: 'rotate(5deg)' }}
      >
        <div className="text-[10px] font-bold text-neutral-800 dark:text-neutral-200 uppercase mb-1 tracking-wider">
          Timesheet — Wk 15
        </div>
        <div className="space-y-0.5 text-[9px] text-neutral-700 dark:text-neutral-300 font-mono">
          <div className="flex justify-between border-b border-dashed border-neutral-400"><span>Mon 08:00</span><span>16:30</span></div>
          <div className="flex justify-between border-b border-dashed border-neutral-400"><span>Tue 08:15</span><span>17:00</span></div>
          <div className="flex justify-between border-b border-dashed border-neutral-400"><span>Wed —</span><span className="text-red-600">MC</span></div>
          <div className="flex justify-between border-b border-dashed border-neutral-400"><span>Thu 07:45</span><span>18:00</span></div>
          <div className="flex justify-between"><span>Fri 08:00</span><span>17:30</span></div>
        </div>
        <div className="text-[9px] text-neutral-500 mt-1 italic">sign: _______</div>
      </div>

      {/* Email snippet */}
      <div
        className="absolute top-[170px] left-[360px] w-[210px] bg-white dark:bg-neutral-900 shadow-lg border border-neutral-300 dark:border-neutral-700 rounded text-[10px] hidden md:block"
        style={{ transform: 'rotate(-3deg)' }}
      >
        <div className="px-2 py-1 border-b border-neutral-200 dark:border-neutral-700 flex items-center gap-1 text-neutral-600 dark:text-neutral-400 text-[9px]">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          Gmail — 1 of 247 unread
        </div>
        <div className="p-2">
          <div className="font-semibold text-neutral-800 dark:text-neutral-100 text-[10px]">Fwd: Fwd: Re: Dive log — Jurong</div>
          <div className="text-neutral-500 text-[9px]">client@shipping.co · 9:42 AM</div>
          <div className="text-neutral-600 dark:text-neutral-400 text-[9px] mt-1 line-clamp-3">
            Can you send me the timesheet for last week? Also the cert for Bob, I need it by EOD. Where's the report from MV Horizon?
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- AFTER side ----------

function AfterLayout() {
  return (
    <div className="relative w-full h-full p-5 md:p-8 bg-gradient-to-br from-background to-muted/40 overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Dashboard frame */}
      <div className="relative h-full bg-card border border-border rounded-xl shadow-xl overflow-hidden flex flex-col">
        {/* Top bar */}
        <div className="h-9 border-b border-border bg-muted/30 flex items-center gap-2 px-3">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-400/60" />
            <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
            <div className="w-2 h-2 rounded-full bg-green-400/60" />
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground ml-3">
            <span>Operations</span>
            <span className="text-muted-foreground/50">›</span>
            <span className="text-foreground font-medium">Overview</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground font-mono">⌘K</span>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-4 gap-2 p-3 border-b border-border">
          {[
            { Icon: Users, label: 'Active ops', value: '12', delta: '+2' },
            { Icon: TrendingUp, label: 'Throughput', value: '284h', delta: '+18%' },
            { Icon: ShieldCheck, label: 'Compliance', value: '96%', delta: '▲' },
            { Icon: AlertCircle, label: 'Flags', value: '3', delta: '—' },
          ].map((k, i) => (
            <div key={k.label} className="px-2.5 py-2 rounded-md border border-border/70 bg-background">
              <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground mb-1">
                <k.Icon className="w-2.5 h-2.5" />
                {k.label}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-foreground font-mono tabular-nums">{k.value}</span>
                <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium">{k.delta}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="flex-1 grid grid-cols-[1fr_180px] min-h-0">
          {/* Left: active ops list */}
          <div className="border-r border-border flex flex-col">
            <div className="px-3 py-2 border-b border-border flex items-center justify-between">
              <span className="text-[10px] font-semibold text-foreground">Active operations</span>
              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                live
              </span>
            </div>
            {[
              { id: 'OP-184', title: 'Hull inspection — MV Horizon', team: 'Dive Team A', status: 'progress' },
              { id: 'OP-183', title: 'Cert renewal — Vessel 04', team: 'QA Team', status: 'scheduled' },
              { id: 'OP-182', title: 'Dive medical batch', team: 'HR · 8 crew', status: 'progress' },
              { id: 'OP-181', title: 'Dry dock prep', team: 'Yard', status: 'done' },
            ].map((op) => (
              <div key={op.id} className="flex items-center gap-2 px-3 py-2 border-b border-border/40 last:border-b-0">
                <div className="font-mono text-[9px] text-muted-foreground w-11 flex-shrink-0">{op.id}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium text-foreground truncate">{op.title}</div>
                  <div className="text-[9px] text-muted-foreground truncate">{op.team}</div>
                </div>
                <span
                  className={`text-[9px] font-medium px-1.5 py-0.5 rounded border ${
                    op.status === 'progress'
                      ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/30'
                      : op.status === 'done'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30'
                        : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:border-slate-500/30'
                  }`}
                >
                  {op.status}
                </span>
              </div>
            ))}
          </div>

          {/* Right: quick panels */}
          <div className="p-3 flex flex-col gap-2">
            <div className="border border-border rounded-md p-2 bg-background">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Next up</span>
                <Calendar className="w-3 h-3 text-muted-foreground" />
              </div>
              <div className="text-[10px] font-medium text-foreground">Refit survey</div>
              <div className="text-[9px] text-muted-foreground">Tue · 09:00 · Vessel 04</div>
            </div>

            <div className="border border-amber-400/40 bg-amber-500/5 rounded-md p-2">
              <div className="flex items-center gap-1 mb-1">
                <AlertCircle className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                <span className="text-[9px] uppercase tracking-wider text-amber-700 dark:text-amber-300 font-medium">Renewals</span>
              </div>
              <div className="text-[10px] text-foreground">
                <span className="font-semibold">3 certs</span> expiring
              </div>
              <div className="text-[9px] text-muted-foreground">next 30 days</div>
            </div>

            <div className="border border-border rounded-md p-2 bg-background">
              <div className="flex items-center gap-1 mb-1">
                <Check className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Auto-filed</span>
              </div>
              <div className="text-[10px] font-semibold text-foreground font-mono tabular-nums">
                182 reports
              </div>
              <div className="text-[9px] text-muted-foreground">this week, zero manual entry</div>
            </div>
          </div>
        </div>
      </div>

      {/* "After" label */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="absolute top-5 right-5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[9px] font-mono uppercase tracking-wider shadow-lg"
      >
        <Sparkles className="w-2.5 h-2.5" />
        Fluxo
      </motion.div>
    </div>
  );
}
