import React, { useMemo, useState } from 'react';
import { Building2, Car, Search, TrendingUp, Users, Wallet } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  PageHeader,
  Panel,
  Pill,
  StatCard,
  StatGrid,
  Td,
  Th,
  TableWrap,
  statusTone,
} from '@/components/demo/ttag/primitives.jsx';
import {
  customers,
  formatDate,
  formatSGD,
  invoiceTotal,
  invoices,
  jobCards,
  vehicleByPlate,
} from '@/data/ttagMotor';

function CustomerDetail({ customer }) {
  if (!customer) return null;
  const history = invoices.filter((i) => i.customerId === customer.id);
  const openJobs = jobCards.filter((j) => j.customerId === customer.id);

  return (
    <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex flex-wrap items-center gap-3">
          {customer.name}
          <Pill tone={customer.type === 'Fleet' ? 'info' : 'neutral'}>{customer.type}</Pill>
        </DialogTitle>
        <DialogDescription>
          {customer.id} · customer since {formatDate(customer.since)} · {customer.phone}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Lifetime value</p>
          <p className="mt-1 text-lg font-semibold tabular-nums">
            {formatSGD(customer.lifetimeValue, { decimals: 0 })}
          </p>
        </div>
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Outstanding</p>
          <p className="mt-1 text-lg font-semibold tabular-nums">
            {formatSGD(customer.outstanding, { decimals: 0 })}
          </p>
        </div>
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Vehicles</p>
          <p className="mt-1 text-lg font-semibold tabular-nums">{customer.vehicles.length}</p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Vehicles
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {customer.vehicles.map((plate) => {
            const v = vehicleByPlate(plate);
            return (
              <li
                key={plate}
                className="flex items-center gap-3 rounded-lg border border-border p-3"
              >
                <Car className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{plate}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {v ? `${v.make} ${v.model} · ${v.mileage.toLocaleString()} km` : 'Not on file'}
                  </p>
                </div>
                {v && <Pill tone={statusTone(v.status)}>{v.status}</Pill>}
              </li>
            );
          })}
        </ul>
      </div>

      {openJobs.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Open jobs
          </p>
          <ul className="space-y-2">
            {openJobs.map((job) => (
              <li key={job.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">
                    {job.id} · {job.plate}
                  </p>
                  <Pill tone="info">{job.progress}% complete</Pill>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{job.complaint}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Billing history
        </p>
        <div className="overflow-hidden rounded-lg border border-border">
          <TableWrap>
            <table className="w-full">
              <thead className="border-b border-border bg-muted/40">
                <tr>
                  <Th>Invoice</Th>
                  <Th>Vehicle</Th>
                  <Th>Issued</Th>
                  <Th>Status</Th>
                  <Th align="right">Total</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {history.map((inv) => (
                  <tr key={inv.id}>
                    <Td className="font-medium">{inv.id}</Td>
                    <Td className="text-muted-foreground">{inv.plate}</Td>
                    <Td className="text-muted-foreground">{formatDate(inv.issued)}</Td>
                    <Td>
                      <Pill tone={statusTone(inv.status)}>{inv.status}</Pill>
                    </Td>
                    <Td align="right">{formatSGD(invoiceTotal(inv))}</Td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr>
                    <Td colSpan={5} align="center" className="py-6 text-muted-foreground">
                      No invoices raised yet.
                    </Td>
                  </tr>
                )}
              </tbody>
            </table>
          </TableWrap>
        </div>
      </div>
    </DialogContent>
  );
}

export default function Customers() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const selected = customers.find((c) => c.id === selectedId) ?? null;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) =>
      [c.name, c.id, c.email, ...c.vehicles].join(' ').toLowerCase().includes(q)
    );
  }, [query]);

  const fleets = customers.filter((c) => c.type === 'Fleet');
  const totalLtv = customers.reduce((s, c) => s + c.lifetimeValue, 0);
  const totalOutstanding = customers.reduce((s, c) => s + c.outstanding, 0);

  return (
    <>
      <PageHeader
        title="Customers"
        description="Individuals and fleet accounts, with every vehicle and invoice attached"
      />

      <StatGrid className="mb-4">
        <StatCard index={0} label="Customers" value={customers.length} icon={Users} />
        <StatCard
          index={1}
          label="Fleet accounts"
          value={fleets.length}
          delta={`${fleets.reduce((s, c) => s + c.vehicles.length, 0)} vehicles under contract`}
          deltaTone="info"
          icon={Building2}
        />
        <StatCard
          index={2}
          label="Lifetime value"
          value={formatSGD(totalLtv, { decimals: 0 })}
          delta="All customers"
          deltaTone="success"
          icon={TrendingUp}
        />
        <StatCard
          index={3}
          label="Outstanding"
          value={formatSGD(totalOutstanding, { decimals: 0 })}
          delta={`${customers.filter((c) => c.outstanding > 0).length} accounts in debt`}
          deltaTone={totalOutstanding > 0 ? 'warning' : 'success'}
          icon={Wallet}
        />
      </StatGrid>

      <Panel
        title="Customer register"
        subtitle={`${visible.length} of ${customers.length} accounts`}
        padded={false}
        actions={
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name, plate or email"
              aria-label="Search customers"
              className="h-9 w-56 rounded-lg border border-border bg-muted/40 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:bg-background"
            />
          </div>
        }
      >
        <TableWrap>
          <table className="w-full">
            <thead className="border-b border-border bg-muted/40">
              <tr>
                <Th>Customer</Th>
                <Th>Type</Th>
                <Th>Contact</Th>
                <Th>Vehicles</Th>
                <Th>Since</Th>
                <Th align="right">Lifetime value</Th>
                <Th align="right">Outstanding</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visible.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className="cursor-pointer transition-colors hover:bg-muted/40"
                >
                  <Td>
                    <span className="font-medium text-primary">{c.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{c.id}</span>
                  </Td>
                  <Td>
                    <Pill tone={c.type === 'Fleet' ? 'info' : 'neutral'}>{c.type}</Pill>
                  </Td>
                  <Td className="text-muted-foreground">{c.phone}</Td>
                  <Td className="text-muted-foreground">{c.vehicles.join(', ')}</Td>
                  <Td className="text-muted-foreground">{formatDate(c.since)}</Td>
                  <Td align="right">{formatSGD(c.lifetimeValue, { decimals: 0 })}</Td>
                  <Td align="right" className={c.outstanding > 0 ? 'font-medium text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}>
                    {formatSGD(c.outstanding, { decimals: 0 })}
                  </Td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <Td colSpan={7} align="center" className="py-10 text-muted-foreground">
                    No customers match “{query}”.
                  </Td>
                </tr>
              )}
            </tbody>
          </table>
        </TableWrap>
      </Panel>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelectedId(null)}>
        <CustomerDetail customer={selected} />
      </Dialog>
    </>
  );
}
