// ManpowerHub — Quotations CRUD Router
// Delegates to: QuotationList, QuotationDetail, QuotationForm, QuotationDeleteModal

const { useState: useQR } = React;

// VIEW states: "list" | "detail" | "create" | "edit"
function Documents({ goto }) {
  const [view, setView]           = useQR("list");
  const [activeId, setActiveId]   = useQR(null);   // id of selected quotation
  const [deleteId, setDeleteId]   = useQR(null);   // id pending deletion
  const [quotations, setQuotations] = useQR(() => [...MockData.quotations]);

  /* ── helpers ─────────────────────────────────────────────────────────── */
  function byId(id) { return quotations.find(q => q.id === id) || null; }

  function handleSave(saved) {
    setQuotations(qs => {
      const exists = qs.find(q => q.id === saved.id);
      if (exists) return qs.map(q => q.id === saved.id ? saved : q);
      return [saved, ...qs];
    });
    // after save, jump to detail
    setActiveId(saved.id);
    setView("detail");
  }

  function handleDeleteConfirm() {
    setQuotations(qs => qs.filter(q => q.id !== deleteId));
    // if we were viewing or editing the deleted one, go back to list
    if (activeId === deleteId) setActiveId(null);
    setDeleteId(null);
    setView("list");
  }

  /* ── render ──────────────────────────────────────────────────────────── */
  return (
    <div style={{ padding: "24px 28px", maxWidth: 1200, margin: "0 auto" }}>

      {view === "list" && (
        <QuotationList
          quotations={quotations}
          onNew={()        => { setActiveId(null); setView("create"); }}
          onView={id       => { setActiveId(id);   setView("detail"); }}
          onEdit={id       => { setActiveId(id);   setView("edit");   }}
          onDelete={id     => setDeleteId(id)}
        />
      )}

      {view === "detail" && (
        <QuotationDetail
          quotation={byId(activeId)}
          onBack={()   => setView("list")}
          onEdit={id   => { setActiveId(id); setView("edit"); }}
          onDelete={id => setDeleteId(id)}
        />
      )}

      {view === "create" && (
        <QuotationForm
          initial={null}
          onSave={handleSave}
          onCancel={() => setView("list")}
        />
      )}

      {view === "edit" && (
        <QuotationForm
          initial={byId(activeId)}
          onSave={handleSave}
          onCancel={() => { setView(activeId ? "detail" : "list"); }}
        />
      )}

      {deleteId && (
        <QuotationDeleteModal
          quotationNumber={byId(deleteId)?.quotationNumber || deleteId}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}

// Export so app.jsx can register it
Object.assign(window.Screens = window.Screens || {}, { Documents });
