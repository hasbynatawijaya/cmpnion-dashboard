import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface MetricCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
  loading?: boolean;
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  hint,
  loading,
}: MetricCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start gap-4">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-xl"
          style={{
            backgroundColor: 'var(--accent)',
            color: 'var(--accent-foreground)',
          }}
        >
          <Icon className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          {loading ? (
            <Skeleton className="mt-1 h-7 w-20" />
          ) : (
            <p className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
              {value}
            </p>
          )}
          <p className="mt-0.5 text-sm text-muted-foreground">{label}</p>
          {hint && !loading ? (
            <p className="mt-1 text-xs text-muted-foreground/80">{hint}</p>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
