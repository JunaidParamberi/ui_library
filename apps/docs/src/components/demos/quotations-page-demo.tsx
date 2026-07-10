"use client";
import * as React from "react";
import { QuotationsPage, createMockQuotationApi } from "@manpowerhub/blocks";

export function QuotationsPageDemo() {
  // One mock API per mount so the demo's CRUD edits stay isolated and reset on reload.
  const api = React.useMemo(() => createMockQuotationApi(), []);
  return <QuotationsPage api={api} />;
}
