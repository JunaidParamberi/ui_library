import * as React from "react";
import { DocumentShell, ItemsTable, Totals, type BrandBlock } from "../document-shell";
import { QuotationStatusPill } from "./quotation-status-pill";
import { ApprovalTimeline } from "./approval-timeline";
import { lineTotal, subtotal, otGrandTotal } from "./quotation.totals";
import type { PersistedQuotation } from "./quotation.types";

const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const DEFAULT_BRAND: BrandBlock = {
  name: "Studio Marchetti",
  contact: ["lena@studiomarchetti.com", "+971 50 482 9311"],
  trn: "100000000000003",
};

export interface QuotationDocumentProps extends React.HTMLAttributes<HTMLDivElement> {
  quotation: PersistedQuotation;
  brand?: BrandBlock;
}

export const QuotationDocument = React.forwardRef<HTMLDivElement, QuotationDocumentProps>(
  ({ quotation, brand = DEFAULT_BRAND, ...props }, ref) => {
    const { customer, items } = quotation;
    return (
      <DocumentShell
        ref={ref}
        type="Quotation"
        id={quotation.quotationNumber}
        brand={brand}
        status={<QuotationStatusPill status={quotation.status} />}
        parties={[
          { label: "Prepared for", name: customer.name, lines: <>{customer.address}<br />{customer.emailId}<br />{customer.phoneNumber}</> },
          { label: "Details", name: `Ref ${quotation.quotationNumber}`, lines: <>Issued {quotation.quotationDate}</> },
        ]}
        footer={<ApprovalTimeline steps={quotation.approvers} />}
        {...props}
      >
        <ItemsTable
          columns={[
            { key: "category", header: "Category" },
            { key: "qty", header: "Qty", align: "right" },
            { key: "rate", header: "Rate", align: "right" },
            { key: "ot", header: "OT Rate", align: "right" },
            { key: "total", header: "Line total", align: "right" },
          ]}
          rows={items.map((it) => ({
            category: it.category,
            qty: it.quantity,
            rate: fmt(Number(it.rate) || 0),
            ot: fmt(Number(it.otRate) || 0),
            total: fmt(lineTotal(it)),
          }))}
        />
        <Totals
          rows={[
            { label: "Subtotal", value: fmt(subtotal(items)) },
            { label: "OT total", value: fmt(otGrandTotal(items)) },
            { label: "Total", value: fmt(subtotal(items) + otGrandTotal(items)), strong: true },
          ]}
        />
      </DocumentShell>
    );
  },
);
QuotationDocument.displayName = "QuotationDocument";
