import * as React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { Card } from "../card";
import { Badge } from "../badge";

export interface KPI {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
  sub?: string;
}

export interface KPICardProps {
  kpi: KPI;
  /** Stagger index for the fade-up entrance (0-based). */
  delay?: number;
}

export function KPICard({ kpi, delay = 0 }: KPICardProps) {
  const { label, value, delta, trend = "flat", sub } = kpi;
  return (
    <Card
      className="animate-fade-up p-[18px]"
      style={{ animationDelay: `${delay * 60}ms` }}
    >
      <div className="mb-2 text-sm text-fg-2">{label}</div>
      <div className="flex items-baseline justify-between gap-2">
        <div className="font-display text-2xl font-semibold tracking-tight tabular-nums">
          {value}
        </div>
        {delta && (
          <Badge variant={trend === "up" ? "success" : "outline"} className="gap-1">
            {trend === "up" && <ArrowUp className="size-3" aria-hidden />}
            {trend === "down" && <ArrowDown className="size-3" aria-hidden />}
            {delta}
          </Badge>
        )}
      </div>
      {sub && <div className={cn("mt-1.5 text-xs text-fg-3")}>{sub}</div>}
    </Card>
  );
}
