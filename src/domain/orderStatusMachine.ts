import type { OrderAction, OrderStatus } from './types';

interface Transition {
  action: OrderAction;
  to: OrderStatus;
  destructive?: boolean;
}

// New → Acknowledged → In Progress → Completed, plus Cancel from any non-final state.
const TRANSITIONS: Record<OrderStatus, Transition[]> = {
  New: [
    { action: 'acknowledge', to: 'Acknowledged' },
    { action: 'cancel', to: 'Cancelled', destructive: true },
  ],
  Acknowledged: [
    { action: 'start', to: 'In Progress' },
    { action: 'cancel', to: 'Cancelled', destructive: true },
  ],
  'In Progress': [
    { action: 'complete', to: 'Completed' },
    { action: 'cancel', to: 'Cancelled', destructive: true },
  ],
  Completed: [],
  Cancelled: [],
};

export const ACTION_LABELS: Record<OrderAction, string> = {
  acknowledge: 'Acknowledge',
  start: 'Start Processing',
  complete: 'Mark Completed',
  cancel: 'Cancel Order',
};

export const FINAL_STATUSES: readonly OrderStatus[] = ['Completed', 'Cancelled'];

export function isFinalStatus(status: OrderStatus): boolean {
  return FINAL_STATUSES.includes(status);
}

export function getAvailableActions(status: OrderStatus): Transition[] {
  return TRANSITIONS[status];
}

export function getNextStatus(
  status: OrderStatus,
  action: OrderAction,
): OrderStatus | null {
  return TRANSITIONS[status].find((t) => t.action === action)?.to ?? null;
}

export function canTransition(status: OrderStatus, action: OrderAction): boolean {
  return getNextStatus(status, action) !== null;
}
