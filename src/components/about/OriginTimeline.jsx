import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Users, Rocket, Network, Infinity } from 'lucide-react';

/**
 * OriginTimeline
 * Visual milestone timeline for the About origin story. Replaces 3
 * paragraphs with an animated vertical timeline. Line fills as user
 * scrolls into view.
 */

const MILESTONES = [
  {
    year: '2025',
    Icon: Eye,
    title: 'The gap we saw',
    body: 'Two bad options for SME operational software: agency custom builds at $200K+ and 12 months, or generic SaaS that never quite fits. Modern AI-assisted development had already changed the economics — someone just needed to bring it to the businesses that needed it.',
    accent: 'from-slate-500 to-slate-600',
  },
  {
    year: 'April 2026',
    Icon: Users,
    title: 'Fluxo founded',
    body: 'Jay (technical) and Chris (commercial) start Fluxo. One co-founder already runs an operational business, so every product decision has an operator in the room.',
    accent: 'from-blue-500 to-blue-600',
  },
  {
    year: '2026 · H2',
    Icon: Rocket,
    title: 'First Studio builds ship',
    body: 'We partner with early operational businesses, mapping real workflows and shipping production systems alongside them. Every build is a chance to learn what should become a reusable pattern.',
    accent: 'from-violet-500 to-violet-600',
    upcoming: true,
  },
  {
    year: '2027',
    Icon: Network,
    title: 'Patterns become a product',
    body: 'After enough Studio builds, the shape of the platform becomes clear. Shared modules (maintenance, compliance, scheduling, reports) get pulled out, hardened, and tested with real operators.',
    accent: 'from-primary to-[hsl(var(--fluxo-cyan))]',
    upcoming: true,
  },
  {
    year: '2027 · later',
    Icon: Infinity,
    title: 'Platform takes shape',
    body: 'The first industry platform — distilled from live custom builds — enters public launch. More to follow, one vertical at a time, as the flywheel turns.',
    accent: 'from-emerald-500 to-emerald-600',
    upcoming: true,
  },
];

export default function OriginTimeline() {
  return (
    <div className="max-w-3xl mx-auto relative">
      {/* Static background rail */}
      <div
        className="absolute left-[22px] top-6 bottom-6 w-px bg-border"
        aria-hidden="true"
      />
      {/* Animated progress rail */}
      <motion.div
        className="absolute left-[22px] top-6 w-px bg-gradient-to-b from-primary via-[hsl(var(--fluxo-cyan))] to-primary/20 origin-top"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ bottom: '1.5rem' }}
        aria-hidden="true"
      />

      <div className="space-y-8">
        {MILESTONES.map((m, i) => (
          <motion.div
            key={m.year}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative pl-16 md:pl-20"
          >
            {/* Timeline node */}
            <div
              className={`absolute left-0 top-4 w-11 h-11 rounded-full bg-background border-2 border-background shadow-[0_0_0_4px_hsl(var(--background))] flex items-center justify-center z-10`}
            >
              <div
                className={`w-full h-full rounded-full bg-gradient-to-br ${m.accent} flex items-center justify-center ${
                  m.upcoming ? 'opacity-70' : ''
                }`}
              >
                <m.Icon className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
            </div>

            {/* Content card */}
            <div
              className={`p-5 lg:p-6 rounded-2xl border bg-card transition-colors ${
                m.upcoming ? 'border-dashed border-border/70' : 'border-border hover:border-primary/40'
              }`}
            >
              <div className="flex items-baseline justify-between mb-2 gap-3 flex-wrap">
                <h3 className="text-lg font-bold text-foreground tracking-tight">{m.title}</h3>
                <span className="text-[10px] font-mono tracking-wider text-muted-foreground flex-shrink-0">
                  {m.year}
                  {m.upcoming && <span className="ml-2 px-1.5 py-0.5 rounded-full bg-muted text-[9px] text-muted-foreground border border-border">upcoming</span>}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{m.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
