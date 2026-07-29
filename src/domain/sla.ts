import type { Order } from './types';

export const SLA_THRESHOLD_MINUTES = 15;

export function minutesSince(iso: string, now: number = Date.now()): number {
  return (now - new Date(iso).getTime()) / 60_000;
}

export function isSlaBreached(order: Order, now: number = Date.now()): boolean {
  return (
    order.status === 'New' &&
    minutesSince(order.orderTime, now) > SLA_THRESHOLD_MINUTES
  );
}

export function ageInMinutes(order: Order, now: number = Date.now()): number {
  return Math.floor(minutesSince(order.orderTime, now));
}
