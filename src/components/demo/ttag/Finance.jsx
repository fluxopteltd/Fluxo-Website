import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Banknote, PiggyBank, Percent, TrendingUp } from 'lucide-react';
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
  VizLegend,
  VizTooltip,
  axisProps,
  ordinalScale,
  useVizPalette,
} from '@/components/demo/ttag/charts.jsx';
import {
  arAging,
  cashflow,
  expenseBreakdown,
  formatCompactSGD,
  formatSGD,
  monthlyPerformance,
  revenueByStream,
} from '@/data/ttagMotor';

export default function Finance() {
  const palette = useVizPalette();

  const closed = monthlyPerformance.filter((m) => !m.partial);
  const current = monthlyPerformance.find((m) => m.partial);
  const last = closed[closed.length - 1];
  const prior = closed[closed.length - 2];

  const grossProfit = (m) => m.revenue - m.cost;
  const netProfit = (m) => m.revenue - m.cost - m.expenses;

  const grossMargin = (grossProfit(last) / last.revenue) * 100;
  const priorGrossMargin = (grossProfit(prior) / prior.revenue) * 100;
  const netMargin = (netProfit(last) / last.revenue) * 100;

  const cashIn = cashflow.reduce((s, w) => s + w.inflow, 0);
  const cashOut = cashflow.reduce((s, w) => s + w.outflow, 0);

  const totalReceivables = arAging.reduce((s, b) => s + b.amount, 0);
  const totalExpenses = expenseBreakdown.reduce((s, e) => s + e.value, 0);
  const totalStreams = revenueByStream.reduce((s, r) => s + r.value, 0);

  const plSeries = [
    { key: 'revenue', label: 'Revenue', color: palette.series[0] },
    { key: 'cost', label: 'Cost of sales', color: palette.series[1] },
    { key: 'expenses', label: 'Operating expenses', color: palette.series[2] },
  ];

  const cashSeries = [
    { key: 'inflow', label: 'Cash in', color: palette.series[0] },
    { key: 'outflow', label: 'Cash out', color: palette.series[1] },
  ];

  // Revenue streams sorted low -> high so the single-hue ramp reads as magnitude.
  const streamsAsc = [...revenueByStream].sort((a, b) => a.value - b.value);
  const streamColours = ordinalScale(palette, streamsAsc.length);
  // Ageing buckets keep their natural order; the ramp darkens as debt gets older.
  const agingColours = ordinalScale(palette, arAging.length);

  return (
    <>
      <PageHeader
        title="Finance"
        description={`Management accounts to ${last.month} · September in progress (${formatCompactSGD(
          current.revenue
        )} billed so far)`}
      />

      <StatGrid className="mb-4">
        <StatCard
          index={0}
          label={`Revenue — ${last.month}`}
          value={formatSGD(last.revenue, { decimals: 0 })}
          delta={`${(((last.revenue - prior.revenue) / prior.revenue) * 100).toFixed(1)}% vs ${prior.month}`}
          deltaTone="success"
          icon={TrendingUp}
        />
        <StatCard
          index={1}
          label="Gross margin"
          value={`${grossMargin.toFixed(1)}%`}
          delta={`${(grossMargin - priorGrossMargin >= 0 ? '+' : '') + (grossMargin - priorGrossMargin).toFixed(1)} pts`}
          deltaTone={grossMargin >= priorGrossMargin ? 'success' : 'warning'}
          icon={Percent}
        />
        <StatCard
          index={2}
          label={`Net profit — ${last.month}`}
          value={formatSGD(netProfit(last), { decimals: 0 })}
          delta={`${netMargin.toFixed(1)}% net margin`}
          deltaTone="success"
          icon={PiggyBank}
        />
        <StatCard
          index={3}
          label="Net cash, last 5 weeks"
          value={formatSGD(cashIn - cashOut, { decimals: 0 })}
          delta={`${formatCompactSGD(cashIn)} in · ${formatCompactSGD(cashOut)} out`}
          deltaTone="info"
          icon={Banknote}
        />
      </StatGrid>

      <Panel
        className="mb-4"
        title="Profit and loss trend"
        subtitle="Closed months only — September is still open"
        actions={<VizLegend items={plSeries.map((s) => ({ label: s.label, color: s.color }))} />}
      >
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={closed} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid stroke={palette.grid} vertical={false} />
              <XAxis dataKey="month" {...axisProps(palette)} interval="preserveStartEnd" />
              <YAxis {...axisProps(palette)} width={52} tickFormatter={formatCompactSGD} />
              <Tooltip cursor={{ stroke: palette.grid, strokeWidth: 1 }} content={<VizTooltip />} />
              {plSeries.map((s) => (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.label}
                  stroke={s.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="mb-4 grid gap-4 xl:grid-cols-2">
        <Panel
          title="Weekly cash movement"
          subtitle="Collections against payments run"
          actions={<VizLegend items={cashSeries.map((s) => ({ label: s.label, color: s.color }))} />}
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashflow} margin={{ top: 4, right: 8, bottom: 0, left: 0 }} barGap={2}>
                <CartesianGrid stroke={palette.grid} vertical={false} />
                <XAxis dataKey="week" {...axisProps(palette)} />
                <YAxis {...axisProps(palette)} width={52} tickFormatter={formatCompactSGD} />
                <Tooltip cursor={{ fill: palette.grid }} content={<VizTooltip />} />
                {cashSeries.map((s) => (
                  <Bar
                    key={s.key}
                    dataKey={s.key}
                    name={s.label}
                    fill={s.color}
                    radius={[4, 4, 0, 0]}
                    barSize={18}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel
          title="Receivables ageing"
          subtitle={`${formatSGD(totalReceivables, { decimals: 0 })} outstanding across all customers`}
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={arAging} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid stroke={palette.grid} vertical={false} />
                <XAxis dataKey="bucket" {...axisProps(palette)} />
                <YAxis {...axisProps(palette)} width={52} tickFormatter={formatCompactSGD} />
                <Tooltip cursor={{ fill: palette.grid }} content={<VizTooltip />} />
                <Bar dataKey="amount" name="Outstanding" radius={[4, 4, 0, 0]} barSize={36}>
                  {arAging.map((entry, i) => (
                    <Cell key={entry.bucket} fill={agingColours[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="mb-4 grid gap-4 xl:grid-cols-2">
        <Panel title={`Revenue by stream — ${last.month}`} subtitle={formatSGD(totalStreams, { decimals: 0 })}>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={streamsAsc}
                layout="vertical"
                margin={{ top: 4, right: 16, bottom: 0, left: 8 }}
              >
                <XAxis type="number" {...axisProps(palette)} tickFormatter={formatCompactSGD} />
                <YAxis type="category" dataKey="name" width={150} {...axisProps(palette)} />
                <Tooltip cursor={{ fill: palette.grid }} content={<VizTooltip />} />
                <Bar dataKey="value" name="Revenue" radius={[0, 4, 4, 0]} barSize={16}>
                  {streamsAsc.map((entry, i) => (
                    <Cell key={entry.name} fill={streamColours[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel
          title={`Operating expenses — ${last.month}`}
          subtitle={formatSGD(totalExpenses, { decimals: 0 })}
        >
          <ul className="space-y-3">
            {expenseBreakdown.map((item) => (
              <li key={item.name}>
                <div className="mb-1 flex items-baseline justify-between gap-3">
                  <span className="text-sm">{item.name}</span>
                  <span className="text-sm font-medium tabular-nums">
                    {formatSGD(item.value, { decimals: 0 })}
                  </span>
                </div>
                <Meter
                  value={item.value}
                  max={totalExpenses}
                  tone="info"
                  label={`${item.name} share of operating expenses`}
                />
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel
        title="Profit and loss by month"
        subtitle="The same figures as the trend chart, in full"
        padded={false}
      >
        <TableWrap>
          <table className="w-full">
            <thead className="border-b border-border bg-muted/40">
              <tr>
                <Th>Month</Th>
                <Th align="right">Revenue</Th>
                <Th align="right">Cost of sales</Th>
                <Th align="right">Gross profit</Th>
                <Th align="right">Gross margin</Th>
                <Th align="right">Operating expenses</Th>
                <Th align="right">Net profit</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {monthlyPerformance.map((m) => (
                <tr key={m.month} className="transition-colors hover:bg-muted/40">
                  <Td className="font-medium">
                    {m.month}
                    {m.partial && (
                      <Pill tone="warning" className="ml-2">
                        In progress
                      </Pill>
                    )}
                  </Td>
                  <Td align="right">{formatSGD(m.revenue, { decimals: 0 })}</Td>
                  <Td align="right">{formatSGD(m.cost, { decimals: 0 })}</Td>
                  <Td align="right">{formatSGD(grossProfit(m), { decimals: 0 })}</Td>
                  <Td align="right">{((grossProfit(m) / m.revenue) * 100).toFixed(1)}%</Td>
                  <Td align="right">{formatSGD(m.expenses, { decimals: 0 })}</Td>
                  <Td align="right" className="font-medium">
                    {formatSGD(netProfit(m), { decimals: 0 })}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Panel>
    </>
  );
}
