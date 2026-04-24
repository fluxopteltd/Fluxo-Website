import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Filter, Plus, Search, Users, Circle } from 'lucide-react';

/**
 * FlowTimeline
 * A clean horizontal week schedule view — teams in rows, days across,
 * jobs as bars positioned on their day spans. Replaces the cluttered
 * kanban for the "Schedule work as it flows" section.
 */

const DAYS = [
  { short: 'Mon', date: '22', isToday: false },
  { short: 'Tue', date: '23', isToday: false },
  { short: 'Wed', date: '24', isToday: true },
  { short: 'Thu', date: '25', isToday: false },
  { short: 'Fri', date: '26', isToday: false },
  { short: 'Sat', date: '27', isToday: false },
  { short: 'Sun', date: '28', isToday: false },
];

const TEAMS = [
  { id: 'dive-a', name: 'Dive Team A', count: 5, tone: 'primary' },
  { id: 'dive-b', name: 'Dive Team B', count: 4, tone: 'secondary' },
  { id: 'workshop', name: 'Workshop', count: 6, tone: 'amber' },
  { id: 'qa', name: 'QA & Compliance', count: 3, tone: 'violet' },
];

// Jobs: team, startDay (0-6), spanDays, title, id
const JOBS = [
  { id: 'OP-184', team: 'dive-a', start: 0, span: 2, title: 'Hull inspection — MV Horizon', tag: 'Survey' },
  { id: 'OP-192', team: 'dive-a', start: 3, span: 1, title: 'Dive medical batch (8 crew)', tag: 'Cert' },
  { id: 'OP-195', team: 'dive-a', start: 5, span: 2, title: 'Bottom survey — Vessel 07', tag: 'Survey' },
  { id: 'OP-181', team: 'dive-b', start: 0, span: 1, title: 'Propeller anode check', tag: 'Repair' },
  { id: 'OP-187', team: 'dive-b', start: 2, span: 2, title: 'Emergency response drill', tag: 'Training' },
  { id: 'OP-201', team: 'dive-b', start: 4, span: 1, title: 'Equipment audit', tag: 'Audit' },
  { id: 'OP-176', team: 'workshop', start: 0, span: 3, title: 'Engine overhaul — MV Pioneer', tag: 'Repair' },
  { id: 'OP-189', team: 'workshop', start: 3, span: 1, title: 'Compressor service', tag: 'Maint' },
  { id: 'OP-198', team: 'workshop', start: 4, span: 2, title: 'Refit — Workshop Bay 2', tag: 'Repair' },
  { id: 'OP-182', team: 'qa', start: 1, span: 2, title: 'Compliance audit Q2', tag: 'Audit' },
  { id: 'OP-199', team: 'qa', start: 4, span: 1, title: 'Class renewal — Vessel 04', tag: 'Cert' },
];

const TONE_STYLES = {
  primary: 'bg-primary/15 border-primary/40 text-foreground',
  secondary: 'bg-blue-500/15 border-blue-500/40 text-foreground dark:bg-blue-500/20',
  amber: 'bg-amber-500/10 border-amber-500/40 text-foreground dark:bg-amber-500/15',
  violet: 'bg-violet-500/10 border-violet-500/40 text-foreground dark:bg-violet-500/15',
};

const DOT_STYLES = {
  primary: 'bg-primary',
  secondary: 'bg-blue-500',
  amber: 'bg-amber-500',
  violet: 'bg-violet-500',
};

function TeamBar({ team }) {
  return (
    <div className="flex items-center gap-2 px-4 h-14 border-r border-border min-w-0">
      <span className={`w-1.5 h-1.5 rounded-full ${DOT_STYLES[team.tone]} flex-shrink-0`} />
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-foreground truncate">{team.name}</div>
        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
          <Users className="w-2.5 h-2.5" />
          {team.count} members
        </div>
      </div>
    </div>
  );
}

export default function FlowTimeline() {
  const [hoveredJobId, setHoveredJobId] = useState(null);

  return (
    <div className="w-full bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
      {/* Top bar */}
      <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-muted/20">
        <div className="flex items-center gap-3">
          <button className="p-1 rounded hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <div>
            <div className="text-sm font-semibold text-foreground">Week 17</div>
            <div className="text-[10px] text-muted-foreground font-mono">Apr 22 – 28, 2026</div>
          </div>
          <button className="p-1 rounded hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button className="text-[10px] px-2 py-0.5 rounded bg-background border border-border text-foreground hover:bg-muted/60 transition-colors font-medium">
            Today
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded bg-background border border-border text-[10px] text-muted-foreground">
            <Search className="w-3 h-3" />
            <span className="font-mono">⌘K</span>
          </div>
          <button className="flex items-center gap-1 px-2 py-0.5 rounded bg-background border border-border text-[10px] text-muted-foreground hover:text-foreground transition-colors">
            <Filter className="w-3 h-3" />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button className="flex items-center gap-1 px-2 py-1 rounded bg-foreground text-background text-[10px] font-medium hover:bg-foreground/90 transition-colors">
            <Plus className="w-3 h-3" strokeWidth={2.5} />
            <span className="hidden sm:inline">Schedule</span>
          </button>
        </div>
      </div>

      {/* Scrollable content — ensures alignment + mobile horizontal scroll */}
      <div className="overflow-x-auto">
        <div className="min-w-[680px]">
          {/* Day headers */}
          <div className="grid grid-cols-[180px_1fr] border-b border-border bg-muted/10">
            <div className="px-4 py-2 border-r border-border">
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Team</div>
            </div>
            <div className="grid grid-cols-7">
              {DAYS.map((d) => (
                <div
                  key={d.date}
                  className={`px-2 py-2 text-center border-r border-border/60 last:border-r-0 ${
                    d.isToday ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className={`text-[10px] font-mono uppercase tracking-wider ${d.isToday ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                    {d.short}
                  </div>
                  <div className={`text-sm font-semibold mt-0.5 ${d.isToday ? 'text-primary' : 'text-foreground'}`}>
                    {d.date}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline rows */}
          <div className="relative">
            {/* "Now" vertical indicator (aligned to Wed which isToday) */}
            <div
              className="absolute top-0 bottom-0 w-px bg-primary/50 pointer-events-none z-10"
              style={{ left: `calc(180px + (100% - 180px) * 2.5 / 7)` }}
            >
              <div className="absolute -top-1 -left-[3px] w-1.5 h-1.5 rounded-full bg-primary" />
            </div>

            {TEAMS.map((team) => (
              <div key={team.id} className="grid grid-cols-[180px_1fr] border-b border-border/50 last:border-b-0">
                <TeamBar team={team} />
                <div className="relative grid grid-cols-7 h-14">
                  {/* Day cell backgrounds / grid lines */}
                  {DAYS.map((d, i) => (
                    <div
                      key={i}
                      className={`border-r border-border/40 last:border-r-0 ${
                        d.isToday ? 'bg-primary/[0.03]' : ''
                      }`}
                    />
                  ))}

                  {/* Job bars */}
                  {JOBS.filter((j) => j.team === team.id).map((job) => {
                    const leftPct = (job.start / 7) * 100;
                    const widthPct = (job.span / 7) * 100;
                    const isHovered = hoveredJobId === job.id;
                    return (
                      <motion.div
                        key={job.id}
                        layoutId={job.id}
                        onMouseEnter={() => setHoveredJobId(job.id)}
                        onMouseLeave={() => setHoveredJobId(null)}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                          left: `calc(${leftPct}% + 4px)`,
                          width: `calc(${widthPct}% - 8px)`,
                        }}
                        className={`absolute top-1/2 -translate-y-1/2 h-8 rounded-md border px-2 flex items-center gap-1.5 cursor-pointer transition-shadow ${
                          TONE_STYLES[team.tone]
                        } ${isHovered ? 'shadow-md z-10' : ''}`}
                      >
                        <span className="font-mono text-[9px] text-muted-foreground flex-shrink-0">{job.id}</span>
                        <span className="text-[10px] font-medium text-foreground truncate">{job.title}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="h-8 border-t border-border flex items-center justify-between px-4 bg-muted/10 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>{JOBS.length} operations scheduled</span>
          </span>
          <span className="hidden sm:flex items-center gap-1">
            <Circle className="w-2.5 h-2.5" />
            <span>Auto-balanced to team capacity</span>
          </span>
        </div>
        <span className="font-mono hidden md:inline">All teams · Apr 22 – 28</span>
      </div>
    </div>
  );
}
