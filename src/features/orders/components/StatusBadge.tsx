import { Badge } from '@/components/ui/badge';
import type { OrderStatus, PaymentStatus } from '@/domain/types';

const STATUS_STYLES: Record<OrderStatus, { bg: string; fg: string }> = {
  New: { bg: 'var(--status-new-bg)', fg: 'var(--status-new-fg)' },
  Acknowledged: { bg: 'var(--status-ack-bg)', fg: 'var(--status-ack-fg)' },
  'In Progress': {
    bg: 'var(--status-progress-bg)',
    fg: 'var(--status-progress-fg)',
  },
  Completed: {
    bg: 'var(--status-completed-bg)',
    fg: 'var(--status-completed-fg)',
  },
  Cancelled: {
    bg: 'var(--status-cancelled-bg)',
    fg: 'var(--status-cancelled-fg)',
  },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const { bg, fg } = STATUS_STYLES[status];
  return (
    <Badge style={{ backgroundColor: bg, color: fg }}>
      <span
        className="size-1.5 rounded-full"
        style={{ backgroundColor: fg }}
        aria-hidden
      />
      {status}
    </Badge>
  );
}

const PAYMENT_STYLES: Record<PaymentStatus, { bg: string; fg: string }> = {
  Paid: { bg: 'var(--pay-paid-bg)', fg: 'var(--pay-paid-fg)' },
  Pending: { bg: 'var(--pay-pending-bg)', fg: 'var(--pay-pending-fg)' },
  Failed: { bg: 'var(--pay-failed-bg)', fg: 'var(--pay-failed-fg)' },
};

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  const { bg, fg } = PAYMENT_STYLES[status];
  return (
    <Badge style={{ backgroundColor: bg, color: fg }}>{status}</Badge>
  );
}
