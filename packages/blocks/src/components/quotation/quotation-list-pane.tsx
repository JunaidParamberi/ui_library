import * as React from "react";
import { Button, Input, cn } from "@manpowerhub/ui";
import { subtotal } from "./quotation.totals";
import type { PersistedQuotation } from "./quotation.types";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

const STATUS_DOT: Record<string, { cls: string; label: string }> = {
  DRAFT: { cls: "bg-muted-foreground", label: "Draft" },
  PENDING_APPROVAL: { cls: "bg-warning", label: "Pending approval" },
  APPROVED: { cls: "bg-success", label: "Approved" },
  SENT: { cls: "bg-primary", label: "Sent" },
  REJECTED: { cls: "bg-destructive", label: "Rejected" },
};

export interface QuotationListPaneProps extends React.HTMLAttributes<HTMLDivElement> {
  quotations: PersistedQuotation[];
  selectedId?: string | null;
  currency?: string;
  isLoading?: boolean;
  onOpen: (id: string) => void;
  onNew: () => void;
}

export const QuotationListPane = React.forwardRef<HTMLDivElement, QuotationListPaneProps>(
  ({ className, quotations, selectedId, currency = "AED", isLoading = false, onOpen, onNew, ...props }, ref) => {
    const [search, setSearch] = React.useState("");
    const needle = search.trim().toLowerCase();
    const visible = quotations.filter((q) =>
      needle === "" ||
      q.quotationNumber.toLowerCase().includes(needle) ||
      q.customer.name.toLowerCase().includes(needle) ||
      q.customer.emailId.toLowerCase().includes(needle),
    );

    return (
      <div ref={ref} className={cn("flex flex-col gap-3", className)} {...props}>
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-md font-semibold text-foreground">Quotations</h2>
          <Button variant="primary" size="sm" onClick={onNew}>New quotation</Button>
        </div>

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search quotation / customer…"
          aria-label="Search quotations"
        />

        {isLoading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
        ) : quotations.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No quotations yet.</p>
        ) : visible.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No quotations match.</p>
        ) : (
          <ul className="flex flex-col">
            {visible.map((q) => {
              const active = q.id === selectedId;
              const s = STATUS_DOT[q.status] ?? STATUS_DOT.DRAFT!;
              return (
                <li key={q.id}>
                  <button
                    type="button"
                    aria-current={active ? "true" : undefined}
                    aria-label={`Open ${q.quotationNumber}`}
                    onClick={() => onOpen(q.id)}
                    className={cn(
                      "relative flex w-full gap-3 border-b border-border px-1 py-3.5 text-left transition-colors last:border-b-0",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                      active ? "bg-accent" : "hover:bg-accent/60",
                    )}
                  >
                    {active && <span aria-hidden className="absolute -left-4 top-0 bottom-0 w-[3px] bg-primary" />}
                    <span className="h-fit flex-none rounded-sm border border-border px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground">QUO</span>
                    <span className="flex min-w-0 flex-1 flex-col gap-2">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate font-mono text-sm text-foreground">{q.quotationNumber}</span>
                        <span className="tabular-nums text-xs font-semibold text-foreground">{currency} {fmt(subtotal(q.items))}</span>
                      </span>
                      <span className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                        <span className={cn("h-1.5 w-1.5 rounded-full", s.cls)} aria-hidden />
                        {s.label}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  },
);
QuotationListPane.displayName = "QuotationListPane";
