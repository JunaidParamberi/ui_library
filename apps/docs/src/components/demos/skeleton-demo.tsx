"use client";
import { Skeleton, Spinner } from "@manpowerhub/ui";

export function SkeletonDemo() {
  return (
    <div className="flex items-center gap-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-40" />
      </div>
      <Spinner aria-label="Loading" />
    </div>
  );
}
