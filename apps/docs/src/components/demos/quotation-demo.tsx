"use client";
import * as React from "react";
import { Quotation, createMockQuotationApi } from "@manpowerhub/blocks";

export function QuotationDemo() {
  // One mock API per mount so the demo's CRUD edits stay isolated and reset on reload.
  const api = React.useMemo(() => createMockQuotationApi(), []);
  return <Quotation api={api} />;
}
