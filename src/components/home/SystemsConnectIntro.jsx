import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Calendar, LayoutGrid, FileText, BarChart3, ShieldCheck,
} from 'lucide-react';

// Responsive hook for screen width
function useWindowWidth() {
  const [w, setW] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1024));
  useEffect(() => {
    const handler = () => setW(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return w;
}

/**
 * SystemsConnectIntro
 * Generic business functions converge on Fluxo.
 *
 * Changes in this pass:
 *  - Network is CENTERED where the headline will be (top ~30%),
 *    not in the middle of the whole hero section
 *  - Lines + icons fully cleared BEFORE the logo starts appearing,
 *    so the logo has a clean stage
 *  - Feature labels are now universal business functions
 *    (Team, Schedule, Operations, Reports, Data, Compliance) —
 *    the kind every company needs, not Fluxo-specific jargon
 *
 * Timeline (7.7s total — overlaps with hero reveal in the last ~1.8s):
 *   0.0 – 0.3s   ambient glow breathes in at top of hero
 *   0.3 – 1.6s   6 feature icons fade in one at a time (stagger 0.15s)
 *   1.6 – 1.9s   icons settle, labels finish reading
 *   1.9 – 2.9s   spokes DRAW from each icon toward the center
 *   3.0 – 3.4s   SYNC PULSE — pulses travel inward simultaneously
 *   3.4 – 3.9s   icons + lines fade and converge inward
 *   3.9 – 4.3s   BURST + shockwave at the center (clean stage)
 *   4.4 – 5.6s   Fluxo logo graceful fade-in (blur-to-sharp)
 *   5.6 – 6.6s   logo holds with subtle breath
 *   6.6 – 7.4s   logo graceful fade-out
 *   5.9 – 7.7s   HERO CONTENT fades in underneath (overlap zone)
 */

export const SYSTEMS_CONNECT_INTRO_DURATION = 7.7;

// Hero content starts revealing before the intro finishes, so the logo's
// fade-out overlaps with the headline fading in. Feels like a hand-off
// rather than a scene change.
export const SYSTEMS_CONNECT_HANDOFF_AT = 5.9;

const FEATURES = [
  { key: 'team',       Icon: Users,       label: 'Team' },
  { key: 'schedule',   Icon: Calendar,    label: 'Schedule' },
  { key: 'operations', Icon: LayoutGrid,  label: 'Operations' },
  { key: 'reports',    Icon: FileText,    label: 'Reports' },
  { key: 'data',       Icon: BarChart3,   label: 'Data' },
  { key: 'compliance', Icon: ShieldCheck, label: 'Compliance' },
];

// Hexagonal layout around a center. Radius is responsive — shrinks on mobile
// so icons don't push past the viewport edges.
function getPosition(index, radius) {
  const angle = (index * 60 - 90) * (Math.PI / 180); // -90 so index 0 is at top
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}

function getResponsiveRadius(width) {
  if (width < 380) return 95;
  if (width < 640) return 120;
  if (width < 1024) return 150;
  return 180;
}

// Visual center — slightly higher on mobile so it doesn't feel too low
// against the phone's safe area, centered on desktop.
const CENTER_CLASS = 'top-[38%] sm:top-1/2';

export default function SystemsConnectIntro() {
  const winW = useWindowWidth();
  const radius = getResponsiveRadius(winW);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Ambient glow — positioned at the hero headline area (responsive size) */}
      <motion.div
        className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] sm:w-[560px] md:w-[720px] h-[420px] sm:h-[560px] md:h-[720px] rounded-full pointer-events-none ${CENTER_CLASS}`}
        style={{
          background:
            'radial-gradient(circle, hsl(var(--primary) / 0.14) 0%, hsl(var(--fluxo-cyan) / 0.06) 35%, transparent 60%)',
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0, 0.7, 0.9, 1, 0.2],
          scale: [0.8, 1, 1, 0.5, 0.2],
        }}
        transition={{
          duration: 7.7,
          times: [0, 0.1, 0.49, 0.55, 1],
          ease: [0.16, 1, 0.3, 1],
        }}
      />

      {/* Network container */}
      <div
        className={`absolute left-1/2 ${CENTER_CLASS}`}
        style={{
          transform: 'translate(-50%, -50%)',
          width: 0,
          height: 0,
        }}
      >
        {/* SVG layer: futuristic spokes + pulses */}
        <svg
          className="absolute pointer-events-none"
          width="600"
          height="600"
          viewBox="-300 -300 600 600"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        >
          <defs>
            <linearGradient id="spoke-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.85" />
              <stop offset="100%" stopColor="hsl(var(--fluxo-cyan))" stopOpacity="0.3" />
            </linearGradient>
            <filter id="pulse-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.4" />
            </filter>
          </defs>

          {/* Outer group handles SYNCED fade-out of all lines together
              (each line's individual draw-in stays staggered via pathLength) */}
          <motion.g
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 1, 0] }}
            transition={{
              duration: 8.2,
              times: [0, 0.415, 0.47],   // hold until ~3.4s, fade by ~3.85s
              ease: 'easeOut',
            }}
          >
            {FEATURES.map((_, i) => {
              const pos = getPosition(i, radius);
              const pathD = `M ${pos.x} ${pos.y} L 0 0`;
              return (
                <g key={i}>
                  {/* GLOW BASE — draws in staggered */}
                  <motion.line
                    x1={pos.x}
                    y1={pos.y}
                    x2={0}
                    y2={0}
                    stroke="hsl(var(--primary))"
                    strokeWidth="5"
                    strokeLinecap="round"
                    opacity="0.18"
                    filter="url(#pulse-glow)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: 1.9 + i * 0.12,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />

                  {/* MAIN LINE — draws in staggered */}
                  <motion.line
                    x1={pos.x}
                    y1={pos.y}
                    x2={0}
                    y2={0}
                    stroke="url(#spoke-grad)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    opacity="0.9"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: 1.9 + i * 0.12,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />

                  {/* DATA FLOW OVERLAY — draws in staggered, then streams infinitely */}
                  <motion.line
                    x1={pos.x}
                    y1={pos.y}
                    x2={0}
                    y2={0}
                    stroke="hsl(var(--primary))"
                    strokeWidth="0.9"
                    strokeLinecap="round"
                    strokeDasharray="3 5"
                    opacity="0.95"
                    initial={{ pathLength: 0, strokeDashoffset: 0 }}
                    animate={{
                      pathLength: 1,
                      strokeDashoffset: [0, -200],
                    }}
                    transition={{
                      pathLength: {
                        duration: 0.6,
                        delay: 1.9 + i * 0.12,
                        ease: [0.16, 1, 0.3, 1],
                      },
                      strokeDashoffset: {
                        duration: 2.2,
                        delay: 1.9 + i * 0.12,
                        repeat: Infinity,
                        ease: 'linear',
                      },
                    }}
                  />

                  {/* SYNC PULSE (fires once at 3.0s across all lines) */}
                  <motion.circle
                    r="5"
                    fill="hsl(var(--primary))"
                    filter="url(#pulse-glow)"
                    initial={{ offsetDistance: '0%', opacity: 0 }}
                    animate={{
                      offsetDistance: ['0%', '100%'],
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      duration: 0.7,
                      delay: 3.0,
                      times: [0, 0.15, 0.85, 1],
                      ease: 'easeInOut',
                    }}
                    style={{
                      offsetPath: `path('${pathD}')`,
                    }}
                  />
                </g>
              );
            })}
          </motion.g>

          {/* Center collector dot */}
          <motion.circle
            cx={0}
            cy={0}
            r="4"
            fill="hsl(var(--primary))"
            filter="url(#pulse-glow)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0, 1, 1, 0], scale: [0, 0, 1, 1.8, 2.5] }}
            transition={{
              duration: 1.5,
              delay: 3.2,
              times: [0, 0.1, 0.4, 0.6, 1],
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        </svg>

        {/* Feature icon nodes */}
        {FEATURES.map((feature, i) => {
          const pos = getPosition(i, radius);
          return (
            <motion.div
              key={feature.key}
              className="absolute"
              style={{ top: 0, left: 0 }}
              initial={{
                opacity: 0,
                scale: 0,
                x: pos.x,
                y: pos.y,
              }}
              animate={{
                // Slower stagger (0.15s between icons) so each feature has
                // time to read. Icons hold full size until lines finish
                // drawing (~3.1s) and sync pulse lands (~3.0s), then
                // converge in time for the burst at ~3.8s.
                opacity: [0, 1, 1, 1, 0],
                scale: [0, 1, 1, 0.32, 0],
                x: [pos.x, pos.x, pos.x, 0, 0],
                y: [pos.y, pos.y, pos.y, 0, 0],
              }}
              transition={{
                duration: 3.2,
                delay: 0.3 + i * 0.15,
                times: [0, 0.18, 0.85, 0.96, 1],
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <FeatureNode feature={feature} index={i} />
            </motion.div>
          );
        })}
      </div>

      {/* BURST — outer div owns centering, inner div owns scale animation.
          (Framer Motion's transform overrides Tailwind's translate, so the
          scale has to live on a child of the positioned element.) */}
      <div className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none ${CENTER_CLASS}`}>
        <motion.div
          className="w-2 h-2 rounded-full"
          style={{
            background:
              'radial-gradient(closest-side, white 0%, hsl(var(--primary)) 35%, transparent 75%)',
            boxShadow: '0 0 100px 50px hsl(var(--primary) / 0.55)',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0, 1, 0], scale: [0, 0, 50, 100] }}
          transition={{
            duration: 1.2,
            delay: 3.8,
            times: [0, 0.15, 0.45, 1],
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </div>

      {/* Shockwave ring — same outer/inner split for true centering */}
      <div className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none ${CENTER_CLASS}`}>
        <motion.div
          className="w-10 h-10 rounded-full border-2 border-primary"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0, 1, 0], scale: [0, 0, 12, 22] }}
          transition={{
            duration: 1.3,
            delay: 3.85,
            times: [0, 0.15, 0.4, 1],
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </div>

      {/* Fluxo logo — starts AFTER network is fully cleared, long graceful arc */}
      <motion.div
        className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none ${CENTER_CLASS}`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.55, filter: 'blur(22px)' }}
          animate={{
            opacity: [0, 0, 1, 1, 1, 0],
            scale: [0.55, 0.55, 1, 1.02, 1.04, 1.1],
            filter: [
              'blur(22px)',
              'blur(22px)',
              'blur(0px)',
              'blur(0px)',
              'blur(0px)',
              'blur(10px)',
            ],
          }}
          transition={{
            // 3.3s: fade in, hold, graceful fade out
            duration: 3.3,
            delay: 4.4,
            times: [0, 0.09, 0.33, 0.5, 0.85, 1],
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {/* Light-theme logo — dark halo behind it keeps it readable
              against the bright burst/ambient glow */}
          <img
            src="/logos/fluxo-light.png"
            alt="Fluxo"
            className="h-20 sm:h-24 md:h-28 drop-shadow-[0_0_24px_rgba(0,0,0,0.25)] drop-shadow-[0_0_60px_rgba(46,127,203,0.45)] dark:hidden"
          />
          <img
            src="/logos/fluxo-dark.png"
            alt="Fluxo"
            className="h-20 sm:h-24 md:h-28 drop-shadow-[0_0_50px_rgba(80,160,255,0.7)] hidden dark:block"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

function FeatureNode({ feature, index }) {
  const Icon = feature.Icon;
  return (
    <div
      className="flex flex-col items-center gap-2"
      style={{ transform: 'translate(-50%, -50%)' }}
    >
      <motion.div
        className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-card border-2 border-border shadow-xl flex items-center justify-center"
        animate={{
          borderColor: [
            'hsl(var(--border))',
            'hsl(var(--primary) / 0.45)',
            'hsl(var(--border))',
          ],
        }}
        transition={{
          duration: 2.2,
          repeat: 2,
          ease: 'easeInOut',
          delay: 0.7 + index * 0.15,
        }}
      >
        <Icon className="w-6 h-6 md:w-7 md:h-7 text-foreground" strokeWidth={1.8} />

        {/* Expanding pulse ring on sync wave */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-primary pointer-events-none"
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: [0, 1, 0], scale: [1, 1.4, 1.9] }}
          transition={{
            duration: 0.9,
            delay: 3.0,
            times: [0, 0.3, 1],
            ease: 'easeOut',
          }}
        />
      </motion.div>

      {/* Label — foreground/80 for readable contrast in both themes */}
      <motion.div
        className="text-[9px] font-mono uppercase tracking-wider text-foreground/80 whitespace-nowrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 2.8,
          delay: 0.5 + index * 0.15,
          times: [0, 0.25, 0.88, 0.97],
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {feature.label}
      </motion.div>
    </div>
  );
}
