import React from 'react';
import { Helmet } from 'react-helmet';
import { Navigate, useParams } from 'react-router-dom';
import DemoShell, { NAV_ITEMS, DEMO_BASE } from '@/components/demo/ttag/DemoShell.jsx';
import Dashboard from '@/components/demo/ttag/Dashboard.jsx';
import JobCards from '@/components/demo/ttag/JobCards.jsx';
import VehicleTracking from '@/components/demo/ttag/VehicleTracking.jsx';
import PointOfSale from '@/components/demo/ttag/PointOfSale.jsx';
import Invoicing from '@/components/demo/ttag/Invoicing.jsx';
import Inventory from '@/components/demo/ttag/Inventory.jsx';
import Finance from '@/components/demo/ttag/Finance.jsx';
import HumanResources from '@/components/demo/ttag/HumanResources.jsx';
import Customers from '@/components/demo/ttag/Customers.jsx';
import { workshop } from '@/data/ttagMotor';

const MODULES = {
  dashboard: Dashboard,
  'job-cards': JobCards,
  vehicles: VehicleTracking,
  customers: Customers,
  pos: PointOfSale,
  invoices: Invoicing,
  inventory: Inventory,
  finance: Finance,
  hr: HumanResources,
};

export default function TtagMotorDemo() {
  const { module = 'dashboard' } = useParams();

  const Module = MODULES[module];
  if (!Module) return <Navigate to={`${DEMO_BASE}/dashboard`} replace />;

  const title = NAV_ITEMS.find((i) => i.key === module)?.label ?? 'Dashboard';

  return (
    <>
      <Helmet>
        <title>{`${title} · ${workshop.name} — Fluxo demo`}</title>
        {/* Client demo: keep it out of search results and off the sitemap. */}
        <meta name="robots" content="noindex, nofollow" />
        <meta
          name="description"
          content="Interactive demo of the TTAG Motor workshop management system built by Fluxo."
        />
      </Helmet>
      <DemoShell title={title}>
        <Module />
      </DemoShell>
    </>
  );
}
