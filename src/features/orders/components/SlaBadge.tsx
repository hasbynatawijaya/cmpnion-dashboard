import { AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function SlaBadge({ minutes }: { minutes: number }) {
  return (
    <Badge
      style={{ backgroundColor: 'var(--sla-bg)', color: 'var(--sla-fg)' }}
      title={`New for ${minutes} minutes — past the 15-minute SLA`}
    >
      <AlertTriangle className="size-3" aria-hidden />
      SLA {minutes}m
    </Badge>
  );
}
