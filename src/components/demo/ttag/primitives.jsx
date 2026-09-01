import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/** Shared visual building blocks for the TTAG Motor demo modules. */

const TONES = {
  success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20',
  danger: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/20',
  info: 'bg-primary/10 text-primary ring-primary/20',
  neutral: 'bg-muted text-muted-foreground ring-border',
};

export function Pill({ tone = 'neutral', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap',
        TONES[tone] ?? TONES.neutral,
        className
      )}
    >
      {children}
    </span>
  );
}

/** Maps free-text statuses used across the dataset onto a pill tone. */
export function statusTone(status) {
  const s = String(status).toLowerCase();
  if (['paid', 'on shift', 'approved', 'ready for collection', 'ready', 'on road', 'healthy'].includes(s)) return 'success';
  if (['overdue', 'service overdue', 'urgent', 'out of stock', 'critical'].includes(s)) return 'danger';
  if (['late', 'pending', 'awaiting parts', 'draft', 'low stock', 'pending approval', 'awaiting collection'].includes(s)) return 'warning';
  if (['sent', 'in progress', 'diagnosis', 'in workshop', 'qc / road test', 'booked in', 'fleet sla'].includes(s)) return 'info';
  return 'neutral';
}

export function Panel({ title, subtitle, actions, children, className, bodyClassName, padded = true }) {
  return (
    <section
      className={cn(
        'rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col',
        className
      )}
    >
      {(title || actions) && (
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div className="min-w-0">
            {title && <h2 className="text-sm font-semibold tracking-tight truncate">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </header>
      )}
      <div className={cn(padded && 'p-5', 'flex-1 min-w-0', bodyClassName)}>{children}</div>
    </section>
  );
}

export function StatCard({ label, value, delta, deltaTone = 'neutral', hint, icon: Icon, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl border border-border bg-card p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        {Icon && (
          <span className="rounded-lg bg-primary/10 p-1.5 text-primary">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      <div className="mt-1.5 flex items-center gap-2">
        {delta && <Pill tone={deltaTone}>{delta}</Pill>}
        {hint && <span className="text-xs text-muted-foreground truncate">{hint}</span>}
      </div>
    </motion.div>
  );
}

export function StatGrid({ children, className }) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 xl:grid-cols-4', className)}>{children}</div>
  );
}

/** Thin horizontal meter used for progress, utilisation and stock levels. */
export function Meter({ value, max = 100, tone = 'info', className, label }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const fill = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-primary',
    neutral: 'bg-muted-foreground',
  }[tone];
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <motion.div
          className={cn('h-full rounded-full', fill)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <span className="w-9 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
        {Math.round(pct)}%
      </span>
    </div>
  );
}

/** Scroll container so wide tables never force the page to scroll sideways. */
export function TableWrap({ children, className }) {
  return <div className={cn('w-full overflow-x-auto', className)}>{children}</div>;
}

export function Th({ children, className, align = 'left', ...props }) {
  return (
    <th
      scope="col"
      className={cn(
        'whitespace-nowrap px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        align === 'left' && 'text-left',
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function Td({ children, className, align = 'left', ...props }) {
  return (
    <td
      className={cn(
        'whitespace-nowrap px-4 py-3 text-sm',
        align === 'right' && 'text-right tabular-nums',
        align === 'center' && 'text-center',
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
}

export function Avatar({ initials, className }) {
  return (
    <span
      className={cn(
        'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary',
        className
      )}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

export function PageHeader({ title, description, actions }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
