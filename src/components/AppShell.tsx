import { useState, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Menu, X, Hotel } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { MockControl } from './MockControl';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/orders', label: 'Orders', icon: ClipboardList, end: false },
];

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Hotel className="size-5" />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold text-foreground">CMPNION</p>
        <p className="text-xs text-muted-foreground">Service Desk</p>
      </div>
    </div>
  );
}

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
            )
          }
        >
          <Icon className="size-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

function LivePill() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground">
      <span className="relative flex size-2">
        <span
          className="absolute inline-flex size-full animate-ping rounded-full opacity-70"
          style={{ backgroundColor: 'var(--live)' }}
        />
        <span
          className="relative inline-flex size-2 rounded-full"
          style={{ backgroundColor: 'var(--live)' }}
        />
      </span>
      Live
    </span>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-svh bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-border bg-card px-4 py-5 lg:flex">
        <div className="px-1">
          <Brand />
        </div>
        <div className="mt-8 flex-1">
          <NavItems />
        </div>
        <p className="px-2 text-xs text-muted-foreground">
          Front desk · Grand Hotel
        </p>
      </aside>

      {/* Mobile slide-over nav */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-border bg-card px-4 py-5">
            <div className="flex items-center justify-between">
              <Brand />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X />
              </Button>
            </div>
            <div className="mt-8">
              <NavItems onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        </div>
      ) : null}

      {/* Main column */}
      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur sm:px-6">
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu />
          </Button>
          <div className="flex-1" />
          <LivePill />
          <MockControl />
          <ThemeToggle />
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
