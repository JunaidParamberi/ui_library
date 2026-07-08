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

export function ProgressLowState() {
  return <Progress value={12} aria-label="Upload progress" />;
}
export function ProgressDefaultState() {
  return <Progress value={55} aria-label="Upload progress" />;
}
export function ProgressCompleteState() {
  return <Progress value={100} aria-label="Upload progress" />;
}
