import React from 'react';
import { motion } from 'framer-motion';
import { Anchor, ShieldCheck, ShoppingBag, Radio, Landmark, ArrowUpRight } from 'lucide-react';

/**
 * RealWork
 * Systems Fluxo has actually built. Client names are withheld on purpose —
 * most of these run live operations — so each card names the industry and
 * what the system does, never a quote we can't attribute.
 */

const WORK = [
  {
    Icon: Anchor,
    industry: 'Marine & diving contractor · Singapore',
    title: 'Operations and compliance system',
    detail: 'Crew certifications, dive records, automated survey reports and planned maintenance in one place.',
    status: 'Live',
  },
  {
    Icon: ShieldCheck,
    industry: 'Offshore contractor · Indonesia',
    title: 'Health, safety & environment platform',
    detail: 'Permits to work, incident reporting, training records and audits across sites and vessels.',
    status: 'In client testing',
  },
  {
    Icon: ShoppingBag,
    industry: 'Fluxo product · Singapore',
    title: 'Selka',
    detail: 'Online storefront, orders, bookings and PayNow payments for Singapore businesses, from one link.',
    status: 'Live',
    href: 'https://selka.sg',
  },
  {
    Icon: Radio,
    industry: 'Livestream seller',
    title: 'Live-sale order management',
    detail: 'Records orders taken during live sales, tracks payments and organises packing and delivery.',
    status: 'Live',
  },
  {
    Icon: Landmark,
    industry: 'Financing brokerage · Singapore',
    title: 'Client and deal CRM',
    detail: 'Leads, applications and lender submissions tracked from first enquiry to disbursement.',
    status: 'Live',
  },
];

export default function RealWork() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {WORK.map((w, i) => {
          const Card = w.href ? 'a' : 'div';
          const linkProps = w.href ? { href: w.href, target: '_blank', rel: 'noopener noreferrer' } : {};
          return (
            <motion.div
              key={w.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card
                {...linkProps}
                className={`group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-colors ${w.href ? 'hover:border-primary/40' : ''}`}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[hsl(var(--fluxo-cyan))] flex items-center justify-center text-white">
                    <w.Icon className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider border ${
                      w.status === 'Live'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
                        : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${w.status === 'Live' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    {w.status}
                  </span>
                </div>
                <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-2">{w.industry}</p>
                <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-1.5">
                  {w.title}
                  {w.href && <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{w.detail}</p>
              </Card>
            </motion.div>
          );
        })}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: WORK.length * 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col justify-center rounded-2xl border border-dashed border-border p-6"
        >
          <p className="text-sm text-foreground font-semibold mb-2">Why no client names?</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Our client projects, live or still in testing, belong to their operations, so we keep the names private. Ask us and we will walk you through the ones closest to your business.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
