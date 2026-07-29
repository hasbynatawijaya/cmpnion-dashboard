import { Link } from 'react-router-dom';
import { AlertTriangle, CreditCard, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AttentionPanelProps {
  slaBreaches: number;
  failedPayments: number;
}

export function AttentionPanel({ slaBreaches, failedPayments }: AttentionPanelProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Needs Attention</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        <AttentionRow
          to="/orders?sla=1"
          icon={<AlertTriangle />}
          tone="var(--sla-fg)"
          toneBg="var(--sla-bg)"
          count={slaBreaches}
          label="Orders breaching SLA"
          empty="No SLA breaches"
        />
        <AttentionRow
          to="/orders?payment=Failed"
          icon={<CreditCard />}
          tone="var(--pay-failed-fg)"
          toneBg="var(--pay-failed-bg)"
          count={failedPayments}
          label="Failed payments"
          empty="No failed payments"
        />
      </CardContent>
    </Card>
  );
}

function AttentionRow({
  to,
  icon,
  tone,
  toneBg,
  count,
  label,
  empty,
}: {
  to: string;
  icon: React.ReactNode;
  tone: string;
  toneBg: string;
  count: number;
  label: string;
  empty: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-md border border-border bg-background/40 px-3 py-2.5 transition-colors hover:bg-secondary/60"
    >
      <span
        className="flex size-9 items-center justify-center rounded-lg [&_svg]:size-4"
        style={{ backgroundColor: toneBg, color: tone }}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">
          {count > 0 ? `${count} ${label.toLowerCase()}` : empty}
        </p>
      </div>
      {count > 0 ? (
        <ChevronRight className="size-4 text-muted-foreground" />
      ) : null}
    </Link>
  );
}
