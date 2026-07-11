import * as React from "react";
import { createMockQuotationApi, type QuotationApi } from "@manpowerhub/blocks";

const QuotationApiContext = React.createContext<QuotationApi | null>(null);

export function QuotationApiProvider({ children }: { children: React.ReactNode }) {
  const apiRef = React.useRef<QuotationApi | null>(null);
  if (apiRef.current === null) apiRef.current = createMockQuotationApi();
  return (
    <QuotationApiContext.Provider value={apiRef.current}>{children}</QuotationApiContext.Provider>
  );
}

export function useQuotationApi(): QuotationApi {
  const api = React.useContext(QuotationApiContext);
  if (!api) throw new Error("useQuotationApi must be used within QuotationApiProvider");
  return api;
}
