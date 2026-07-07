"use client";
import { Progress, HealthRing } from "@manpowerhub/ui";

export function ProgressDemo() {
  return (
    <div className="flex items-center gap-8">
      <div className="flex-1 space-y-3">
        <Progress value={42} aria-label="Upload progress" />
        <Progress value={80} aria-label="Storage used" />
      </div>
      <HealthRing value={72} label="72%" />
    </div>
  );
}
