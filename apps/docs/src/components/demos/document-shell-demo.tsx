"use client";
import * as React from "react";
import { DocumentShell, ItemsTable, Totals, StatusPill } from "@manpowerhub/blocks";

export function DocumentShellDemo() {
  return (
    <DocumentShell
      type="Quotation"
      id="Q-1001"
      brand={{ name: "Studio Marchetti", contact: ["lena@studio.com", "+971 50 482 9311"], trn: "100000000000003" }}
      status={<StatusPill variant="warn" dot>Pending approval</StatusPill>}
      parties={[
        { label: "Prepared for", name: "Northwind Labs", lines: "Mumbai 400013, India" },
        { label: "Project", name: "Landing v3", lines: "Start 02 Jun 2026" },
        { label: "Details", name: "Q-1001", lines: "Issued 01 Jul 2026" },
      ]}
    >
      <ItemsTable
        columns={[
          { key: "scope", header: "Scope" },
          { key: "qty", header: "Qty", align: "right" },
          { key: "amt", header: "Amount", align: "right" },
        ]}
        rows={[
          { scope: "Discovery workshop", qty: "1", amt: "1,400.00" },
          { scope: "UI design — 3 screens", qty: "3", amt: "3,600.00" },
        ]}
      />
      <Totals
        rows={[
          { label: "Subtotal", value: "5,000.00" },
          { label: "Total AED", value: "5,000.00", strong: true },
        ]}
      />
    </DocumentShell>
  );
}
