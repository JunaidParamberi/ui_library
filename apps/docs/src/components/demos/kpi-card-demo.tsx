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

export function KpiCardTrendUpState() {
  return (
    <KPICard
      kpi={{ label: "Revenue", value: "$48.2k", delta: "+12%", trend: "up", sub: "vs last month" }}
    />
  );
}
export function KpiCardTrendDownState() {
  return (
    <KPICard
      kpi={{ label: "Churn", value: "3.1%", delta: "-4%", trend: "down", sub: "vs last month" }}
    />
  );
}
export function KpiCardFlatState() {
  return (
    <KPICard
      kpi={{ label: "Active seats", value: "128", delta: "0%", trend: "flat", sub: "vs last month" }}
    />
  );
}
