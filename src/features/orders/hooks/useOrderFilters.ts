import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ORDER_STATUSES,
  SERVICE_TYPES,
  PAYMENT_STATUSES,
  type OrderStatus,
  type PaymentStatus,
  type ServiceType,
} from '@/domain/types';
import type { OrderQuery, SortOrder } from '@/domain/orderFilters';

const PARAM = {
  search: 'q',
  status: 'status',
  service: 'service',
  payment: 'payment',
  sla: 'sla',
  sort: 'sort',
  order: 'order',
} as const;

function parseStatus(value: string | null): OrderStatus | 'all' {
  return ORDER_STATUSES.includes(value as OrderStatus)
    ? (value as OrderStatus)
    : 'all';
}

function parseService(value: string | null): ServiceType | 'all' {
  return SERVICE_TYPES.includes(value as ServiceType)
    ? (value as ServiceType)
    : 'all';
}

function parsePayment(value: string | null): PaymentStatus | 'all' {
  return PAYMENT_STATUSES.includes(value as PaymentStatus)
    ? (value as PaymentStatus)
    : 'all';
}

function parseSort(value: string | null): SortOrder {
  return value === 'oldest' ? 'oldest' : 'newest';
}

export interface UseOrderFiltersResult {
  query: OrderQuery;
  selectedOrderId: string | null;
  setSearch: (value: string) => void;
  setStatus: (value: OrderStatus | 'all') => void;
  setService: (value: ServiceType | 'all') => void;
  setPayment: (value: PaymentStatus | 'all') => void;
  setSlaOnly: (value: boolean) => void;
  setSort: (value: SortOrder) => void;
  selectOrder: (id: string | null) => void;
  clearFilters: () => void;
  activeFilterCount: number;
}

export function useOrderFilters(): UseOrderFiltersResult {
  const [params, setParams] = useSearchParams();

  const query = useMemo<OrderQuery>(
    () => ({
      search: params.get(PARAM.search) ?? '',
      status: parseStatus(params.get(PARAM.status)),
      service: parseService(params.get(PARAM.service)),
      payment: parsePayment(params.get(PARAM.payment)),
      slaOnly: params.get(PARAM.sla) === '1',
      sort: parseSort(params.get(PARAM.sort)),
    }),
    [params],
  );

  const selectedOrderId = params.get(PARAM.order);

  // Mutate params without dropping the others; drop keys at their default value.
  const update = useCallback(
    (key: string, value: string | null) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value === null || value === '') next.delete(key);
          else next.set(key, value);
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  const setSearch = useCallback((v: string) => update(PARAM.search, v), [update]);
  const setStatus = useCallback(
    (v: OrderStatus | 'all') => update(PARAM.status, v === 'all' ? null : v),
    [update],
  );
  const setService = useCallback(
    (v: ServiceType | 'all') => update(PARAM.service, v === 'all' ? null : v),
    [update],
  );
  const setPayment = useCallback(
    (v: PaymentStatus | 'all') => update(PARAM.payment, v === 'all' ? null : v),
    [update],
  );
  const setSlaOnly = useCallback(
    (v: boolean) => update(PARAM.sla, v ? '1' : null),
    [update],
  );
  const setSort = useCallback(
    (v: SortOrder) => update(PARAM.sort, v === 'newest' ? null : v),
    [update],
  );
  const selectOrder = useCallback(
    (id: string | null) => update(PARAM.order, id),
    [update],
  );

  const clearFilters = useCallback(() => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete(PARAM.search);
        next.delete(PARAM.status);
        next.delete(PARAM.service);
        next.delete(PARAM.payment);
        next.delete(PARAM.sla);
        return next;
      },
      { replace: true },
    );
  }, [setParams]);

  const activeFilterCount =
    (query.search ? 1 : 0) +
    (query.status !== 'all' ? 1 : 0) +
    (query.service !== 'all' ? 1 : 0) +
    (query.payment !== 'all' ? 1 : 0) +
    (query.slaOnly ? 1 : 0);

  return {
    query,
    selectedOrderId,
    setSearch,
    setStatus,
    setService,
    setPayment,
    setSlaOnly,
    setSort,
    selectOrder,
    clearFilters,
    activeFilterCount,
  };
}
