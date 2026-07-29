import { describe, expect, test } from 'bun:test';
import { isSlaBreached, ageInMinutes } from './sla';
import type { Order } from './types';

const NOW = new Date('2026-07-28T18:00:00Z').getTime();

function makeOrder(overrides: Partial<Order>): Order {
  return {
    id: 'ORD-1001',
    guestName: 'Test Guest',
    roomNumber: '101',
    service: 'Room Service',
    quantity: 1,
    amount: 10,
    specialRequest: '',
    orderTime: new Date(NOW).toISOString(),
    status: 'New',
    paymentStatus: 'Paid',
    ...overrides,
  };
}

describe('sla', () => {
  test('flags a New order older than 15 minutes', () => {
    const order = makeOrder({
      status: 'New',
      orderTime: new Date(NOW - 16 * 60_000).toISOString(),
    });
    expect(isSlaBreached(order, NOW)).toBe(true);
  });

  test('does not flag a New order within the threshold', () => {
    const order = makeOrder({
      status: 'New',
      orderTime: new Date(NOW - 10 * 60_000).toISOString(),
    });
    expect(isSlaBreached(order, NOW)).toBe(false);
  });

  test('never flags non-New orders regardless of age', () => {
    const order = makeOrder({
      status: 'Acknowledged',
      orderTime: new Date(NOW - 120 * 60_000).toISOString(),
    });
    expect(isSlaBreached(order, NOW)).toBe(false);
  });

  test('reports whole-minute age', () => {
    const order = makeOrder({
      orderTime: new Date(NOW - 23 * 60_000 - 30_000).toISOString(),
    });
    expect(ageInMinutes(order, NOW)).toBe(23);
  });
});
