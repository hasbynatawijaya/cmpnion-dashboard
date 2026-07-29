import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mockConfig } from '@/mocks/config';
import { orderKeys } from '@/api/orders.api';
import { cn } from '@/lib/utils';

export function MockControl() {
  const queryClient = useQueryClient();
  const [, force] = useState(0);
  const rerender = () => force((n) => n + 1);

  const toggleFetch = () => {
    mockConfig.failOrdersFetch = !mockConfig.failOrdersFetch;
    rerender();
    queryClient.invalidateQueries({ queryKey: orderKeys.all });
  };

  const toggleActions = () => {
    mockConfig.failOrderActions = !mockConfig.failOrderActions;
    rerender();
  };

  const anyActive = mockConfig.failOrdersFetch || mockConfig.failOrderActions;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Simulation controls"
          className={cn(anyActive && 'border-destructive text-destructive')}
        >
          <FlaskConical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          Simulate failures
        </div>
        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); toggleFetch(); }}>
          <span className="flex-1">Fail loading orders</span>
          <ToggleDot on={mockConfig.failOrdersFetch} />
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); toggleActions(); }}>
          <span className="flex-1">Fail order actions</span>
          <ToggleDot on={mockConfig.failOrderActions} />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <p className="px-2 py-1 text-[11px] leading-snug text-muted-foreground">
          Toggle these to preview the error state and optimistic-update rollback.
        </p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ToggleDot({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        'size-2.5 rounded-full',
        on ? 'bg-destructive' : 'bg-muted-foreground/30',
      )}
      aria-hidden
    />
  );
}
