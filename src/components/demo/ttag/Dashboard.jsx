import React from 'react';
import { Link } from 'react-router-dom';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlertTriangle,
  ArrowUpRight,
  Car,
  ClipboardList,
  PackageX,
  Receipt,
  Wallet,
  Wrench,
} from 'lucide-react';
import {
  Meter,
  Panel,
  PageHeader,
  Pill,
  StatCard,
  StatGrid,
  Td,
  Th,
  TableWrap,
  statusTone,
} from '@/components/demo/ttag/primitives.jsx';
import { VizLegend, VizTooltip, axisProps, useVizPalette } from '@/components/demo/ttag/charts.jsx';
import { DEMO_BASE } from '@/components/demo/ttag/DemoShell.jsx';
import {
  JOB_STAGES,
  bays,
  formatCompactSGD,
  formatSGD,
  invoiceTotal,
  invoices,
  jobCards,
  jobTotal,
  lowStockParts,
  monthlyPerformance,
  recentSales,
  staffById,
  vehicles,
} from '@/data/ttagMotor';

const stageLabel = (key) => JOB_STAGES.find((s) => s.key === key)?.label ?? key;

export default function Dashboard() {
  const palette = useVizPalette();

  const occupiedBays = bays.filter((b) => b.jobId).length;
  const activeJobs = jobCards.filter((j) => j.stage !== 'ready');
  const readyForCollection = jobCards.filter((j) => j.stage === 'ready');
  const overdueInvoices = invoices.filter((i) => i.status === 'Overdue');
  const overdueValue = overdueInvoices.reduce((sum, i) => sum + invoiceTotal(i), 0);
  const salesToday = recentSales.reduce((sum, s) => sum + s.total, 0);
  const workInProgressValue = activeJobs.reduce((sum, j) => sum + jobTotal(j), 0);

  // The final month is still in progress, so the trend line shows closed months only.
  const closedMonths = monthlyPerformance.filter((m) => !m.partial);
  const currentMonth = monthlyPerformance.find((m) => m.partial);
  const lastClosed = closedMonths[closedMonths.length - 1];
  const priorClosed = closedMonths[closedMonths.length - 2];
  const revenueDelta = ((lastClosed.revenue - priorClosed.revenue) / priorClosed.revenue) * 100;

  const trendSeries = [
    { key: 'revenue', label: 'Revenue', color: palette.series[0] },
    { key: 'cost', label: 'Cost of sales', color: palette.series[1] },
  ];

  const serviceDue = vehicles.filter((v) => v.status === 'Service overdue');
  const dtcVehicles = vehicles.filter((v) => v.telematics.dtcCount > 0);

  return (
    <>
      <PageHeader
        title="Workshop overview"
        description="Tuesday, 1 September 2026 · 6 bays · 4 technicians on shift"
        actions={
          <Link
            to={`${DEMO_BASE}/job-cards`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <ClipboardList className="h-4 w-4" />
            Open job board
          </Link>
        }
      />

      <StatGrid>
        <StatCard
          index={0}
          label="Counter sales today"
          value={formatSGD(salesToday, { decimals: 0 })}
          delta={`${recentSales.length} transactions`}
          deltaTone="info"
          icon={Receipt}
        />
        <StatCard
          index={1}
          label="Work in progress"
          value={formatSGD(workInProgressValue, { decimals: 0 })}
          delta={`${activeJobs.length} open jobs`}
          deltaTone="neutral"
          hint={`${readyForCollection.length} ready`}
          icon={Wrench}
        />
        <StatCard
          index={2}
          label="Bay utilisation"
          value={`${occupiedBays}/${bays.length}`}
          delta={`${Math.round((occupiedBays / bays.length) * 100)}% occupied`}
          deltaTone={occupiedBays / bays.length > 0.8 ? 'warning' : 'success'}
          icon={Car}
        />
        <StatCard
          index={3}
          label="Overdue receivables"
          value={formatSGD(overdueValue, { decimals: 0 })}
          delta={`${overdueInvoices.length} invoices`}
          deltaTone="danger"
          icon={Wallet}
        />
      </StatGrid>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="Revenue and cost of sales"
          subtitle={`Closed months to ${lastClosed.month} · September in progress (${formatCompactSGD(
            currentMonth.revenue
          )} so far)`}
          actions={<VizLegend items={trendSeries.map((s) => ({ label: s.label, color: s.color }))} />}
        >
          <div className="mb-4 flex items-baseline gap-3">
            <p className="text-3xl font-semibold tracking-tight tabular-nums">
              {formatSGD(lastClosed.revenue, { decimals: 0 })}
            </p>
            <Pill tone={revenueDelta >= 0 ? 'success' : 'danger'}>
              <ArrowUpRight className="h-3 w-3" />
              {revenueDelta >= 0 ? '+' : ''}
              {revenueDelta.toFixed(1)}% vs {priorClosed.month}
            </Pill>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={closedMonths} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid stroke={palette.grid} vertical={false} />
                <XAxis dataKey="month" {...axisProps(palette)} interval="preserveStartEnd" />
                <YAxis
                  {...axisProps(palette)}
                  width={52}
                  tickFormatter={(v) => formatCompactSGD(v)}
                />
                <Tooltip
                  cursor={{ stroke: palette.grid, strokeWidth: 1 }}
                  content={<VizTooltip />}
                />
                {trendSeries.map((s) => (
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

        <Panel title="Bay status" subtitle={`${occupiedBays} of ${bays.length} bays occupied`}>
          <ul className="space-y-2.5">
            {bays.map((bay) => {
              const job = jobCards.find((j) => j.id === bay.jobId);
              return (
                <li
                  key={bay.id}
                  className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5"
                >
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      job ? 'bg-primary' : 'bg-muted-foreground/40'
                    }`}
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{bay.label}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {job ? `${job.plate} · ${job.id}` : `${bay.kind} · available`}
                    </p>
                  </div>
                  {job && <Pill tone={statusTone(stageLabel(job.stage))}>{stageLabel(job.stage)}</Pill>}
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="Jobs on the floor"
          subtitle="Live status across all bays"
          padded={false}
          actions={
            <Link
              to={`${DEMO_BASE}/job-cards`}
              className="text-xs font-medium text-primary hover:underline"
            >
              View all
            </Link>
          }
        >
          <TableWrap>
            <table className="w-full">
              <thead className="border-b border-border bg-muted/40">
                <tr>
                  <Th>Job</Th>
                  <Th>Vehicle</Th>
                  <Th>Technician</Th>
                  <Th>Stage</Th>
                  <Th className="min-w-[140px]">Progress</Th>
                  <Th align="right">Value</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {jobCards.map((job) => (
                  <tr key={job.id} className="transition-colors hover:bg-muted/40">
                    <Td className="font-medium">{job.id}</Td>
                    <Td>
                      <span className="font-medium">{job.plate}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        Bay {job.bay ?? '—'}
                      </span>
                    </Td>
                    <Td className="text-muted-foreground">
                      {staffById(job.technicianId)?.shortName}
                    </Td>
                    <Td>
                      <Pill tone={statusTone(stageLabel(job.stage))}>{stageLabel(job.stage)}</Pill>
                    </Td>
                    <Td>
                      <Meter
                        value={job.progress}
                        tone={job.progress === 100 ? 'success' : 'info'}
                        label={`${job.id} progress`}
                      />
                    </Td>
                    <Td align="right">{formatSGD(jobTotal(job))}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        </Panel>

        <Panel title="Needs attention" subtitle="Exceptions raised across modules">
          <ul className="space-y-3">
            {serviceDue.map((v) => (
              <li key={v.plate} className="flex gap-3">
                <span className="mt-0.5 rounded-lg bg-rose-500/10 p-1.5 text-rose-500">
                  <AlertTriangle className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{v.plate} service overdue</p>
                  <p className="text-xs text-muted-foreground">
                    Due {v.nextServiceDue} · {v.mileage.toLocaleString()} km on the clock
                  </p>
                </div>
              </li>
            ))}
            {lowStockParts.slice(0, 3).map((p) => (
              <li key={p.sku} className="flex gap-3">
                <span className="mt-0.5 rounded-lg bg-amber-500/10 p-1.5 text-amber-500">
                  <PackageX className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.onHand === 0 ? 'Out of stock' : `${p.onHand} left`} · reorder at {p.reorderAt}
                  </p>
                </div>
              </li>
            ))}
            {dtcVehicles.slice(0, 2).map((v) => (
              <li key={`dtc-${v.plate}`} className="flex gap-3">
                <span className="mt-0.5 rounded-lg bg-primary/10 p-1.5 text-primary">
                  <Car className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    {v.plate} reporting {v.telematics.dtcCount} fault code
                    {v.telematics.dtcCount > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Battery {v.telematics.battery}V · coolant {v.telematics.engineTemp}°C
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
