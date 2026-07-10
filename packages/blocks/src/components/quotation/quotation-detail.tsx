import * as React from "react";
import {
  Button, Card, CardBody, CardHeader, CardTitle,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
  cn,
} from "@manpowerhub/ui";
import { QuotationStatusPill } from "./quotation-status-pill";
import { ApprovalTimeline } from "./approval-timeline";
import { subtotal, otGrandTotal } from "./quotation.totals";
import type { ApprovalStep, PersistedQuotation } from "./quotation.types";

const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export interface QuotationDetailProps extends React.HTMLAttributes<HTMLDivElement> {
  quotation: PersistedQuotation;
  onEdit: () => void;
  onSubmitForApproval: () => void;
  onDecide: (approverId: string, decision: "APPROVED" | "REJECTED", comment?: string) => void;
  onPrint: () => void;
  onBack?: () => void;
  onFullView?: () => void;
  onDelete?: () => void;
  busy?: boolean;
}

export const QuotationDetail = React.forwardRef<HTMLDivElement, QuotationDetailProps>(
  ({ className, quotation, onEdit, onSubmitForApproval, onDecide, onPrint, onBack, onFullView, onDelete, busy = false, ...props }, ref) => {
    const q = quotation;
    const [confirmDelete, setConfirmDelete] = React.useState(false);
    // First still-pending approver acts as the current actor for the demo.
    const nextApprover: ApprovalStep | undefined = q.approvers.find((a) => a.decision === "PENDING");
    return (
      <div ref={ref} className={cn("flex flex-col gap-4", className)} {...props}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {onBack && <Button variant="ghost" size="sm" onClick={onBack}>← Back</Button>}
            <h2 className="font-display text-lg font-semibold text-foreground">{q.quotationNumber}</h2>
            <QuotationStatusPill status={q.status} />
          </div>
          <div className="flex gap-2">
            {onFullView && <Button variant="secondary" size="sm" onClick={onFullView}>Full view</Button>}
            <Button variant="secondary" size="sm" onClick={onPrint}>Print</Button>
            <Button variant="ghost" size="sm" onClick={onEdit}>Edit</Button>
            {onDelete && (
              <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>Delete</Button>
            )}
          </div>
        </div>

        <Card>
          <CardHeader><CardTitle>{q.customer.name}</CardTitle></CardHeader>
          <CardBody>
            <div className="text-sm text-muted-foreground">{q.customer.address}</div>
            <div className="text-sm text-muted-foreground">{q.customer.emailId} · {q.customer.phoneNumber}</div>
            <div className="mt-4 flex flex-col gap-0.5 text-sm text-foreground">
              <div className="text-muted-foreground">Subtotal: <span className="tabular-nums">{fmt(subtotal(q.items))}</span></div>
              <div className="text-muted-foreground">OT total: <span className="tabular-nums">{fmt(otGrandTotal(q.items))}</span></div>
              <div>Total: <span className="font-semibold tabular-nums">{fmt(subtotal(q.items) + otGrandTotal(q.items))}</span></div>
            </div>
          </CardBody>
        </Card>

        <ApprovalTimeline steps={q.approvers} />

        <div className="flex justify-end gap-2">
          {q.status === "DRAFT" && (
            <Button variant="primary" size="sm" disabled={busy} onClick={onSubmitForApproval}>Submit for approval</Button>
          )}
          {q.status === "PENDING_APPROVAL" && nextApprover && (
            <>
              <Button variant="danger" size="sm" disabled={busy} onClick={() => onDecide(nextApprover.approverId, "REJECTED", undefined)}>Reject</Button>
              <Button variant="primary" size="sm" disabled={busy} onClick={() => onDecide(nextApprover.approverId, "APPROVED", undefined)}>Approve</Button>
            </>
          )}
        </div>

        {onDelete && (
          <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete {q.quotationNumber}?</DialogTitle>
                <DialogDescription>This can&rsquo;t be undone.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <Button
                  variant="danger"
                  onClick={() => {
                    onDelete();
                    setConfirmDelete(false);
                  }}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  },
);
QuotationDetail.displayName = "QuotationDetail";
