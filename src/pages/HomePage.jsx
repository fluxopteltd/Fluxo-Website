import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Sparkles, MoveRight, Plus, MoreHorizontal, Search, Filter,
  Award, AlertTriangle, TrendingUp, TrendingDown,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar,
  CartesianGrid, PieChart, Pie, Cell,
} from 'recharts';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import LiveOpsMockup from '@/components/home/LiveOpsMockup.jsx';
import IndustryDashboard from '@/components/home/IndustryDashboard.jsx';
import FlowTimeline from '@/components/home/FlowTimeline.jsx';
import ReportFlow from '@/components/home/ReportFlow.jsx';
import SocialProof from '@/components/home/SocialProof.jsx';
import WhichFit from '@/components/home/WhichFit.jsx';
import SystemsConnectIntro, { SYSTEMS_CONNECT_INTRO_DURATION, SYSTEMS_CONNECT_HANDOFF_AT } from '@/components/home/SystemsConnectIntro.jsx';

/**
 * =====================================================================
 * FLUXO HOMEPAGE — Linear-inspired design (SINGLE FILE VERSION)
 *
 * All interactive components are inlined as helper functions in this
 * file. If you later migrate to a proper multi-file setup (recommended),
 * these can be extracted into separate component files.
 *
 * Sections on this page:
 *   1. Hero — massive headline + product screenshot below
 *   2. Positioning statement + 3 animated SVG illustrations
 *   3. Feature 1: Operations Overview (static screenshot)
 *   4. Feature 2: Scheduling (INTERACTIVE kanban board)
 *   5. Feature 3: Teams & Compliance (INTERACTIVE team dashboard)
 *   6. Feature 4: Analytics (INTERACTIVE charts)
 *   7. What We Build (Studio + Platform cards)
 *   8. Closing CTA
 * =====================================================================
 */

// =====================================================================
// BACKGROUND UTILITIES
// =====================================================================

/**
 * Grid background pattern — fades toward edges.
 */
function GridPattern({ opacity = 0.4 }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
        <radialGradient id="grid-fade" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="black" stopOpacity="1" />
          <stop offset="70%" stopColor="black" stopOpacity="0.3" />
          <stop offset="100%" stopColor="black" stopOpacity="0" />
        </radialGradient>
        <mask id="grid-mask">
          <rect width="100%" height="100%" fill="url(#grid-fade)" />
        </mask>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="url(#grid-pattern)"
        mask="url(#grid-mask)"
        style={{ color: `hsl(var(--primary) / ${opacity})` }}
      />
    </svg>
  );
}

/**
 * TiltFrame — wraps product visuals with subtle 3D tilt on scroll
 * and ambient glow for the Linear "floating screenshot" feel.
 */
function TiltFrame({ children, className = '' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [8, 0, -4]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1, 0.98]);

  return (
    <div ref={ref} className={`relative ${className}`} style={{ perspective: 1600 }}>
      <div className="absolute -inset-8 bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent rounded-3xl blur-3xl opacity-60 pointer-events-none" />
      <motion.div
        style={{
          rotateX,
          scale,
          transformStyle: 'preserve-3d',
          transformOrigin: 'center top',
        }}
        className="relative"
      >
        {children}
      </motion.div>
    </div>
  );
}

// =====================================================================
// ILLUSTRATIONS — 3 animated SVG line-art shapes
// =====================================================================

const ILLUSTRATION_STROKE = 'hsl(var(--muted-foreground))';
const ILLUSTRATION_STROKE_ACTIVE = 'hsl(var(--primary))';

// Purpose — a custom-shaped piece dropping into a precisely-matching slot.
// Conveys "tailored fit, not a generic template."
function StackedDisks({ className = '' }) {
  // Unique silhouette path — irregular shape with notches
  const shape =
    'M -42 -18 L -22 -18 L -22 -28 L 8 -28 L 8 -18 L 34 -18 L 34 6 L 42 6 L 42 22 L -34 22 L -34 6 L -42 6 Z';
  return (
    <motion.svg
      viewBox="0 0 240 240"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      whileHover="hover"
    >
      <defs>
        <linearGradient id="fit-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
          <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      {/* Target slot outline (the operation's specific shape) */}
      <g transform="translate(120 150)">
        <motion.path
          d={shape}
          fill="none"
          stroke={ILLUSTRATION_STROKE}
          strokeWidth="1"
          strokeDasharray="3 3"
          opacity="0.7"
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 0.7, scale: 1, transition: { duration: 0.6, delay: 0.1 } },
          }}
        />
        {/* Inner grid hint to suggest a "slot" */}
        <motion.g
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 0.25, transition: { delay: 0.4, duration: 0.6 } },
          }}
        >
          <line x1="-34" y1="-10" x2="34" y2="-10" stroke={ILLUSTRATION_STROKE} strokeWidth="0.5" />
          <line x1="-34" y1="2" x2="34" y2="2" stroke={ILLUSTRATION_STROKE} strokeWidth="0.5" />
          <line x1="-34" y1="14" x2="34" y2="14" stroke={ILLUSTRATION_STROKE} strokeWidth="0.5" />
        </motion.g>
      </g>

      {/* Falling matching piece — loops down into the slot repeatedly */}
      <motion.g
        animate={{ y: [0, 70, 70, 0, 0], opacity: [1, 1, 1, 1, 1] }}
        transition={{
          duration: 4.5,
          times: [0, 0.35, 0.55, 0.9, 1],
          repeat: Infinity,
          ease: [0.5, 0, 0.2, 1],
          repeatDelay: 0.6,
        }}
      >
        <g transform="translate(120 80)">
          <motion.path
            d={shape}
            fill="url(#fit-gradient)"
            stroke={ILLUSTRATION_STROKE_ACTIVE}
            strokeWidth="1.4"
            variants={{
              hidden: { opacity: 0, y: -10 },
              visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.6 } },
              hover: { scale: 1.03, transition: { duration: 0.3 } },
            }}
          />
        </g>
      </motion.g>

      {/* Alignment marks on either side */}
      <motion.g
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { delay: 0.6, duration: 0.6 } },
        }}
      >
        <line x1="50" y1="150" x2="72" y2="150" stroke={ILLUSTRATION_STROKE} strokeWidth="1" opacity="0.5" />
        <line x1="168" y1="150" x2="190" y2="150" stroke={ILLUSTRATION_STROKE} strokeWidth="1" opacity="0.5" />
        <circle cx="50" cy="150" r="2" fill={ILLUSTRATION_STROKE} opacity="0.5" />
        <circle cx="190" cy="150" r="2" fill={ILLUSTRATION_STROKE} opacity="0.5" />
      </motion.g>
    </motion.svg>
  );
}

// Operators — a network of team nodes connected to a central hub.
// Conveys "we run operations ourselves; we connect the people who do."
function FloatingCubes({ className = '' }) {
  // Six peripheral nodes around a central hub
  const nodes = [
    { x: 60, y: 70, delay: 0.15 },
    { x: 180, y: 70, delay: 0.25 },
    { x: 40, y: 140, delay: 0.35 },
    { x: 200, y: 140, delay: 0.45 },
    { x: 85, y: 195, delay: 0.55 },
    { x: 155, y: 195, delay: 0.65 },
  ];
  const hub = { x: 120, y: 130 };

  return (
    <motion.svg
      viewBox="0 0 240 240"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      whileHover="hover"
    >
      <defs>
        <radialGradient id="hub-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
        </radialGradient>
      </defs>

      {/* Connection lines from hub to each node */}
      {nodes.map((n, i) => (
        <motion.line
          key={`line-${i}`}
          x1={hub.x}
          y1={hub.y}
          x2={n.x}
          y2={n.y}
          stroke={ILLUSTRATION_STROKE}
          strokeWidth="1"
          opacity="0.5"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 0.5,
              transition: { delay: 0.2 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
            },
          }}
        />
      ))}

      {/* Data pulses travelling along each line (offset timing) */}
      {nodes.map((n, i) => (
        <motion.circle
          key={`pulse-${i}`}
          r="2"
          fill={ILLUSTRATION_STROKE_ACTIVE}
          initial={{ cx: hub.x, cy: hub.y, opacity: 0 }}
          animate={{
            cx: [hub.x, n.x, hub.x],
            cy: [hub.y, n.y, hub.y],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            delay: 1 + i * 0.35,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Peripheral nodes */}
      {nodes.map((n, i) => (
        <motion.g
          key={`node-${i}`}
          variants={{
            hidden: { opacity: 0, scale: 0.6 },
            visible: { opacity: 1, scale: 1, transition: { delay: n.delay, duration: 0.5 } },
            hover: { scale: 1.1, transition: { duration: 0.3 } },
          }}
        >
          <circle cx={n.x} cy={n.y} r="8" fill="hsl(var(--background))" stroke={ILLUSTRATION_STROKE} strokeWidth="1" />
          <circle cx={n.x} cy={n.y} r="3" fill={ILLUSTRATION_STROKE} opacity="0.6" />
        </motion.g>
      ))}

      {/* Central hub — pulses to show it's the active operator */}
      <motion.g
        variants={{
          hidden: { opacity: 0, scale: 0.5 },
          visible: { opacity: 1, scale: 1, transition: { delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
          hover: { scale: 1.08, transition: { duration: 0.3 } },
        }}
      >
        <motion.circle
          cx={hub.x}
          cy={hub.y}
          r="20"
          fill="url(#hub-gradient)"
          animate={{ r: [20, 26, 20], opacity: [0.8, 0.3, 0.8] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <circle cx={hub.x} cy={hub.y} r="14" fill="hsl(var(--background))" stroke={ILLUSTRATION_STROKE_ACTIVE} strokeWidth="1.4" />
        <circle cx={hub.x} cy={hub.y} r="4" fill={ILLUSTRATION_STROKE_ACTIVE} />
      </motion.g>
    </motion.svg>
  );
}

// Built to last — layered foundation blocks with a column rising through.
// Conveys "infrastructure, solid base, engineered for the long haul."
function CascadingCards({ className = '' }) {
  // 4 horizontal foundation layers (bottom → top)
  const layers = [
    { y: 190, width: 180, label: 'Infrastructure' },
    { y: 162, width: 160, label: 'Platform' },
    { y: 134, width: 140, label: 'Workflow' },
    { y: 106, width: 120, label: 'App' },
  ];

  return (
    <motion.svg
      viewBox="0 0 240 240"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      whileHover="hover"
    >
      <defs>
        <linearGradient id="pillar-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.45" />
          <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      {/* Ground line */}
      <motion.line
        x1="20" y1="212" x2="220" y2="212"
        stroke={ILLUSTRATION_STROKE}
        strokeWidth="1"
        opacity="0.4"
        variants={{
          hidden: { pathLength: 0 },
          visible: { pathLength: 1, transition: { duration: 0.6 } },
        }}
      />

      {/* Foundation layers — stack from bottom up */}
      {layers.map((layer, i) => {
        const x = 120 - layer.width / 2;
        return (
          <motion.g
            key={i}
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { delay: 0.2 + i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
              hover: { y: -2, transition: { duration: 0.3, delay: i * 0.04 } },
            }}
          >
            {/* Layer plate */}
            <rect
              x={x}
              y={layer.y}
              width={layer.width}
              height="18"
              fill="hsl(var(--background))"
              stroke={ILLUSTRATION_STROKE}
              strokeWidth="1"
              rx="2"
            />
            {/* Inner dashed line to suggest stability/continuity */}
            <line
              x1={x + 8}
              y1={layer.y + 9}
              x2={x + layer.width - 8}
              y2={layer.y + 9}
              stroke={ILLUSTRATION_STROKE}
              strokeWidth="0.5"
              strokeDasharray="3 3"
              opacity="0.4"
            />
          </motion.g>
        );
      })}

      {/* Rising pillar — a vertical column that threads through every layer */}
      <motion.rect
        x="114" y="36" width="12" height="172"
        fill="url(#pillar-gradient)"
        stroke={ILLUSTRATION_STROKE_ACTIVE}
        strokeWidth="1.2"
        rx="1"
        variants={{
          hidden: { opacity: 0, scaleY: 0 },
          visible: { opacity: 1, scaleY: 1, transition: { delay: 0.8, duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
        }}
        style={{ transformOrigin: '120px 208px' }}
      />

      {/* Capstone on top of pillar */}
      <motion.g
        variants={{
          hidden: { opacity: 0, y: -8 },
          visible: { opacity: 1, y: 0, transition: { delay: 1.3, duration: 0.5 } },
        }}
      >
        <rect x="100" y="28" width="40" height="10" rx="2"
          fill="hsl(var(--primary) / 0.15)"
          stroke={ILLUSTRATION_STROKE_ACTIVE}
          strokeWidth="1.2"
        />
      </motion.g>

      {/* Slow pulse travelling up the pillar */}
      <motion.circle
        r="3"
        fill={ILLUSTRATION_STROKE_ACTIVE}
        cx="120"
        initial={{ cy: 200, opacity: 0 }}
        animate={{ cy: [200, 40], opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: 'easeOut',
          delay: 1.6,
          times: [0, 0.1, 0.9, 1],
          repeatDelay: 1,
        }}
      />
    </motion.svg>
  );
}

// =====================================================================
// KANBAN BOARD — interactive scheduling mock
// =====================================================================

const KANBAN_INITIAL_JOBS = [
  { id: 'JOB-2847', title: 'Tuas Terminal — pipe inspection', team: 'Alpha', priority: 'high', column: 'backlog', category: 'Inspection' },
  { id: 'JOB-2848', title: 'Sentosa Cove — mooring check', team: 'Bravo', priority: 'medium', column: 'backlog', category: 'Diving' },
  { id: 'JOB-2850', title: 'Jurong Port — hull cleaning prep', team: 'Alpha', priority: 'low', column: 'backlog', category: 'Maintenance' },
  { id: 'JOB-2853', title: 'PSA Pasir Panjang — survey', team: 'Charlie', priority: 'medium', column: 'backlog', category: 'Survey' },
  { id: 'JOB-2841', title: 'Marina Bay — structural dive', team: 'Bravo', priority: 'high', column: 'scheduled', category: 'Diving' },
  { id: 'JOB-2842', title: 'West Coast Pier — anode replacement', team: 'Alpha', priority: 'medium', column: 'scheduled', category: 'Maintenance' },
  { id: 'JOB-2844', title: 'Changi Naval — compliance audit', team: 'Charlie', priority: 'high', column: 'scheduled', category: 'Compliance' },
  { id: 'JOB-2836', title: 'Container terminal #47 — inspection', team: 'Alpha', priority: 'high', column: 'in_progress', category: 'Inspection' },
  { id: 'JOB-2838', title: 'Loyang offshore — cable survey', team: 'Bravo', priority: 'medium', column: 'in_progress', category: 'Survey' },
  { id: 'JOB-2831', title: 'Raffles Marina — inspection', team: 'Charlie', priority: 'medium', column: 'completed', category: 'Inspection' },
  { id: 'JOB-2832', title: 'Pasir Panjang — maintenance', team: 'Alpha', priority: 'low', column: 'completed', category: 'Maintenance' },
  { id: 'JOB-2834', title: 'Keppel Bay — cert renewal', team: 'Bravo', priority: 'low', column: 'completed', category: 'Compliance' },
];

const KANBAN_COLUMNS = [
  { key: 'backlog', label: 'Backlog', accent: 'bg-muted-foreground/40' },
  { key: 'scheduled', label: 'Scheduled', accent: 'bg-blue-500' },
  { key: 'in_progress', label: 'In Progress', accent: 'bg-yellow-500' },
  { key: 'completed', label: 'Completed', accent: 'bg-green-500' },
];

const KANBAN_FLOW_ORDER = ['backlog', 'scheduled', 'in_progress', 'completed'];

const KanbanJobCard = React.forwardRef(function KanbanJobCard({ job }, ref) {
  const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500',
  };
  const categoryColors = {
    Inspection: 'bg-blue-100 text-blue-700 border-blue-200',
    Diving: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    Maintenance: 'bg-purple-100 text-purple-700 border-purple-200',
    Survey: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    Compliance: 'bg-amber-100 text-amber-700 border-amber-200',
  };

  return (
    <motion.div
      ref={ref}
      layout layoutId={job.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      whileHover={{ y: -2, boxShadow: '0 8px 20px -4px rgba(0,0,0,0.12)' }}
      className="bg-card border border-border rounded-lg p-3 mb-2 cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-mono text-muted-foreground">{job.id}</span>
        <div className={`w-1.5 h-1.5 rounded-full ${priorityColors[job.priority]}`} />
      </div>
      <p className="text-xs font-medium text-foreground leading-snug mb-2 line-clamp-2">
        {job.title}
      </p>
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${categoryColors[job.category]}`}>
          {job.category}
        </span>
        <div className="flex -space-x-1">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary to-secondary border border-background flex items-center justify-center">
            <span className="text-[7px] font-bold text-white">{job.team[0]}</span>
          </div>
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-secondary to-primary border border-background flex items-center justify-center">
            <span className="text-[7px] font-bold text-white">{job.team[1] || 'A'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

function KanbanBoard() {
  const [jobs, setJobs] = useState(KANBAN_INITIAL_JOBS);

  useEffect(() => {
    const interval = setInterval(() => {
      setJobs((current) => {
        const movable = current.filter((j) => j.column !== 'completed');
        if (movable.length === 0) return KANBAN_INITIAL_JOBS;

        const candidates = movable.sort((a, b) => {
          const aIdx = KANBAN_FLOW_ORDER.indexOf(a.column);
          const bIdx = KANBAN_FLOW_ORDER.indexOf(b.column);
          return aIdx - bIdx;
        });
        const picked = candidates[Math.floor(Math.random() * Math.min(3, candidates.length))];

        return current.map((j) => {
          if (j.id !== picked.id) return j;
          const nextIdx = KANBAN_FLOW_ORDER.indexOf(j.column) + 1;
          return { ...j, column: KANBAN_FLOW_ORDER[nextIdx] };
        });
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
      <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">O</span>
          </div>
          <span className="text-sm font-semibold text-foreground">Schedule</span>
          <span className="text-xs text-muted-foreground">· Week of 22 Apr</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 bg-background border border-border rounded-md px-2 py-1">
            <Search className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Search</span>
          </div>
          <button className="flex items-center gap-1 bg-background border border-border rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Filter className="w-3 h-3" />
            <span className="hidden md:inline">Filter</span>
          </button>
          <button className="flex items-center gap-1 bg-primary text-primary-foreground rounded-md px-2.5 py-1 text-xs font-medium hover:bg-primary/90 transition-colors">
            <Plus className="w-3 h-3" />
            <span className="hidden md:inline">New Job</span>
          </button>
        </div>
      </div>

      <div className="p-4 bg-muted/10">
        <div className="grid grid-cols-4 gap-3">
          {KANBAN_COLUMNS.map((col) => {
            const colJobs = jobs.filter((j) => j.column === col.key);
            return (
              <div key={col.key} className="flex flex-col min-h-[360px]">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${col.accent}`} />
                    <span className="text-xs font-semibold text-foreground">{col.label}</span>
                    <span className="text-[10px] text-muted-foreground">{colJobs.length}</span>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex-1">
                  <AnimatePresence mode="popLayout">
                    {colJobs.map((job) => (
                      <KanbanJobCard key={job.id} job={job} />
                    ))}
                  </AnimatePresence>

                  <motion.div layout
                    className="border border-dashed border-border/60 rounded-lg p-2 flex items-center justify-center text-muted-foreground/50 hover:text-muted-foreground hover:border-border transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// TEAM DASHBOARD — interactive roster + cert expiry mock
// =====================================================================

function TeamMetricCounter({ label, value, suffix = '', trend, trendColor = 'text-green-600', warning = false }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const target = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(target)) { setDisplayValue(value); return; }
    const duration = 1500;
    const start = Date.now();

    function tick() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      setDisplayValue(Number.isInteger(target) ? Math.round(current) : current.toFixed(1));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`bg-card border rounded-lg p-3 flex-1 ${warning ? 'border-amber-200 bg-amber-50/50' : 'border-border'}`}
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        {warning && <AlertTriangle className="w-3 h-3 text-amber-600" />}
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      </div>
      <p className={`text-xl font-bold ${warning ? 'text-amber-700' : 'text-foreground'}`}>
        {displayValue}{suffix}
      </p>
      {trend && <p className={`text-[10px] font-medium mt-0.5 ${trendColor}`}>{trend}</p>}
    </motion.div>
  );
}

const TEAM_MEMBERS = [
  { name: 'Alex Tan', role: 'Lead Diver', status: 'on_duty', certs: ['ADAS 3', 'PADI'], lastActive: '2 min ago' },
  { name: 'Sarah Lim', role: 'Operations Mgr', status: 'active', certs: ['PMP', 'First Aid'], lastActive: '8 min ago' },
  { name: 'Marcus Wong', role: 'Technician', status: 'on_duty', certs: ['NDT L-II'], lastActive: '1 hr ago' },
  { name: 'Priya Raj', role: 'Supervisor', status: 'off_duty', certs: ['ADAS 4', 'First Aid'], lastActive: '3 hrs ago' },
  { name: 'Jason Lee', role: 'Diver', status: 'active', certs: ['ADAS 2'], lastActive: '12 min ago' },
  { name: 'Farah Ismail', role: 'Safety Officer', status: 'on_leave', certs: ['WSHO', 'First Aid'], lastActive: '2 days ago' },
];

const EXPIRING_CERTS_INITIAL = [
  { person: 'Alex Tan', cert: 'ADAS Class 3', days: 14 },
  { person: 'Marcus Wong', cert: 'NDT Level II', days: 28 },
  { person: 'Jason Lee', cert: 'First Aid & CPR', days: 45 },
];

function TeamStatusBadge({ status }) {
  const configs = {
    on_duty: { label: 'On Duty', dotColor: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50 border-green-200' },
    active: { label: 'Active', dotColor: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200' },
    off_duty: { label: 'Off Duty', dotColor: 'bg-muted-foreground/40', textColor: 'text-muted-foreground', bgColor: 'bg-muted border-border' },
    on_leave: { label: 'On Leave', dotColor: 'bg-amber-500', textColor: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200' },
  };
  const cfg = configs[status];

  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded border ${cfg.bgColor} ${cfg.textColor}`}>
      <motion.span className={`w-1.5 h-1.5 rounded-full ${cfg.dotColor}`}
        animate={status === 'on_duty' ? { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      {cfg.label}
    </span>
  );
}

function TeamDashboard() {
  const [expiringCerts, setExpiringCerts] = useState(EXPIRING_CERTS_INITIAL);

  useEffect(() => {
    const interval = setInterval(() => {
      setExpiringCerts((current) =>
        current.map((c) => ({
          ...c,
          days: Math.random() < 0.15 ? Math.max(0, c.days - 1) : c.days,
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
      <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">O</span>
          </div>
          <span className="text-sm font-semibold text-foreground">Team</span>
          <span className="text-xs text-muted-foreground">· 47 members</span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 bg-background border border-border rounded-md px-2 py-1">
          <Search className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Search members</span>
        </div>
      </div>

      <div className="p-4 bg-muted/10">
        <div className="flex gap-2 mb-4">
          <TeamMetricCounter label="Active" value={47} trend="↑ 3 this month" trendColor="text-green-600" />
          <TeamMetricCounter label="On Duty" value={12} trend="Today" trendColor="text-muted-foreground" />
          <TeamMetricCounter label="Cert Compliance" value={98} suffix="%" trend="↑ 2% vs last qtr" trendColor="text-green-600" />
          <TeamMetricCounter label="Expiring Soon" value={3} trend="Next 30 days" trendColor="text-amber-700" warning />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-card border border-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/20">
              <h3 className="text-xs font-semibold text-foreground">Team Roster</h3>
              <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
            </div>

            <div className="divide-y divide-border">
              <div className="grid grid-cols-12 gap-2 px-3 py-1.5 bg-muted/10 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                <div className="col-span-4">Member</div>
                <div className="col-span-3">Role</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-3 text-right">Last Active</div>
              </div>

              {TEAM_MEMBERS.map((m, i) => (
                <motion.div key={m.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  whileHover={{ backgroundColor: 'hsl(var(--muted) / 0.5)' }}
                  className="grid grid-cols-12 gap-2 px-3 py-2 items-center cursor-pointer"
                >
                  <div className="col-span-4 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                      <span className="text-[9px] font-bold text-white">
                        {m.name.split(' ').map((n) => n[0]).join('')}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-foreground truncate">{m.name}</span>
                  </div>
                  <div className="col-span-3 text-xs text-muted-foreground truncate">{m.role}</div>
                  <div className="col-span-2"><TeamStatusBadge status={m.status} /></div>
                  <div className="col-span-3 text-[10px] text-muted-foreground text-right">{m.lastActive}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/20">
              <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Award className="w-3 h-3 text-amber-600" />
                Certifications Expiring
              </h3>
            </div>

            <div className="divide-y divide-border">
              <AnimatePresence>
                {expiringCerts.map((c) => {
                  const urgent = c.days <= 14;
                  return (
                    <motion.div key={c.person + c.cert} layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="px-3 py-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">{c.person}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{c.cert}</p>
                        </div>
                        <motion.div key={c.days}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                            urgent ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {c.days}d
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              <div className="px-3 py-2 bg-muted/10">
                <button className="text-[10px] text-primary font-medium hover:underline">
                  View all (8) →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// ANALYTICS DASHBOARD — interactive charts mock
// =====================================================================

const OPS_BY_MONTH_INITIAL = [
  { month: 'Nov', ops: 42 },
  { month: 'Dec', ops: 48 },
  { month: 'Jan', ops: 55 },
  { month: 'Feb', ops: 61 },
  { month: 'Mar', ops: 68 },
  { month: 'Apr', ops: 74 },
];

const REVENUE_BY_TEAM = [
  { team: 'Alpha', value: 48 },
  { team: 'Bravo', value: 36 },
  { team: 'Charlie', value: 29 },
  { team: 'Delta', value: 22 },
  { team: 'Echo', value: 18 },
  { team: 'Foxtrot', value: 14 },
];

const OPS_BY_CATEGORY = [
  { name: 'Diving', value: 42 },
  { name: 'Maintenance', value: 28 },
  { name: 'Inspection', value: 18 },
  { name: 'Survey', value: 12 },
];

const PIE_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  '#8AB8E0',
  '#C4DEEF',
];

function AnalyticsMetricCard({ label, value, suffix = '', prefix = '', trend, up = true, accent }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const target = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(target)) { setDisplayValue(value); return; }
    const duration = 1800;
    const start = Date.now();

    function tick() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      setDisplayValue(Number.isInteger(target) ? Math.round(current) : current.toFixed(1));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-card border border-border rounded-lg p-3 flex-1 relative overflow-hidden"
    >
      <div className={`absolute top-0 left-0 w-full h-0.5 ${accent || 'bg-primary/30'}`} />
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">{label}</p>
      <p className="text-xl font-bold text-foreground">
        {prefix}{displayValue}{suffix}
      </p>
      {trend && (
        <div className={`flex items-center gap-1 mt-1 text-[10px] font-medium ${up ? 'text-green-600' : 'text-red-600'}`}>
          {up ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
          {trend}
        </div>
      )}
    </motion.div>
  );
}

function AnalyticsDashboard() {
  const [opsByMonth, setOpsByMonth] = useState(OPS_BY_MONTH_INITIAL);

  useEffect(() => {
    const interval = setInterval(() => {
      setOpsByMonth((current) => {
        const updated = [...current];
        const lastIdx = updated.length - 1;
        const last = updated[lastIdx];
        const delta = Math.random() < 0.5 ? -1 : 1;
        updated[lastIdx] = { ...last, ops: Math.max(60, Math.min(85, last.ops + delta)) };
        return updated;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
      <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">O</span>
          </div>
          <span className="text-sm font-semibold text-foreground">Analytics</span>
          <span className="text-xs text-muted-foreground">· Last 6 months</span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 bg-background border border-border rounded-md px-2 py-1">
          <Search className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Search</span>
        </div>
      </div>

      <div className="p-4 bg-muted/10">
        <div className="flex gap-2 mb-4">
          <AnalyticsMetricCard label="Ops Completed" value={284} trend="+12% vs last month" up accent="bg-primary" />
          <AnalyticsMetricCard label="Revenue" value={18.4} prefix="$" suffix="k" trend="+8% vs last month" up accent="bg-secondary" />
          <AnalyticsMetricCard label="Avg Duration" value={4.2} suffix="h" trend="−15% vs last month" up accent="bg-green-500" />
          <AnalyticsMetricCard label="On-Time Rate" value={96} suffix="%" trend="+3% vs last month" up accent="bg-blue-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 bg-card border border-border rounded-lg p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-foreground">Operations Trend</h3>
              <span className="text-[10px] text-muted-foreground">Monthly · live</span>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={opsByMonth} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="line-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} domain={[0, 'dataMax + 10']} />
                  <Tooltip contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                    fontSize: '11px',
                  }} />
                  <Line type="monotone" dataKey="ops" stroke="hsl(var(--primary))" strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', r: 3 }}
                    activeDot={{ r: 5 }}
                    isAnimationActive animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-card border border-border rounded-lg p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-foreground">By Category</h3>
              <span className="text-[10px] text-muted-foreground">% share</span>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={OPS_BY_CATEGORY} innerRadius={32} outerRadius={52} paddingAngle={2} dataKey="value"
                    isAnimationActive animationDuration={1500}
                  >
                    {OPS_BY_CATEGORY.map((entry, i) => (
                      <Cell key={entry.name} fill={PIE_COLORS[i]} stroke="hsl(var(--card))" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                    fontSize: '11px',
                  }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {OPS_BY_CATEGORY.map((c, i) => (
                <div key={c.name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <span className="text-[9px] text-muted-foreground truncate">{c.name}</span>
                  <span className="text-[9px] font-semibold text-foreground ml-auto">{c.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-3 bg-card border border-border rounded-lg p-3"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-foreground">Revenue by Team</h3>
            <span className="text-[10px] text-muted-foreground">SGD thousands · this month</span>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_BY_TEAM} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="bar-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
                <XAxis dataKey="team" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  fontSize: '11px',
                }} />
                <Bar dataKey="value" fill="url(#bar-gradient)" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={1200} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// =====================================================================
// LAYOUT HELPERS
// =====================================================================

function SectionHeader({ headline, description, sectionNumber, sectionName, availability = 'both' }) {
  return (
    <div className="mb-12">
      {availability && (
        <div className="mb-5">
          <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-card border border-border text-[10px] font-mono text-muted-foreground">
            {(availability === 'both' || availability === 'studio') && (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-foreground font-medium">Studio</span>
              </span>
            )}
            {availability === 'both' && <span className="text-muted-foreground/60">·</span>}
            {(availability === 'both' || availability === 'platform') && (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--fluxo-cyan))]" />
                <span className="text-foreground font-medium">Platform</span>
              </span>
            )}
          </span>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-4">
        <div className="lg:col-span-7">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-[1.1]">
            {headline}
          </h2>
        </div>
        <div className="lg:col-span-5 lg:pb-2">
          <p className="text-base lg:text-lg text-muted-foreground leading-relaxed mb-4">
            {description}
          </p>
          <div className="flex items-center gap-1.5 text-sm font-mono text-muted-foreground">
            <span>{sectionNumber}</span>
            <span className="text-foreground font-semibold">{sectionName}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturePills({ pills }) {
  const [activeIdx, setActiveIdx] = useState(null);
  const active = activeIdx !== null ? pills[activeIdx] : null;

  return (
    <div className="mt-10 max-w-3xl mx-auto">
      <div className="flex flex-wrap gap-2 justify-center">
        {pills.map((pill, i) => {
          const isActive = activeIdx === i;
          return (
            <motion.button
              key={pill.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setActiveIdx(isActive ? null : i)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border transition-all ${
                isActive
                  ? 'border-primary bg-primary/10 text-foreground shadow-sm'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
              }`}
            >
              <span className={isActive ? 'text-primary' : 'text-muted-foreground'}>{pill.number}</span>
              <span className="font-semibold text-foreground">{pill.label}</span>
              <motion.span
                animate={{ rotate: isActive ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                className={isActive ? 'text-primary' : 'text-muted-foreground'}
              >
                +
              </motion.span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.label}
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-4 rounded-xl border border-border bg-card text-center">
              <p className="text-[10px] font-mono uppercase tracking-wider text-primary mb-1">
                {active.number} · {active.label}
              </p>
              <p className="text-sm text-foreground leading-relaxed">{active.desc}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =====================================================================
// MAIN HOMEPAGE COMPONENT
// =====================================================================

function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(heroProgress, [0, 1], [0, 80]);

  // Intro stage: two phases so the logo's fade-out overlaps with the hero
  // text fading in.  `heroReveal` flips first (around 5.5s) to mount the
  // hero content underneath the still-visible intro; `introDone` flips later
  // (at 7.3s) to remove the intro overlay entirely. Users can skip either.
  const [heroReveal, setHeroReveal] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setHeroReveal(true), SYSTEMS_CONNECT_HANDOFF_AT * 1000);
    const t2 = setTimeout(() => setIntroDone(true), SYSTEMS_CONNECT_INTRO_DURATION * 1000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const skipIntro = () => {
    setHeroReveal(true);
    setIntroDone(true);
  };

  return (
    <>
      <Helmet>
        <title>Fluxo — One system for how your business actually runs</title>
        <meta name="description" content="Custom operational software for SMEs. Purpose-built for how your business actually runs." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
        <Header visible={introDone} />

        <main className="flex-1 overflow-hidden">
          {/* HERO — min-h ensures the section stays the same size during intro and after */}
          <section ref={heroRef} className="relative pt-20 sm:pt-24 lg:pt-32 pb-12 lg:pb-24 min-h-[850px] lg:min-h-[960px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30" />
            <div className="absolute inset-0 text-primary/60"><GridPattern opacity={0.25} /></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-primary/15 via-primary/5 to-transparent blur-3xl rounded-full pointer-events-none" />

            {/* Ambient color blobs — static (no drift) so they don't shift during intro */}
            <div className="absolute top-[20%] -left-20 w-[320px] h-[320px] bg-primary/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-[40%] -right-24 w-[380px] h-[380px] bg-[hsl(var(--fluxo-cyan))]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Intro: StarfieldIntro spans the full hero. Overlaps with hero content reveal for a smooth hand-off. */}
            <AnimatePresence>
              {!introDone && (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 z-20"
                >
                  <SystemsConnectIntro />
                  <button
                    type="button"
                    onClick={skipIntro}
                    className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-30 text-[11px] sm:text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md border border-border/60 bg-background/40 backdrop-blur-sm hover:bg-background/70 pointer-events-auto"
                    aria-label="Skip intro animation"
                  >
                    Skip →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            {heroReveal && (
                <motion.div
                  key="hero-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10"
                >

            <motion.div
              style={{ y: heroY }}
              className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
            >
              <div className="max-w-4xl mx-auto text-center mb-8 lg:mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border mb-8 text-xs font-mono tracking-wide text-muted-foreground shadow-sm"
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                  </span>
                  Operational infrastructure for SMEs
                </motion.div>

                {/* Headline — staggered line-by-line for Linear-style pacing */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold text-foreground tracking-[-0.03em] leading-[1.05] md:leading-[1.02] mb-6 sm:mb-8">
                  {['One system for how', 'your business', 'actually runs.'].map((line, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 28, filter: 'blur(12px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{
                        delay: 0.5 + i * 0.22,
                        duration: 1.0,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={`block ${i === 2 ? 'text-gradient' : ''}`}
                    >
                      {line}
                    </motion.span>
                  ))}
                </h1>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
                >
                  <span className="text-foreground font-medium">Fluxo Studio</span> builds custom systems shaped around your operation. <span className="text-foreground font-medium">Fluxo Platform</span> delivers proven SaaS you can deploy fast.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.55, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-wrap gap-2 justify-center items-center mb-8"
                >
                  <a
                    href="#what-we-build"
                    className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="font-semibold text-foreground">Studio</span>
                    <span className="text-muted-foreground">— custom builds</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </a>
                  <a
                    href="#what-we-build"
                    className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border hover:border-secondary/50 hover:bg-secondary/5 transition-colors text-xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--fluxo-cyan))]" />
                    <span className="font-semibold text-foreground">Platform</span>
                    <span className="text-muted-foreground">— SaaS products</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.75, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col sm:flex-row gap-3 justify-center items-center"
                >
                  <Button size="lg" className="h-12 px-6 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 rounded-full transition-all" asChild>
                    <a href="/contact">Get started <ArrowRight className="ml-1.5 h-4 w-4" /></a>
                  </Button>
                  <Button size="lg" variant="outline" className="h-12 px-6 text-sm font-medium border-border bg-background text-foreground hover:bg-muted/50 rounded-full" asChild>
                    <a href="/services">Explore services</a>
                  </Button>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 56, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1.95, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-6xl mx-auto"
              >
                <TiltFrame>
                  <div className="rounded-xl bg-card border border-border shadow-2xl overflow-hidden">
                    <div className="h-8 bg-muted/60 border-b border-border flex items-center gap-1.5 px-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                      <div className="flex-1 flex justify-center">
                        <div className="bg-background/80 rounded px-2 py-0.5 text-[10px] text-muted-foreground font-mono">
                          operations.example.com
                        </div>
                      </div>
                    </div>
                    <LiveOpsMockup />
                  </div>
                </TiltFrame>
              </motion.div>
            </motion.div>
                </motion.div>
              )}
          </section>

          {/* FEATURE 1: OPERATIONS OVERVIEW (static image) */}
          <section className="py-24 lg:py-32 relative border-t border-border/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeader
                headline={<>Any industry. <br /> Any <span className="text-gradient">workflow.</span></>}
                description="Marine, automotive, F&B, insurance — or something we haven't built yet. Swipe through example operational systems Fluxo ships — whether custom-built for you (Studio) or ready to deploy (Platform)."
                sectionNumber="1.0"
                sectionName="Versatility"
                availability="both"
              />

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-6xl mx-auto"
              >
                <TiltFrame>
                  <IndustryDashboard />
                </TiltFrame>
              </motion.div>

              <FeaturePills pills={[
                { number: '1.1', label: 'Dashboards', desc: 'Tailored to each industry\'s metrics. Marine shows dive hours; workshops show bay occupancy; F&B shows covers served. Same platform, different lens.' },
                { number: '1.2', label: 'Live metrics', desc: 'Key numbers update as work happens, not once a day. Team leads see operational health the moment it shifts — no lag, no stale dashboards.' },
                { number: '1.3', label: 'Alerts', desc: 'Color-coded warnings surface when thresholds are crossed — low stock, cert expiring, job overdue. You find out before your client does.' },
                { number: '1.4', label: 'Custom views', desc: 'Build as many saved views as your team needs. Filter by team, status, date, priority — each role gets what they actually care about.' },
              ]} />
            </div>
          </section>

          {/* FEATURE 2: SCHEDULING (interactive kanban) */}
          <section className="py-24 lg:py-32 relative border-t border-border/50 bg-muted/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeader
                headline={<>Schedule work <br /> as it <span className="text-gradient">flows.</span></>}
                description="Drag jobs through their lifecycle. Assign teams. Track progress from backlog to completion — with real-time visibility for everyone."
                sectionNumber="2.0"
                sectionName="Schedule"
                availability="both"
              />

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-6xl mx-auto"
              >
                <TiltFrame><FlowTimeline /></TiltFrame>
              </motion.div>

              <FeaturePills pills={[
                { number: '2.1', label: 'Weekly timeline', desc: 'See every team\'s week at a glance. Jobs laid out across days with a live "now" indicator so everyone knows what\'s in flight and what\'s next.' },
                { number: '2.2', label: 'Team swim lanes', desc: 'Each team gets its own row. No clutter, no cross-team noise — just a clean view of who has capacity and who is slammed.' },
                { number: '2.3', label: 'Live scheduling', desc: 'Drag jobs between days. Changes propagate instantly to the assigned team members\' phones and to downstream reports.' },
                { number: '2.4', label: 'Auto-balanced capacity', desc: 'Fluxo suggests assignments based on skills, certifications, current workload, and priority — so senior crew aren\'t stuck with filler and juniors aren\'t out of their depth.' },
              ]} />
            </div>
          </section>

          {/* FEATURE 3: TEAMS & COMPLIANCE (interactive) */}
          <section className="py-24 lg:py-32 relative border-t border-border/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeader
                headline={<>Teams and <br /> compliance in <span className="text-gradient">one place.</span></>}
                description="Roster, roles, certifications, expiries — nothing slips through the cracks. Proactive alerts before anything becomes a problem."
                sectionNumber="3.0"
                sectionName="Teams"
                availability="both"
              />

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-6xl mx-auto"
              >
                <TiltFrame><TeamDashboard /></TiltFrame>
              </motion.div>

              <FeaturePills pills={[
                { number: '3.1', label: 'Team roster', desc: 'Every member, every role, every skill — in one living directory. On-shift / off-shift status updates in real time so dispatchers know who\'s available.' },
                { number: '3.2', label: 'Certifications', desc: 'Every cert tracked centrally — issue date, expiry, issuing body, scanned document attached. No more chasing paper copies the night before an audit.' },
                { number: '3.3', label: 'Expiry alerts', desc: 'Automated reminders 90 / 60 / 30 days before expiry, sent to the individual and their manager. No surprises, no lapsed crew at a client site.' },
                { number: '3.4', label: 'Roles & access', desc: 'Fine-grained permissions per role. Dispatchers see scheduling, finance sees invoices, ops leads see everything. One login, right view.' },
              ]} />
            </div>
          </section>

          {/* FEATURE 4: REPORTS — single source, many outputs */}
          <section className="py-24 lg:py-32 relative border-t border-border/50 bg-muted/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeader
                headline={<>One report. <br /> Everywhere it <span className="text-gradient">matters.</span></>}
                description="Fill a single daily report — Fluxo feeds the data into every downstream output that needs it. Invoice, compliance log, team timesheet, weekly summary, monthly dashboard. No duplicate entry. No reconciliation. No lost hours."
                sectionNumber="4.0"
                sectionName="Reports"
                availability="both"
              />

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-6xl mx-auto"
              >
                <TiltFrame><ReportFlow /></TiltFrame>
              </motion.div>

              <FeaturePills pills={[
                { number: '4.1', label: 'Single source of truth', desc: 'One place to enter each operation\'s data. Every downstream report — invoice, timesheet, compliance log, weekly summary — pulls from that same source.' },
                { number: '4.2', label: 'Auto-propagation', desc: 'Fill a daily report once. Timesheets, invoices, compliance logs, KPI dashboards — all update automatically without you touching them.' },
                { number: '4.3', label: 'Downstream links', desc: 'Every derived report shows where its data came from. Traceable both ways: from the invoice back to the job, and from the job forward to every report it feeds.' },
                { number: '4.4', label: 'Zero duplicate entry', desc: 'No more Excel copy-paste. No more end-of-month reconciliation meetings. No more "which spreadsheet is the real one?" The source is the source.' },
              ]} />
            </div>
          </section>

          {/* FEATURE 5: ANALYTICS (interactive) */}
          <section className="py-24 lg:py-32 relative border-t border-border/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeader
                headline={<>Understand <br /> your <span className="text-gradient">operation.</span></>}
                description="Every metric, every trend, every revenue dimension — surfaced where you need it. Know what's working, what's not, and why."
                sectionNumber="5.0"
                sectionName="Analytics"
                availability="both"
              />

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-6xl mx-auto"
              >
                <TiltFrame><AnalyticsDashboard /></TiltFrame>
              </motion.div>

              <FeaturePills pills={[
                { number: '5.1', label: 'Role dashboards', desc: 'Custom views per role — ops, finance, compliance, leadership. Each role sees exactly the metrics that matter to them, formatted the way they think.' },
                { number: '5.2', label: 'Trend analysis', desc: 'Week-over-week, month-over-month, year-over-year comparisons. Spot patterns — seasonal dips, creeping costs, improving throughput — before they become problems.' },
                { number: '5.3', label: 'Revenue insights', desc: 'Profit per job. Profit per team. Profit per vessel, bay, table, claim. Drill into the numbers until you know exactly where your margin lives.' },
                { number: '5.4', label: 'Custom reports', desc: 'Build your own reports from the metrics you track, formatted the way you present them to clients or the board. Export to PDF, Excel, or live link.' },
              ]} />
            </div>
          </section>

          {/* SOCIAL PROOF — testimonial carousel (moved below features) */}
          <section className="py-24 lg:py-28 relative border-t border-border/50 bg-muted/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto mb-12 text-center"
              >
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">Real operators</p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-[1.15]">
                  Built with operators. <span className="text-gradient">Running on their operations.</span>
                </h2>
              </motion.div>

              <SocialProof />
            </div>
          </section>

          {/* WHAT WE BUILD — two-path decision just before the closing CTA */}
          <section id="what-we-build" className="py-24 lg:py-32 relative border-t border-border/50 scroll-mt-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto mb-12 text-center"
              >
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">What we build</p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-[1.15]">
                  Two paths. <span className="text-gradient">Shaped around you.</span>
                </h2>
                <p className="text-base md:text-lg text-muted-foreground mt-4">
                  Whichever path fits your operation — we'll meet you where you are.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="group relative bg-gradient-to-br from-card to-muted/30 border border-border rounded-2xl p-8 md:p-10 hover:border-secondary/40 transition-colors overflow-hidden"
                >
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 text-secondary-foreground text-[10px] font-mono uppercase tracking-wider mb-6 border border-secondary/30">
                      <Sparkles className="w-3 h-3" />
                      Coming 2027
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">Fluxo Platform</h3>
                    <p className="text-muted-foreground mb-8 leading-relaxed">
                      Multi-tenant SaaS, distilled from the custom systems we've shipped. Deploy in hours with proven patterns already built in.
                    </p>
                    <div className="mb-8 bg-background/60 backdrop-blur rounded-xl p-4 border border-border">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Availability</p>
                      <p className="text-sm font-medium text-foreground">Launching 2027 — early access on request</p>
                    </div>
                    <Button variant="outline" className="w-full h-11 text-sm border-border bg-background hover:bg-muted rounded-full" asChild>
                      <a href="/services">Join the waitlist</a>
                    </Button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="group relative bg-card border border-border rounded-2xl p-8 md:p-10 hover:border-primary/40 transition-colors"
                >
                  <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-mono uppercase tracking-wider mb-6 border border-primary/20">
                    Available now
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Fluxo Studio</h3>
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    Custom software, built for your specific operation. Dedicated infrastructure, full data ownership, ongoing support.
                  </p>
                  <div className="mb-8 bg-muted/40 rounded-xl p-4 border border-border/50">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">How it works</p>
                    <p className="text-sm font-medium text-foreground">Discovery → build → ongoing partnership</p>
                  </div>
                  <Button className="w-full h-11 text-sm bg-foreground text-background hover:bg-foreground/90 rounded-full" asChild>
                    <a href="/contact">Start your custom build <MoveRight className="ml-1.5 w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></a>
                  </Button>
                </motion.div>
              </div>
            </div>
          </section>

          {/* CLOSING CTA — interactive fit-finder */}
          <section className="py-28 lg:py-36 relative border-t border-border/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/40" />
            <div className="absolute inset-0 text-primary/60"><GridPattern opacity={0.2} /></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-primary/15 to-transparent blur-3xl rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-3xl mx-auto text-center mb-10"
              >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 text-foreground tracking-tight leading-[1.05]">
                  Your operation. <br />
                  <span className="text-gradient">On software that matches.</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                  Not sure which option fits? Take 90 seconds. We'll point you the right way.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <WhichFit />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center mt-8 text-sm text-muted-foreground"
              >
                Prefer to skip the quiz?{' '}
                <a href="/contact" className="text-foreground font-medium hover:text-primary transition-colors underline underline-offset-4">
                  Just reach out →
                </a>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default HomePage;
