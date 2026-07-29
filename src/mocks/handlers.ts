import { http, HttpResponse } from 'msw';
import type { OrderAction } from '@/domain/types';
import { mockConfig, delay } from './config';
import {
  applyAction,
  getAllOrders,
  InvalidTransitionError,
  OrderNotFoundError,
} from './store';

const VALID_ACTIONS: OrderAction[] = ['acknowledge', 'start', 'complete', 'cancel'];

export const handlers = [
  http.get('/api/orders', async () => {
    await delay(mockConfig.latencyMs);

    if (mockConfig.failOrdersFetch) {
      return HttpResponse.json(
        { message: 'Unable to load orders.' },
        { status: 500 },
      );
    }

    return HttpResponse.json({ orders: getAllOrders() });
  }),

  http.patch('/api/orders/:id/status', async ({ params, request }) => {
    await delay(Math.min(mockConfig.latencyMs, 500));

    if (mockConfig.failOrderActions) {
      return HttpResponse.json(
        { message: 'Action failed. Please try again.' },
        { status: 500 },
      );
    }

    const { id } = params as { id: string };
    const body = (await request.json().catch(() => null)) as {
      action?: OrderAction;
    } | null;

    if (!body?.action || !VALID_ACTIONS.includes(body.action)) {
      return HttpResponse.json({ message: 'Invalid action.' }, { status: 400 });
    }

    try {
      const updated = applyAction(id, body.action);
      return HttpResponse.json({ order: updated });
    } catch (error) {
      if (error instanceof OrderNotFoundError) {
        return HttpResponse.json({ message: 'Order not found.' }, { status: 404 });
      }
      if (error instanceof InvalidTransitionError) {
        return HttpResponse.json({ message: error.message }, { status: 409 });
      }
      return HttpResponse.json({ message: 'Unexpected error.' }, { status: 500 });
    }
  }),
];
