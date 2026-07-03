import * as React from "react";
import { Badge, type BadgeProps } from "./badge";

/** Canonical status vocabulary shared across invoices, projects, tasks. */
export type Status =
  | "paid" | "sent" | "draft" | "overdue" | "partially_paid" | "written_off"
  | "active" | "planning" | "on hold" | "done" | "todo" | "in_progress"
  | "cancelled" | "high" | "med" | "low" | "approved";

const STATUS_MAP: Record<Status, { variant: BadgeProps["variant"]; label: string }> = {
  paid: { variant: "success", label: "Paid" },
  sent: { variant: "info", label: "Sent" },
  draft: { variant: "outline", label: "Draft" },
  overdue: { variant: "danger", label: "Overdue" },
  partially_paid: { variant: "warning", label: "Partial" },
  written_off: { variant: "outline", label: "Written off" },
  active: { variant: "success", label: "Active" },
  planning: { variant: "info", label: "Planning" },
  "on hold": { variant: "warning", label: "On hold" },
  done: { variant: "success", label: "Done" },
  todo: { variant: "outline", label: "To do" },
  in_progress: { variant: "info", label: "In progress" },
  cancelled: { variant: "outline", label: "Cancelled" },
  high: { variant: "danger", label: "High" },
  med: { variant: "warning", label: "Medium" },
  low: { variant: "outline", label: "Low" },
  approved: { variant: "success", label: "Approved" },
};

export interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const m = STATUS_MAP[status] ?? { variant: "outline" as const, label: status };
  return <Badge variant={m.variant} dot>{m.label}</Badge>;
}
