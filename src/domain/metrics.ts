import type { Order, ServiceType } from './types';
import { isFinalStatus } from './orderStatusMachine';

export interface ServiceCount {
  service: ServiceType;
  count: number;
}

export interface DashboardMetrics {
  activeGuests: number;
  pendingOrders: number;
  revenueToday: number;
  completedOrders: number;
  averageOrderValue: number;
  topServices: ServiceCount[];
}

// Revenue counts Completed + Paid only; average excludes cancelled orders.
export function computeMetrics(orders: Order[]): DashboardMetrics {
  const activeGuests = new Set(
    orders.filter((o) => !isFinalStatus(o.status)).map((o) => o.guestName),
  ).size;

  const pendingOrders = orders.filter((o) => !isFinalStatus(o.status)).length;

  const revenueToday = orders
    .filter((o) => o.status === 'Completed' && o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + o.amount, 0);

  const completedOrders = orders.filter((o) => o.status === 'Completed').length;

  const billable = orders.filter((o) => o.status !== 'Cancelled');
  const averageOrderValue =
    billable.length === 0
      ? 0
      : billable.reduce((sum, o) => sum + o.amount, 0) / billable.length;

  const counts = new Map<ServiceType, number>();
  for (const o of orders) {
    counts.set(o.service, (counts.get(o.service) ?? 0) + 1);
  }
  const topServices: ServiceCount[] = [...counts.entries()]
    .map(([service, count]) => ({ service, count }))
    .sort((a, b) => b.count - a.count);

  return {
    activeGuests,
    pendingOrders,
    revenueToday,
    completedOrders,
    averageOrderValue,
    topServices,
  };
}
