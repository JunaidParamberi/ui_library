import * as React from "react";
import { Badge, cn } from "@manpowerhub/ui";
import type { ApprovalDecision, ApprovalStep } from "./quotation.types";

const DECISION: Record<ApprovalDecision, { variant: "success" | "warning" | "danger"; label: string }> = {
  APPROVED: { variant: "success", label: "Approved" },
  PENDING: { variant: "warning", label: "Pending" },
  REJECTED: { variant: "danger", label: "Rejected" },
};

export interface ApprovalTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: ApprovalStep[];
}

export const ApprovalTimeline = React.forwardRef<HTMLDivElement, ApprovalTimelineProps>(
  ({ className, steps, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-3", className)} {...props}>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Approvals</div>
      {steps.length === 0 ? (
        <p className="text-sm text-muted-foreground">No approvers assigned.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {steps.map((s) => {
            const d = DECISION[s.decision];
            return (
              <li key={s.approverId} className="flex items-start justify-between gap-3 border-b border-border/60 pb-3 last:border-0">
                <div>
                  <div className="text-sm font-medium text-foreground">{s.approverName}</div>
                  <div className="text-xs text-muted-foreground">{s.approverEmail}</div>
                  {s.comment && <div className="mt-1 text-xs text-fg-2">{s.comment}</div>}
                </div>
                <Badge variant={d.variant}>{d.label}</Badge>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  ),
);
ApprovalTimeline.displayName = "ApprovalTimeline";
