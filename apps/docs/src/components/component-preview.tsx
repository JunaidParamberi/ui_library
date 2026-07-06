import type { ReactNode } from "react";

export function ComponentPreview({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-background p-6">
      {children}
    </div>
  );
}
