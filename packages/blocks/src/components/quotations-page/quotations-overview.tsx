import * as React from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  Button,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Tabs, TabsList, TabsTrigger, TabsContent,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
  cn, type KPI,
} from "@manpowerhub/ui";
import {
  QuotationStatusPill,
  subtotal,
  type PersistedQuotation,
  type QuotationStatus,
} from "../quotation";
import { StatCardRow } from "../stat-card-row";
import { PageHeader } from "../page-header";
import { DataTableToolbar } from "../data-table-toolbar";

const STATUS_TABS: { value: "ALL" | QuotationStatus; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "DRAFT", label: "Draft" },
  { value: "PENDING_APPROVAL", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "SENT", label: "Sent" },
  { value: "REJECTED", label: "Rejected" },
];

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

export interface QuotationsOverviewProps extends React.HTMLAttributes<HTMLDivElement> {
  quotations: PersistedQuotation[];
  isLoading?: boolean;
  currency?: string;
  onNew: () => void;
  onOpen: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const QuotationsOverview = React.forwardRef<HTMLDivElement, QuotationsOverviewProps>(
  (
    { className, quotations, isLoading = false, currency = "AED", onNew, onOpen, onEdit, onDelete, ...props },
    ref,
  ) => {
    const [statusFilter, setStatusFilter] = React.useState<"ALL" | QuotationStatus>("ALL");
    const [search, setSearch] = React.useState("");
    const [pendingDelete, setPendingDelete] = React.useState<PersistedQuotation | null>(null);

    const countBy = (s: "ALL" | QuotationStatus) =>
      s === "ALL" ? quotations.length : quotations.filter((q) => q.status === s).length;

    const totalValue = quotations.reduce((sum, q) => sum + subtotal(q.items), 0);

    const stats: KPI[] = [
      { label: "Total Quotations", value: String(quotations.length) },
      { label: "Total Value", value: `${currency} ${fmt(totalValue)}` },
      { label: "Draft", value: String(countBy("DRAFT")), sub: "awaiting submission" },
      { label: "Pending Approval", value: String(countBy("PENDING_APPROVAL")), sub: "in review" },
      { label: "Approved", value: String(countBy("APPROVED")), sub: "ready to send" },
    ];

    const needle = search.trim().toLowerCase();
    const visible = quotations.filter((row) => {
      const matchStatus = statusFilter === "ALL" || row.status === statusFilter;
      const matchSearch =
        needle === "" ||
        row.quotationNumber.toLowerCase().includes(needle) ||
        row.customer.name.toLowerCase().includes(needle) ||
        row.customer.emailId.toLowerCase().includes(needle);
      return matchStatus && matchSearch;
    });

    return (
      <div ref={ref} className={cn("flex flex-col gap-6", className)} {...props}>
        <StatCardRow columns={5} stats={stats} loading={isLoading} />

        <PageHeader
          title="Quotations"
          actions={
            <Button variant="primary" size="sm" onClick={onNew}>
              New Quotation
            </Button>
          }
        />

        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as "ALL" | QuotationStatus)}>
          <TabsList>
            {STATUS_TABS.map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                count={countBy(t.value)}
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {STATUS_TABS.map((t) => (
            <TabsContent key={t.value} value={t.value} />
          ))}
        </Tabs>

        <DataTableToolbar
          search={{ value: search, onChange: setSearch, placeholder: "Search quotation / customer…" }}
        />

        {isLoading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
        ) : quotations.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No quotations yet.</p>
        ) : visible.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No quotations match.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>{`Value (${currency})`}</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() => onOpen(row.id)}
                >
                  <TableCell className="font-mono">
                    <button
                      type="button"
                      className="font-mono text-left hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 rounded-sm"
                      aria-label={`Open ${row.quotationNumber}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpen(row.id);
                      }}
                    >
                      {row.quotationNumber}
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-foreground">{row.customer.name}</div>
                    <div className="text-xs text-muted-foreground">{row.customer.emailId}</div>
                  </TableCell>
                  <TableCell className="tabular-nums">{row.quotationDate}</TableCell>
                  <TableCell className="tabular-nums">{row.items.length}</TableCell>
                  <TableCell className="tabular-nums font-medium">{fmt(subtotal(row.items))}</TableCell>
                  <TableCell>
                    <QuotationStatusPill status={row.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${row.quotationNumber}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(row.id);
                        }}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${row.quotationNumber}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setPendingDelete(row);
                        }}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog
          open={pendingDelete !== null}
          onOpenChange={(open) => {
            if (!open) setPendingDelete(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete {pendingDelete?.quotationNumber}?</DialogTitle>
              <DialogDescription>This can&rsquo;t be undone.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button
                variant="danger"
                onClick={() => {
                  if (pendingDelete) onDelete(pendingDelete.id);
                  setPendingDelete(null);
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  },
);
QuotationsOverview.displayName = "QuotationsOverview";
