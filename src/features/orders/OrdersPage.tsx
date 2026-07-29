import { useMemo } from 'react';
import { SearchX, PackageOpen } from 'lucide-react';
import { useOrdersQuery } from './hooks/useOrdersQuery';
import { useOrderFilters } from './hooks/useOrderFilters';
import { useNow } from '@/hooks/useNow';
import { applyOrderQuery, countSlaBreaches } from '@/domain/orderFilters';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { OrderFilters } from './components/OrderFilters';
import { OrderTable } from './components/OrderTable';
import { OrderCardList } from './components/OrderCardList';
import { OrderDetailDrawer } from './components/OrderDetailDrawer';
import { OrdersSkeleton } from './components/OrdersSkeleton';

export function OrdersPage() {
  const { data: orders, isLoading, isError, refetch, isFetching } =
    useOrdersQuery();
  const filters = useOrderFilters();
  const now = useNow();

  const visibleOrders = useMemo(
    () => applyOrderQuery(orders ?? [], filters.query, now),
    [orders, filters.query, now],
  );

  const slaCount = useMemo(
    () => countSlaBreaches(orders ?? [], now),
    [orders, now],
  );

  const selectedOrder =
    orders?.find((o) => o.id === filters.selectedOrderId) ?? null;

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Orders
          </h1>
          <p className="text-sm text-muted-foreground">
            {isLoading
              ? 'Loading guest requests…'
              : `${visibleOrders.length} of ${orders?.length ?? 0} orders`}
          </p>
        </div>
      </header>

      <OrderFilters filters={filters} slaCount={slaCount} />

      {isError ? (
        <ErrorState onRetry={() => refetch()} isRetrying={isFetching} />
      ) : isLoading ? (
        <OrdersSkeleton />
      ) : visibleOrders.length === 0 ? (
        <EmptyState
          icon={
            filters.activeFilterCount > 0 ? <SearchX /> : <PackageOpen />
          }
          title="No orders found."
          description={
            filters.activeFilterCount > 0
              ? 'No orders match your current search and filters.'
              : 'There are no orders yet. New guest requests will appear here.'
          }
          action={
            filters.activeFilterCount > 0 ? (
              <Button variant="outline" size="sm" onClick={filters.clearFilters}>
                Clear filters
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <OrderTable orders={visibleOrders} now={now} onSelect={filters.selectOrder} />
          <OrderCardList
            orders={visibleOrders}
            now={now}
            onSelect={filters.selectOrder}
          />
        </>
      )}

      <OrderDetailDrawer
        order={selectedOrder}
        now={now}
        open={filters.selectedOrderId !== null}
        onOpenChange={(open) => {
          if (!open) filters.selectOrder(null);
        }}
      />
    </div>
  );
}
