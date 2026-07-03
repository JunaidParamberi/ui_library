// ManpowerHub — Quotation List + KPI cards
// Expects: { quotations, onNew, onView, onEdit, onDelete }

const QSTATUS_META = {
  DRAFT:            { cls: "outline", label: "Draft"            },
  PENDING_APPROVAL: { cls: "warning", label: "Pending Approval" },
  APPROVED:         { cls: "success", label: "Approved"         },
  SENT:             { cls: "info",    label: "Sent"             },
  REJECTED:         { cls: "danger",  label: "Rejected"         },
};

const TABS_DEF = [
  { key: "ALL",              label: "All"             },
  { key: "DRAFT",            label: "Draft"           },
  { key: "PENDING_APPROVAL", label: "Pending"         },
  { key: "APPROVED",         label: "Approved"        },
  { key: "SENT",             label: "Sent"            },
  { key: "REJECTED",         label: "Rejected"        },
];

function fmtDateShort(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" });
}

function calcValue(items) {
  return (items || []).reduce((s, it) => s + (parseFloat(it.quantity) || 0) * (parseFloat(it.rate) || 0), 0);
}

function QBadge({ status }) {
  const m = QSTATUS_META[status] || { cls: "outline", label: status };
  return <span className={`badge badge-${m.cls}`}>{m.label}</span>;
}

function KpiCard({ label, value, sub, color }) {
  return (
    <div className="card" style={{ flex: "1 1 140px", minWidth: 130, padding: "16px 20px" }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: color || "var(--text-1)", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function QuotationList({ quotations, onNew, onView, onEdit, onDelete }) {
  const { useState: useS } = React;
  const [tab, setTab]       = useS("ALL");
  const [search, setSearch] = useS("");

  const totalValue  = quotations.reduce((s, q) => s + calcValue(q.items), 0);
  const drafts      = quotations.filter(q => q.status === "DRAFT").length;
  const pending     = quotations.filter(q => q.status === "PENDING_APPROVAL").length;
  const approved    = quotations.filter(q => q.status === "APPROVED").length;

  const filtered = quotations.filter(q => {
    if (tab !== "ALL" && q.status !== tab) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        q.quotationNumber.toLowerCase().includes(s) ||
        (q.customer?.name || "").toLowerCase().includes(s)
      );
    }
    return true;
  });

  const tabCounts = {};
  TABS_DEF.forEach(t => {
    tabCounts[t.key] = t.key === "ALL" ? quotations.length : quotations.filter(q => q.status === t.key).length;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* KPI row */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <KpiCard label="Total Quotations" value={quotations.length} />
        <KpiCard label="Total Value"      value={`AED ${totalValue.toLocaleString()}`} color="var(--primary)" />
        <KpiCard label="Draft"            value={drafts}   sub="awaiting submission" />
        <KpiCard label="Pending Approval" value={pending}  sub="in review" color="var(--amber)" />
        <KpiCard label="Approved"         value={approved} sub="ready to send"       color="var(--green)" />
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Quotations</h2>
        <button className="btn btn-primary" onClick={onNew}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Quotation
        </button>
      </div>

      {/* Tabs + Search */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <div className="tabs" style={{ flex: 1 }}>
          {TABS_DEF.map(t => (
            <button key={t.key} className={`tab ${tab === t.key ? "active" : ""}`} onClick={() => setTab(t.key)}>
              {t.label}
              <span style={{ marginLeft: 5, fontSize: 11, opacity: .7 }}>({tabCounts[t.key]})</span>
            </button>
          ))}
        </div>
        <div className="search-wrap" style={{ position: "relative", width: 220 }}>
          <svg style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", opacity: .45 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            className="input"
            style={{ paddingLeft: 30, height: 34, fontSize: 13 }}
            placeholder="Search quotation / customer…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="table">
          <thead>
            <tr>
              <th>Quotation #</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th style={{ textAlign: "right" }}>Value (AED)</th>
              <th>Status</th>
              <th style={{ width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: "40px 0", color: "var(--text-3)" }}>No quotations found</td></tr>
            )}
            {filtered.map(q => {
              const val = calcValue(q.items);
              return (
                <tr key={q.id} style={{ cursor: "pointer" }} onClick={() => onView(q.id)}>
                  <td>
                    <span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--primary)" }}>{q.quotationNumber}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{q.customer?.name || "—"}</div>
                    <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 1 }}>{q.customer?.emailId || ""}</div>
                  </td>
                  <td style={{ fontSize: 13, color: "var(--text-2)" }}>{fmtDateShort(q.quotationDate)}</td>
                  <td style={{ fontSize: 13, color: "var(--text-2)" }}>{(q.items || []).length}</td>
                  <td style={{ textAlign: "right", fontWeight: 600, fontSize: 13 }}>{val.toLocaleString()}</td>
                  <td><QBadge status={q.status} /></td>
                  <td onClick={e => e.stopPropagation()}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button className="icon-btn" title="Edit"   onClick={() => onEdit(q.id)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button className="icon-btn danger" title="Delete" onClick={() => onDelete(q.id)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
