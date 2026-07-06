"use client";
import { StatCardRow } from "@manpowerhub/blocks";
import type { KPI } from "@manpowerhub/ui";

const stats: KPI[] = [
  {
    label: "Revenue",
    value: "$48.2k",
    delta: "+12%",
    trend: "up",
    sub: "vs last month",
  },
  { label: "Active users", value: "3,912", delta: "+4%", trend: "up" },
  { label: "Churn", value: "1.4%", delta: "-0.2%", trend: "down" },
];

export function StatCardRowDemo() {
  return <StatCardRow stats={stats} columns={3} />;
}
