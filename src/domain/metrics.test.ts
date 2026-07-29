import { describe, expect, test } from 'bun:test';
import { computeMetrics } from './metrics';
import type { Order } from './types';

function order(overrides: Partial<Order>): Order {
  return {
    id: 'ORD-1000',
    guestName: 'Guest',
    roomNumber: '100',
    service: 'Room Service',
    quantity: 1,
    amount: 40,
    specialRequest: '',
    orderTime: '2026-07-28T10:00:00Z',
    status: 'New',
    paymentStatus: 'Paid',
    ...overrides,
  };
}

describe('computeMetrics', () => {
  const orders: Order[] = [
    order({ id: 'a', guestName: 'John', status: 'New', amount: 40 }),
    order({ id: 'b', guestName: 'John', status: 'In Progress', amount: 0, service: 'Housekeeping' }),
    order({ id: 'c', guestName: 'Sarah', status: 'Completed', amount: 100, paymentStatus: 'Paid' }),
    order({ id: 'd', guestName: 'Mike', status: 'Completed', amount: 50, paymentStatus: 'Pending' }),
    order({ id: 'e', guestName: 'Anna', status: 'Cancelled', amount: 75 }),
  ];

  const m = computeMetrics(orders);

  test('counts distinct guests with non-final orders', () => {
    expect(m.activeGuests).toBe(1);
  });

  test('counts pending (non-final) orders', () => {
    expect(m.pendingOrders).toBe(2);
  });

  test('revenue today = Completed + Paid only', () => {
    expect(m.revenueToday).toBe(100);
  });

  test('counts completed orders', () => {
    expect(m.completedOrders).toBe(2);
  });

  test('average order value excludes cancelled orders', () => {
    // (40 + 0 + 100 + 50) / 4 = 47.5
    expect(m.averageOrderValue).toBeCloseTo(47.5);
  });

  test('top services ranked by volume', () => {
    expect(m.topServices[0].service).toBe('Room Service');
    expect(m.topServices[0].count).toBe(4);
  });

  test('handles empty input without dividing by zero', () => {
    const empty = computeMetrics([]);
    expect(empty.averageOrderValue).toBe(0);
    expect(empty.activeGuests).toBe(0);
  });
});
