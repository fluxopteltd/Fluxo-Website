import React, { useMemo, useState } from 'react';
import { ArrowRight, Clock, Gauge, User, Wrench } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Meter,
  PageHeader,
  Panel,
  Pill,
  Td,
  Th,
  TableWrap,
  statusTone,
} from '@/components/demo/ttag/primitives.jsx';
import {
  GST_RATE,
  JOB_STAGES,
  customerById,
  formatSGD,
  jobCards as seedJobCards,
  jobSubtotal,
  jobTotal,
  staffById,
  vehicleByPlate,
} from '@/data/ttagMotor';

const stageLabel = (key) => JOB_STAGES.find((s) => s.key === key)?.label ?? key;

/** Progress shown on the board when a job is pushed to the next stage. */
const STAGE_PROGRESS = {
  booked: 0,
  diagnosis: 20,
  'awaiting-parts': 40,
  'in-progress': 65,
  qc: 88,
  ready: 100,
};

function JobTile({ job, onSelect }) {
  const vehicle = vehicleByPlate(job.plate);
  const tech = staffById(job.technicianId);
  return (
    <button
      type="button"
      onClick={() => onSelect(job)}
      className="w-full rounded-lg border border-border bg-card p-3 text-left shadow-sm transition-all hover:border-primary/50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-semibold">{job.plate}</span>
        {job.priority !== 'Normal' && (
          <Pill tone={job.priority === 'Urgent' ? 'danger' : 'info'}>{job.priority}</Pill>
        )}
      </div>
      <p className="mt-0.5 text-xs text-muted-foreground">
        {vehicle ? `${vehicle.make} ${vehicle.model}` : job.id}
      </p>
      <p className="mt-2 line-clamp-2 text-xs text-foreground/80">{job.complaint}</p>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <User className="h-3 w-3 shrink-0" aria-hidden="true" />
        <span className="truncate">{tech?.shortName}</span>
        <span className="ml-auto shrink-0 font-medium tabular-nums text-foreground">
          {formatSGD(jobTotal(job), { decimals: 0 })}
        </span>
      </div>
      <Meter
        className="mt-2.5"
        value={job.progress}
        tone={job.progress === 100 ? 'success' : 'info'}
        label={`${job.id} progress`}
      />
    </button>
  );
}

function JobDetail({ job, onAdvance, onClose }) {
  if (!job) return null;
  const vehicle = vehicleByPlate(job.plate);
  const customer = customerById(job.customerId);
  const tech = staffById(job.technicianId);
  const advisor = staffById(job.advisorId);
  const subtotal = jobSubtotal(job);
  const stageIndex = JOB_STAGES.findIndex((s) => s.key === job.stage);
  const nextStage = JOB_STAGES[stageIndex + 1];

  return (
    <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex flex-wrap items-center gap-3">
          {job.id}
          <Pill tone={statusTone(stageLabel(job.stage))}>{stageLabel(job.stage)}</Pill>
        </DialogTitle>
        <DialogDescription>
          {job.plate} · {vehicle?.make} {vehicle?.model} {vehicle?.year} · {customer?.name}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { icon: User, label: 'Technician', value: tech?.name },
          { icon: Wrench, label: 'Bay', value: job.bay ? `Bay ${job.bay}` : 'Unassigned' },
          { icon: Gauge, label: 'Odometer', value: `${job.odometer.toLocaleString()} km` },
          { icon: Clock, label: 'Promised', value: new Date(job.promised).toLocaleString('en-SG', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) },
          { icon: User, label: 'Service advisor', value: advisor?.name },
          { icon: Wrench, label: 'Labour booked', value: `${job.labourHours} hrs` },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border border-border p-3">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <item.icon className="h-3 w-3" aria-hidden="true" />
              {item.label}
            </p>
            <p className="mt-1 text-sm font-medium">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Customer complaint
        </p>
        <p className="mt-1.5 text-sm">{job.complaint}</p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <TableWrap>
          <table className="w-full">
            <thead className="border-b border-border bg-muted/40">
              <tr>
                <Th>Type</Th>
                <Th>Description</Th>
                <Th align="right">Qty</Th>
                <Th align="right">Unit</Th>
                <Th align="right">Amount</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {job.lines.map((line) => (
                <tr key={line.code}>
                  <Td>
                    <Pill tone={line.type === 'Labour' ? 'info' : 'neutral'}>{line.type}</Pill>
                  </Td>
                  <Td className="whitespace-normal">{line.description}</Td>
                  <Td align="right">{line.qty}</Td>
                  <Td align="right">{formatSGD(line.unit)}</Td>
                  <Td align="right" className="font-medium">
                    {formatSGD(line.qty * line.unit)}
                  </Td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t border-border bg-muted/30">
              <tr>
                <Td colSpan={4} align="right" className="text-muted-foreground">
                  Subtotal
                </Td>
                <Td align="right">{formatSGD(subtotal)}</Td>
              </tr>
              <tr>
                <Td colSpan={4} align="right" className="text-muted-foreground">
                  GST {(GST_RATE * 100).toFixed(0)}%
                </Td>
                <Td align="right">{formatSGD(subtotal * GST_RATE)}</Td>
              </tr>
              <tr>
                <Td colSpan={4} align="right" className="font-semibold">
                  Total
                </Td>
                <Td align="right" className="font-semibold">
                  {formatSGD(jobTotal(job))}
                </Td>
              </tr>
            </tfoot>
          </table>
        </TableWrap>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        {nextStage ? (
          <Button onClick={() => onAdvance(job.id)}>
            Move to {nextStage.label}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button disabled>Ready for collection</Button>
        )}
      </div>
    </DialogContent>
  );
}

export default function JobCards() {
  const [jobs, setJobs] = useState(seedJobCards);
  const [selectedId, setSelectedId] = useState(null);

  const selected = jobs.find((j) => j.id === selectedId) ?? null;

  const byStage = useMemo(
    () =>
      JOB_STAGES.map((stage) => ({
        ...stage,
        jobs: jobs.filter((j) => j.stage === stage.key),
      })),
    [jobs]
  );

  const advance = (jobId) => {
    setJobs((prev) =>
      prev.map((job) => {
        if (job.id !== jobId) return job;
        const idx = JOB_STAGES.findIndex((s) => s.key === job.stage);
        const next = JOB_STAGES[idx + 1];
        if (!next) return job;
        return {
          ...job,
          stage: next.key,
          progress: STAGE_PROGRESS[next.key] ?? job.progress,
          bay: next.key === 'ready' ? null : job.bay,
        };
      })
    );
  };

  const openValue = jobs
    .filter((j) => j.stage !== 'ready')
    .reduce((sum, j) => sum + jobTotal(j), 0);

  return (
    <>
      <PageHeader
        title="Job cards"
        description={`${jobs.length} jobs on the board · ${formatSGD(openValue, {
          decimals: 0,
        })} of work in progress`}
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {byStage.map((stage) => (
          <div key={stage.key} className="flex flex-col rounded-xl border border-border bg-muted/30">
            <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {stage.label}
              </p>
              <span className="rounded-full bg-background px-2 py-0.5 text-xs font-medium tabular-nums">
                {stage.jobs.length}
              </span>
            </div>
            <div className="flex-1 space-y-2 p-2">
              {stage.jobs.length === 0 ? (
                <p className="px-1 py-6 text-center text-xs text-muted-foreground">No jobs</p>
              ) : (
                stage.jobs.map((job) => (
                  <JobTile key={job.id} job={job} onSelect={(j) => setSelectedId(j.id)} />
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      <Panel
        className="mt-4"
        title="All job cards"
        subtitle="Full detail for every job currently open"
        padded={false}
      >
        <TableWrap>
          <table className="w-full">
            <thead className="border-b border-border bg-muted/40">
              <tr>
                <Th>Job</Th>
                <Th>Vehicle</Th>
                <Th>Customer</Th>
                <Th>Stage</Th>
                <Th>Priority</Th>
                <Th>Promised</Th>
                <Th align="right">Total</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  onClick={() => setSelectedId(job.id)}
                  className="cursor-pointer transition-colors hover:bg-muted/40"
                >
                  <Td className="font-medium text-primary">{job.id}</Td>
                  <Td>{job.plate}</Td>
                  <Td className="text-muted-foreground">{customerById(job.customerId)?.name}</Td>
                  <Td>
                    <Pill tone={statusTone(stageLabel(job.stage))}>{stageLabel(job.stage)}</Pill>
                  </Td>
                  <Td>
                    <Pill tone={job.priority === 'Urgent' ? 'danger' : job.priority === 'Normal' ? 'neutral' : 'info'}>
                      {job.priority}
                    </Pill>
                  </Td>
                  <Td className="text-muted-foreground">
                    {new Date(job.promised).toLocaleString('en-SG', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Td>
                  <Td align="right">{formatSGD(jobTotal(job))}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Panel>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelectedId(null)}>
        <JobDetail job={selected} onAdvance={advance} onClose={() => setSelectedId(null)} />
      </Dialog>
    </>
  );
}
