"use client";
import { KPICard } from "@manpowerhub/ui";

export function KpiCardDemo() {
  return (
    <KPICard
      kpi={{
        label: "Revenue",
        value: "$48.2k",
        delta: "+12%",
        trend: "up",
        sub: "vs last month",
      }}
    />
  );
}
