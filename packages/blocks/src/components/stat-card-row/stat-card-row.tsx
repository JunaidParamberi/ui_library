import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Card, KPICard, cn, type KPI } from "@manpowerhub/ui";

export const statCardRowVariants = cva("grid gap-4", {
  variants: {
    columns: {
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
    },
  },
  defaultVariants: { columns: 3 },
});

export interface StatCardRowProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof statCardRowVariants> {
  stats: KPI[];
  loading?: boolean;
}

function StatSkeleton() {
  return (
    <Card className="p-[18px]" data-testid="stat-skeleton" aria-hidden>
      <div className="mb-2 h-4 w-20 animate-pulse rounded bg-secondary" />
      <div className="h-7 w-28 animate-pulse rounded bg-secondary" />
    </Card>
  );
}

export const StatCardRow = React.forwardRef<HTMLDivElement, StatCardRowProps>(
  ({ className, columns, stats, loading = false, ...props }, ref) => {
    const count = loading ? (typeof columns === "number" ? columns : 3) : stats.length;
    return (
      <div ref={ref} className={cn(statCardRowVariants({ columns }), className)} {...props}>
        {loading
          ? Array.from({ length: count }).map((_, i) => <StatSkeleton key={i} />)
          : stats.map((kpi, i) => <KPICard key={kpi.label} kpi={kpi} delay={i} />)}
      </div>
    );
  },
);
StatCardRow.displayName = "StatCardRow";
