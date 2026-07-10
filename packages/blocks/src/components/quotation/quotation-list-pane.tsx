import * as React from "react";
import { Button, Input, cn } from "@manpowerhub/ui";
import { QuotationStatusPill } from "./quotation-status-pill";
import { subtotal } from "./quotation.totals";
import type { PersistedQuotation } from "./quotation.types";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

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
          <ul className="flex flex-col gap-1">
            {visible.map((q) => {
              const active = q.id === selectedId;
              return (
                <li key={q.id}>
                  <button
                    type="button"
                    aria-current={active ? "true" : undefined}
                    aria-label={`Open ${q.quotationNumber}`}
                    onClick={() => onOpen(q.id)}
                    className={cn(
                      "w-full rounded-lg border px-3 py-2.5 text-left transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                      active
                        ? "border-ring bg-accent"
                        : "border-border hover:bg-muted/50",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-sm text-foreground">{q.quotationNumber}</span>
                      <QuotationStatusPill status={q.status} />
                    </div>
                    <div className="mt-1 truncate text-sm font-medium text-foreground">{q.customer.name}</div>
                    <div className="mt-0.5 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="truncate">{q.customer.emailId}</span>
                      <span className="tabular-nums">{currency} {fmt(subtotal(q.items))}</span>
                    </div>
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
