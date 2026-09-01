import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  Car,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Menu,
  Package,
  Search,
  ScanLine,
  UserCog,
  Users,
  Wallet,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle.jsx';
import { Avatar, Pill } from '@/components/demo/ttag/primitives.jsx';
import { workshop } from '@/data/ttagMotor';

export const DEMO_BASE = '/demo/ttag-motor';

export const NAV_GROUPS = [
  {
    label: 'Operations',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { key: 'job-cards', label: 'Job Cards', icon: ClipboardList },
      { key: 'vehicles', label: 'Vehicle Tracking', icon: Car },
      { key: 'customers', label: 'Customers', icon: Users },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { key: 'pos', label: 'Point of Sale', icon: ScanLine },
      { key: 'invoices', label: 'Invoicing', icon: FileText },
      { key: 'inventory', label: 'Parts & Inventory', icon: Package },
    ],
  },
  {
    label: 'Back office',
    items: [
      { key: 'finance', label: 'Finance', icon: Wallet },
      { key: 'hr', label: 'Human Resources', icon: UserCog },
    ],
  },
];

export const NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

function WorkshopMark() {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-sm font-bold text-primary-foreground">
      TT
    </span>
  );
}

function SidebarContent({ onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <WorkshopMark />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight">{workshop.name}</p>
          <p className="truncate text-xs text-muted-foreground">{workshop.tagline}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.key}>
                  <NavLink
                    to={`${DEMO_BASE}/${item.key}`}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                      }`
                    }
                  >
                    <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-border px-5 py-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to Fluxo
        </Link>
      </div>
    </div>
  );
}

export default function DemoShell({ title, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-card lg:block">
        <SidebarContent />
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SidebarContent onNavigate={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>

            <h1 className="truncate text-sm font-semibold tracking-tight sm:text-base">{title}</h1>

            <Pill tone="info" className="hidden sm:inline-flex">
              Demo data
            </Pill>

            <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
              <div className="relative hidden md:block">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  placeholder="Search plate, job, invoice…"
                  aria-label="Search"
                  className="h-9 w-56 rounded-lg border border-border bg-muted/50 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:bg-background"
                />
              </div>
              <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
              </Button>
              <ThemeToggle />
              <div className="flex items-center gap-2 pl-1">
                <Avatar initials="JL" />
                <div className="hidden text-left xl:block">
                  <p className="text-xs font-medium leading-tight">Jason Lee</p>
                  <p className="text-[11px] leading-tight text-muted-foreground">Workshop Manager</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
