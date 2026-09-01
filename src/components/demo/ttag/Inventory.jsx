import React, { useMemo, useState } from 'react';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Package, PackageX, ShoppingCart, Warehouse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Meter,
  PageHeader,
  Panel,
  Pill,
  StatCard,
  StatGrid,
  Td,
  Th,
  TableWrap,
} from '@/components/demo/ttag/primitives.jsx';
import {
  VizTooltip,
  axisProps,
  ordinalScale,
  useVizPalette,
} from '@/components/demo/ttag/charts.jsx';
import { formatCompactSGD, formatSGD, parts } from '@/data/ttagMotor';

const ALL = 'All';

const stockState = (part) => {
  if (part.onHand === 0) return { label: 'Out of stock', tone: 'danger' };
  if (part.onHand <= part.reorderAt) return { label: 'Low stock', tone: 'warning' };
  return { label: 'In stock', tone: 'success' };
};

export default function Inventory() {
  const palette = useVizPalette();
  const [category, setCategory] = useState(ALL);

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(parts.map((p) => p.category))).sort()],
    []
  );

  const visible = useMemo(
    () => (category === ALL ? parts : parts.filter((p) => p.category === category)),
    [category]
  );

  const stockValue = parts.reduce((sum, p) => sum + p.onHand * p.cost, 0);
  const lowStock = parts.filter((p) => p.onHand > 0 && p.onHand <= p.reorderAt);
  const outOfStock = parts.filter((p) => p.onHand === 0);
  const reorderList = [...outOfStock, ...lowStock];

  // Stock value by category, ordered low -> high so the ordinal ramp reads correctly.
  const byCategory = useMemo(() => {
    const totals = new Map();
    parts.forEach((p) => {
      totals.set(p.category, (totals.get(p.category) ?? 0) + p.onHand * p.cost);
    });
    return Array.from(totals, ([name, value]) => ({ name, value })).sort(
      (a, b) => a.value - b.value
    );
  }, []);

  const rampColours = ordinalScale(palette, byCategory.length);

  return (
    <>
      <PageHeader
        title="Parts & inventory"
        description="Bin-level stock, reorder points and what the shelf is worth"
        actions={
          <Button>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Raise purchase order
          </Button>
        }
      />

      <StatGrid className="mb-4">
        <StatCard index={0} label="Active SKUs" value={parts.length} icon={Package} />
        <StatCard
          index={1}
          label="Stock on hand"
          value={formatSGD(stockValue, { decimals: 0 })}
          delta="At cost"
          deltaTone="neutral"
          icon={Warehouse}
        />
        <StatCard
          index={2}
          label="Below reorder point"
          value={lowStock.length}
          delta="Order soon"
          deltaTone="warning"
          icon={ShoppingCart}
        />
        <StatCard
          index={3}
          label="Out of stock"
          value={outOfStock.length}
          delta={outOfStock.length ? 'Blocking jobs' : 'None'}
          deltaTone={outOfStock.length ? 'danger' : 'success'}
          icon={PackageX}
        />
      </StatGrid>

      <div className="mb-4 grid gap-4 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="Stock value by category"
          subtitle="Capital sitting on the shelf, at cost"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={byCategory}
                layout="vertical"
                margin={{ top: 4, right: 16, bottom: 0, left: 8 }}
              >
                <XAxis type="number" {...axisProps(palette)} tickFormatter={formatCompactSGD} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  {...axisProps(palette)}
                />
                <Tooltip
                  cursor={{ fill: palette.grid }}
                  content={<VizTooltip />}
                />
                <Bar dataKey="value" name="Stock value" radius={[0, 4, 4, 0]} barSize={16}>
                  {byCategory.map((entry, i) => (
                    <Cell key={entry.name} fill={rampColours[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel
          title="Reorder queue"
          subtitle={`${reorderList.length} lines need a purchase order`}
        >
          {reorderList.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Every SKU is above its reorder point.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {reorderList.map((p) => {
                const state = stockState(p);
                return (
                  <li key={p.sku} className="rounded-lg border border-border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-snug">{p.name}</p>
                      <Pill tone={state.tone}>{state.label}</Pill>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {p.sku} · bin {p.bin} · {p.supplier}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-xs">
                      <span className="text-muted-foreground">
                        {p.onHand} on hand / reorder at {p.reorderAt}
                      </span>
                      <span className="ml-auto font-medium">
                        Suggest {Math.max(p.reorderAt * 2 - p.onHand, 4)} units
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>

      <Panel
        title="Parts catalogue"
        subtitle={`${visible.length} of ${parts.length} SKUs`}
        padded={false}
        actions={
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                  category === c
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        }
      >
        <TableWrap>
          <table className="w-full">
            <thead className="border-b border-border bg-muted/40">
              <tr>
                <Th>SKU</Th>
                <Th>Part</Th>
                <Th>Bin</Th>
                <Th className="min-w-[150px]">Stock level</Th>
                <Th align="right">Cost</Th>
                <Th align="right">Price</Th>
                <Th align="right">Margin</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visible.map((p) => {
                const state = stockState(p);
                const margin = ((p.price - p.cost) / p.price) * 100;
                return (
                  <tr key={p.sku} className="transition-colors hover:bg-muted/40">
                    <Td className="font-medium">{p.sku}</Td>
                    <Td className="whitespace-normal">
                      <span className="font-medium">{p.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">{p.supplier}</span>
                    </Td>
                    <Td className="text-muted-foreground">{p.bin}</Td>
                    <Td>
                      <Meter
                        value={p.onHand}
                        max={Math.max(p.reorderAt * 3, p.onHand, 1)}
                        tone={state.tone === 'success' ? 'success' : state.tone}
                        label={`${p.name} stock level`}
                      />
                      <span className="text-xs text-muted-foreground">
                        {p.onHand} on hand · reorder at {p.reorderAt}
                      </span>
                    </Td>
                    <Td align="right">{formatSGD(p.cost)}</Td>
                    <Td align="right">{formatSGD(p.price)}</Td>
                    <Td align="right">{margin.toFixed(0)}%</Td>
                    <Td>
                      <Pill tone={state.tone}>{state.label}</Pill>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableWrap>
      </Panel>
    </>
  );
}
