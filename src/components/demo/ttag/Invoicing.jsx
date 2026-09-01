import React, { useMemo, useState } from 'react';
import { CircleDollarSign, Clock3, FileText, Printer, Send, TriangleAlert } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
  GST_RATE,
  TODAY,
  customerById,
  formatDate,
  formatSGD,
  invoiceGst,
  invoiceSubtotal,
  invoiceTotal,
  invoices as seedInvoices,
  vehicleByPlate,
  workshop,
} from '@/data/ttagMotor';

const FILTERS = ['All', 'Draft', 'Sent', 'Overdue', 'Paid'];

function InvoiceDetail({ invoice, onMarkPaid, onClose }) {
  if (!invoice) return null;
  const customer = customerById(invoice.customerId);
  const vehicle = vehicleByPlate(invoice.plate);
  const daysLate = Math.round((TODAY - new Date(invoice.due)) / (1000 * 60 * 60 * 24));

  return (
    <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex flex-wrap items-center gap-3">
          {invoice.id}
          <Pill tone={statusTone(invoice.status)}>{invoice.status}</Pill>
        </DialogTitle>
        <DialogDescription>
          Issued {formatDate(invoice.issued)} · due {formatDate(invoice.due)}
          {invoice.status === 'Overdue' && daysLate > 0 && ` · ${daysLate} days late`}
        </DialogDescription>
      </DialogHeader>

      <div className="rounded-lg border border-border p-4">
        <div className="flex flex-wrap justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">From</p>
            <p className="mt-1 text-sm font-semibold">{workshop.name}</p>
            <p className="text-xs text-muted-foreground">{workshop.address}</p>
            <p className="text-xs text-muted-foreground">GST Reg. {workshop.uen}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Bill to</p>
            <p className="mt-1 text-sm font-semibold">{customer?.name}</p>
            <p className="text-xs text-muted-foreground">{customer?.email}</p>
            <p className="text-xs text-muted-foreground">
              {invoice.plate}
              {vehicle && ` · ${vehicle.make} ${vehicle.model}`}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <TableWrap>
          <table className="w-full">
            <thead className="border-b border-border bg-muted/40">
              <tr>
                <Th>Description</Th>
                <Th align="right">Qty</Th>
                <Th align="right">Unit price</Th>
                <Th align="right">Amount</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoice.lines.map((line) => (
                <tr key={line.description}>
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
                <Td colSpan={3} align="right" className="text-muted-foreground">
                  Subtotal
                </Td>
                <Td align="right">{formatSGD(invoiceSubtotal(invoice))}</Td>
              </tr>
              <tr>
                <Td colSpan={3} align="right" className="text-muted-foreground">
                  GST {(GST_RATE * 100).toFixed(0)}%
                </Td>
                <Td align="right">{formatSGD(invoiceGst(invoice))}</Td>
              </tr>
              <tr>
                <Td colSpan={3} align="right" className="font-semibold">
                  Total due
                </Td>
                <Td align="right" className="font-semibold">
                  {formatSGD(invoiceTotal(invoice))}
                </Td>
              </tr>
            </tfoot>
          </table>
        </TableWrap>
      </div>

      <p className="text-xs text-muted-foreground">Payment terms: {invoice.terms}</p>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button variant="outline">
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
        {invoice.status !== 'Paid' && (
          <Button onClick={() => onMarkPaid(invoice.id)}>
            <CircleDollarSign className="mr-2 h-4 w-4" />
            Record payment
          </Button>
        )}
      </div>
    </DialogContent>
  );
}

export default function Invoicing() {
  const [invoices, setInvoices] = useState(seedInvoices);
  const [filter, setFilter] = useState('All');
  const [selectedId, setSelectedId] = useState(null);

  const selected = invoices.find((i) => i.id === selectedId) ?? null;

  const visible = useMemo(
    () => (filter === 'All' ? invoices : invoices.filter((i) => i.status === filter)),
    [invoices, filter]
  );

  const sumBy = (status) =>
    invoices.filter((i) => i.status === status).reduce((sum, i) => sum + invoiceTotal(i), 0);

  const outstanding = invoices
    .filter((i) => i.status === 'Sent' || i.status === 'Overdue')
    .reduce((sum, i) => sum + invoiceTotal(i), 0);

  const markPaid = (id) => {
    setInvoices((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'Paid' } : i)));
    setSelectedId(null);
  };

  return (
    <>
      <PageHeader
        title="Invoicing"
        description="Every job that leaves a bay becomes a GST invoice — issued, chased and reconciled here"
        actions={
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            New invoice
          </Button>
        }
      />

      <StatGrid className="mb-4">
        <StatCard
          index={0}
          label="Outstanding"
          value={formatSGD(outstanding, { decimals: 0 })}
          delta={`${invoices.filter((i) => i.status === 'Sent' || i.status === 'Overdue').length} invoices`}
          deltaTone="info"
          icon={Send}
        />
        <StatCard
          index={1}
          label="Overdue"
          value={formatSGD(sumBy('Overdue'), { decimals: 0 })}
          delta={`${invoices.filter((i) => i.status === 'Overdue').length} to chase`}
          deltaTone="danger"
          icon={TriangleAlert}
        />
        <StatCard
          index={2}
          label="Paid"
          value={formatSGD(sumBy('Paid'), { decimals: 0 })}
          delta="Settled"
          deltaTone="success"
          icon={CircleDollarSign}
        />
        <StatCard
          index={3}
          label="Drafts"
          value={invoices.filter((i) => i.status === 'Draft').length}
          delta="Awaiting review"
          deltaTone="warning"
          icon={Clock3}
        />
      </StatGrid>

      <Panel
        title="Invoice register"
        subtitle={`${visible.length} of ${invoices.length} invoices`}
        padded={false}
        actions={
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                  filter === f
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        }
      >
        <TableWrap>
          <table className="w-full">
            <thead className="border-b border-border bg-muted/40">
              <tr>
                <Th>Invoice</Th>
                <Th>Customer</Th>
                <Th>Vehicle</Th>
                <Th>Issued</Th>
                <Th>Due</Th>
                <Th>Status</Th>
                <Th align="right">Total</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visible.map((inv) => (
                <tr
                  key={inv.id}
                  onClick={() => setSelectedId(inv.id)}
                  className="cursor-pointer transition-colors hover:bg-muted/40"
                >
                  <Td className="font-medium text-primary">{inv.id}</Td>
                  <Td>{customerById(inv.customerId)?.name}</Td>
                  <Td className="text-muted-foreground">{inv.plate}</Td>
                  <Td className="text-muted-foreground">{formatDate(inv.issued)}</Td>
                  <Td className="text-muted-foreground">{formatDate(inv.due)}</Td>
                  <Td>
                    <Pill tone={statusTone(inv.status)}>{inv.status}</Pill>
                  </Td>
                  <Td align="right" className="font-medium">
                    {formatSGD(invoiceTotal(inv))}
                  </Td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <Td colSpan={7} align="center" className="py-10 text-muted-foreground">
                    No {filter.toLowerCase()} invoices.
                  </Td>
                </tr>
              )}
            </tbody>
          </table>
        </TableWrap>
      </Panel>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelectedId(null)}>
        <InvoiceDetail
          invoice={selected}
          onMarkPaid={markPaid}
          onClose={() => setSelectedId(null)}
        />
      </Dialog>
    </>
  );
}
