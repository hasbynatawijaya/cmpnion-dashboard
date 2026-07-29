import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { ServiceCount } from '@/domain/metrics';
import type { ServiceType } from '@/domain/types';

const SERVICE_COLORS: Record<ServiceType, string> = {
  'Room Service': '#3f7d5c',
  Housekeeping: '#e0985a',
  'Spa & Massage': '#5cb0ac',
  Laundry: '#c07a94',
  'Extra Bed': '#8a7cc0',
};

export function TopServices({
  services,
  loading,
}: {
  services: ServiceCount[];
  loading?: boolean;
}) {
  const max = Math.max(1, ...services.map((s) => s.count));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Top Selling Services</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3.5">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))
          : services.map(({ service, count }) => (
              <div key={service} className="flex items-center gap-3 text-sm">
                <span className="w-28 shrink-0 truncate text-muted-foreground">
                  {service}
                </span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(count / max) * 100}%`,
                      backgroundColor: SERVICE_COLORS[service],
                    }}
                  />
                </div>
                <span className="w-6 shrink-0 text-right font-medium tabular-nums text-foreground">
                  {count}
                </span>
              </div>
            ))}
      </CardContent>
    </Card>
  );
}
