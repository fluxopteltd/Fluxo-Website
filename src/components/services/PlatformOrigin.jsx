import React from 'react';
import { motion } from 'framer-motion';
import {
  Wrench, ShieldCheck, CalendarDays, BarChart3, ArrowRight,
} from 'lucide-react';

/**
 * PlatformOrigin
 * "Distilled from Studio" — four concrete patterns that started as custom
 * Studio builds and are becoming Platform modules. Makes the flywheel
 * tangible instead of abstract.
 */

const PATTERNS = [
  {
    Icon: Wrench,
    accent: 'from-blue-500 to-blue-600',
    origin: 'Dive company PMS tracker',
    detail: 'Running-hours monitoring, service cycles, overdue alerts',
    module: 'Equipment & Maintenance',
  },
  {
    Icon: ShieldCheck,
    accent: 'from-emerald-500 to-emerald-600',
    origin: 'Class society audit prep',
    detail: 'Cert expiry tracking, audit trails, export packages',
    module: 'Compliance Engine',
  },
  {
    Icon: CalendarDays,
    accent: 'from-violet-500 to-violet-600',
    origin: 'Marine ops scheduling',
    detail: 'Kanban workflows, crew rotation, job dependencies',
    module: 'Scheduling & Dispatch',
  },
  {
    Icon: BarChart3,
    accent: 'from-primary to-[hsl(var(--fluxo-cyan))]',
    origin: 'Multi-project reporting',
    detail: 'One source, many outputs — PDF, Excel, API, dashboards',
    module: 'Reports & Analytics',
  },
];

export default function PlatformOrigin() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-border">
        <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-0.5">
          The flywheel
        </p>
        <div className="text-base font-bold text-foreground">
          What Studio proves → what Platform ships
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Every module in Platform starts as a Studio build solving a real problem.
          Then we generalize, harden, and release it.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
        {PATTERNS.map((p, i) => {
          const { Icon } = p;
          const isLastRow = i >= PATTERNS.length - 2;
          return (
            <motion.div
              key={p.module}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`p-5 ${!isLastRow ? 'md:border-b md:border-border' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.accent} flex items-center justify-center text-white flex-shrink-0`}
                >
                  <Icon className="w-5 h-5" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 flex-wrap">
                    <span>Studio origin</span>
                    <ArrowRight className="w-3 h-3" />
                    <span className="text-primary">Platform module</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs text-muted-foreground">{p.origin}</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground/60 flex-shrink-0" />
                    <span className="text-sm font-semibold text-foreground">{p.module}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    {p.detail}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
