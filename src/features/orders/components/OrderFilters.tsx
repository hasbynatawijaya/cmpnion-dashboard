import { useEffect, useState } from 'react';
import { Search, X, TriangleAlert } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';
import {
  ORDER_STATUSES,
  SERVICE_TYPES,
  PAYMENT_STATUSES,
  type OrderStatus,
  type PaymentStatus,
  type ServiceType,
} from '@/domain/types';
import type { SortOrder } from '@/domain/orderFilters';
import type { UseOrderFiltersResult } from '../hooks/useOrderFilters';

export function OrderFilters({
  filters,
  slaCount,
}: {
  filters: UseOrderFiltersResult;
  slaCount: number;
}) {
  const {
    query,
    setSearch,
    setStatus,
    setService,
    setPayment,
    setSlaOnly,
    setSort,
    clearFilters,
    activeFilterCount,
  } = filters;

  // Local input state keeps typing snappy; the URL updates on a debounce.
  const [searchInput, setSearchInput] = useState(query.search);
  const debouncedSearch = useDebounce(searchInput, 250);

  useEffect(() => {
    if (debouncedSearch !== query.search) setSearch(debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Keep local input in sync when the URL changes externally (e.g. Clear).
  useEffect(() => {
    setSearchInput(query.search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.search]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative flex-1 sm:min-w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search guest, order ID, or room…"
            className="pl-9"
            aria-label="Search orders"
          />
          {searchInput ? (
            <button
              onClick={() => setSearchInput('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>

        <Select
          value={query.status}
          onValueChange={(v) => setStatus(v as OrderStatus | 'all')}
        >
          <SelectTrigger className="w-full sm:w-40" aria-label="Filter by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {ORDER_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={query.service}
          onValueChange={(v) => setService(v as ServiceType | 'all')}
        >
          <SelectTrigger className="w-full sm:w-44" aria-label="Filter by service">
            <SelectValue placeholder="Service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All services</SelectItem>
            {SERVICE_TYPES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={query.payment}
          onValueChange={(v) => setPayment(v as PaymentStatus | 'all')}
        >
          <SelectTrigger className="w-full sm:w-40" aria-label="Filter by payment">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All payments</SelectItem>
            {PAYMENT_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={query.sort} onValueChange={(v) => setSort(v as SortOrder)}>
          <SelectTrigger className="w-full sm:w-36" aria-label="Sort orders">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant={query.slaOnly ? 'destructive' : 'outline'}
          onClick={() => setSlaOnly(!query.slaOnly)}
          className={cn('gap-2')}
          aria-pressed={query.slaOnly}
        >
          <TriangleAlert />
          SLA
          {slaCount > 0 ? (
            <span
              className={cn(
                'ml-0.5 rounded-full px-1.5 text-xs font-semibold',
                query.slaOnly
                  ? 'bg-white/20'
                  : 'bg-(--sla-bg) text-(--sla-fg)',
              )}
            >
              {slaCount}
            </span>
          ) : null}
        </Button>

        {activeFilterCount > 0 ? (
          <Button variant="ghost" onClick={clearFilters} className="gap-1.5">
            <X className="size-4" />
            Clear
          </Button>
        ) : null}
      </div>
    </div>
  );
}
