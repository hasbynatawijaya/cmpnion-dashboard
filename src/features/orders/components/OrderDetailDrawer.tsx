import type { Order } from '@/domain/types';
import { isSlaBreached, ageInMinutes } from '@/domain/sla';
import { formatDateTime, formatCurrency } from '@/lib/formatters';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { StatusBadge, PaymentBadge } from './StatusBadge';
import { SlaBadge } from './SlaBadge';
import { OrderActions } from './OrderActions';

interface OrderDetailDrawerProps {
  order: Order | null;
  now: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailDrawer({
  order,
  now,
  open,
  onOpenChange,
}: OrderDetailDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        title={order ? `Order ${order.id}` : 'Order details'}
        description="Full order details and actions"
      >
        {order ? (
          <OrderDetailBody order={order} now={now} />
        ) : (
          <div className="p-6 text-sm text-muted-foreground">
            This order no longer exists.
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function OrderDetailBody({ order, now }: { order: Order; now: number }) {
  const breached = isSlaBreached(order, now);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {order.id}
        </p>
        <h2 className="mt-1 text-lg font-semibold text-foreground">
          {order.guestName}
        </h2>
        <p className="text-sm text-muted-foreground">Room {order.roomNumber}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StatusBadge status={order.status} />
          <PaymentBadge status={order.paymentStatus} />
          {breached ? <SlaBadge minutes={ageInMinutes(order, now)} /> : null}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <dl className="space-y-4">
          <DetailRow label="Service" value={order.service} />
          <DetailRow label="Quantity" value={String(order.quantity)} />
          <DetailRow label="Amount" value={formatCurrency(order.amount, true)} />
          <DetailRow label="Ordered" value={formatDateTime(order.orderTime)} />
          <Separator />
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Special Request
            </dt>
            <dd className="mt-1.5 rounded-md bg-muted/60 p-3 text-sm text-foreground">
              {order.specialRequest || (
                <span className="text-muted-foreground">No special request.</span>
              )}
            </dd>
          </div>
        </dl>
      </div>

      <div className="border-t border-border p-6">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Actions
        </p>
        <OrderActions order={order} variant="full" />
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
