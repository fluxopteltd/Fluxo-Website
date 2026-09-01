import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { formatSGD } from '@/data/ttagMotor';

/**
 * Chart colour system for the demo.
 *
 * Light and dark are separately selected steps of the same hues rather than an
 * automatic flip, and each set was checked with the palette validator against its
 * own surface (categorical adjacent pairs and the ordinal ramp both pass).
 */
const LIGHT = {
  series: ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300'],
  // Ordinal ramp: low magnitude -> high magnitude reads light -> dark on a light surface.
  ordinal: ['#86b6ef', '#5598e7', '#2a78d6', '#1c5cab', '#104281'],
  grid: 'rgba(15, 27, 50, 0.10)',
  axis: '#52514e',
};

const DARK = {
  series: ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#008300'],
  // On a dark surface the ramp is inverted so higher magnitude still reads stronger.
  ordinal: ['#184f95', '#256abf', '#3987e5', '#6da7ec', '#9ec5f4'],
  grid: 'rgba(226, 236, 255, 0.10)',
  axis: '#a9b4c7',
};

export function useVizPalette() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && resolvedTheme === 'dark' ? DARK : LIGHT;
}

/** Picks `count` evenly spaced steps out of the ordinal ramp. */
export function ordinalScale(palette, count) {
  const ramp = palette.ordinal;
  if (count <= 1) return [ramp[Math.floor(ramp.length / 2)]];
  return Array.from({ length: count }, (_, i) =>
    ramp[Math.round((i / (count - 1)) * (ramp.length - 1))]
  );
}

export const axisProps = (palette) => ({
  stroke: palette.axis,
  tickLine: false,
  axisLine: false,
  tick: { fill: palette.axis, fontSize: 11 },
});

/** Themed replacement for the default recharts tooltip. */
export function VizTooltip({ active, payload, label, formatter, labelFormatter }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
      {label !== undefined && (
        <p className="mb-1.5 text-xs font-medium text-popover-foreground">
          {labelFormatter ? labelFormatter(label) : label}
        </p>
      )}
      <ul className="space-y-1">
        {payload.map((entry) => (
          <li key={entry.dataKey ?? entry.name} className="flex items-center gap-2 text-xs">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color ?? entry.payload?.fill }}
              aria-hidden="true"
            />
            <span className="text-muted-foreground">{entry.name}</span>
            <span className="ml-auto pl-3 font-medium tabular-nums text-popover-foreground">
              {formatter ? formatter(entry.value, entry) : formatSGD(entry.value, { decimals: 0 })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Legend rendered in text tokens, with the series colour carried by the swatch only. */
export function VizLegend({ items }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2 text-xs text-muted-foreground">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: item.color }}
            aria-hidden="true"
          />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
