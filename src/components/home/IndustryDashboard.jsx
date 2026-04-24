import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Anchor, Wrench, UtensilsCrossed, FileCheck,
  Search, Filter, Plus, ArrowUpRight, ChevronRight, ChevronLeft,
  Pause, Ship, MapPin, Users2, Clock, Activity,
} from 'lucide-react';
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell,
} from 'recharts';

/**
 * IndustryDashboard
 * Auto-cycling dashboard with 4 visually distinct example workflows.
 * Each industry has a unique "signature widget" making the dashboards feel
 * catered to that operation. Arrows + dots + swipe + hover-pause for
 * manual control.
 */

const CYCLE_MS = 7000;

// ---------- DATA ----------

const INDUSTRIES = {
  marine: {
    label: 'Marine operations',
    Icon: Anchor,
    url: 'fluxo.app/marine-ops',
    primaryMetric: { label: 'Dive hours this week', value: '284', delta: '+18%' },
    kpis: [
      { label: 'Vessels in port', value: '12' },
      { label: 'Crew on shift', value: '47' },
      { label: 'Jobs open', value: '23' },
      { label: 'Compliance', value: '96%' },
    ],
    jobs: [
      { id: 'MR-481', title: 'Hull inspection — MV Horizon', meta: 'Dive Team A · Jurong', tag: 'Survey', status: 'progress' },
      { id: 'MR-480', title: 'Class renewal — Vessel 04', meta: 'QA Team · Drydock B', tag: 'Compliance', status: 'scheduled' },
      { id: 'MR-479', title: 'Propeller service — Oceanic', meta: 'Workshop 2 · Tuas', tag: 'Repair', status: 'progress' },
      { id: 'MR-478', title: 'Dive medical batch', meta: 'HR · 8 crew', tag: 'Cert', status: 'scheduled' },
    ],
    chartLabel: 'Dive hours · last 8 weeks',
    chartData: [
      { x: 'W10', v: 198 }, { x: 'W11', v: 221 }, { x: 'W12', v: 205 },
      { x: 'W13', v: 244 }, { x: 'W14', v: 238 }, { x: 'W15', v: 262 },
      { x: 'W16', v: 271 }, { x: 'W17', v: 284 },
    ],
    side: [
      { label: 'Expiring certs', value: '3', sub: 'next 30 days', tone: 'warn' },
      { label: 'Vessels > 48h', value: '2', sub: 'in port', tone: 'neutral' },
    ],
  },

  automotive: {
    label: 'Workshop management',
    Icon: Wrench,
    url: 'fluxo.app/workshop',
    primaryMetric: { label: 'Jobs completed this week', value: '142', delta: '+24%' },
    kpis: [
      { label: 'Bays occupied', value: '8/10' },
      { label: 'Technicians', value: '14' },
      { label: 'Orders open', value: '31' },
      { label: 'Avg turnaround', value: '2.3d' },
    ],
    jobs: [
      { id: 'WO-2041', title: 'Servicing — SJN 3421X', meta: 'Bay 3 · Tech SL', tag: 'Major', status: 'progress' },
      { id: 'WO-2040', title: 'Brake overhaul — SFD 882Y', meta: 'Bay 5 · Tech MR', tag: 'Repair', status: 'progress' },
      { id: 'WO-2039', title: 'Inspection — SMT 114K', meta: 'Walk-in · Advisor JT', tag: 'Inspection', status: 'scheduled' },
      { id: 'WO-2038', title: 'Parts fitment — SKZ 755G', meta: 'Bay 2 · waiting parts', tag: 'Repair', status: 'blocked' },
    ],
    chartLabel: 'Jobs completed · last 8 weeks',
    chartData: [
      { x: 'W10', v: 98 }, { x: 'W11', v: 112 }, { x: 'W12', v: 104 },
      { x: 'W13', v: 121 }, { x: 'W14', v: 118 }, { x: 'W15', v: 129 },
      { x: 'W16', v: 135 }, { x: 'W17', v: 142 },
    ],
    side: [
      { label: 'Parts low stock', value: '7', sub: 'SKUs', tone: 'warn' },
      { label: 'Invoices unpaid', value: '4', sub: '> 30 days', tone: 'alert' },
    ],
  },

  fnb: {
    label: 'F&B service',
    Icon: UtensilsCrossed,
    url: 'fluxo.app/dining-room',
    primaryMetric: { label: 'Covers served today', value: '186', delta: '+12%' },
    kpis: [
      { label: 'Tables active', value: '14/22' },
      { label: 'Staff on shift', value: '11' },
      { label: 'Kitchen tickets', value: '9' },
      { label: 'HACCP score', value: 'A' },
    ],
    jobs: [
      { id: 'T-12', title: 'Table 12 · dinner (6 pax)', meta: 'Server · A. Kumar', tag: 'Dine-in', status: 'progress' },
      { id: 'D-44', title: 'Delivery batch · GrabFood', meta: '5 orders queued', tag: 'Delivery', status: 'progress' },
      { id: 'T-07', title: 'Table 07 · birthday setup', meta: 'Server · L. Ng', tag: 'Reservation', status: 'scheduled' },
      { id: 'IV-31', title: 'Chicken thigh · restock', meta: 'Kitchen · low stock', tag: 'Inventory', status: 'blocked' },
    ],
    chartLabel: 'Covers served · last 8 days',
    chartData: [
      { x: 'Mon', v: 142 }, { x: 'Tue', v: 121 }, { x: 'Wed', v: 158 },
      { x: 'Thu', v: 164 }, { x: 'Fri', v: 201 }, { x: 'Sat', v: 222 },
      { x: 'Sun', v: 198 }, { x: 'Today', v: 186 },
    ],
    side: [
      { label: 'Low inventory', value: '4', sub: 'items', tone: 'warn' },
      { label: 'Avg ticket', value: '$38', sub: 'per cover', tone: 'neutral' },
    ],
  },

  insurance: {
    label: 'Claims processing',
    Icon: FileCheck,
    url: 'fluxo.app/claims',
    primaryMetric: { label: 'Claims cycle time', value: '6.2d', delta: '-18%' },
    kpis: [
      { label: 'Claims open', value: '38' },
      { label: 'Adjusters', value: '6' },
      { label: 'Payouts (wk)', value: '$142K' },
      { label: 'SLA hit rate', value: '94%' },
    ],
    jobs: [
      { id: 'CL-0521', title: 'Motor · collision — Jurong', meta: 'Adjuster · J. Tan', tag: 'Motor', status: 'progress' },
      { id: 'CL-0520', title: 'Property · water damage', meta: 'Adjuster · M. Rahman', tag: 'Property', status: 'progress' },
      { id: 'CL-0519', title: 'Health · hospital bill review', meta: 'Desk review', tag: 'Health', status: 'scheduled' },
      { id: 'CL-0518', title: 'Motor · total loss assessment', meta: 'Awaiting docs', tag: 'Motor', status: 'blocked' },
    ],
    chartLabel: 'Avg cycle time · last 8 weeks (days)',
    chartData: [
      { x: 'W10', v: 9.1 }, { x: 'W11', v: 8.4 }, { x: 'W12', v: 8.8 },
      { x: 'W13', v: 7.9 }, { x: 'W14', v: 7.5 }, { x: 'W15', v: 7.1 },
      { x: 'W16', v: 6.6 }, { x: 'W17', v: 6.2 },
    ],
    side: [
      { label: 'Pending docs', value: '11', sub: 'claims', tone: 'warn' },
      { label: 'Escalations', value: '2', sub: 'needs review', tone: 'alert' },
    ],
  },
};

const KEYS = Object.keys(INDUSTRIES);

const STATUS_STYLES = {
  progress: { dot: 'bg-blue-500', label: 'In progress', pill: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/30' },
  scheduled: { dot: 'bg-slate-400', label: 'Scheduled', pill: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:border-slate-500/30' },
  blocked: { dot: 'bg-amber-500', label: 'Blocked', pill: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30' },
  done: { dot: 'bg-emerald-500', label: 'Done', pill: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30' },
};

const TONE_STYLES = {
  ok: 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-500/30 dark:bg-emerald-500/10',
  warn: 'border-amber-200 bg-amber-50/40 dark:border-amber-500/30 dark:bg-amber-500/10',
  alert: 'border-red-200 bg-red-50/40 dark:border-red-500/30 dark:bg-red-500/10',
  neutral: 'border-border bg-card',
};

// ---------- SIGNATURE WIDGETS (per industry) ----------

function MarineWidget() {
  const vessels = [
    { name: 'MV Horizon', pos: 'Jurong · Berth 3', status: 'In port', dot: 'bg-emerald-500', eta: 'Docked' },
    { name: 'MV Victory', pos: 'Strait of Malacca', status: 'At sea', dot: 'bg-blue-500', eta: 'ETA 14 Apr' },
    { name: 'MV Pioneer', pos: 'Tuas · Drydock B', status: 'Drydock', dot: 'bg-amber-500', eta: '3 days left' },
    { name: 'MV Oceanic', pos: 'Sembawang', status: 'Refit', dot: 'bg-violet-500', eta: '12 days left' },
    { name: 'Vessel 04', pos: 'Jurong · Berth 7', status: 'In port', dot: 'bg-emerald-500', eta: 'Docked' },
    { name: 'Vessel 07', pos: 'Anchorage B', status: 'Anchored', dot: 'bg-sky-500', eta: '2h until berth' },
  ];
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Ship className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">Fleet tracker</span>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono">6 of 12 shown</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {vessels.map((v) => (
          <motion.div
            key={v.name}
            whileHover={{ y: -2 }}
            className="border border-border rounded-lg bg-card p-2.5 cursor-pointer"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <motion.span
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-1.5 h-1.5 rounded-full ${v.dot}`}
              />
              <span className="text-[10px] font-semibold text-foreground truncate">{v.name}</span>
            </div>
            <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
              <MapPin className="w-2.5 h-2.5" />
              <span className="truncate">{v.pos}</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-[9px] text-foreground font-medium">{v.status}</span>
              <span className="text-[9px] text-muted-foreground font-mono">{v.eta}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AutomotiveWidget() {
  const bays = [
    { id: 1, state: 'busy', job: 'SJN 3421X', tech: 'SL' },
    { id: 2, state: 'busy', job: 'SKZ 755G', tech: 'MR' },
    { id: 3, state: 'busy', job: 'SFD 882Y', tech: 'JT' },
    { id: 4, state: 'free' },
    { id: 5, state: 'busy', job: 'SDA 901W', tech: 'AK' },
    { id: 6, state: 'busy', job: 'SNG 114K', tech: 'CW' },
    { id: 7, state: 'free' },
    { id: 8, state: 'busy', job: 'SLK 220D', tech: 'LN' },
    { id: 9, state: 'busy', job: 'SPA 331F', tech: 'SL' },
    { id: 10, state: 'busy', job: 'SMP 664T', tech: 'MR' },
  ];
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Wrench className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">Workshop bays</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-muted-foreground">8 busy</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">2 free</span>
          </span>
        </div>
      </div>
      <div className="grid grid-cols-5 sm:grid-cols-5 gap-1.5">
        {bays.map((bay) => (
          <motion.div
            key={bay.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: bay.id * 0.03 }}
            className={`relative aspect-[4/3] rounded-md border p-1.5 flex flex-col justify-between ${
              bay.state === 'busy'
                ? 'border-primary/40 bg-primary/10'
                : 'border-dashed border-emerald-500/40 bg-emerald-500/5'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono font-semibold text-foreground">B{bay.id}</span>
              {bay.state === 'busy' && (
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1 h-1 rounded-full bg-primary"
                />
              )}
            </div>
            {bay.state === 'busy' ? (
              <div>
                <div className="text-[9px] font-semibold text-foreground leading-tight truncate">{bay.job}</div>
                <div className="text-[8px] text-muted-foreground">Tech {bay.tech}</div>
              </div>
            ) : (
              <div className="text-[8px] text-emerald-600 dark:text-emerald-400 font-medium">Available</div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function FnbWidget() {
  // Floor plan grid — table statuses
  const tables = [
    { n: 1, state: 'occupied', pax: '4/4' },
    { n: 2, state: 'occupied', pax: '2/4' },
    { n: 3, state: 'free' },
    { n: 4, state: 'reserved' },
    { n: 5, state: 'occupied', pax: '6/6' },
    { n: 6, state: 'cleaning' },
    { n: 7, state: 'occupied', pax: '3/4' },
    { n: 8, state: 'free' },
    { n: 9, state: 'occupied', pax: '2/2' },
    { n: 10, state: 'reserved' },
    { n: 11, state: 'occupied', pax: '5/6' },
    { n: 12, state: 'occupied', pax: '4/6' },
    { n: 13, state: 'free' },
    { n: 14, state: 'occupied', pax: '4/4' },
  ];
  const styles = {
    occupied: 'bg-primary/15 border-primary/50 text-foreground',
    free: 'bg-emerald-500/5 border-emerald-500/40 text-emerald-600 dark:text-emerald-400',
    reserved: 'bg-violet-500/10 border-violet-500/40 text-violet-600 dark:text-violet-400',
    cleaning: 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400',
  };
  const labels = { occupied: 'Dining', free: 'Free', reserved: 'Reserved', cleaning: 'Cleaning' };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">Floor plan · main dining</span>
        </div>
        <div className="flex items-center gap-2 text-[9px]">
          {Object.entries(labels).map(([k, v]) => (
            <span key={k} className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${
                k === 'occupied' ? 'bg-primary' :
                k === 'free' ? 'bg-emerald-500' :
                k === 'reserved' ? 'bg-violet-500' : 'bg-amber-500'
              }`} />
              <span className="text-muted-foreground">{v}</span>
            </span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-5 sm:grid-cols-7 gap-1.5">
        {tables.map((t) => (
          <motion.div
            key={t.n}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: t.n * 0.02 }}
            className={`aspect-square rounded-md border flex flex-col items-center justify-center ${styles[t.state]}`}
          >
            <span className="text-[10px] font-bold font-mono">T{t.n}</span>
            {t.pax && <span className="text-[8px]">{t.pax}</span>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function InsuranceWidget() {
  const stages = [
    { key: 'filed', label: 'Filed', count: 38, color: 'bg-slate-400' },
    { key: 'review', label: 'Review', count: 27, color: 'bg-blue-500' },
    { key: 'adjust', label: 'Adjusting', count: 18, color: 'bg-violet-500' },
    { key: 'approve', label: 'Approved', count: 11, color: 'bg-emerald-500' },
    { key: 'paid', label: 'Paid', count: 9, color: 'bg-foreground' },
  ];
  const max = stages[0].count;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">Claims pipeline · this week</span>
        </div>
        <span className="text-[10px] text-muted-foreground">Avg cycle 6.2d</span>
      </div>
      <div className="flex items-end gap-2 h-28">
        {stages.map((s, i) => (
          <React.Fragment key={s.key}>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: i * 0.1 }}
              className="flex-1 flex flex-col items-center justify-end"
            >
              <div className="text-sm font-bold font-mono text-foreground mb-1">{s.count}</div>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(s.count / max) * 80}px` }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={`w-full rounded-t-md ${s.color}`}
              />
              <div className="text-[9px] text-muted-foreground mt-1 text-center">{s.label}</div>
            </motion.div>
            {i < stages.length - 1 && (
              <ChevronRight className="w-3 h-3 text-muted-foreground/50 mb-6" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

const WIDGETS = {
  marine: MarineWidget,
  automotive: AutomotiveWidget,
  fnb: FnbWidget,
  insurance: InsuranceWidget,
};

// ---------- SHARED ----------

function JobRow({ job, selected, onClick }) {
  const s = STATUS_STYLES[job.status];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors border-l-2 ${
        selected ? 'bg-primary/5 border-primary' : 'border-transparent hover:bg-muted/40'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} flex-shrink-0`} />
      <div className="font-mono text-[10px] text-muted-foreground w-16 flex-shrink-0">{job.id}</div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-foreground truncate">{job.title}</div>
        <div className="text-[10px] text-muted-foreground truncate">{job.meta}</div>
      </div>
      <div className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground flex-shrink-0 hidden sm:block">
        {job.tag}
      </div>
      <div className={`text-[9px] font-medium px-1.5 py-0.5 rounded border ${s.pill} flex-shrink-0`}>
        {s.label}
      </div>
    </button>
  );
}

// ---------- MAIN ----------

export default function IndustryDashboard() {
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const startRef = useRef(Date.now());
  const activeKey = KEYS[idx];
  const industry = INDUSTRIES[activeKey];
  const Widget = WIDGETS[activeKey];
  const [selectedJobId, setSelectedJobId] = useState(industry.jobs[0].id);

  useEffect(() => {
    if (paused) return;
    startRef.current = Date.now();
    setProgress(0);

    const tickId = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      setProgress(Math.min(1, elapsed / CYCLE_MS));
    }, 50);

    const nextId = setTimeout(() => {
      setDirection(1);
      setIdx((i) => (i + 1) % KEYS.length);
    }, CYCLE_MS);

    return () => {
      clearInterval(tickId);
      clearTimeout(nextId);
    };
  }, [idx, paused]);

  useEffect(() => {
    setSelectedJobId(INDUSTRIES[activeKey].jobs[0].id);
  }, [activeKey]);

  const goPrev = () => {
    setDirection(-1);
    setPaused(true);
    setIdx((i) => (i - 1 + KEYS.length) % KEYS.length);
  };
  const goNext = () => {
    setDirection(1);
    setPaused(true);
    setIdx((i) => (i + 1) % KEYS.length);
  };
  const jumpTo = (i) => {
    setDirection(i > idx ? 1 : -1);
    setPaused(true);
    setIdx(i);
  };

  // Swipe handler with velocity + offset threshold
  const handleDragEnd = (_, info) => {
    const swipe = info.offset.x * Math.max(1, Math.abs(info.velocity.x) / 500);
    if (swipe < -80) goNext();
    else if (swipe > 80) goPrev();
  };

  // Slide variants for directional transitions
  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div
      className="rounded-xl bg-card border border-border shadow-2xl overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Browser chrome */}
      <div className="h-8 bg-muted/60 border-b border-border flex items-center gap-1.5 px-3">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
        <div className="flex-1 flex justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={industry.url}
              initial={{ opacity: 0, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 3 }}
              transition={{ duration: 0.2 }}
              className="bg-background/80 rounded px-2 py-0.5 text-[10px] text-muted-foreground font-mono"
            >
              {industry.url}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Caption band with arrow nav + dots */}
      <div className="px-3 py-2 border-b border-border flex items-center gap-2 bg-muted/20">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous example"
          className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-center">
          <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground flex-shrink-0 hidden sm:inline">
            Built for
          </span>
          <AnimatePresence mode="wait">
            <motion.div
              key={industry.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-1.5 min-w-0"
            >
              <industry.Icon className="w-3.5 h-3.5 text-primary flex-shrink-0" strokeWidth={2} />
              <span className="text-xs font-semibold text-foreground truncate">{industry.label}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          {paused && (
            <span className="flex items-center gap-1 text-[9px] text-muted-foreground">
              <Pause className="w-2.5 h-2.5" strokeWidth={2} />
              <span className="font-mono hidden sm:inline">paused</span>
            </span>
          )}
          <div className="flex items-center gap-1.5">
            {KEYS.map((key, i) => {
              const isActive = i === idx;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => jumpTo(i)}
                  aria-label={`Show ${INDUSTRIES[key].label}`}
                  className="group relative h-2 flex items-center"
                >
                  <span
                    className={`block rounded-full transition-all duration-500 ${
                      isActive
                        ? 'w-6 h-1 bg-muted'
                        : 'w-1 h-1 bg-muted-foreground/40 group-hover:bg-muted-foreground/70'
                    }`}
                  />
                  {isActive && !paused && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full transition-none"
                      style={{ width: `${progress * 24}px` }}
                    />
                  )}
                  {isActive && paused && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-6 bg-primary rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next example"
          className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Dashboard body — swipeable carousel */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.35}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        whileDrag={{ cursor: 'grabbing' }}
        className="bg-background cursor-grab touch-pan-y select-none"
      >
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={activeKey}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Top header with primary metric + KPIs */}
            <div className="p-5 border-b border-border flex flex-col md:flex-row md:items-end gap-4 md:gap-8">
              <div className="flex-shrink-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                  {industry.primaryMetric.label}
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl md:text-4xl font-bold text-foreground font-mono tabular-nums tracking-tight">
                    {industry.primaryMetric.value}
                  </div>
                  <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {industry.primaryMetric.delta}
                  </div>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                {industry.kpis.map((kpi) => (
                  <div key={kpi.label} className="border-l border-border pl-3">
                    <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
                      {kpi.label}
                    </div>
                    <div className="text-base font-semibold text-foreground font-mono tabular-nums mt-0.5">
                      {kpi.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Signature widget (unique per industry) */}
            <div className="border-b border-border">
              <Widget />
            </div>

            {/* Bottom row: jobs + chart/side */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] min-h-[220px]">
              <div className="border-r border-border">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-foreground">Active operations</span>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Filter className="w-3 h-3" />
                      All
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/60 border border-border text-[10px] text-muted-foreground">
                      <Search className="w-3 h-3" />
                      <span className="font-mono hidden sm:inline">⌘K</span>
                    </div>
                    <button className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-foreground text-background text-[10px] font-medium">
                      <Plus className="w-3 h-3" strokeWidth={2.5} />
                      New
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-border/60">
                  {industry.jobs.map((job) => (
                    <JobRow
                      key={job.id}
                      job={job}
                      selected={selectedJobId === job.id}
                      onClick={() => setSelectedJobId(job.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] font-semibold text-foreground">{industry.chartLabel}</div>
                    <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <div className="h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={industry.chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                        <XAxis
                          dataKey="x"
                          tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis hide />
                        <Tooltip
                          cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
                          contentStyle={{
                            fontSize: 10,
                            padding: '4px 8px',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: 4,
                            background: 'hsl(var(--background))',
                          }}
                        />
                        <Bar dataKey="v" radius={[3, 3, 0, 0]}>
                          {industry.chartData.map((_, i) => (
                            <Cell
                              key={i}
                              fill={
                                i === industry.chartData.length - 1
                                  ? 'hsl(var(--primary))'
                                  : 'hsl(var(--primary) / 0.35)'
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-2 flex-1">
                  {industry.side.map((item) => (
                    <div key={item.label} className={`border rounded-md px-3 py-2 ${TONE_STYLES[item.tone]}`}>
                      <div className="flex items-baseline justify-between">
                        <div className="text-[10px] text-muted-foreground">{item.label}</div>
                        <div className="text-sm font-semibold text-foreground font-mono tabular-nums">
                          {item.value}
                        </div>
                      </div>
                      <div className="text-[9px] text-muted-foreground mt-0.5">{item.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
