import type { ReactNode } from "react";

export function VariantGallery({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose my-6 grid gap-4 rounded-lg border border-border bg-background p-4 sm:grid-cols-2">
      {children}
    </div>
  );
}

export function GalleryCell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-border/60 p-4">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-1 items-center">{children}</div>
    </div>
  );
}
