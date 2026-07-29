import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function OrdersSkeleton() {
  return (
    <>
      <div className="hidden overflow-hidden rounded-lg border border-border bg-card lg:block">
        <div className="space-y-px">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3.5">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-28" />
              <div className="flex-1" />
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3 lg:hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="mt-2 h-4 w-28" />
            <Skeleton className="mt-4 h-8 w-full" />
          </Card>
        ))}
      </div>
    </>
  );
}
