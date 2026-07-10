import * as React from "react";
import {
  Button, Card, CardBody, CardHeader, CardTitle,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
  cn,
} from "@manpowerhub/ui";
import { QuotationStatusPill } from "./quotation-status-pill";
import { ApprovalTimeline } from "./approval-timeline";
import { subtotal, otGrandTotal, lineTotal } from "./quotation.totals";
import type { ApprovalStep, PersistedQuotation, QuotationTerms } from "./quotation.types";

const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const TERMS_LABEL: Record<QuotationTerms, string> = {
  DUE_ON_RECEIPT: "Due on Receipt", NET_15: "Net 15", NET_30: "Net 30", NET_45: "Net 45", CUSTOM: "Custom",
};

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
    const nextApprover: ApprovalStep | undefined = q.approvers.find((a) => a.decision === "PENDING");
    const total = subtotal(q.items) + otGrandTotal(q.items);
    return (
      <div ref={ref} className={cn("flex flex-col gap-6", className)} {...props}>
        {/* header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              {onBack && <Button variant="ghost" size="sm" onClick={onBack}>← Back</Button>}
              <span className="font-display text-2xl font-semibold text-foreground">{q.quotationNumber}</span>
              <QuotationStatusPill status={q.status} />
            </div>
            <div className="font-display text-lg font-semibold text-foreground">{q.customer.name}</div>
            <div className="text-sm text-muted-foreground">{q.customer.address}</div>
            <div className="text-sm text-muted-foreground">{q.customer.emailId} · {q.customer.phoneNumber}</div>
          </div>
          <div className="flex gap-2">
            {onFullView && <Button variant="secondary" size="sm" onClick={onFullView}>Full view</Button>}
            <Button variant="secondary" size="sm" onClick={onPrint}>Print</Button>
            <Button variant="ghost" size="sm" onClick={onEdit}>Edit</Button>
            {onDelete && <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>Delete</Button>}
          </div>
        </div>

        {/* two-column body */}
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader><CardTitle>Items</CardTitle></CardHeader>
              <CardBody>
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      <th className="py-2 text-left font-semibold">Item Details</th>
                      <th className="py-2 text-right font-semibold">Qty</th>
                      <th className="py-2 text-right font-semibold">Rate</th>
                      <th className="py-2 text-right font-semibold">OT Rate</th>
                      <th className="py-2 text-right font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {q.items.map((it, i) => (
                      <tr key={i} className="border-t border-border/60">
                        <td className="py-2">{it.category}{it.description && <div className="text-xs text-muted-foreground">{it.description}</div>}</td>
                        <td className="py-2 text-right tabular-nums">{it.quantity}</td>
                        <td className="py-2 text-right tabular-nums">{fmt(Number(it.rate) || 0)}</td>
                        <td className="py-2 text-right tabular-nums">{fmt(Number(it.otRate) || 0)}</td>
                        <td className="py-2 text-right tabular-nums">{fmt(lineTotal(it))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardBody>
            </Card>
            <Card>
              <CardHeader><CardTitle>Approval timeline</CardTitle></CardHeader>
              <CardBody><ApprovalTimeline steps={q.approvers} /></CardBody>
            </Card>
          </div>

          <div className="flex flex-col gap-6">
            <Card>
              <CardBody>
                <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Financial summary</div>
                <div className="mt-2 font-display text-2xl font-semibold text-foreground" data-testid="detail-total">AED {fmt(total)}</div>
                <div className="mt-3 flex flex-col text-sm">
                  <div className="flex justify-between border-t border-border/60 py-1.5"><span className="text-muted-foreground">Subtotal</span><span className="tabular-nums">{fmt(subtotal(q.items))}</span></div>
                  <div className="flex justify-between border-t border-border/60 py-1.5"><span className="text-muted-foreground">OT total</span><span className="tabular-nums">{fmt(otGrandTotal(q.items))}</span></div>
                  <div className="flex justify-between border-t border-border/60 py-1.5 font-semibold"><span>Total</span><span className="tabular-nums">{fmt(total)}</span></div>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Details</div>
                <div className="mt-2 flex flex-col text-sm">
                  <div className="flex justify-between border-t border-border/60 py-1.5"><span className="text-muted-foreground">Quotation date</span><span>{q.quotationDate}</span></div>
                  {q.dueDate && <div className="flex justify-between border-t border-border/60 py-1.5"><span className="text-muted-foreground">Due date</span><span>{q.dueDate}</span></div>}
                  {q.terms && <div className="flex justify-between border-t border-border/60 py-1.5"><span className="text-muted-foreground">Terms</span><span>{TERMS_LABEL[q.terms]}</span></div>}
                </div>
                {q.customerNotes && (
                  <>
                    <div className="mt-4 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Customer notes</div>
                    <p className="mt-1 text-sm text-muted-foreground">{q.customerNotes}</p>
                  </>
                )}
              </CardBody>
            </Card>
          </div>
        </div>

        {/* action bar */}
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
                <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
                <Button variant="danger" onClick={() => { onDelete(); setConfirmDelete(false); }}>Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  },
);
QuotationDetail.displayName = "QuotationDetail";
