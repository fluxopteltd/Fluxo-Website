import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid, CalendarDays, Users, ShieldCheck, LayoutDashboard, Gauge, Activity,
  Search, Plus, Bell, ChevronDown, Circle, Clock, CheckCircle2, AlertCircle,
  Anchor, Wrench, FileCheck, TrendingUp, X, Check, Calendar, Ship, UserCircle, Flag,
  Briefcase,
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis } from 'recharts';

/**
 * LiveOpsMockup
 * Interactive miniature "operations dashboard" for the homepage hero.
 * Sidebar is clickable — each view swaps the main panel. Ambient motion
 * continues in all views for the "live product" feel.
 */

const VIEWS = {
  dashboard: { Icon: LayoutDashboard, label: 'Dashboard' },
  overview: { Icon: Briefcase, label: 'Operations' },
  schedule: { Icon: CalendarDays, label: 'Schedule' },
  equipment: { Icon: Wrench, label: 'Equipment' },
  teams: { Icon: Users, label: 'Teams' },
  compliance: { Icon: ShieldCheck, label: 'Compliance' },
};

// ---------- Shared bits ----------

function NavItem({ Icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`w-full flex items-center gap-2 px-1.5 sm:px-2.5 py-1.5 rounded-md text-[11px] transition-colors text-left ${
        active
          ? 'bg-primary/10 text-primary font-medium'
          : 'text-muted-foreground hover:bg-muted/60'
      }`}
    >
      <Icon className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} />
      <span className="hidden sm:inline">{label}</span>
      {active && <span className="ml-auto hidden sm:inline-block w-1 h-1 rounded-full bg-primary" />}
    </button>
  );
}

function MiniStat({ label, value, trend }) {
  return (
    <div className="flex-1 px-3 py-2 rounded-md border border-border/70 bg-background/70">
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="flex items-baseline gap-1.5 mt-0.5">
        <div className="text-sm font-semibold text-foreground font-mono tabular-nums">{value}</div>
        {trend && <div className="text-[9px] text-emerald-600 font-medium">{trend}</div>}
      </div>
    </div>
  );
}

function LiveChart() {
  const [data, setData] = useState(() =>
    Array.from({ length: 14 }, (_, i) => ({
      x: i,
      v: 40 + Math.sin(i / 2) * 20 + Math.random() * 10,
    }))
  );

  useEffect(() => {
    const id = setInterval(() => {
      setData((prev) => {
        const next = prev.slice(1).map((p, i) => ({ ...p, x: i }));
        const last = prev[prev.length - 1];
        next.push({
          x: next.length,
          v: Math.max(20, Math.min(90, last.v + (Math.random() - 0.5) * 18)),
        });
        return next;
      });
    }, 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="fluxoArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="x" hide />
        <YAxis domain={[0, 100]} hide />
        <Area
          type="monotone"
          dataKey="v"
          stroke="hsl(var(--primary))"
          strokeWidth={1.8}
          fill="url(#fluxoArea)"
          isAnimationActive
          animationDuration={700}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ---------- OVERVIEW VIEW ----------

const STATUS_CYCLE = [
  { key: 'scheduled', label: 'Scheduled', cls: 'bg-slate-100 text-slate-700 border-slate-200', Icon: Clock },
  { key: 'in-progress', label: 'In progress', cls: 'bg-blue-50 text-blue-700 border-blue-200', Icon: Circle },
  { key: 'completed', label: 'Completed', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', Icon: CheckCircle2 },
];

const INITIAL_JOBS = [
  { id: 'OP-184', title: 'Hull inspection', vessel: 'MV Horizon', team: 'Dive Team A', due: 'Today · 14:00', statusIdx: 1, progress: 60, tasksDone: 5, tasks: 8, priority: 'high', assignees: ['JT', 'MR'] },
  { id: 'OP-183', title: 'Refit survey', vessel: 'Vessel 04', team: 'Marine Ops', due: 'Tue · 09:00', statusIdx: 0, progress: 0, tasksDone: 0, tasks: 12, priority: 'med', assignees: ['SL'] },
  { id: 'OP-182', title: 'Compliance audit Q2', vessel: 'All fleet', team: 'QA Team', due: 'Wed · 16:00', statusIdx: 1, progress: 35, tasksDone: 2, tasks: 6, priority: 'high', assignees: ['AK', 'LN'] },
  { id: 'OP-181', title: 'Dry dock prep', vessel: 'Vessel 12', team: 'Yard Crew', due: 'Completed', statusIdx: 2, progress: 100, tasksDone: 10, tasks: 10, priority: 'low', assignees: ['CW'] },
  { id: 'OP-180', title: 'Emergency drill', vessel: 'MV Victory', team: 'Dive Team B', due: 'Fri · 08:00', statusIdx: 0, progress: 0, tasksDone: 0, tasks: 4, priority: 'med', assignees: ['MR', 'SL'] },
];

const NEW_OP_TEMPLATES = [
  { title: 'Engine overhaul', vessel: 'MV Pioneer', team: 'Workshop', due: 'Mon · 10:00', priority: 'med' },
  { title: 'Bottom survey', vessel: 'Vessel 07', team: 'Dive Team A', due: 'Thu · 08:00', priority: 'high' },
  { title: 'Anode replacement', vessel: 'MV Horizon', team: 'Dive Team B', due: 'Sat · 09:00', priority: 'low' },
];

function StatusPill({ statusIdx }) {
  const s = STATUS_CYCLE[statusIdx];
  const { Icon } = s;
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={s.key}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        transition={{ duration: 0.25 }}
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium border ${s.cls}`}
      >
        <Icon className="w-2.5 h-2.5" strokeWidth={2.5} />
        {s.label}
      </motion.div>
    </AnimatePresence>
  );
}

function ComplianceMeter({ value }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-muted-foreground">Compliance</span>
        <span className="font-mono font-medium text-foreground">{value}%</span>
      </div>
      <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-[hsl(var(--fluxo-cyan))] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'progress', label: 'In progress', statusIdx: 1 },
  { key: 'scheduled', label: 'Scheduled', statusIdx: 0 },
  { key: 'completed', label: 'Completed', statusIdx: 2 },
];

const PRIORITY_STYLES = {
  high: { dot: 'bg-red-500', label: 'High' },
  med: { dot: 'bg-amber-500', label: 'Medium' },
  low: { dot: 'bg-slate-400', label: 'Low' },
};

function DefaultStats({ tick, compliance, completedToday }) {
  return (
    <div className="flex flex-col gap-2.5 h-full">
      <div className="border border-border/70 rounded-md bg-card p-2.5">
        <div className="text-[9px] uppercase tracking-wider text-muted-foreground">This week</div>
        <div className="flex items-baseline gap-1 mt-0.5">
          <motion.div
            key={completedToday}
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-base font-semibold text-foreground font-mono tabular-nums"
          >
            {completedToday}
          </motion.div>
          <span className="text-[9px] text-muted-foreground">completed</span>
        </div>
      </div>
      <div className="border border-border/70 rounded-md bg-card p-2.5 flex flex-col flex-1 min-h-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] font-semibold text-foreground">Throughput</span>
          <span className="text-[9px] text-emerald-600 font-mono">▲ 12%</span>
        </div>
        <div className="flex-1 min-h-0">
          <LiveChart />
        </div>
      </div>
      <div className="border border-border/70 rounded-md bg-card p-2.5">
        <ComplianceMeter value={compliance} />
        <div className="mt-1.5 flex items-center gap-1 text-[9px] text-muted-foreground">
          <AlertCircle className="w-2.5 h-2.5" />
          1 cert expiring
        </div>
      </div>
    </div>
  );
}

function OperationDetail({ op, onBack }) {
  const status = STATUS_CYCLE[op.statusIdx];
  const [checklistDone, setChecklistDone] = useState(op.tasksDone);

  useEffect(() => {
    if (op.statusIdx !== 1) return;
    const id = setInterval(() => {
      setChecklistDone((c) => (c < op.tasks ? c + 1 : c));
    }, 3500);
    return () => clearInterval(id);
  }, [op.statusIdx, op.tasks]);

  const checklistItems = [
    { label: 'Pre-dive safety brief', done: true },
    { label: 'Equipment inventory check', done: true },
    { label: 'Underwater survey', done: checklistDone >= 3 },
    { label: 'Photo documentation', done: checklistDone >= 4 },
    { label: 'Debrief + logbook', done: checklistDone >= 5 },
  ];

  return (
    <div className="flex flex-col h-full gap-2.5">
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onBack}
          className="p-0.5 rounded hover:bg-muted/60 text-muted-foreground"
        >
          <X className="w-3 h-3" />
        </button>
        <span className="font-mono text-[9px] text-muted-foreground">{op.id}</span>
        <span className={`ml-auto inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium border ${status.cls}`}>
          {status.label}
        </span>
      </div>

      <div>
        <div className="text-[11px] font-semibold text-foreground leading-tight">{op.title}</div>
        <div className="text-[9px] text-muted-foreground mt-0.5">{op.vessel}</div>
      </div>

      <div className="space-y-1 text-[9px]">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <UserCircle className="w-2.5 h-2.5" />
          <span className="text-foreground">{op.team}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="w-2.5 h-2.5" />
          <span className="text-foreground">{op.due}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Flag className="w-2.5 h-2.5" />
          <span className="text-foreground">{PRIORITY_STYLES[op.priority].label}</span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between text-[9px] mb-1">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-mono text-foreground">{checklistDone}/{op.tasks}</span>
        </div>
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-[hsl(var(--fluxo-cyan))]"
            initial={false}
            animate={{ width: `${(checklistDone / op.tasks) * 100}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1 flex-1 min-h-0 overflow-auto">
        <div className="text-[9px] font-semibold text-foreground">Checklist</div>
        {checklistItems.map((item, i) => (
          <motion.div
            key={i}
            layout
            className="flex items-center gap-1.5 text-[9px]"
          >
            <div className={`w-3 h-3 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
              item.done
                ? 'bg-primary border-primary'
                : 'border-border bg-background'
            }`}>
              {item.done && <Check className="w-2 h-2 text-background" strokeWidth={3} />}
            </div>
            <span className={item.done ? 'text-muted-foreground line-through' : 'text-foreground'}>
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center -space-x-1">
        {op.assignees.map((a) => (
          <div
            key={a}
            className="w-5 h-5 rounded-full bg-gradient-to-br from-muted to-muted/60 border-2 border-background flex items-center justify-center text-[8px] font-semibold text-foreground"
          >
            {a}
          </div>
        ))}
      </div>
    </div>
  );
}

const VESSEL_OPTIONS = ['MV Horizon', 'MV Victory', 'MV Pioneer', 'Vessel 04', 'Vessel 07', 'MV Oceanic'];
const TEAM_OPTIONS = ['Dive Team A', 'Dive Team B', 'Marine Ops', 'Workshop', 'QA / Compliance', 'Yard Crew'];
const DUE_OPTIONS = ['Today · 14:00', 'Tomorrow · 09:00', 'Thu · 08:00', 'Fri · 10:00', 'Next Mon · 09:00'];

function CycleButton({ Icon, options, value, onChange }) {
  const idx = options.indexOf(value);
  const handleClick = () => {
    const next = options[(idx + 1) % options.length];
    onChange(next);
  };
  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full mt-0.5 px-1.5 py-1 rounded border border-border/70 bg-background text-[10px] text-foreground text-left flex items-center gap-1 hover:border-primary/50 transition-colors"
      title="Click to change"
    >
      <Icon className="w-2.5 h-2.5 text-muted-foreground flex-shrink-0" />
      <span className="truncate">{value}</span>
      <ChevronDown className="w-2.5 h-2.5 text-muted-foreground ml-auto flex-shrink-0" />
    </button>
  );
}

function CreateOpForm({ onCreate, onCancel }) {
  const [title, setTitle] = useState('');
  const [vessel, setVessel] = useState(VESSEL_OPTIONS[0]);
  const [team, setTeam] = useState(TEAM_OPTIONS[0]);
  const [due, setDue] = useState(DUE_OPTIONS[0]);
  const [priority, setPriority] = useState('med');

  const submit = () => {
    onCreate({
      title: title.trim() || 'Untitled operation',
      vessel,
      team,
      due,
      priority,
    });
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') submit();
    else if (e.key === 'Escape') onCancel();
  };

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-semibold text-foreground">New operation</span>
        <button
          type="button"
          onClick={onCancel}
          className="ml-auto p-0.5 rounded hover:bg-muted/60 text-muted-foreground"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-1.5">
        <div>
          <label className="text-[8px] uppercase tracking-wider text-muted-foreground">Title</label>
          <input
            type="text"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="e.g. Hull inspection"
            className="w-full mt-0.5 px-1.5 py-1 rounded border border-border/70 bg-background text-[10px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="text-[8px] uppercase tracking-wider text-muted-foreground">Vessel</label>
          <CycleButton Icon={Ship} options={VESSEL_OPTIONS} value={vessel} onChange={setVessel} />
        </div>

        <div>
          <label className="text-[8px] uppercase tracking-wider text-muted-foreground">Team</label>
          <CycleButton Icon={UserCircle} options={TEAM_OPTIONS} value={team} onChange={setTeam} />
        </div>

        <div>
          <label className="text-[8px] uppercase tracking-wider text-muted-foreground">Due</label>
          <CycleButton Icon={Calendar} options={DUE_OPTIONS} value={due} onChange={setDue} />
        </div>

        <div>
          <label className="text-[8px] uppercase tracking-wider text-muted-foreground">Priority</label>
          <div className="flex gap-1 mt-0.5">
            {Object.entries(PRIORITY_STYLES).map(([key, p]) => (
              <button
                key={key}
                type="button"
                onClick={() => setPriority(key)}
                className={`flex-1 px-1 py-1 rounded border text-[9px] flex items-center justify-center gap-1 ${
                  priority === key
                    ? 'border-primary bg-primary/5 text-foreground'
                    : 'border-border/70 bg-background text-muted-foreground hover:border-primary/40'
                }`}
              >
                <span className={`w-1 h-1 rounded-full ${p.dot}`} />
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto flex gap-1.5">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-2 py-1.5 rounded border border-border/70 text-[10px] font-medium text-foreground hover:bg-muted/60"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={submit}
          className="flex-1 px-2 py-1.5 rounded bg-foreground text-background text-[10px] font-medium hover:bg-foreground/90"
        >
          Create
        </button>
      </div>
    </div>
  );
}

function OverviewView() {
  const [ops, setOps] = useState(INITIAL_JOBS);
  const [tick, setTick] = useState(0);
  const [compliance, setCompliance] = useState(94);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const id = setInterval(() => {
      setOps((prev) => {
        const [head, ...rest] = prev;
        const nextIdx = (head.statusIdx + 1) % STATUS_CYCLE.length;
        const progress = nextIdx === 0 ? 0 : nextIdx === 1 ? 60 : 100;
        return [{ ...head, statusIdx: nextIdx, progress }, ...rest];
      });
      setTick((t) => t + 1);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setCompliance((c) => Math.max(88, Math.min(99, c + (Math.random() > 0.5 ? 1 : -1))));
    }, 3200);
    return () => clearInterval(id);
  }, []);

  const completedToday = useMemo(() => 17 + (tick % 4), [tick]);

  const filtered = useMemo(() => {
    if (filter === 'all') return ops;
    const f = FILTERS.find((x) => x.key === filter);
    if (!f) return ops;
    return ops.filter((o) => o.statusIdx === f.statusIdx);
  }, [ops, filter]);

  const selected = selectedId && selectedId !== 'new' ? ops.find((o) => o.id === selectedId) : null;

  const handleCreate = (form) => {
    const nextNum = 185 + (ops.length - INITIAL_JOBS.length);
    const newOp = {
      id: `OP-${nextNum}`,
      title: form.title,
      vessel: form.vessel,
      team: form.team,
      due: form.due,
      statusIdx: 0,
      progress: 0,
      tasksDone: 0,
      tasks: 6,
      priority: form.priority,
      assignees: ['JT'],
    };
    setOps((prev) => [newOp, ...prev]);
    setSelectedId(newOp.id);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Filter + actions row */}
      <div className="px-2 sm:px-3 py-2 flex items-center gap-1 border-b border-border/60 overflow-x-auto">
        <div className="flex items-center gap-1 flex-shrink-0">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] font-medium transition-colors whitespace-nowrap ${
                filter === f.key
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-muted/60'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted/60 border border-border/70 text-[9px] text-muted-foreground">
            <Search className="w-2.5 h-2.5" />
            <span className="font-mono">⌘K</span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedId('new')}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-foreground text-background text-[10px] font-medium hover:bg-foreground/90 transition-colors whitespace-nowrap"
          >
            <Plus className="w-2.5 h-2.5" strokeWidth={2.5} />
            <span className="hidden sm:inline">New operation</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_200px] min-h-0 relative">
        {/* Operations list */}
        <div className={`overflow-auto sm:border-r border-border/60 ${
          selectedId ? 'hidden sm:block' : ''
        }`}>
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-[10px] text-muted-foreground">
              No operations match this filter.
            </div>
          ) : (
            filtered.map((op) => {
              const isSelected = op.id === selectedId;
              const prStyle = PRIORITY_STYLES[op.priority];
              return (
                <motion.button
                  key={op.id}
                  layout
                  type="button"
                  onClick={() => setSelectedId(op.id)}
                  className={`w-full px-3 py-2 flex items-center gap-2 text-left border-l-2 transition-colors ${
                    isSelected
                      ? 'bg-primary/5 border-primary'
                      : 'border-transparent hover:bg-muted/30'
                  }`}
                >
                  <span className={`w-1 h-1 rounded-full ${prStyle.dot} flex-shrink-0`} />
                  <div className="font-mono text-[9px] text-muted-foreground w-11 flex-shrink-0">
                    {op.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-medium text-foreground truncate">
                      {op.title}
                    </div>
                    <div className="text-[9px] text-muted-foreground truncate">
                      {op.vessel} · {op.team}
                    </div>
                  </div>
                  <div className="text-[9px] text-muted-foreground font-mono flex-shrink-0 hidden md:block">
                    {op.due}
                  </div>
                  <StatusPill statusIdx={op.statusIdx} />
                </motion.button>
              );
            })
          )}
        </div>

        {/* Right panel — morphs (takes full width on mobile when selected) */}
        <div className={`p-3 min-h-0 overflow-hidden sm:block ${
          selectedId ? 'block' : 'hidden sm:block'
        }`}>
          <AnimatePresence mode="wait">
            {selectedId === 'new' ? (
              <motion.div
                key="create"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.25 }}
                className="h-full"
              >
                <CreateOpForm
                  onCreate={handleCreate}
                  onCancel={() => setSelectedId(null)}
                />
              </motion.div>
            ) : selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.25 }}
                className="h-full"
              >
                <OperationDetail op={selected} onBack={() => setSelectedId(null)} />
              </motion.div>
            ) : (
              <motion.div
                key="stats"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <DefaultStats
                  tick={tick}
                  compliance={compliance}
                  completedToday={completedToday}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ---------- SCHEDULE VIEW (mini kanban) ----------

const KANBAN_COLUMNS = [
  { id: 'backlog', label: 'Backlog', accent: 'bg-slate-400' },
  { id: 'inprogress', label: 'In progress', accent: 'bg-primary' },
  { id: 'done', label: 'Done', accent: 'bg-emerald-500' },
];

const KANBAN_SEED = [
  { id: 'J-21', title: 'Hull inspection', priority: 'high', col: 'inprogress', team: 'Dive A' },
  { id: 'J-22', title: 'Compressor service', priority: 'med', col: 'backlog', team: 'Workshop' },
  { id: 'J-23', title: 'Cert renewal batch', priority: 'low', col: 'backlog', team: 'QA' },
  { id: 'J-24', title: 'Yard safety audit', priority: 'med', col: 'inprogress', team: 'Ops' },
  { id: 'J-25', title: 'Client report — Jurong', priority: 'high', col: 'done', team: 'PM' },
  { id: 'J-26', title: 'Weekly roster', priority: 'low', col: 'done', team: 'HR' },
];

const NEW_JOB_TEMPLATES = [
  { title: 'Anode replacement', team: 'Dive B', priority: 'med' },
  { title: 'Class survey prep', team: 'QA', priority: 'high' },
  { title: 'Gearbox teardown', team: 'Workshop', priority: 'med' },
  { title: 'Crew rotation plan', team: 'HR', priority: 'low' },
  { title: 'Vendor PO review', team: 'PM', priority: 'low' },
];

function ScheduleView() {
  const [cards, setCards] = useState(KANBAN_SEED);
  const [addIdx, setAddIdx] = useState(0);

  // Periodically move one card forward
  useEffect(() => {
    const id = setInterval(() => {
      setCards((prev) => {
        const movable = prev.find((c) => c.col !== 'done');
        if (!movable) return prev;
        const nextCol =
          movable.col === 'backlog' ? 'inprogress' : movable.col === 'inprogress' ? 'done' : 'done';
        return prev.map((c) => (c.id === movable.id ? { ...c, col: nextCol } : c));
      });
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const handleAddJob = () => {
    const template = NEW_JOB_TEMPLATES[addIdx % NEW_JOB_TEMPLATES.length];
    setAddIdx((i) => i + 1);
    setCards((prev) => [
      { id: `J-${27 + addIdx}`, col: 'backlog', ...template },
      ...prev,
    ]);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-4 pt-4 pb-3 flex items-end justify-between">
        <div>
          <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
            Sprint · Week 17
          </div>
          <div className="text-sm font-semibold text-foreground">Active schedule</div>
        </div>
        <button
          type="button"
          onClick={handleAddJob}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-foreground text-background text-[10px] font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3 h-3" strokeWidth={2.5} />
          Add job
        </button>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-2 px-4 pb-4 min-h-0">
        {KANBAN_COLUMNS.map((col) => {
          const colCards = cards.filter((c) => c.col === col.id);
          return (
            <div
              key={col.id}
              className="border border-border/70 rounded-lg bg-muted/20 flex flex-col min-h-0"
            >
              <div className="px-2 py-1.5 flex items-center gap-1.5 border-b border-border/50">
                <span className={`w-1.5 h-1.5 rounded-full ${col.accent}`} />
                <span className="text-[10px] font-semibold text-foreground">{col.label}</span>
                <span className="ml-auto text-[9px] text-muted-foreground font-mono">
                  {colCards.length}
                </span>
              </div>
              <div className="p-1.5 flex flex-col gap-1.5 flex-1 overflow-hidden">
                <AnimatePresence>
                  {colCards.map((card) => (
                    <motion.div
                      key={card.id}
                      layout
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="bg-background border border-border/70 rounded-md p-2 cursor-pointer hover:border-primary/50 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-mono text-[8px] text-muted-foreground">{card.id}</span>
                        <span
                          className={`w-1 h-1 rounded-full ${
                            card.priority === 'high'
                              ? 'bg-red-500'
                              : card.priority === 'med'
                                ? 'bg-amber-500'
                                : 'bg-slate-400'
                          }`}
                        />
                      </div>
                      <div className="text-[10px] font-medium text-foreground leading-tight">
                        {card.title}
                      </div>
                      <div className="text-[9px] text-muted-foreground mt-1">{card.team}</div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- TEAMS VIEW ----------

const TEAM_MEMBERS = [
  { id: 'JT', name: 'J. Tan', role: 'Dive Lead', status: 'on-shift', certs: 4 },
  { id: 'MR', name: 'M. Rahman', role: 'Marine Ops', status: 'on-shift', certs: 5 },
  { id: 'SL', name: 'S. Lim', role: 'Workshop', status: 'on-shift', certs: 3 },
  { id: 'AK', name: 'A. Kumar', role: 'QA Audit', status: 'off', certs: 6 },
  { id: 'CW', name: 'C. Wong', role: 'Yard Crew', status: 'on-shift', certs: 2 },
  { id: 'LN', name: 'L. Ng', role: 'PM', status: 'leave', certs: 3 },
];

const STATUS_COLORS = {
  'on-shift': { dot: 'bg-emerald-500', label: 'On shift', pill: 'text-emerald-700 bg-emerald-50' },
  off: { dot: 'bg-slate-300', label: 'Off', pill: 'text-slate-600 bg-slate-100' },
  leave: { dot: 'bg-amber-400', label: 'Leave', pill: 'text-amber-700 bg-amber-50' },
};

function TeamsView() {
  const [members, setMembers] = useState(TEAM_MEMBERS);
  const [selectedId, setSelectedId] = useState('JT');

  // Occasionally toggle one status
  useEffect(() => {
    const id = setInterval(() => {
      setMembers((prev) => {
        const i = Math.floor(Math.random() * prev.length);
        const cur = prev[i].status;
        const next = cur === 'on-shift' ? 'off' : 'on-shift';
        return prev.map((m, idx) => (idx === i ? { ...m, status: next } : m));
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const onShift = members.filter((m) => m.status === 'on-shift').length;
  const [assignFlash, setAssignFlash] = useState(false);

  const handleAssign = () => {
    // Promote the selected member to on-shift and briefly flash feedback
    setMembers((prev) =>
      prev.map((m) => (m.id === selectedId ? { ...m, status: 'on-shift' } : m))
    );
    setAssignFlash(true);
    setTimeout(() => setAssignFlash(false), 1400);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-4 pt-4 pb-3 flex items-end justify-between">
        <div>
          <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
            Roster · today
          </div>
          <div className="flex items-baseline gap-2">
            <motion.div
              key={onShift}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-foreground font-mono tabular-nums"
            >
              {onShift}
              <span className="text-muted-foreground text-sm font-normal">/{members.length}</span>
            </motion.div>
            <div className="text-xs text-muted-foreground">on shift</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {assignFlash && (
              <motion.span
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-[9px] font-mono text-emerald-600 flex items-center gap-1"
              >
                <Check className="w-2.5 h-2.5" strokeWidth={3} />
                Assigned
              </motion.span>
            )}
          </AnimatePresence>
          <button
            type="button"
            onClick={handleAssign}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-foreground text-background text-[10px] font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3 h-3" strokeWidth={2.5} />
            Assign
          </button>
        </div>
      </div>

      <div className="flex-1 px-4 pb-4 grid grid-cols-2 gap-1.5 content-start min-h-0 overflow-auto">
        {members.map((m) => {
          const st = STATUS_COLORS[m.status];
          const isSelected = m.id === selectedId;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedId(m.id)}
              className={`flex items-center gap-2 p-2 rounded-md border text-left transition-all ${
                isSelected
                  ? 'border-primary/60 bg-primary/5 shadow-sm'
                  : 'border-border/70 bg-card hover:border-primary/40'
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-muted to-muted/60 border border-border flex items-center justify-center text-[9px] font-semibold text-foreground">
                  {m.id}
                </div>
                <motion.span
                  animate={{ scale: m.status === 'on-shift' ? [1, 1.3, 1] : 1 }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`absolute -bottom-0 -right-0 w-2 h-2 rounded-full border border-background ${st.dot}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-semibold text-foreground truncate">{m.name}</div>
                <div className="text-[9px] text-muted-foreground truncate">{m.role}</div>
              </div>
              <div className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${st.pill} flex-shrink-0`}>
                {st.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- COMPLIANCE VIEW ----------

const CERT_DATA = [
  { name: 'ABS — AOSS Cert', owner: 'Vessel fleet', daysLeft: 138, level: 'ok' },
  { name: 'BV Class renewal', owner: 'Fleet ops', daysLeft: 730, level: 'ok' },
  { name: 'Dive medical — J. Tan', owner: 'J. Tan', daysLeft: 42, level: 'warn' },
  { name: 'Welding cert — S. Lim', owner: 'S. Lim', daysLeft: 14, level: 'danger' },
  { name: 'MPA licence', owner: 'Corporate', daysLeft: 210, level: 'ok' },
];

const LEVEL_STYLES = {
  ok: { dot: 'bg-emerald-500', bar: 'from-emerald-500 to-emerald-400', label: 'Valid' },
  warn: { dot: 'bg-amber-500', bar: 'from-amber-500 to-amber-400', label: 'Renew soon' },
  danger: { dot: 'bg-red-500', bar: 'from-red-500 to-red-400', label: 'Urgent' },
};

function ComplianceView() {
  const [tick, setTick] = useState(0);
  const [exportState, setExportState] = useState('idle'); // idle | exporting | done
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1200);
    return () => clearInterval(id);
  }, []);

  const handleExport = () => {
    if (exportState !== 'idle') return;
    setExportState('exporting');
    setTimeout(() => setExportState('done'), 900);
    setTimeout(() => setExportState('idle'), 2200);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-4 pt-4 pb-3 flex items-end justify-between">
        <div>
          <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
            Compliance tracker
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold text-foreground font-mono tabular-nums">94%</div>
            <div className="text-xs text-emerald-600 font-medium">▲ 2%</div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleExport}
          disabled={exportState !== 'idle'}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-foreground text-background text-[10px] font-medium hover:opacity-90 transition-opacity disabled:opacity-80"
        >
          {exportState === 'exporting' ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                className="w-3 h-3 border border-background/40 border-t-background rounded-full"
              />
              Exporting…
            </>
          ) : exportState === 'done' ? (
            <>
              <Check className="w-3 h-3" strokeWidth={3} />
              Exported
            </>
          ) : (
            <>
              <FileCheck className="w-3 h-3" strokeWidth={2.5} />
              Export
            </>
          )}
        </button>
      </div>

      <div className="flex-1 px-4 pb-4 flex flex-col gap-1.5 min-h-0 overflow-auto">
        {CERT_DATA.map((cert, i) => {
          const style = LEVEL_STYLES[cert.level];
          const maxDays = 730;
          const pct = Math.min(100, (cert.daysLeft / maxDays) * 100);
          return (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="border border-border/70 rounded-md bg-card p-2"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${style.dot} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-semibold text-foreground truncate">{cert.name}</div>
                  <div className="text-[9px] text-muted-foreground">{cert.owner}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[10px] font-mono font-semibold text-foreground tabular-nums">
                    {cert.daysLeft}d
                  </div>
                  <div className="text-[8px] text-muted-foreground">{style.label}</div>
                </div>
              </div>
              <div className="h-0.5 w-full bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${style.bar} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: i * 0.06 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- DASHBOARD VIEW ----------

const ACTIVITY_FEED = [
  { id: 1, Icon: CheckCircle2, tone: 'emerald', who: 'A. Tan', what: 'completed', target: 'Hull inspection · OP-184', when: '2m' },
  { id: 2, Icon: Plus,          tone: 'blue',    who: 'S. Lim', what: 'created',   target: 'Refit survey · OP-185',    when: '14m' },
  { id: 3, Icon: AlertCircle,   tone: 'amber',   who: 'System', what: 'flagged',   target: 'Dive medical · expiring',  when: '1h' },
  { id: 4, Icon: Wrench,        tone: 'sky',     who: 'M. Wong', what: 'serviced',  target: 'Generator A · 250h cycle', when: '3h' },
  { id: 5, Icon: FileCheck,     tone: 'emerald', who: 'P. Raj', what: 'approved',  target: 'Audit report Q2',          when: '5h' },
];

const TONE_STYLES = {
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  amber: 'bg-amber-50 text-amber-600 border-amber-200',
  sky: 'bg-sky-50 text-sky-600 border-sky-200',
};

function DashboardKpi({ label, value, sub, trend }) {
  return (
    <div className="border border-border/70 rounded-md bg-card p-2.5">
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="flex items-baseline gap-1.5 mt-0.5">
        <div className="text-base font-semibold text-foreground font-mono tabular-nums">{value}</div>
        {trend && <div className="text-[9px] text-emerald-600 font-medium">{trend}</div>}
      </div>
      {sub && <div className="text-[9px] text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}

function DashboardView() {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-4 pt-4 pb-2">
        <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
          Company overview
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-lg font-bold text-foreground">Good afternoon, J. Tan</div>
          <div className="text-[10px] text-muted-foreground">All systems nominal</div>
        </div>
      </div>

      <div className="flex-1 px-4 pb-4 grid grid-cols-1 sm:grid-cols-[1fr_200px] gap-2.5 min-h-0">
        <div className="flex flex-col gap-2.5 min-h-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <DashboardKpi label="Open ops" value="12" sub="3 due today" trend="▲ 4" />
            <DashboardKpi label="On-shift" value="8/14" sub="2 teams deployed" />
            <DashboardKpi label="Compliance" value="94%" sub="1 cert expiring" trend="▲ 2%" />
            <DashboardKpi label="Fleet" value="92%" sub="11/12 vessels ready" />
          </div>

          <div className="border border-border/70 rounded-md bg-card p-2.5 flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold text-foreground">Operations throughput</span>
              <span className="text-[9px] text-emerald-600 font-mono">▲ 12% vs last week</span>
            </div>
            <div className="flex-1 min-h-0">
              <LiveChart />
            </div>
          </div>
        </div>

        <div className="border border-border/70 rounded-md bg-card p-2 flex flex-col min-h-0">
          <div className="flex items-center gap-1.5 mb-1.5 px-0.5">
            <Activity className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] font-semibold text-foreground">Activity</span>
            <motion.span
              className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
          </div>
          <div className="flex flex-col gap-1 overflow-auto flex-1 min-h-0">
            {ACTIVITY_FEED.map((item, i) => {
              const { Icon } = item;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-1.5 p-1.5 rounded border border-border/70 bg-background"
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${TONE_STYLES[item.tone]}`}>
                    <Icon className="w-2.5 h-2.5" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] leading-tight">
                      <span className="font-semibold text-foreground">{item.who}</span>{' '}
                      <span className="text-muted-foreground">{item.what}</span>
                    </div>
                    <div className="text-[9px] text-foreground/80 truncate">{item.target}</div>
                  </div>
                  <div className="text-[8px] text-muted-foreground font-mono flex-shrink-0 mt-0.5">{item.when}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- EQUIPMENT (PMS) VIEW ----------

const EQUIPMENT_DATA = [
  { id: 'EQ-101', name: 'Main Engine #1',     vessel: 'MV Horizon',  hours: 8420,  nextAt: 8600, cycle: 250, level: 'ok'     },
  { id: 'EQ-102', name: 'Generator A',        vessel: 'MV Horizon',  hours: 3210,  nextAt: 3255, cycle: 100, level: 'warn'   },
  { id: 'EQ-103', name: 'Dive Compressor',    vessel: 'Workshop',    hours: 1840,  nextAt: 2000, cycle: 500, level: 'ok'     },
  { id: 'EQ-104', name: 'Bow Thruster',       vessel: 'MV Victory',  hours: 4120,  nextAt: 4500, cycle: 500, level: 'ok'     },
  { id: 'EQ-105', name: 'Air Handling Unit',  vessel: 'MV Pioneer',  hours: 6755,  nextAt: 6700, cycle: 200, level: 'danger' },
  { id: 'EQ-106', name: 'Fire Pump',          vessel: 'Fleet-wide',  hours: 920,   nextAt: 1000, cycle: 250, level: 'ok'     },
];

const EQ_LEVEL_STYLES = {
  ok:     { dot: 'bg-emerald-500', bar: 'from-emerald-500 to-emerald-400', label: 'Healthy',   pill: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  warn:   { dot: 'bg-amber-500',   bar: 'from-amber-500 to-amber-400',     label: 'Due soon',  pill: 'text-amber-700 bg-amber-50 border-amber-200'       },
  danger: { dot: 'bg-red-500',     bar: 'from-red-500 to-red-400',         label: 'Overdue',   pill: 'text-red-700 bg-red-50 border-red-200'             },
};

const NEW_EQUIPMENT_TEMPLATES = [
  { name: 'Ballast Pump',      vessel: 'MV Pioneer',  hours: 0,    nextAt: 500,  cycle: 500, level: 'ok' },
  { name: 'Auxiliary Engine',  vessel: 'MV Victory',  hours: 1250, nextAt: 1500, cycle: 250, level: 'ok' },
  { name: 'Navigation Radar',  vessel: 'MV Horizon',  hours: 4200, nextAt: 4500, cycle: 500, level: 'ok' },
];

function EquipmentView() {
  const [items, setItems] = useState(EQUIPMENT_DATA);
  const [addIdx, setAddIdx] = useState(0);

  const handleNew = () => {
    const template = NEW_EQUIPMENT_TEMPLATES[addIdx % NEW_EQUIPMENT_TEMPLATES.length];
    setAddIdx((i) => i + 1);
    setItems((prev) => [
      { id: `EQ-${107 + addIdx}`, ...template },
      ...prev,
    ]);
  };

  const overdueCount = items.filter((e) => e.level === 'danger').length;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-4 pt-4 pb-3 flex items-end justify-between">
        <div>
          <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
            Planned maintenance
          </div>
          <div className="flex items-baseline gap-2">
            <motion.div
              key={items.length}
              initial={{ opacity: 0, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-foreground font-mono tabular-nums"
            >
              {items.length}
            </motion.div>
            <div className="text-xs text-muted-foreground">
              tracked assets{overdueCount > 0 && ` · ${overdueCount} overdue`}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleNew}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-foreground text-background text-[10px] font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3 h-3" strokeWidth={2.5} />
          New
        </button>
      </div>

      <div className="flex-1 px-4 pb-4 flex flex-col gap-1.5 min-h-0 overflow-auto">
        {items.map((eq, i) => {
          const style = EQ_LEVEL_STYLES[eq.level];
          const sinceLast = eq.cycle - (eq.nextAt - eq.hours);
          const pct = Math.max(0, Math.min(100, (sinceLast / eq.cycle) * 100));
          const remaining = eq.nextAt - eq.hours;
          return (
            <motion.div
              key={eq.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="border border-border/70 rounded-md bg-card p-2"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded bg-muted/60 border border-border flex items-center justify-center flex-shrink-0">
                  <Wrench className="w-3 h-3 text-muted-foreground" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-foreground truncate">{eq.name}</span>
                    <span className="text-[9px] font-mono text-muted-foreground">{eq.id}</span>
                  </div>
                  <div className="text-[9px] text-muted-foreground truncate">{eq.vessel}</div>
                </div>
                <div className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full border flex-shrink-0 ${style.pill}`}>
                  {style.label}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <Gauge className="w-3 h-3 text-muted-foreground flex-shrink-0" strokeWidth={2} />
                <span className="text-[9px] text-muted-foreground">
                  {eq.hours.toLocaleString()} hrs · next service at {eq.nextAt.toLocaleString()}
                </span>
                <span className={`ml-auto text-[9px] font-mono tabular-nums ${remaining < 0 ? 'text-red-600 font-semibold' : 'text-foreground'}`}>
                  {remaining < 0 ? `${Math.abs(remaining)}h overdue` : `${remaining}h left`}
                </span>
              </div>

              <div className="h-0.5 w-full bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${style.bar} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: i * 0.06 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- MAIN ----------

export default function LiveOpsMockup() {
  const [activeView, setActiveView] = useState('dashboard');

  const ViewComponent = {
    dashboard: DashboardView,
    overview: OverviewView,
    schedule: ScheduleView,
    equipment: EquipmentView,
    teams: TeamsView,
    compliance: ComplianceView,
  }[activeView];

  return (
    <div className="grid grid-cols-[52px_1fr] sm:grid-cols-[140px_1fr] h-[480px] sm:h-[440px] bg-background">
      {/* SIDEBAR */}
      <aside className="border-r border-border/70 bg-muted/30 p-1.5 sm:p-2.5 flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5 px-1 sm:px-2 py-1.5 mb-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-primary to-[hsl(var(--fluxo-cyan))] flex items-center justify-center flex-shrink-0">
            <div className="w-2 h-2 rounded-sm bg-white/90" />
          </div>
          <span className="text-[11px] font-semibold text-foreground hidden sm:inline">Fluxo</span>
        </div>
        {Object.entries(VIEWS).map(([key, v]) => (
          <NavItem
            key={key}
            Icon={v.Icon}
            label={v.label}
            active={activeView === key}
            onClick={() => setActiveView(key)}
          />
        ))}
        <div className="mt-auto flex items-center gap-2 px-1 sm:px-2 py-1.5 border-t border-border/70 pt-2.5">
          <div className="w-5 h-5 rounded-full bg-muted border border-border flex items-center justify-center text-[8px] font-semibold text-muted-foreground flex-shrink-0">
            JT
          </div>
          <span className="text-[10px] text-muted-foreground hidden sm:inline">J. Tan</span>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex flex-col min-w-0">
        {/* Top bar */}
        <div className="h-9 border-b border-border/70 flex items-center gap-2 px-3 text-[10px]">
          <span className="text-foreground font-medium capitalize">{VIEWS[activeView].label}</span>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/60 border border-border/70 text-muted-foreground">
              <Search className="w-3 h-3" />
              <span className="font-mono">⌘K</span>
            </div>
            <Bell className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col flex-1 min-h-0"
          >
            <ViewComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
