import { useQuery } from '@tanstack/react-query';
import { ordersApi, orderKeys } from '@/api/orders.api';
import type { Order } from '@/domain/types';

export function useOrdersQuery() {
  return useQuery<Order[]>({
    queryKey: orderKeys.list(),
    queryFn: ordersApi.list,
  });
}
