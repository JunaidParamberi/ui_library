// ManpowerHub — Quotation Detail Page
// Expects: { quotation, onBack, onEdit, onDelete }

function fmtD(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" });
}
function fmtDT(d) {
  if (!d) return "—";
  const dt = new Date(d);
  return dt.toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" }) +
    " · " + dt.toLocaleTimeString("en-AE", { hour: "2-digit", minute: "2-digit" });
}

const QSTATUS_DETAIL = {
  DRAFT:            { cls: "outline", label: "Draft"            },
  PENDING_APPROVAL: { cls: "warning", label: "Pending Approval" },
  APPROVED:         { cls: "success", label: "Approved"         },
  SENT:             { cls: "info",    label: "Sent"             },
  REJECTED:         { cls: "danger",  label: "Rejected"         },
};

const DEC_META = {
  PENDING:  { color: "var(--amber)", icon: "⏳", label: "Pending"  },
  APPROVED: { color: "var(--green)", icon: "✓",  label: "Approved" },
  REJECTED: { color: "var(--red)",   icon: "✕",  label: "Rejected" },
};

function QDetailBadge({ status }) {
  const m = QSTATUS_DETAIL[status] || { cls: "outline", label: status };
  return <span className={`badge badge-${m.cls}`} style={{ fontSize: 13, padding: "4px 10px" }}>{m.label}</span>;
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".07em", color: "var(--text-3)" }}>{label}</span>
      <span style={{ fontSize: 14, color: "var(--text-1)" }}>{value || "—"}</span>
    </div>
  );
}

function QuotationDetail({ quotation: q, onBack, onEdit, onDelete }) {
  if (!q) return null;

  const items   = q.items   || [];
  const approvers = q.approvers || [];

  const subtotal = items.reduce((s, it) => s + (parseFloat(it.quantity) || 0) * (parseFloat(it.rate) || 0), 0);
  const otTotal  = items.reduce((s, it) => s + (parseFloat(it.quantity) || 0) * (parseFloat(it.otRate) || 0), 0);

  const allDone = approvers.length > 0 && approvers.every(a => a.decision !== "PENDING");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button className="icon-btn" onClick={onBack} title="Back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 2 }}>Quotation</div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, fontFamily: "monospace" }}>{q.quotationNumber}</h2>
        </div>
        <QDetailBadge status={q.status} />
        <button className="btn btn-ghost" onClick={() => onEdit(q.id)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Edit
        </button>
        <button className="btn btn-ghost danger" onClick={() => onDelete(q.id)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg>
          Delete
        </button>
      </div>

      {/* Meta grid */}
      <div className="card" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))", gap: "16px 24px", padding: "20px 24px" }}>
        <InfoRow label="Quotation Date" value={fmtD(q.quotationDate)} />
        <InfoRow label="Created By"     value={q.createdBy} />
        <InfoRow label="Created At"     value={fmtDT(q.createdAt)} />
        <InfoRow label="Last Updated"   value={fmtDT(q.updatedAt)} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Customer Card */}
        <div className="card" style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: ".07em" }}>Customer</div>
          <div style={{ fontSize: 17, fontWeight: 700 }}>{q.customer?.name || "—"}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { icon: "📍", val: q.customer?.address },
              { icon: "📞", val: q.customer?.phoneNumber },
              { icon: "✉",  val: q.customer?.emailId },
            ].map(({ icon, val }) => val && (
              <div key={icon} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--text-2)", alignItems: "flex-start" }}>
                <span style={{ opacity: .7 }}>{icon}</span>
                <span>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Financials Card */}
        <div className="card" style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: ".07em" }}>Financial Summary</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--text-2)" }}>
              <span>Regular Rate Total</span>
              <span style={{ fontWeight: 600, color: "var(--text-1)" }}>AED {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--text-2)" }}>
              <span>OT Rate Total</span>
              <span style={{ fontWeight: 600, color: "var(--text-1)" }}>AED {otTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 8, display: "flex", justifyContent: "space-between", fontSize: 15 }}>
              <span style={{ fontWeight: 700 }}>Grand Total</span>
              <span style={{ fontWeight: 800, color: "var(--primary)", fontSize: 17 }}>AED {(subtotal + otTotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", fontWeight: 700, fontSize: 14 }}>
          Manpower Items
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Category</th>
              <th style={{ textAlign: "right" }}>Quantity</th>
              <th style={{ textAlign: "right" }}>Rate (AED)</th>
              <th style={{ textAlign: "right" }}>OT Rate (AED)</th>
              <th style={{ textAlign: "right" }}>Line Total (AED)</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "30px 0", color: "var(--text-3)" }}>No items</td></tr>
            )}
            {items.map((it, i) => {
              const lineVal = (parseFloat(it.quantity) || 0) * (parseFloat(it.rate) || 0);
              return (
                <tr key={i}>
                  <td style={{ color: "var(--text-3)", fontSize: 12 }}>{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{it.category}</td>
                  <td style={{ textAlign: "right" }}>{it.quantity}</td>
                  <td style={{ textAlign: "right" }}>{parseFloat(it.rate).toFixed(2)}</td>
                  <td style={{ textAlign: "right" }}>{parseFloat(it.otRate).toFixed(2)}</td>
                  <td style={{ textAlign: "right", fontWeight: 600 }}>{lineVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
              );
            })}
            <tr style={{ background: "var(--surface-2)" }}>
              <td colSpan={5} style={{ textAlign: "right", fontWeight: 700, fontSize: 13 }}>Regular Subtotal</td>
              <td style={{ textAlign: "right", fontWeight: 700 }}>AED {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Approval Timeline */}
      {approvers.length > 0 && (
        <div className="card" style={{ padding: "20px 24px" }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Approval Workflow</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {approvers.map((ap, i) => {
              const m = DEC_META[ap.decision] || DEC_META.PENDING;
              const isLast = i === approvers.length - 1;
              return (
                <div key={ap.approverId} style={{ display: "flex", gap: 16, position: "relative" }}>
                  {/* Line */}
                  {!isLast && (
                    <div style={{
                      position: "absolute", left: 18, top: 36, bottom: 0, width: 2,
                      background: "var(--border)", zIndex: 0,
                    }} />
                  )}
                  {/* Circle */}
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                    background: m.color + "22", border: `2px solid ${m.color}`,
                    display: "grid", placeItems: "center", fontSize: 14,
                    color: m.color, zIndex: 1, position: "relative",
                  }}>
                    {m.icon}
                  </div>
                  {/* Content */}
                  <div style={{ flex: 1, paddingBottom: isLast ? 0 : 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{ap.approverName}</span>
                      <span className={`badge badge-${ap.decision === "APPROVED" ? "success" : ap.decision === "REJECTED" ? "danger" : "warning"}`} style={{ fontSize: 11 }}>
                        {m.label}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>{ap.approverEmail}</div>
                    {ap.approvedAt && (
                      <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>
                        {ap.decision === "REJECTED" ? "Rejected" : "Approved"} · {fmtDT(ap.approvedAt)}
                      </div>
                    )}
                    {ap.requestedAt && !ap.approvedAt && (
                      <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>Requested · {fmtDT(ap.requestedAt)}</div>
                    )}
                    {ap.comment && (
                      <div style={{
                        marginTop: 6, fontSize: 13, color: "var(--text-2)",
                        background: "var(--surface-2)", border: "1px solid var(--border)",
                        borderRadius: 6, padding: "6px 10px",
                      }}>
                        "{ap.comment}"
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
