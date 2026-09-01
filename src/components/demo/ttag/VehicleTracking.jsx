import React, { useMemo, useState } from 'react';
import {
  BatteryMedium,
  CalendarClock,
  Car,
  Gauge,
  RadioTower,
  Search,
  ShieldCheck,
  Thermometer,
  TriangleAlert,
} from 'lucide-react';
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
  statusTone,
} from '@/components/demo/ttag/primitives.jsx';
import {
  TODAY,
  customerById,
  formatDate,
  formatSGD,
  invoiceTotal,
  invoices,
  jobCards,
  vehicles,
} from '@/data/ttagMotor';

const daysBetween = (iso) =>
  Math.round((new Date(iso) - TODAY) / (1000 * 60 * 60 * 24));

function ExpiryRow({ icon: Icon, label, date }) {
  const days = daysBetween(date);
  const tone = days < 0 ? 'danger' : days < 60 ? 'warning' : 'success';
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5">
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{formatDate(date)}</p>
      </div>
      <Pill tone={tone}>
        {days < 0 ? `${Math.abs(days)} days overdue` : `${days} days`}
      </Pill>
    </div>
  );
}

function VehicleDetail({ vehicle }) {
  const customer = customerById(vehicle.customerId);
  const history = invoices.filter((i) => i.plate === vehicle.plate);
  const openJob = jobCards.find((j) => j.plate === vehicle.plate);
  const serviceDays = daysBetween(vehicle.nextServiceDue);
  const kmToService = vehicle.nextServiceKm - vehicle.mileage;

  return (
    <div className="space-y-4">
      <Panel
        title={`${vehicle.plate} · ${vehicle.make} ${vehicle.model}`}
        subtitle={`${vehicle.year} · ${vehicle.colour} · VIN ${vehicle.vin}`}
        actions={<Pill tone={statusTone(vehicle.status)}>{vehicle.status}</Pill>}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border p-3">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Gauge className="h-3 w-3" aria-hidden="true" /> Odometer
            </p>
            <p className="mt-1 text-lg font-semibold tabular-nums">
              {vehicle.mileage.toLocaleString()} km
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {kmToService > 0
                ? `${kmToService.toLocaleString()} km to next service`
                : `${Math.abs(kmToService).toLocaleString()} km past service interval`}
            </p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarClock className="h-3 w-3" aria-hidden="true" /> Next service
            </p>
            <p className="mt-1 text-lg font-semibold">{formatDate(vehicle.nextServiceDue)}</p>
            <p className="mt-1 text-xs">
              <Pill tone={serviceDays < 0 ? 'danger' : serviceDays < 30 ? 'warning' : 'success'}>
                {serviceDays < 0 ? `${Math.abs(serviceDays)} days overdue` : `in ${serviceDays} days`}
              </Pill>
            </p>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <ExpiryRow icon={ShieldCheck} label="Insurance expiry" date={vehicle.insuranceExpiry} />
          <ExpiryRow icon={Car} label="COE expiry" date={vehicle.coeExpiry} />
        </div>

        <div className="mt-3 rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Owner</p>
          <p className="mt-0.5 text-sm font-medium">{customer?.name}</p>
          <p className="text-xs text-muted-foreground">
            {customer?.type} · {customer?.phone}
          </p>
        </div>
      </Panel>

      <Panel
        title="Telematics"
        subtitle={
          vehicle.telematics.fitted
            ? 'Live readings from the fitted tracker'
            : 'No tracker fitted to this vehicle'
        }
      >
        {vehicle.telematics.fitted ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border p-3">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <BatteryMedium className="h-3 w-3" aria-hidden="true" /> Battery
              </p>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                {vehicle.telematics.battery} V
              </p>
              <Pill tone={vehicle.telematics.battery < 12.2 ? 'warning' : 'success'}>
                {vehicle.telematics.battery < 12.2 ? 'Below nominal' : 'Healthy'}
              </Pill>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Thermometer className="h-3 w-3" aria-hidden="true" /> Coolant
              </p>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                {vehicle.telematics.engineTemp} °C
              </p>
              <Pill tone={vehicle.telematics.engineTemp > 94 ? 'warning' : 'success'}>
                {vehicle.telematics.engineTemp > 94 ? 'Running hot' : 'Normal'}
              </Pill>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <TriangleAlert className="h-3 w-3" aria-hidden="true" /> Fault codes
              </p>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                {vehicle.telematics.dtcCount}
              </p>
              <Pill tone={vehicle.telematics.dtcCount > 0 ? 'danger' : 'success'}>
                {vehicle.telematics.dtcCount > 0 ? 'Action needed' : 'All clear'}
              </Pill>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Fit a TTAG tracker to stream mileage, battery health and fault codes straight onto this
            record.
          </p>
        )}
      </Panel>

      <Panel
        title="Service history"
        subtitle={`${history.length} invoiced visit${history.length === 1 ? '' : 's'}${
          openJob ? ' · 1 job currently open' : ''
        }`}
        padded={false}
      >
        {openJob && (
          <div className="flex items-center gap-3 border-b border-border bg-primary/5 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{openJob.id} — in progress</p>
              <p className="truncate text-xs text-muted-foreground">{openJob.complaint}</p>
            </div>
            <Meter value={openJob.progress} className="w-28" label={`${openJob.id} progress`} />
          </div>
        )}
        {history.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
            No invoiced history for this vehicle yet.
          </p>
        ) : (
          <TableWrap>
            <table className="w-full">
              <thead className="border-b border-border bg-muted/40">
                <tr>
                  <Th>Invoice</Th>
                  <Th>Date</Th>
                  <Th>Work done</Th>
                  <Th>Status</Th>
                  <Th align="right">Total</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {history.map((inv) => (
                  <tr key={inv.id}>
                    <Td className="font-medium">{inv.id}</Td>
                    <Td className="text-muted-foreground">{formatDate(inv.issued)}</Td>
                    <Td className="whitespace-normal text-muted-foreground">
                      {inv.lines.map((l) => l.description).join(', ')}
                    </Td>
                    <Td>
                      <Pill tone={statusTone(inv.status)}>{inv.status}</Pill>
                    </Td>
                    <Td align="right">{formatSGD(invoiceTotal(inv))}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        )}
      </Panel>
    </div>
  );
}

export default function VehicleTracking() {
  const [query, setQuery] = useState('');
  const [selectedPlate, setSelectedPlate] = useState(vehicles[0].plate);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return vehicles;
    return vehicles.filter((v) =>
      [v.plate, v.make, v.model, customerById(v.customerId)?.name]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [query]);

  const selected = vehicles.find((v) => v.plate === selectedPlate) ?? vehicles[0];

  const inWorkshop = vehicles.filter((v) => v.status === 'In workshop').length;
  const overdue = vehicles.filter((v) => daysBetween(v.nextServiceDue) < 0).length;
  const tracked = vehicles.filter((v) => v.telematics.fitted).length;

  return (
    <>
      <PageHeader
        title="Vehicle tracking"
        description="Every vehicle on the books, its service position and live tracker health"
      />

      <StatGrid className="mb-4">
        <StatCard index={0} label="Vehicles on file" value={vehicles.length} icon={Car} />
        <StatCard
          index={1}
          label="In the workshop"
          value={inWorkshop}
          delta="Occupying bays now"
          deltaTone="info"
          icon={Gauge}
        />
        <StatCard
          index={2}
          label="Service overdue"
          value={overdue}
          delta={overdue > 0 ? 'Chase required' : 'All current'}
          deltaTone={overdue > 0 ? 'danger' : 'success'}
          icon={CalendarClock}
        />
        <StatCard
          index={3}
          label="Trackers fitted"
          value={`${tracked}/${vehicles.length}`}
          delta="Streaming telemetry"
          deltaTone="success"
          icon={RadioTower}
        />
      </StatGrid>

      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Panel title="Fleet register" subtitle={`${filtered.length} shown`} padded={false}>
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Plate, model or owner"
                aria-label="Search vehicles"
                className="h-9 w-full rounded-lg border border-border bg-muted/40 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:bg-background"
              />
            </div>
          </div>
          <ul className="max-h-[520px] divide-y divide-border overflow-y-auto">
            {filtered.map((v) => (
              <li key={v.plate}>
                <button
                  type="button"
                  onClick={() => setSelectedPlate(v.plate)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                    v.plate === selected.plate ? 'bg-primary/10' : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{v.plate}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {v.make} {v.model}
                    </p>
                  </div>
                  <Pill tone={statusTone(v.status)}>{v.status}</Pill>
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-4 py-8 text-center text-sm text-muted-foreground">
                No vehicles match “{query}”.
              </li>
            )}
          </ul>
        </Panel>

        <VehicleDetail vehicle={selected} />
      </div>
    </>
  );
}
