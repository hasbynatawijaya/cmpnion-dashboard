import { describe, expect, test } from 'bun:test';
import { applyOrderQuery, matchesSearch, DEFAULT_ORDER_QUERY } from './orderFilters';
import type { Order } from './types';

const NOW = new Date('2026-07-28T18:00:00Z').getTime();

const orders: Order[] = [
  base('ORD-1001', 'John Smith', '204', 'Room Service', 'New', -30, 'Paid'),
  base('ORD-1002', 'Sarah Johnson', '312', 'Housekeeping', 'In Progress', -60, 'Failed'),
  base('ORD-1003', 'John Doe', '204', 'Laundry', 'New', -5, 'Paid'),
  base('ORD-1004', 'Michael Tan', '105', 'Laundry', 'Completed', -120, 'Failed'),
];

function base(
  id: string,
  guestName: string,
  roomNumber: string,
  service: Order['service'],
  status: Order['status'],
  ageMin: number,
  paymentStatus: Order['paymentStatus'] = 'Paid',
): Order {
  return {
    id,
    guestName,
    roomNumber,
    service,
    quantity: 1,
    amount: 20,
    specialRequest: '',
    orderTime: new Date(NOW + ageMin * 60_000).toISOString(),
    status,
    paymentStatus,
  };
}

describe('matchesSearch', () => {
  test('matches by room number', () => {
    expect(matchesSearch(orders[0], '204')).toBe(true);
    expect(matchesSearch(orders[1], '204')).toBe(false);
  });

  test('matches by guest name, case-insensitively', () => {
    expect(matchesSearch(orders[0], 'john')).toBe(true);
  });

  test('matches by order id', () => {
    expect(matchesSearch(orders[0], 'ORD-1001')).toBe(true);
  });

  test('empty search matches everything', () => {
    expect(matchesSearch(orders[0], '   ')).toBe(true);
  });
});

describe('applyOrderQuery', () => {
  test('search "204" returns only Room 204 orders', () => {
    const result = applyOrderQuery(orders, { ...DEFAULT_ORDER_QUERY, search: '204' }, NOW);
    expect(result.map((o) => o.id).sort()).toEqual(['ORD-1001', 'ORD-1003']);
  });

  test('search + status filter compose (John + New)', () => {
    const result = applyOrderQuery(
      orders,
      { ...DEFAULT_ORDER_QUERY, search: 'john', status: 'New' },
      NOW,
    );
    expect(result.map((o) => o.id).sort()).toEqual(['ORD-1001', 'ORD-1003']);
  });

  test('service filter narrows results', () => {
    const result = applyOrderQuery(
      orders,
      { ...DEFAULT_ORDER_QUERY, service: 'Laundry' },
      NOW,
    );
    expect(result.map((o) => o.id).sort()).toEqual(['ORD-1003', 'ORD-1004']);
  });

  test('payment filter keeps only matching payment status', () => {
    const result = applyOrderQuery(
      orders,
      { ...DEFAULT_ORDER_QUERY, payment: 'Failed' },
      NOW,
    );
    expect(result.map((o) => o.id).sort()).toEqual(['ORD-1002', 'ORD-1004']);
  });

  test('slaOnly keeps only breaching New orders', () => {
    const result = applyOrderQuery(
      orders,
      { ...DEFAULT_ORDER_QUERY, slaOnly: true },
      NOW,
    );
    // ORD-1001 is New and 30m old (breach); ORD-1003 is New but only 5m old.
    expect(result.map((o) => o.id)).toEqual(['ORD-1001']);
  });

  test('sorts newest and oldest first', () => {
    const newest = applyOrderQuery(orders, { ...DEFAULT_ORDER_QUERY, sort: 'newest' }, NOW);
    expect(newest[0].id).toBe('ORD-1003');
    const oldest = applyOrderQuery(orders, { ...DEFAULT_ORDER_QUERY, sort: 'oldest' }, NOW);
    expect(oldest[0].id).toBe('ORD-1004');
  });

  test('returns empty array when nothing matches', () => {
    const result = applyOrderQuery(orders, { ...DEFAULT_ORDER_QUERY, search: 'zzz' }, NOW);
    expect(result).toHaveLength(0);
  });
});
