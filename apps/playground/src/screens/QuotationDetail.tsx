import * as React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  MasterDetailShell,
  QuotationListPane,
  QuotationDetail as QuotationDetailBlock,
  QuotationDocument,
  EmptyState,
  type PersistedQuotation,
} from "@manpowerhub/blocks";
import { FileText } from "lucide-react";
import { useQuotationApi } from "../data/quotation-api";

export function QuotationDetailScreen() {
  const api = useQuotationApi();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [params, setParams] = useSearchParams();
  const isFull = params.get("view") === "full";

  const [items, setItems] = React.useState<PersistedQuotation[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const refetch = React.useCallback(() => {
    setLoading(true);
    return api
      .list()
      .then((rows) => setItems(rows))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [api]);

  React.useEffect(() => {
    void refetch();
  }, [refetch]);

  const current = id ? items.find((q) => q.id === id) : undefined;

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

  const listPane = (
    <QuotationListPane
      quotations={items}
      selectedId={id ?? null}
      isLoading={loading}
      onOpen={(nextId) => navigate(`/quotations/${nextId}`)}
      onNew={() => navigate("/quotations/new")}
    />
  );

  const detail = current ? (
    <QuotationDetailBlock
      quotation={current}
      busy={busy}
      onEdit={() => navigate(`/quotations/${current.id}/edit`)}
      onFullView={() => setParams({ view: "full" })}
      onPrint={() => setParams({ view: "full" })}
      onSubmitForApproval={() =>
        run(async () => {
          await api.submitForApproval(current.id);
          await refetch();
        })
      }
      onDecide={(approverId, decision, comment) =>
        run(async () => {
          await api.decide(current.id, approverId, decision, comment);
          await refetch();
        })
      }
      onDelete={() =>
        run(async () => {
          await api.remove(current.id);
          await refetch();
          navigate("/quotations");
        })
      }
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
    <div className="flex flex-col gap-4">
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <MasterDetailShell
        list={listPane}
        detail={detail}
        detailPlaceholder={placeholder}
        full={full}
        isFull={isFull && !!current}
        hasSelection={!!current}
        onBack={() => (isFull ? setParams({}) : navigate("/quotations"))}
      />
    </div>
  );
}
