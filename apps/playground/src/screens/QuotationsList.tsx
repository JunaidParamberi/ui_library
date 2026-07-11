import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  PageHeader,
  DataTableToolbar,
  QuotationList,
  EmptyState,
  type PersistedQuotation,
} from "@manpowerhub/blocks";
import { Button } from "@manpowerhub/ui";
import { FileText } from "lucide-react";
import { useQuotationApi } from "../data/quotation-api";

type Status = "loading" | "loaded" | "error";

export function QuotationsList() {
  const api = useQuotationApi();
  const navigate = useNavigate();
  const [items, setItems] = React.useState<PersistedQuotation[]>([]);
  const [status, setStatus] = React.useState<Status>("loading");
  const [search, setSearch] = React.useState("");

  const load = React.useCallback(() => {
    setStatus("loading");
    api
      .list()
      .then((rows) => {
        setItems(rows);
        setStatus("loaded");
      })
      .catch(() => setStatus("error"));
  }, [api]);

  React.useEffect(() => {
    load();
  }, [load]);

  const filtered = items.filter((q) =>
    `${q.quotationNumber} ${q.customer.name}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Quotations"
        description="Create, review, and approve quotations."
        actions={<Button onClick={() => navigate("/quotations/new")}>New quotation</Button>}
      />

      <DataTableToolbar
        search={{ value: search, onChange: setSearch, placeholder: "Search quotations…" }}
      />

      {status === "error" && (
        <div className="flex flex-col items-start gap-3 rounded-md border border-border p-6">
          <p className="text-sm text-destructive">Could not load quotations.</p>
          <Button onClick={load}>Retry</Button>
        </div>
      )}

      {status === "loaded" && items.length === 0 && (
        <EmptyState
          variant="dashed"
          icon={<FileText />}
          title="No quotations yet"
          description="Create your first quotation to get started."
          action={{ label: "New quotation", onClick: () => navigate("/quotations/new") }}
        />
      )}

      {status === "loaded" && items.length > 0 && filtered.length === 0 && (
        <EmptyState
          variant="dashed"
          icon={<FileText />}
          title="No matching quotations"
          description="No quotations match your search."
          action={{ label: "Clear search", onClick: () => setSearch("") }}
        />
      )}

      {status !== "error" && !(status === "loaded" && filtered.length === 0) && (
        <QuotationList
          quotations={filtered}
          isLoading={status === "loading"}
          onOpen={(id) => navigate(`/quotations/${id}`)}
          onNew={() => navigate("/quotations/new")}
        />
      )}
    </div>
  );
}
