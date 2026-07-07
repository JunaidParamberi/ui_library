"use client";
import { AreaChart, MiniBars } from "@manpowerhub/ui";

const series = [
  { x: 0, y: 10 },
  { x: 1, y: 25 },
  { x: 2, y: 18 },
  { x: 3, y: 32 },
  { x: 4, y: 28 },
  { x: 5, y: 40 },
  { x: 6, y: 35 },
];

export function AreaChartDemo() {
  return (
    <div className="flex items-center gap-8">
      <AreaChart data={series} />
      <MiniBars data={[3, 8, 5, 12, 7, 15, 9]} />
    </div>
  );
}
