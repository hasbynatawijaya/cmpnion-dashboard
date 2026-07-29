import { z } from 'zod';
import {
  ORDER_STATUSES,
  SERVICE_TYPES,
  PAYMENT_STATUSES,
  type Order,
  type OrderAction,
} from '@/domain/types';
import { apiGet, apiPatch } from './client';

const orderSchema = z.object({
  id: z.string(),
  guestName: z.string(),
  roomNumber: z.string(),
  service: z.enum(SERVICE_TYPES),
  quantity: z.number(),
  amount: z.number(),
  specialRequest: z.string(),
  orderTime: z.string(),
  status: z.enum(ORDER_STATUSES),
  paymentStatus: z.enum(PAYMENT_STATUSES),
}) satisfies z.ZodType<Order>;

const listResponseSchema = z.object({ orders: z.array(orderSchema) });
const actionResponseSchema = z.object({ order: orderSchema });

export const ordersApi = {
  async list(): Promise<Order[]> {
    const data = await apiGet<unknown>('/api/orders');
    return listResponseSchema.parse(data).orders;
  },

  async applyAction(id: string, action: OrderAction): Promise<Order> {
    const data = await apiPatch<unknown>(`/api/orders/${id}/status`, { action });
    return actionResponseSchema.parse(data).order;
  },
};

export const orderKeys = {
  all: ['orders'] as const,
  list: () => [...orderKeys.all, 'list'] as const,
};
