import React, { useMemo, useState } from 'react';
import { CheckCircle2, Minus, Plus, Receipt, ScanLine, Trash2, X } from 'lucide-react';
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
  Td,
  Th,
  TableWrap,
} from '@/components/demo/ttag/primitives.jsx';
import {
  GST_RATE,
  customers,
  formatSGD,
  paymentMethods,
  posCatalog,
  posCategories,
  recentSales,
  workshop,
} from '@/data/ttagMotor';

const ALL = 'All';

export default function PointOfSale() {
  const [category, setCategory] = useState(ALL);
  const [cart, setCart] = useState([]);
  const [customerId, setCustomerId] = useState('walk-in');
  const [method, setMethod] = useState(paymentMethods[0]);
  const [receipt, setReceipt] = useState(null);
  const [sales, setSales] = useState(recentSales);

  const visible = useMemo(
    () => (category === ALL ? posCatalog : posCatalog.filter((p) => p.category === category)),
    [category]
  );

  const addItem = (product) =>
    setCart((prev) => {
      const existing = prev.find((l) => l.sku === product.sku);
      if (existing) {
        return prev.map((l) => (l.sku === product.sku ? { ...l, qty: l.qty + 1 } : l));
      }
      return [...prev, { ...product, qty: 1 }];
    });

  const changeQty = (sku, delta) =>
    setCart((prev) =>
      prev
        .map((l) => (l.sku === sku ? { ...l, qty: l.qty + delta } : l))
        .filter((l) => l.qty > 0)
    );

  const removeItem = (sku) => setCart((prev) => prev.filter((l) => l.sku !== sku));

  const subtotal = cart.reduce((sum, l) => sum + l.qty * l.price, 0);
  const gst = subtotal * GST_RATE;
  const total = subtotal + gst;
  const customerName =
    customerId === 'walk-in' ? 'Walk-in' : customers.find((c) => c.id === customerId)?.name;

  const charge = () => {
    if (!cart.length) return;
    const id = `POS-26-${3392 + sales.length - recentSales.length}`;
    const sale = {
      id,
      time: new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', hour12: false }),
      customer: customerName,
      items: cart.reduce((n, l) => n + l.qty, 0),
      method,
      total,
      lines: cart,
      subtotal,
      gst,
    };
    setReceipt(sale);
    setSales((prev) => [sale, ...prev]);
    setCart([]);
  };

  return (
    <>
      <PageHeader
        title="Point of sale"
        description="Counter sales for parts, tyres and walk-in servicing — GST inclusive"
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-4">
          <Panel title="Catalogue" subtitle={`${visible.length} items`}>
            <div className="mb-4 flex flex-wrap gap-2">
              {[ALL, ...posCategories].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    category === c
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((product) => (
                <button
                  key={product.sku}
                  type="button"
                  onClick={() => addItem(product)}
                  className="flex flex-col rounded-lg border border-border bg-card p-3 text-left transition-all hover:border-primary/50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <span className="text-xs text-muted-foreground">{product.category}</span>
                  <span className="mt-1 flex-1 text-sm font-medium leading-snug">
                    {product.name}
                  </span>
                  <span className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{product.sku}</span>
                    <span className="text-sm font-semibold tabular-nums">
                      {formatSGD(product.price, { decimals: 0 })}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Today's transactions" subtitle={`${sales.length} sales`} padded={false}>
            <TableWrap>
              <table className="w-full">
                <thead className="border-b border-border bg-muted/40">
                  <tr>
                    <Th>Receipt</Th>
                    <Th>Time</Th>
                    <Th>Customer</Th>
                    <Th align="right">Items</Th>
                    <Th>Method</Th>
                    <Th align="right">Total</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sales.map((s) => (
                    <tr key={s.id} className="transition-colors hover:bg-muted/40">
                      <Td className="font-medium">{s.id}</Td>
                      <Td className="text-muted-foreground">{s.time}</Td>
                      <Td>{s.customer}</Td>
                      <Td align="right">{s.items}</Td>
                      <Td>
                        <Pill tone="neutral">{s.method}</Pill>
                      </Td>
                      <Td align="right">{formatSGD(s.total)}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          </Panel>
        </div>

        <div className="xl:sticky xl:top-20 xl:self-start">
          <Panel
            title="Current sale"
            subtitle={`${cart.reduce((n, l) => n + l.qty, 0)} item${
              cart.reduce((n, l) => n + l.qty, 0) === 1 ? '' : 's'
            }`}
            actions={
              cart.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCart([])}
                  className="text-xs text-muted-foreground transition-colors hover:text-destructive"
                >
                  Clear
                </button>
              )
            }
          >
            {cart.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-center">
                <ScanLine className="h-8 w-8 text-muted-foreground/50" aria-hidden="true" />
                <p className="text-sm text-muted-foreground">
                  Tap a catalogue item to start a sale.
                </p>
              </div>
            ) : (
              <ul className="mb-4 space-y-2">
                {cart.map((line) => (
                  <li key={line.sku} className="flex items-start gap-2 rounded-lg border border-border p-2.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-snug">{line.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatSGD(line.price)} each
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => changeQty(line.sku, -1)}
                        aria-label={`Reduce ${line.name}`}
                        className="rounded border border-border p-1 transition-colors hover:bg-muted"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm tabular-nums">{line.qty}</span>
                      <button
                        type="button"
                        onClick={() => changeQty(line.sku, 1)}
                        aria-label={`Add ${line.name}`}
                        className="rounded border border-border p-1 transition-colors hover:bg-muted"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(line.sku)}
                        aria-label={`Remove ${line.name}`}
                        className="ml-1 rounded border border-border p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="space-y-3 border-t border-border pt-4">
              <label className="block">
                <span className="text-xs font-medium text-muted-foreground">Customer</span>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-2 text-sm outline-none focus:border-primary"
                >
                  <option value="walk-in">Walk-in</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <div>
                <span className="text-xs font-medium text-muted-foreground">Payment method</span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {paymentMethods.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMethod(m)}
                      className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                        method === m
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <dl className="space-y-1.5 border-t border-border pt-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="tabular-nums">{formatSGD(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">GST {(GST_RATE * 100).toFixed(0)}%</dt>
                  <dd className="tabular-nums">{formatSGD(gst)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-1.5 text-base font-semibold">
                  <dt>Total</dt>
                  <dd className="tabular-nums">{formatSGD(total)}</dd>
                </div>
              </dl>

              <Button className="w-full" size="lg" disabled={!cart.length} onClick={charge}>
                <Receipt className="mr-2 h-4 w-4" />
                Charge {formatSGD(total)}
              </Button>
            </div>
          </Panel>
        </div>
      </div>

      <Dialog open={Boolean(receipt)} onOpenChange={(open) => !open && setReceipt(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              Payment received
            </DialogTitle>
            <DialogDescription>
              {receipt?.id} · {receipt?.method}
            </DialogDescription>
          </DialogHeader>

          {receipt && (
            <div className="rounded-lg border border-border p-4 font-mono text-xs">
              <p className="text-center text-sm font-semibold">{workshop.name}</p>
              <p className="text-center text-muted-foreground">{workshop.address}</p>
              <p className="mb-3 text-center text-muted-foreground">GST Reg. {workshop.uen}</p>
              <div className="border-y border-dashed border-border py-2">
                {receipt.lines.map((l) => (
                  <div key={l.sku} className="flex justify-between gap-3 py-0.5">
                    <span className="min-w-0 truncate">
                      {l.qty} × {l.name}
                    </span>
                    <span className="shrink-0 tabular-nums">{formatSGD(l.qty * l.price)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-0.5 pt-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{formatSGD(receipt.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST {(GST_RATE * 100).toFixed(0)}%</span>
                  <span className="tabular-nums">{formatSGD(receipt.gst)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-1 text-sm font-semibold">
                  <span>Total</span>
                  <span className="tabular-nums">{formatSGD(receipt.total)}</span>
                </div>
              </div>
              <p className="mt-3 text-center text-muted-foreground">Thank you — drive safe.</p>
            </div>
          )}

          <Button variant="outline" onClick={() => setReceipt(null)}>
            <X className="mr-2 h-4 w-4" />
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
