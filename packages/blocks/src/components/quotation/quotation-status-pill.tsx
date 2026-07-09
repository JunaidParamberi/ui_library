import * as React from "react";
import { StatusPill, type StatusPillProps } from "../document-shell";
import type { QuotationStatus } from "./quotation.types";

const MAP: Record<QuotationStatus, { variant: StatusPillProps["variant"]; label: string; dot?: boolean }> = {
  DRAFT: { variant: "default", label: "Draft" },
  PENDING_APPROVAL: { variant: "warn", label: "Pending approval", dot: true },
  APPROVED: { variant: "success", label: "Approved" },
  SENT: { variant: "accent", label: "Sent" },
  REJECTED: { variant: "outline", label: "Rejected" },
};

export interface QuotationStatusPillProps extends Omit<StatusPillProps, "variant" | "children"> {
  status: QuotationStatus;
}

export const QuotationStatusPill = React.forwardRef<HTMLSpanElement, QuotationStatusPillProps>(
  ({ status, ...props }, ref) => {
    const m = MAP[status];
    return <StatusPill ref={ref} variant={m.variant} dot={m.dot} {...props}>{m.label}</StatusPill>;
  },
);
QuotationStatusPill.displayName = "QuotationStatusPill";
