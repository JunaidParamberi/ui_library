import * as React from "react";
import { Badge, cn } from "@manpowerhub/ui";
import type { ApprovalDecision, ApprovalStep } from "./quotation.types";

const DECISION: Record<ApprovalDecision, { variant: "success" | "warning" | "danger"; label: string; tile: string; glyph: string }> = {
  APPROVED: { variant: "success", label: "Approved", tile: "bg-success/15 text-success", glyph: "✓" },
  PENDING:  { variant: "warning", label: "Pending",  tile: "bg-warning/15 text-warning", glyph: "…" },
  REJECTED: { variant: "danger",  label: "Rejected", tile: "bg-destructive/15 text-destructive", glyph: "✕" },
};

export interface ApprovalTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: ApprovalStep[];
}

export const ApprovalTimeline = React.forwardRef<HTMLDivElement, ApprovalTimelineProps>(
  ({ className, steps, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col", className)} {...props}>
      {steps.length === 0 ? (
        <p className="text-sm text-muted-foreground">No approvers assigned.</p>
      ) : (
        <ul className="flex flex-col">
          {steps.map((s) => {
            const d = DECISION[s.decision];
            return (
              <li key={s.approverId} className="flex items-start gap-3 border-t border-border/60 py-3 first:border-t-0">
                <span data-testid={`tl-tile-${s.approverId}`} data-decision={s.decision}
                  className={cn("grid h-8 w-8 flex-none place-items-center rounded-md text-sm", d.tile)}>{d.glyph}</span>
                <div className="flex flex-1 items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium text-foreground">{s.approverName}</div>
                    <div className="text-xs text-muted-foreground">{s.approverEmail}</div>
                    {s.comment && <div className="mt-1 text-xs text-fg-2">{s.comment}</div>}
                  </div>
                  <Badge variant={d.variant}>{d.label}</Badge>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  ),
);
ApprovalTimeline.displayName = "ApprovalTimeline";
