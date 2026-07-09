import * as React from "react";
import { cn } from "@manpowerhub/ui";
import { QuotationsOverview } from "./quotations-overview";
import {
  QuotationForm,
  QuotationDetail,
  QuotationDocument,
  createMockQuotationApi,
  type QuotationApi,
  type PersistedQuotation,
  type QuotationAggregateData,
} from "../quotation";

type View =
  | { name: "list" }
  | { name: "form"; id?: string }
  | { name: "detail"; id: string }
  | { name: "document"; id: string };

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
    const [view, setView] = React.useState<View>({ name: "list" });
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

    const current = "id" in view && view.id ? items.find((q) => q.id === view.id) : undefined;

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
        await apiRef.current.create(data);
        await refetch();
        setView({ name: "list" });
      });
    const handleUpdate = (id: string, data: QuotationAggregateData) =>
      run(async () => {
        await apiRef.current.update(id, data);
        await refetch();
        setView({ name: "detail", id });
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
    const handleDelete = (id: string) =>
      run(async () => {
        await apiRef.current.remove(id);
        await refetch();
      });

    return (
      <div ref={ref} className={cn("flex flex-col gap-4", className)} {...props}>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        {view.name === "list" && (
          <QuotationsOverview
            quotations={items}
            isLoading={loading}
            currency={currency}
            onNew={() => setView({ name: "form" })}
            onOpen={(id) => setView({ name: "detail", id })}
            onEdit={(id) => setView({ name: "form", id })}
            onDelete={handleDelete}
          />
        )}

        {view.name === "form" && (
          <QuotationForm
            initial={view.id ? current : undefined}
            submitting={busy}
            onCancel={() => setView(view.id ? { name: "detail", id: view.id } : { name: "list" })}
            onSubmit={(data) => (view.id ? handleUpdate(view.id, data) : handleCreate(data))}
          />
        )}

        {view.name === "detail" && current && (
          <QuotationDetail
            quotation={current}
            busy={busy}
            onBack={() => setView({ name: "list" })}
            onEdit={() => setView({ name: "form", id: current.id })}
            onPrint={() => setView({ name: "document", id: current.id })}
            onSubmitForApproval={() => handleSubmit(current.id)}
            onDecide={(approverId, decision, comment) =>
              handleDecide(current.id, approverId, decision, comment)
            }
          />
        )}

        {view.name === "document" && current && (
          <div className="flex flex-col items-center gap-4">
            <button
              className="self-start text-sm text-muted-foreground underline"
              onClick={() => setView({ name: "detail", id: current.id })}
            >
              ← Back to detail
            </button>
            <QuotationDocument quotation={current} />
          </div>
        )}
      </div>
    );
  },
);
QuotationsPage.displayName = "QuotationsPage";
