import { useMemo } from 'react';
import { Users, Clock, DollarSign, CheckCircle2, Receipt } from 'lucide-react';
import { useOrdersQuery } from '@/features/orders/hooks/useOrdersQuery';
import { computeMetrics } from '@/domain/metrics';
import { countSlaBreaches } from '@/domain/orderFilters';
import { formatCurrency } from '@/lib/formatters';
import { MetricCard } from '@/features/dashboard/components/MetricCard';
import { TopServices } from '@/features/dashboard/components/TopServices';
import { AttentionPanel } from '@/features/dashboard/components/AttentionPanel';
import { ErrorState } from '@/components/ErrorState';

export function DashboardPage() {
  const { data: orders, isLoading, isError, refetch, isFetching } = useOrdersQuery();

  const metrics = useMemo(
    () => computeMetrics(orders ?? []),
    [orders],
  );
  const slaBreaches = useMemo(() => countSlaBreaches(orders ?? []), [orders]);
  const failedPayments = useMemo(
    () => (orders ?? []).filter((o) => o.paymentStatus === 'Failed').length,
    [orders],
  );

  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">Today · {today}</p>
      </header>

      {isError ? (
        <ErrorState onRetry={() => refetch()} isRetrying={isFetching} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            <MetricCard
              label="Active Guests"
              value={String(metrics.activeGuests)}
              icon={Users}
              loading={isLoading}
            />
            <MetricCard
              label="Pending Orders"
              value={String(metrics.pendingOrders)}
              icon={Clock}
              loading={isLoading}
            />
            <MetricCard
              label="Revenue Today"
              value={formatCurrency(metrics.revenueToday)}
              icon={DollarSign}
              loading={isLoading}
            />
            <MetricCard
              label="Completed Orders"
              value={String(metrics.completedOrders)}
              icon={CheckCircle2}
              loading={isLoading}
            />
            <MetricCard
              label="Avg Order Value"
              value={formatCurrency(metrics.averageOrderValue, true)}
              icon={Receipt}
              loading={isLoading}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <TopServices services={metrics.topServices} loading={isLoading} />
            <AttentionPanel
              slaBreaches={slaBreaches}
              failedPayments={failedPayments}
            />
          </div>
        </>
      )}
    </div>
  );
}
