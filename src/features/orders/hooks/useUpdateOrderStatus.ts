import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ordersApi, orderKeys } from '@/api/orders.api';
import { getNextStatus, ACTION_LABELS } from '@/domain/orderStatusMachine';
import type { Order, OrderAction } from '@/domain/types';

interface Variables {
  order: Order;
  action: OrderAction;
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ order, action }: Variables) =>
      ordersApi.applyAction(order.id, action),

    onMutate: async ({ order, action }) => {
      const nextStatus = getNextStatus(order.status, action);
      await queryClient.cancelQueries({ queryKey: orderKeys.list() });
      const previous = queryClient.getQueryData<Order[]>(orderKeys.list());

      if (nextStatus) {
        queryClient.setQueryData<Order[]>(orderKeys.list(), (old) =>
          old?.map((o) =>
            o.id === order.id ? { ...o, status: nextStatus } : o,
          ),
        );
      }

      return { previous };
    },

    onError: (_error, { action }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(orderKeys.list(), context.previous);
      }
      toast.error(`Couldn't ${ACTION_LABELS[action].toLowerCase()}`, {
        description: 'The change was reverted. Please try again.',
      });
    },

    onSuccess: (updated, { action }) => {
      const messages: Record<OrderAction, string> = {
        acknowledge: `Order ${updated.id} acknowledged`,
        start: `Order ${updated.id} is now in progress`,
        complete: `Order ${updated.id} marked completed`,
        cancel: `Order ${updated.id} cancelled`,
      };
      toast.success(messages[action]);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.list() });
    },
  });
}
