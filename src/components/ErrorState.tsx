import { RotateCw, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function ErrorState({
  title = 'Unable to load orders.',
  description = 'Something went wrong while fetching data. Please try again.',
  onRetry,
  isRetrying,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card/50 px-6 py-16 text-center"
    >
      <div
        className="flex size-11 items-center justify-center rounded-full [&_svg]:size-5"
        style={{ backgroundColor: 'var(--sla-bg)', color: 'var(--sla-fg)' }}
      >
        <TriangleAlert />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry} disabled={isRetrying}>
          <RotateCw className={isRetrying ? 'animate-spin' : undefined} />
          {isRetrying ? 'Retrying…' : 'Try again'}
        </Button>
      ) : null}
    </div>
  );
}
