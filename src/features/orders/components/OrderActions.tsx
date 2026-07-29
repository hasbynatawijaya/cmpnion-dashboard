import { useState } from 'react';
import { Check, Play, X, CircleCheckBig, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { getAvailableActions, ACTION_LABELS } from '@/domain/orderStatusMachine';
import type { Order, OrderAction } from '@/domain/types';
import { useUpdateOrderStatus } from '../hooks/useUpdateOrderStatus';

const ACTION_ICON: Record<OrderAction, typeof Check> = {
  acknowledge: Check,
  start: Play,
  complete: CircleCheckBig,
  cancel: X,
};

interface OrderActionsProps {
  order: Order;
  // inline = icon buttons for the row; full = labeled buttons for the drawer.
  variant?: 'inline' | 'full';
}

export function OrderActions({ order, variant = 'inline' }: OrderActionsProps) {
  const mutation = useUpdateOrderStatus();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const actions = getAvailableActions(order.status);

  if (actions.length === 0) {
    return variant === 'full' ? (
      <p className="text-sm text-muted-foreground">
        This order is {order.status.toLowerCase()} — no further actions.
      </p>
    ) : null;
  }

  const isBusy = mutation.isPending;

  const run = (action: OrderAction) => mutation.mutate({ order, action });

  const primaryActions = actions.filter((a) => !a.destructive);
  const cancelAction = actions.find((a) => a.destructive);

  return (
    <div
      className={
        variant === 'full'
          ? 'flex flex-col gap-2'
          : 'flex items-center justify-end gap-1.5'
      }
    >
      {primaryActions.map((a) => {
        const Icon = ACTION_ICON[a.action];
        return (
          <Button
            key={a.action}
            size={variant === 'full' ? 'md' : 'sm'}
            variant={variant === 'full' ? 'primary' : 'outline'}
            disabled={isBusy}
            onClick={() => run(a.action)}
            className={variant === 'full' ? 'w-full' : undefined}
            aria-label={ACTION_LABELS[a.action]}
            title={ACTION_LABELS[a.action]}
          >
            {isBusy ? <Loader2 className="animate-spin" /> : <Icon />}
            {variant === 'full' ? ACTION_LABELS[a.action] : null}
          </Button>
        );
      })}

      {cancelAction ? (
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogTrigger asChild>
            <Button
              size={variant === 'full' ? 'md' : 'sm'}
              variant={variant === 'full' ? 'outline' : 'ghost'}
              disabled={isBusy}
              className={variant === 'full' ? 'w-full' : undefined}
              aria-label="Cancel order"
              title="Cancel order"
            >
              <X />
              {variant === 'full' ? 'Cancel Order' : null}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel order {order.id}?</AlertDialogTitle>
              <AlertDialogDescription>
                This cancels {order.guestName}'s {order.service.toLowerCase()}{' '}
                request for Room {order.roomNumber}. This action can't be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep order</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  run('cancel');
                  setConfirmOpen(false);
                }}
              >
                Cancel order
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}
    </div>
  );
}
