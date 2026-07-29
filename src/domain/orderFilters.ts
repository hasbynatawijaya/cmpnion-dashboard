import type { Order, OrderStatus, PaymentStatus, ServiceType } from './types';
import { isSlaBreached } from './sla';

export type SortOrder = 'newest' | 'oldest';

export interface OrderQuery {
  search: string;
  status: OrderStatus | 'all';
  service: ServiceType | 'all';
  payment: PaymentStatus | 'all';
  slaOnly: boolean;
  sort: SortOrder;
}

export const DEFAULT_ORDER_QUERY: OrderQuery = {
  search: '',
  status: 'all',
  service: 'all',
  payment: 'all',
  slaOnly: false,
  sort: 'newest',
};

// Search spans guest name, order id, and room number.
export function matchesSearch(order: Order, rawSearch: string): boolean {
  const q = rawSearch.trim().toLowerCase();
  if (!q) return true;
  return (
    order.guestName.toLowerCase().includes(q) ||
    order.id.toLowerCase().includes(q) ||
    order.roomNumber.toLowerCase().includes(q)
  );
}

export function applyOrderQuery(
  orders: Order[],
  query: OrderQuery,
  now: number = Date.now(),
): Order[] {
  const filtered = orders.filter((order) => {
    if (!matchesSearch(order, query.search)) return false;
    if (query.status !== 'all' && order.status !== query.status) return false;
    if (query.service !== 'all' && order.service !== query.service) return false;
    if (query.payment !== 'all' && order.paymentStatus !== query.payment) return false;
    if (query.slaOnly && !isSlaBreached(order, now)) return false;
    return true;
  });

  const direction = query.sort === 'newest' ? -1 : 1;
  return filtered.sort(
    (a, b) =>
      direction *
      (new Date(a.orderTime).getTime() - new Date(b.orderTime).getTime()),
  );
}

export function countSlaBreaches(orders: Order[], now: number = Date.now()): number {
  return orders.reduce((n, o) => (isSlaBreached(o, now) ? n + 1 : n), 0);
}
