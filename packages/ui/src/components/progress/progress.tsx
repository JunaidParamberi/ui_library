"use client";
import * as React from "react";
import * as RadixProgress from "@radix-ui/react-progress";
import { cn } from "../../lib/utils";

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof RadixProgress.Root> {
  value: number;
}

export const Progress = React.forwardRef<
  React.ElementRef<typeof RadixProgress.Root>,
  ProgressProps
>(({ className, value, ...props }, ref) => {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <RadixProgress.Root
      ref={ref}
      value={clamped}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)}
      {...props}
    >
      <RadixProgress.Indicator
        className="h-full w-full flex-1 bg-primary transition-transform duration-fast"
        style={{ transform: `translateX(-${100 - clamped}%)` }}
      />
    </RadixProgress.Root>
  );
});
Progress.displayName = "Progress";

export interface HealthRingProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export const HealthRing = React.forwardRef<HTMLDivElement, HealthRingProps>(
  ({ className, value, size = 64, strokeWidth = 6, label, ...props }, ref) => {
    const clamped = Math.min(100, Math.max(0, value));
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - clamped / 100);

    return (
      <div
        ref={ref}
        className={cn("relative inline-flex items-center justify-center", className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className="fill-none stroke-secondary"
          />
          <circle
            data-testid="ring-value"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="fill-none stroke-primary transition-[stroke-dashoffset] duration-fast"
          />
        </svg>
        {label && (
          <span className="absolute font-display text-sm font-semibold tabular-nums text-foreground">
            {label}
          </span>
        )}
      </div>
    );
  },
);
HealthRing.displayName = "HealthRing";
