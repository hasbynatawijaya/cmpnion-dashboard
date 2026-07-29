import { MoreHorizontal } from 'lucide-react';
import type { Order } from '@/domain/types';
import { isSlaBreached, ageInMinutes } from '@/domain/sla';
import { formatTime, formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { StatusBadge, PaymentBadge } from './StatusBadge';
import { SlaBadge } from './SlaBadge';
import { OrderActions } from './OrderActions';

interface OrderTableProps {
  orders: Order[];
  now: number;
  onSelect: (id: string) => void;
}

export function OrderTable({ orders, now, onSelect }: OrderTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-lg border border-border bg-card lg:block">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
            <Th>Order</Th>
            <Th>Guest</Th>
            <Th>Room</Th>
            <Th>Service</Th>
            <Th className="text-center">Qty</Th>
            <Th>Time</Th>
            <Th>Status</Th>
            <Th>Payment</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const breached = isSlaBreached(order, now);
            return (
              <tr
                key={order.id}
                onClick={() => onSelect(order.id)}
                className={cn(
                  'cursor-pointer border-b border-border/70 transition-colors last:border-0 hover:bg-secondary/40',
                )}
                style={
                  breached
                    ? { boxShadow: 'inset 3px 0 0 0 var(--sla-fg)' }
                    : undefined
                }
              >
                <Td className="font-medium text-foreground">{order.id}</Td>
                <Td>{order.guestName}</Td>
                <Td className="tabular-nums">{order.roomNumber}</Td>
                <Td className="text-muted-foreground">{order.service}</Td>
                <Td className="text-center tabular-nums">{order.quantity}</Td>
                <Td className="whitespace-nowrap text-muted-foreground">
                  {formatTime(order.orderTime)}
                </Td>
                <Td>
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status={order.status} />
                    {breached ? <SlaBadge minutes={ageInMinutes(order, now)} /> : null}
                  </div>
                </Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <PaymentBadge status={order.paymentStatus} />
                    <span className="tabular-nums text-muted-foreground">
                      {formatCurrency(order.amount)}
                    </span>
                  </div>
                </Td>
                <Td onClick={(e) => e.stopPropagation()} className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <OrderActions order={order} variant="inline" />
                    <MoreHorizontal className="size-4 text-muted-foreground/50" />
                  </div>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={cn('px-4 py-3 font-medium', className)}>{children}</th>
  );
}

function Td({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <td className={cn('px-4 py-3 align-middle', className)} onClick={onClick}>
      {children}
    </td>
  );
}
