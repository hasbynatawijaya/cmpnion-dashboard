import type { Order, OrderStatus } from '@/domain/types';
import { getNextStatus } from '@/domain/orderStatusMachine';
import type { OrderAction } from '@/domain/types';
import { generateSeedOrders } from './data';

let orders: Order[] = generateSeedOrders();

export function getAllOrders(): Order[] {
  return orders.map((o) => ({ ...o }));
}

export function getOrderById(id: string): Order | undefined {
  const found = orders.find((o) => o.id === id);
  return found ? { ...found } : undefined;
}

export class InvalidTransitionError extends Error {}
export class OrderNotFoundError extends Error {}

export function applyAction(id: string, action: OrderAction): Order {
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) throw new OrderNotFoundError(id);

  const current = orders[index];
  const next: OrderStatus | null = getNextStatus(current.status, action);
  if (!next) {
    throw new InvalidTransitionError(
      `Cannot ${action} an order in status ${current.status}`,
    );
  }

  const updated: Order = { ...current, status: next };
  orders[index] = updated;
  return { ...updated };
}

export function resetStore(seed?: Order[]): void {
  orders = seed ? seed.map((o) => ({ ...o })) : generateSeedOrders();
}
