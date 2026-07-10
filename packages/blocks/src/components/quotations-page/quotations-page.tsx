import * as React from "react";
import { cn } from "@manpowerhub/ui";
import { FileText } from "lucide-react";
import { MasterDetailShell } from "../master-detail-shell";
import { EmptyState } from "../empty-state";
import {
  QuotationForm,
  QuotationDetail,
  QuotationDocument,
  QuotationListPane,
  createMockQuotationApi,
  type QuotationApi,
  type PersistedQuotation,
  type QuotationAggregateData,
} from "../quotation";

type Mode = "split" | "full" | "form";

export interface QuotationsPageProps extends React.HTMLAttributes<HTMLDivElement> {
  api?: QuotationApi;
  currency?: string;
}

export const QuotationsPage = React.forwardRef<HTMLDivElement, QuotationsPageProps>(
  ({ className, api, currency = "AED", ...props }, ref) => {
    const apiRef = React.useRef<QuotationApi>(api ?? createMockQuotationApi());
    const [items, setItems] = React.useState<PersistedQuotation[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [busy, setBusy] = React.useState(false);
    const [selectedId, setSelectedId] = React.useState<string | null>(null);
    const [mode, setMode] = React.useState<Mode>("split");
    const [error, setError] = React.useState<string | null>(null);

    const refetch = React.useCallback(async () => {
      setLoading(true);
      try {
        setItems(await apiRef.current.list());
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    }, []);

    React.useEffect(() => {
      void refetch();
    }, [refetch]);

    const current = selectedId ? items.find((q) => q.id === selectedId) : undefined;

    // If the selected record vanished (deleted/refetch), drop the selection + exit full.
    React.useEffect(() => {
      if (selectedId && !loading && !current) {
        setSelectedId(null);
        setMode("split");
      }
    }, [selectedId, current, loading]);

    const run = async (fn: () => Promise<void>) => {
      setBusy(true);
      setError(null);
      try {
        await fn();
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setBusy(false);
      }
    };

    const handleCreate = (data: QuotationAggregateData) =>
      run(async () => {
        const created = await apiRef.current.create(data);
        await refetch();
        setSelectedId(created?.id ?? null);
        setMode("split");
      });
    const handleUpdate = (id: string, data: QuotationAggregateData) =>
      run(async () => {
        await apiRef.current.update(id, data);
        await refetch();
        setSelectedId(id);
        setMode("split");
      });
    const handleSubmit = (id: string) =>
      run(async () => {
        await apiRef.current.submitForApproval(id);
        await refetch();
      });
    const handleDecide = (
      id: string,
      approverId: string,
      decision: "APPROVED" | "REJECTED",
      comment?: string,
    ) =>
      run(async () => {
        await apiRef.current.decide(id, approverId, decision, comment);
        await refetch();
      });

    const listPane = (
      <QuotationListPane
        quotations={items}
        selectedId={selectedId}
        currency={currency}
        isLoading={loading}
        onOpen={(id) => {
          setSelectedId(id);
          setMode("split");
        }}
        onNew={() => {
          setSelectedId(null);
          setMode("form");
        }}
      />
    );

    // Form overlay takes over the whole area when active.
    if (mode === "form") {
      return (
        <div ref={ref} className={cn("flex flex-col gap-4", className)} {...props}>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <QuotationForm
            initial={selectedId ? current : undefined}
            submitting={busy}
            onCancel={() => setMode("split")}
            onSubmit={(data) => (selectedId ? handleUpdate(selectedId, data) : handleCreate(data))}
          />
        </div>
      );
    }

    const detail = current ? (
      <QuotationDetail
        quotation={current}
        busy={busy}
        onFullView={() => setMode("full")}
        onEdit={() => setMode("form")}
        onPrint={() => setMode("full")}
        onSubmitForApproval={() => handleSubmit(current.id)}
        onDecide={(approverId, decision, comment) => handleDecide(current.id, approverId, decision, comment)}
      />
    ) : undefined;

    const placeholder = (
      <EmptyState
        variant="dashed"
        icon={<FileText />}
        title="Select a quotation"
        description="Choose a quotation from the list to see its details."
      />
    );

    const full = current ? (
      <div className="flex flex-col items-center gap-4">
        <QuotationDocument quotation={current} />
      </div>
    ) : undefined;

    return (
      <div ref={ref} className={cn("flex flex-col gap-4", className)} {...props}>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <MasterDetailShell
          list={listPane}
          detail={detail}
          detailPlaceholder={placeholder}
          full={full}
          isFull={mode === "full" && !!current}
          hasSelection={!!current}
          onBack={() => (mode === "full" ? setMode("split") : setSelectedId(null))}
        />
      </div>
    );
  },
);
QuotationsPage.displayName = "QuotationsPage";
