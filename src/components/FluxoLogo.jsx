import React from 'react';

/**
 * FluxoLogo — modular F mark + wordmark + optional tagline.
 *
 * Mark: 6 rounded squares laid out as an "F", with two small connector
 * bridges. Single linear gradient (cyan → blue → purple) spans the whole
 * mark via gradientUnits="userSpaceOnUse".
 *
 * Variants:
 *   - "mark"   : just the modular F (favicon, app icon, tight UI)
 *   - "lockup" : mark + FLUXO wordmark (header, footer, default)
 *   - "full"   : mark + wordmark + "WHERE SYSTEMS CONNECT" tagline (intro, hero, business cards)
 *
 * Sizing is driven by `height` (px). The mark scales to that height; the
 * wordmark is sized proportionally so the lockup stays balanced at any size.
 */

// Brand v3 gradient — matches the modular F brand sheet:
// vivid sky-blue top-left → indigo mid → deep violet bottom-right.
const GRADIENT_STOPS = [
  { offset: '0%',   color: '#2A9EFF' }, // vivid bright sky-blue top-left
  { offset: '50%',  color: '#5358E2' }, // indigo middle (blue → violet bridge)
  { offset: '100%', color: '#7C28D8' }, // deep violet/purple bottom-right
];

// Mark geometry — a 3×3 unit grid. Each module is M units, gap is G.
const M = 28;          // module size
const G = 4;           // gap between modules
const R = 7;           // module corner radius
const STEP = M + G;    // distance between module origins

// Module top-left corners in mark coord space.
// Layout (F shape):
//   [0][1][2]
//   [3][4]
//   [5]
export const MODULE_POSITIONS = [
  { col: 0, row: 0 }, // 0 — top-left
  { col: 1, row: 0 }, // 1 — top-middle
  { col: 2, row: 0 }, // 2 — top-right
  { col: 0, row: 1 }, // 3 — middle-left
  { col: 1, row: 1 }, // 4 — middle (small bar)
  { col: 0, row: 2 }, // 5 — bottom-left
].map((p) => ({
  col: p.col,
  row: p.row,
  x: p.col * STEP,
  y: p.row * STEP,
  cx: p.col * STEP + M / 2,
  cy: p.row * STEP + M / 2,
}));

// Mark bounding box (square, so wordmark can sit flush)
export const MARK_BOX = {
  width: 3 * M + 2 * G,
  height: 3 * M + 2 * G,
};

// Connector bridges — both meet at module 4 (mid-mid), the F's interior junction.
const CONNECTORS = [
  // Bridge between module 1 (top-mid) and module 4 (mid-mid) — vertical
  {
    x: MODULE_POSITIONS[1].x + M / 2 - 4,
    y: MODULE_POSITIONS[1].y + M,
    width: 8,
    height: G,
    rx: 2,
  },
  // Bridge between module 3 (mid-left) and module 4 (mid-mid) — horizontal
  {
    x: MODULE_POSITIONS[3].x + M,
    y: MODULE_POSITIONS[3].y + M / 2 - 4,
    width: G,
    height: 8,
    rx: 2,
  },
];

/**
 * The mark only — modular F made of rounded squares with shared gradient.
 * Renders at MARK_BOX.width × MARK_BOX.height in its own coord space; the
 * outer SVG scales it via the `height` prop.
 */
export function FluxoMark({ height = 40, className = '', gradientId = 'fluxo-mark-grad' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${MARK_BOX.width} ${MARK_BOX.height}`}
      height={height}
      width={(height * MARK_BOX.width) / MARK_BOX.height}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2={MARK_BOX.width}
          y2={MARK_BOX.height}
        >
          {GRADIENT_STOPS.map((s) => (
            <stop key={s.offset} offset={s.offset} stopColor={s.color} />
          ))}
        </linearGradient>
      </defs>

      {/* Connection bridges — drawn first so they sit beneath the modules */}
      {CONNECTORS.map((c, i) => (
        <rect
          key={`c-${i}`}
          x={c.x}
          y={c.y}
          width={c.width}
          height={c.height}
          rx={c.rx}
          fill={`url(#${gradientId})`}
          opacity="0.85"
        />
      ))}

      {/* The 6 modules */}
      {MODULE_POSITIONS.map((p, i) => (
        <rect
          key={`m-${i}`}
          x={p.x}
          y={p.y}
          width={M}
          height={M}
          rx={R}
          ry={R}
          fill={`url(#${gradientId})`}
        />
      ))}
    </svg>
  );
}

/**
 * Default export — full lockup with mark + wordmark, optional tagline.
 *
 * Wordmark is rendered as HTML text using a wide-tracked geometric sans
 * (system font stack — no extra font payload). For the intro we want
 * the wordmark to be styleable and animatable independently, so HTML
 * text is intentionally preferred over an SVG path.
 */
export default function FluxoLogo({
  variant = 'lockup',           // 'mark' | 'lockup' | 'full'
  height = 40,                  // mark height in px (wordmark scales from this)
  className = '',
  wordmarkClassName = '',       // override wordmark color (e.g. 'text-foreground')
  taglineClassName = '',
  gradientId = 'fluxo-logo-grad',
}) {
  if (variant === 'mark') {
    return <FluxoMark height={height} className={className} gradientId={gradientId} />;
  }

  // Wordmark sizing — scales from mark height. These ratios match the v3
  // brand sheet roughly (wordmark cap-height ≈ 0.55 of mark height).
  const wordmarkSize = Math.round(height * 0.62);
  const taglineSize = Math.max(8, Math.round(height * 0.13));
  const trackingWord = '0.18em';

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <FluxoMark height={height} gradientId={gradientId} />
      <div className="flex flex-col leading-none">
        <span
          className={`font-semibold ${wordmarkClassName || 'text-foreground'}`}
          style={{
            fontFamily:
              "'Geist', 'Inter', 'Bahnschrift', 'Eurostile', system-ui, -apple-system, sans-serif",
            fontSize: `${wordmarkSize}px`,
            letterSpacing: trackingWord,
            lineHeight: 1,
            display: 'block',
          }}
        >
          FLUXO
        </span>
        {variant === 'full' && (
          <span
            className={`mt-1.5 ${taglineClassName || 'text-foreground/70'}`}
            style={{
              fontFamily:
                "'Geist', 'Inter', system-ui, -apple-system, sans-serif",
              fontSize: `${taglineSize}px`,
              lineHeight: 1,
              fontWeight: 400,
              // Span the wordmark width so "W" of WHERE aligns under "F"
              // of FLUXO and "T" of CONNECT aligns under "O".
              display: 'block',
              width: '100%',
              textAlign: 'justify',
              textAlignLast: 'justify',
              letterSpacing: 0,
            }}
          >
            WHERE SYSTEMS CONNECT
          </span>
        )}
      </div>
    </div>
  );
}
