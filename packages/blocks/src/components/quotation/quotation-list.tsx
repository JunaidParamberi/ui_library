import * as React from "react";
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, cn } from "@manpowerhub/ui";
import { QuotationStatusPill } from "./quotation-status-pill";
import type { PersistedQuotation } from "./quotation.types";

export interface QuotationListProps extends React.HTMLAttributes<HTMLDivElement> {
  quotations: PersistedQuotation[];
  onOpen: (id: string) => void;
  onNew: () => void;
  isLoading?: boolean;
}

export const QuotationList = React.forwardRef<HTMLDivElement, QuotationListProps>(
  ({ className, quotations, onOpen, onNew, isLoading = false, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-4", className)} {...props}>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-foreground">Quotations</h2>
        <Button variant="primary" size="sm" onClick={onNew}>New quotation</Button>
      </div>
      {isLoading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
      ) : quotations.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No quotations yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotations.map((q) => (
              <TableRow
                key={q.id}
                className="cursor-pointer"
                onClick={() => onOpen(q.id)}
                tabIndex={0}
                role="button"
                aria-label={`Open ${q.quotationNumber}`}
                onKeyDown={(e) => { if (e.key === "Enter") onOpen(q.id); }}
              >
                <TableCell className="font-mono">{q.quotationNumber}</TableCell>
                <TableCell>{q.customer.name}</TableCell>
                <TableCell className="tabular-nums">{q.quotationDate}</TableCell>
                <TableCell className="tabular-nums">{q.items.length}</TableCell>
                <TableCell><QuotationStatusPill status={q.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  ),
);
QuotationList.displayName = "QuotationList";
