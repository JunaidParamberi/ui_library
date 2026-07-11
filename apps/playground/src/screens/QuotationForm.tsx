import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  QuotationForm as QuotationFormBlock,
  type QuotationAggregateData,
  type PersistedQuotation,
} from "@manpowerhub/blocks";
import { useQuotationApi } from "../data/quotation-api";

export function QuotationFormScreen() {
  const api = useQuotationApi();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [initial, setInitial] = React.useState<PersistedQuotation | undefined>(undefined);
  const [ready, setReady] = React.useState(!isEdit);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!id) return;
    let alive = true;
    api.get(id).then((q) => {
      if (!alive) return;
      setInitial(q);
      setReady(true);
    });
    return () => {
      alive = false;
    };
  }, [api, id]);

  const handleSubmit = (data: QuotationAggregateData) => {
    setSubmitting(true);
    const op = isEdit && id ? api.update(id, data) : api.create(data);
    op.then((saved) => {
      const savedId = "id" in saved ? saved.id : id;
      navigate(`/quotations/${savedId}`);
    }).finally(() => setSubmitting(false));
  };

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <QuotationFormBlock
        initial={initial}
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={() => navigate(id ? `/quotations/${id}` : "/quotations")}
      />
    </div>
  );
}
