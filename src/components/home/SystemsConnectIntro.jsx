import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Calendar, LayoutGrid, FileText, BarChart3, ShieldCheck,
} from 'lucide-react';
import { MODULE_POSITIONS, MARK_BOX } from '@/components/FluxoLogo.jsx';

/**
 * SystemsConnectIntro — phase-driven state machine.
 *
 * Each component reads a single `phase` value and animates between
 * concrete target states (no complex keyframe arrays).
 *
 * Phases (driven by setTimeout from mount):
 *   0 INITIAL  — everything hidden                                    [t=0]
 *   1 TEXT     — FLUXO + tagline fade in                              [t=0.3s]
 *   2 ICONS    — 6 icons appear one-by-one (per-icon delay)           [t=1.0s]
 *   3 HEXAGON  — hexagon perimeter draws around all 6 icons           [t=2.6s]
 *   4 HELD     — hexagon complete, brief brightening, hold            [t=3.6s]
 *   5 FLYING   — icons fly to module positions, gradually morphing
 *                into gradient blocks during the second half of the flight [t=4.4s]
 *   6 MORPHED  — full lockup visible, brief settle                    [t=5.2s]
 *   7 PULSE    — the whole logo pulses + glow ring expands            [t=5.8s]
 *   8 FADING   — whole composition fades out                          [t=6.4s]
 *   end                                                               [t=7.0s]
 */

const PHASES = {
  INITIAL: 0,
  TEXT: 1,
  ICONS: 2,
  HEXAGON: 3,
  HELD: 4,
  FLYING: 5,
  MORPHED: 6,
  PULSE: 7,
  FADING: 8,
};

const PHASE_TIMES_MS = {
  [PHASES.TEXT]:    300,
  [PHASES.ICONS]:   1000,
  [PHASES.HEXAGON]: 2600,
  [PHASES.HELD]:    3600,
  [PHASES.FLYING]:  4400,
  [PHASES.MORPHED]: 5200,
  [PHASES.PULSE]:   5800,
  [PHASES.FADING]:  7200,
};

export const SYSTEMS_CONNECT_INTRO_DURATION = 8.4;
export const SYSTEMS_CONNECT_HANDOFF_AT = 7.4;

// Shared fade-out timing — wordmark, modules, bridges, and ambient glow
// all blur + fade with these values so the dissolution reads as one motion.
const FADE_DURATION = 1.0;
const FADE_BLUR = 'blur(14px)';

// Shared pulse timing — wordmark, bridges, and module icons must all use
// these exact values so the glow appears in perfect sync across the lockup.
const PULSE_DURATION = 1.2;
const PULSE_TIMES = [0, 0.5, 1];
const PULSE_EASE = 'easeInOut';

const FEATURES = [
  { key: 'team',       Icon: Users,       label: 'Team' },
  { key: 'schedule',   Icon: Calendar,    label: 'Schedule' },
  { key: 'operations', Icon: LayoutGrid,  label: 'Operations' },
  { key: 'reports',    Icon: FileText,    label: 'Reports' },
  { key: 'data',       Icon: BarChart3,   label: 'Data' },
  { key: 'compliance', Icon: ShieldCheck, label: 'Compliance' },
];

// Map each hexagon icon to a logo module (which slot it flies into).
const ICON_TO_MODULE = [1, 2, 4, 5, 3, 0];

// Icon entrance is staggered: each icon enters 0.18s after the previous.
const ICON_ENTRY_STAGGER = 0.18;
// Flight stagger: each icon starts its flight 0.06s after the previous.
const FLIGHT_STAGGER = 0.06;
const FLIGHT_DURATION = 0.7;

// =====================================================================
// Geometry helpers
// =====================================================================

function useWindowWidth() {
  const [w, setW] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1024));
  useEffect(() => {
    const handler = () => setW(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return w;
}

function getHexPosition(index, radius) {
  const angle = (index * 60 - 90) * (Math.PI / 180);
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
}

function getResponsiveRadius(width) {
  if (width < 380) return 130;
  if (width < 640) return 150;
  if (width < 1024) return 180;
  return 205;
}

function getMarkDisplaySize(width) {
  if (width < 380) return 60;
  if (width < 640) return 70;
  if (width < 1024) return 84;
  return 100;
}

const CENTER_CLASS = 'top-[38%] sm:top-1/2';

const GRAD_STOPS = [
  { offset: '0%',   color: '#2A9EFF' },
  { offset: '50%',  color: '#5358E2' },
  { offset: '100%', color: '#7C28D8' },
];

// =====================================================================
// Phase-driven component
// =====================================================================

export default function SystemsConnectIntro() {
  const winW = useWindowWidth();
  const radius = getResponsiveRadius(winW);
  const markDisplay = getMarkDisplaySize(winW);

  const scale = markDisplay / MARK_BOX.height;
  const moduleSizePx = 28 * scale;
  const cornerRadiusPx = 7 * scale;

  const iconCardSize = winW >= 768 ? 64 : 56;
  // Exact size match so the icon overlay and the SVG module overlap
  // perfectly during the morph→module crossfade (no second-logo halo).
  const iconArrivalScale = moduleSizePx / iconCardSize;

  // Wordmark sizing
  const wordmarkSize = Math.round(markDisplay * 0.62);
  const taglineSize = Math.max(9, Math.round(markDisplay * 0.13));
  // Generous wordmark-width estimate (5 chars × ~0.6em + 4 × 0.18em
  // letter-spacing rounds up to ~3.9em; we use 4.0 for safety so the
  // mark sits comfortably to the LEFT of FLUXO with no overlap).
  const wordmarkWidth = wordmarkSize * 4.0;
  const lockupGap = Math.round(markDisplay * 0.28);

  // Wordmark stays at the geometric centre (x=0) of the hexagon orbit.
  // Mark forms to its LEFT — beside the wordmark, with the standard gap.
  // Icons fly directly to these module positions; nothing shifts after.
  const wordmarkCenterX = 0;
  const wordmarkLeft = wordmarkCenterX - wordmarkWidth / 2;
  const markCenterX = wordmarkLeft - lockupGap - markDisplay / 2;

  const moduleTargets = MODULE_POSITIONS.map((p) => ({
    x: markCenterX + (p.cx - MARK_BOX.width / 2) * scale,
    y: (p.cy - MARK_BOX.height / 2) * scale,
  }));

  // Bridge 1: between mod 1 (top-mid) and mod 4 (mid-mid) — vertical
  const bridge1 = {
    x: markCenterX + (MODULE_POSITIONS[1].cx - MARK_BOX.width / 2) * scale - 4 * scale,
    y: (MODULE_POSITIONS[1].cy + 14 - MARK_BOX.height / 2) * scale,
    w: 8 * scale,
    h: 4 * scale,
  };
  // Bridge 2: between mod 3 (mid-left) and mod 4 (mid-mid) — horizontal
  const bridge2 = {
    x: markCenterX + (MODULE_POSITIONS[3].cx + 14 - MARK_BOX.width / 2) * scale,
    y: (MODULE_POSITIONS[3].cy - MARK_BOX.height / 2) * scale - 4 * scale,
    w: 4 * scale,
    h: 8 * scale,
  };

  // ---- Phase state machine ----
  const [phase, setPhase] = useState(PHASES.INITIAL);

  useEffect(() => {
    const timers = Object.entries(PHASE_TIMES_MS).map(([phaseValue, ms]) =>
      setTimeout(() => setPhase(Number(phaseValue)), ms)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const fading = phase >= PHASES.FADING;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Ambient glow — always present, fades with the lockup */}
      <motion.div
        className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] sm:w-[560px] md:w-[720px] h-[420px] sm:h-[560px] md:h-[720px] rounded-full pointer-events-none ${CENTER_CLASS}`}
        style={{
          background:
            'radial-gradient(circle, hsl(var(--primary) / 0.14) 0%, hsl(var(--fluxo-cyan) / 0.06) 35%, transparent 60%)',
        }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{
          opacity: fading ? 0 : 0.9,
          scale: fading ? 0.5 : 1,
        }}
        transition={{ duration: fading ? FADE_DURATION : 0.8, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Network container — anchors all coords on its centre */}
      <div
        className={`absolute left-1/2 ${CENTER_CLASS}`}
        style={{ transform: 'translate(-50%, -50%)', width: 0, height: 0 }}
      >
        {/* WORDMARK + TAGLINE — anchored at the wordmark's final position
            (right of centre). Stays put through the morph + pulse + fade. */}
        <WordmarkBlock
          phase={phase}
          wordmarkSize={wordmarkSize}
          taglineSize={taglineSize}
          wordmarkCenterX={wordmarkCenterX}
        />

        {/* HEXAGON PERIMETER — orbits around network centre (0,0) */}
        <HexagonPerimeter phase={phase} radius={radius} />

        {/* FEATURE ICONS — appear staggered, fly directly to final module
            positions (which sit to the left of centre, beside the wordmark) */}
        {FEATURES.map((feature, i) => {
          const moduleIdx = ICON_TO_MODULE[i];
          const modulePos = MODULE_POSITIONS[moduleIdx];
          return (
            <FeatureIcon
              key={feature.key}
              feature={feature}
              index={i}
              phase={phase}
              hexPos={getHexPosition(i, radius)}
              modPos={moduleTargets[moduleIdx]}
              iconArrivalScale={iconArrivalScale}
              moduleCol={modulePos.col}
              moduleRow={modulePos.row}
            />
          );
        })}

        {/* LOGO MARK — modules pop in at MORPHED, pulse at PULSE */}
        <LogoMark
          phase={phase}
          moduleTargets={moduleTargets}
          moduleSizePx={moduleSizePx}
          cornerRadiusPx={cornerRadiusPx}
          bridge1={bridge1}
          bridge2={bridge2}
        />
      </div>
    </div>
  );
}

// =====================================================================
// Subcomponents — each reads `phase` and animates between concrete states
// =====================================================================

function WordmarkBlock({ phase, wordmarkSize, taglineSize, wordmarkCenterX }) {
  // Wordmark + tagline appear together with the logo modules at MORPHED —
  // they no longer fade in at the start.
  const showWordmark = phase >= PHASES.MORPHED && phase < PHASES.FADING;
  const showTagline = phase >= PHASES.MORPHED && phase < PHASES.FADING;
  const pulsing = phase === PHASES.PULSE;

  // Centre the FLUXO text on (0, 0) — not the wordmark+tagline stack centre.
  // Otherwise the tagline below pushes the visible wordmark text upward
  // and it stops aligning with the mark's vertical centre.
  // gap (mt-1.5) = 6px in Tailwind.
  const TAGLINE_GAP = 6;
  const stackHeight = wordmarkSize + TAGLINE_GAP + taglineSize;
  const stackOffsetY = (stackHeight - wordmarkSize) / 2;

  return (
    <div
      className="absolute pointer-events-none"
      style={{ top: 0, left: `${wordmarkCenterX}px` }}
    >
      {/* Static centring wrapper. Inner motion.div owns the pulse so the
          scale doesn't fight the static translate. */}
      <div
        style={{ transform: `translate(-50%, calc(-50% + ${stackOffsetY}px))` }}
      >
      <motion.div
        className="flex flex-col items-center leading-none"
        initial={{ scale: 1, filter: 'drop-shadow(0 0 0 transparent) drop-shadow(0 0 0 transparent) blur(0px)' }}
        animate={{
          scale: pulsing ? [1, 1.08, 1] : 1,
          filter:
            phase === PHASES.FADING
              ? `drop-shadow(0 0 0 transparent) drop-shadow(0 0 0 transparent) ${FADE_BLUR}`
              : pulsing
              ? [
                  'drop-shadow(0 0 0 transparent) drop-shadow(0 0 0 transparent) blur(0px)',
                  'drop-shadow(0 0 12px rgba(77, 195, 250, 0.95)) drop-shadow(0 0 28px rgba(91, 124, 255, 0.7)) blur(0px)',
                  'drop-shadow(0 0 0 transparent) drop-shadow(0 0 0 transparent) blur(0px)',
                ]
              : 'drop-shadow(0 0 0 transparent) drop-shadow(0 0 0 transparent) blur(0px)',
        }}
        transition={
          phase === PHASES.FADING
            ? { duration: FADE_DURATION, ease: 'easeOut' }
            : pulsing
            ? {
                scale: { duration: PULSE_DURATION, times: PULSE_TIMES, ease: PULSE_EASE },
                filter: { duration: PULSE_DURATION, times: PULSE_TIMES, ease: PULSE_EASE },
              }
            : { duration: 0.2 }
        }
      >
        <motion.span
          className="font-semibold text-foreground whitespace-nowrap"
          style={{
            fontFamily:
              "'Geist', 'Inter', 'Bahnschrift', 'Eurostile', system-ui, -apple-system, sans-serif",
            fontSize: `${wordmarkSize}px`,
            letterSpacing: '0.18em',
            lineHeight: 1,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: showWordmark ? 1 : 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          FLUXO
        </motion.span>
        <motion.span
          className="mt-1.5 text-foreground/70 whitespace-nowrap"
          style={{
            fontFamily:
              "'Geist', 'Inter', system-ui, -apple-system, sans-serif",
            fontSize: `${taglineSize}px`,
            letterSpacing: '0.32em',
            lineHeight: 1,
            fontWeight: 400,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: showTagline ? 1 : 0 }}
          transition={{ duration: 0.6, delay: showTagline ? 0.2 : 0, ease: [0.16, 1, 0.3, 1] }}
        >
          WHERE&nbsp;SYSTEMS&nbsp;CONNECT
        </motion.span>
      </motion.div>
      </div>
    </div>
  );
}

function HexagonPerimeter({ phase, radius }) {
  // Hexagon points: each icon position
  const hexPoints = FEATURES.map((_, i) => getHexPosition(i, radius));
  const pointsAttr = hexPoints.map((p) => `${p.x},${p.y}`).join(' ');
  // Regular hexagon perimeter = 6 × radius (each side equals the radius)
  const perimeterLen = 6 * radius;

  // Drawing state: dashoffset is at perimeterLen (hidden) until HEXAGON
  // phase, then animates to 0 (fully drawn). Group opacity fades at FLYING.
  const isDrawing = phase >= PHASES.HEXAGON;
  const isFading = phase >= PHASES.FLYING;
  const isFlashing = phase === PHASES.HELD;

  return (
    <svg
      className="absolute pointer-events-none"
      width="600"
      height="600"
      viewBox="-300 -300 600 600"
      style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
    >
      <defs>
        <filter id="edge-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
      </defs>

      <motion.g
        initial={{ opacity: 1 }}
        animate={{ opacity: isFading ? 0 : 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Glow halo */}
        <motion.polygon
          points={pointsAttr}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#edge-glow)"
          strokeDasharray={perimeterLen}
          initial={{ strokeDashoffset: perimeterLen, opacity: 0.22 }}
          animate={{
            strokeDashoffset: isDrawing ? 0 : perimeterLen,
            opacity: isFlashing ? 0.6 : 0.32,
          }}
          transition={{
            strokeDashoffset: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 0.3 },
          }}
        />

        {/* Main edge — solid colour, no gradient (eliminates SVG bbox issues
            with gradients on stroke-only paths) */}
        <motion.polygon
          points={pointsAttr}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={perimeterLen}
          initial={{ strokeDashoffset: perimeterLen }}
          animate={{ strokeDashoffset: isDrawing ? 0 : perimeterLen }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Completion flash — bright white outline at HELD phase */}
        <motion.polygon
          points={pointsAttr}
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#edge-glow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: isFlashing ? 0.9 : 0 }}
          transition={{ duration: isFlashing ? 0.2 : 0.4 }}
        />
      </motion.g>
    </svg>
  );
}

function FeatureIcon({ feature, index, phase, hexPos, modPos, iconArrivalScale, moduleCol, moduleRow }) {
  const Icon = feature.Icon;

  // Position state — drives the outer motion.div (x, y, scale, opacity)
  const visible = phase >= PHASES.ICONS;
  const atTarget = phase >= PHASES.FLYING;
  const pulsing = phase === PHASES.PULSE;
  const targetX = atTarget ? modPos.x : hexPos.x;
  const targetY = atTarget ? modPos.y : hexPos.y;
  // Pulse: briefly scale up by 8% on top of the arrival size
  const baseScale = atTarget ? iconArrivalScale : (visible ? 1 : 0);
  const pulseScale = atTarget ? iconArrivalScale * 1.08 : baseScale;
  // Icons STAY visible past MORPHED — they ARE the modules now (no
  // separate SVG module rect, no possibility of two logos overlapping).
  const targetOpacity = visible && phase < PHASES.FADING ? 1 : 0;

  // Morph state — drives the inner crossfade (icon → gradient block).
  // Starts mid-flight so the icon is visibly transforming as it travels.
  const morphed = phase >= PHASES.FLYING;
  // Mid-flight delay so the morph reads as "happens during the flight"
  const morphDelay = phase === PHASES.FLYING ? index * FLIGHT_STAGGER + FLIGHT_DURATION * 0.45 : 0;
  const morphDuration = phase === PHASES.FLYING ? FLIGHT_DURATION * 0.55 : 0.25;

  // Per-phase outer animation timing
  let delay = 0;
  let duration = 0.3;
  if (phase === PHASES.ICONS) {
    delay = index * ICON_ENTRY_STAGGER;
    duration = 0.4;
  } else if (phase === PHASES.FLYING) {
    delay = index * FLIGHT_STAGGER;
    duration = FLIGHT_DURATION;
  } else if (phase === PHASES.FADING) {
    duration = FADE_DURATION;
  }

  return (
    <motion.div
      className="absolute"
      // transformOrigin '0 0' is required so the scale animation doesn't
      // drift the card away from its target modPos. Default 'center' would
      // shift the card by ~16px down-right at iconArrivalScale (~0.5),
      // pulling it out of alignment with the SVG bridges.
      style={{ top: 0, left: 0, transformOrigin: '0 0' }}
      initial={{ opacity: 0, scale: 0, x: hexPos.x, y: hexPos.y, filter: 'blur(0px)' }}
      animate={{
        opacity: targetOpacity,
        scale: baseScale,
        x: targetX,
        y: targetY,
        filter: phase === PHASES.FADING ? FADE_BLUR : 'blur(0px)',
      }}
      transition={{
        delay,
        duration,
        ease: phase === PHASES.FLYING ? [0.16, 1, 0.3, 1] : 'easeOut',
      }}
    >
      {/* Card centred on the motion.div's origin (no flex layout offset).
          Label is absolutely positioned BELOW so it doesn't push the
          card's centre off the target position. */}
      <div
        className="relative w-14 h-14 md:w-16 md:h-16"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        {/* Card layer — bg + border + shadow. Border + shadow fade as
            the morph kicks in so it stops looking like a card. */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-card border-2 border-border shadow-xl"
          initial={{ opacity: 1 }}
          animate={{ opacity: morphed ? 0 : 1 }}
          transition={{ delay: morphDelay, duration: morphDuration, ease: 'easeOut' }}
        />

        {/* Gradient block — each module shows its own SLICE of one larger
            gradient that spans the whole F. With background-size 328.57%
            and position based on (col, row), the modules together display
            a single continuous diagonal gradient (matches the brand sheet
            and the FluxoLogo SVG which uses gradientUnits="userSpaceOnUse"). */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            backgroundImage:
              'linear-gradient(135deg, #2A9EFF 0%, #5358E2 50%, #7C28D8 100%)',
            backgroundSize: '328.57% 328.57%',
            backgroundPosition: `${moduleCol * 50}% ${moduleRow * 50}%`,
            backgroundRepeat: 'no-repeat',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: morphed ? 1 : 0 }}
          transition={{
            opacity: { delay: morphDelay, duration: morphDuration, ease: 'easeOut' },
          }}
        />

        {/* Icon glyph — fades out as the morph progresses */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: morphed ? 0 : 1 }}
          transition={{ delay: morphDelay, duration: morphDuration * 0.6, ease: 'easeOut' }}
        >
          <Icon className="w-6 h-6 md:w-7 md:h-7 text-foreground" strokeWidth={1.8} />
        </motion.div>

        {/* Label — absolutely positioned BELOW the card (doesn't affect
            the card's centre alignment with the target position) */}
        <motion.div
          className="absolute left-1/2 text-[9px] font-mono uppercase tracking-wider text-foreground/80 whitespace-nowrap"
          style={{ top: 'calc(100% + 8px)', transform: 'translateX(-50%)' }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: phase >= PHASES.ICONS && phase <= PHASES.HELD ? 1 : 0,
          }}
          transition={{
            duration: 0.3,
            delay: phase === PHASES.ICONS ? index * ICON_ENTRY_STAGGER + 0.15 : 0,
          }}
        >
          {feature.label}
        </motion.div>
      </div>
    </motion.div>
  );
}

function LogoMark({ phase, moduleTargets, moduleSizePx, cornerRadiusPx, bridge1, bridge2 }) {
  // SVG modules are GONE — the icon's HTML gradient overlay IS the module
  // from MORPHED onwards. This SVG layer only owns the connection bridges
  // (which need vector geometry) and the pulse glow filter.
  const showBridges = phase >= PHASES.MORPHED && phase < PHASES.FADING;
  const pulsing = phase === PHASES.PULSE;

  // Compute mark centre for the pulse transform-origin
  const markCx = (moduleTargets[0].x + moduleTargets[2].x) / 2;
  const markCy = (moduleTargets[0].y + moduleTargets[5].y) / 2;

  return (
    <svg
      className="absolute pointer-events-none overflow-visible"
      width="1"
      height="1"
      style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        overflow: 'visible',
      }}
    >
      <defs>
        <linearGradient
          id="intro-mark-grad"
          gradientUnits="userSpaceOnUse"
          x1={moduleTargets[0].x - moduleSizePx / 2}
          y1={moduleTargets[0].y - moduleSizePx / 2}
          x2={moduleTargets[5].x + moduleSizePx / 2}
          y2={moduleTargets[5].y + moduleSizePx / 2}
        >
          {GRAD_STOPS.map((s) => (
            <stop key={s.offset} offset={s.offset} stopColor={s.color} />
          ))}
        </linearGradient>
      </defs>

      {/* Bridges — sit in place, no pulse, blur out on FADING with the rest. */}
      <motion.g
        initial={{ filter: 'blur(0px)' }}
        animate={{
          filter: phase === PHASES.FADING ? FADE_BLUR : 'blur(0px)',
        }}
        transition={{ duration: FADE_DURATION, ease: 'easeOut' }}
      >
        {/* Connection bridges — appear in place together with the modules.
            No delay, no stagger, no transform animation. */}
        {[bridge1, bridge2].map((b, i) => (
          <motion.rect
            key={`bridge-${i}`}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            rx={Math.min(b.w, b.h) / 2}
            fill="url(#intro-mark-grad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: showBridges ? 0.9 : 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        ))}
      </motion.g>
    </svg>
  );
}
