import type { Order } from '@/domain/types';
import { isSlaBreached, ageInMinutes } from '@/domain/sla';
import { formatTime, formatCurrency } from '@/lib/formatters';
import { Card } from '@/components/ui/card';
import { StatusBadge, PaymentBadge } from './StatusBadge';
import { SlaBadge } from './SlaBadge';
import { OrderActions } from './OrderActions';

interface OrderCardListProps {
  orders: Order[];
  now: number;
  onSelect: (id: string) => void;
}

export function OrderCardList({ orders, now, onSelect }: OrderCardListProps) {
  return (
    <div className="space-y-3 lg:hidden">
      {orders.map((order) => {
        const breached = isSlaBreached(order, now);
        return (
          <Card
            key={order.id}
            onClick={() => onSelect(order.id)}
            className="cursor-pointer p-4"
            style={
              breached ? { boxShadow: 'inset 3px 0 0 0 var(--sla-fg)' } : undefined
            }
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-foreground">{order.guestName}</p>
                <p className="text-xs text-muted-foreground">
                  {order.id} · Room {order.roomNumber}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <StatusBadge status={order.status} />
                {breached ? <SlaBadge minutes={ageInMinutes(order, now)} /> : null}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {order.service} · x{order.quantity}
              </span>
              <span className="text-muted-foreground">
                {formatTime(order.orderTime)}
              </span>
            </div>

            <div
              className="mt-3 flex items-center justify-between border-t border-border pt-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 text-sm">
                <PaymentBadge status={order.paymentStatus} />
                <span className="tabular-nums text-muted-foreground">
                  {formatCurrency(order.amount)}
                </span>
              </div>
              <OrderActions order={order} variant="inline" />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
