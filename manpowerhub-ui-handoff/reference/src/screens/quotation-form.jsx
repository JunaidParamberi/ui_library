// ManpowerHub — Quotation Create / Edit Form + Delete Modal
// Expects: { initial (null=create), onSave, onCancel }
// DeleteModal expects: { quotationNumber, onConfirm, onCancel }

const EMPTY_FORM = {
  quotationNumber: "",
  quotationDate: new Date().toISOString().slice(0, 10),
  status: "DRAFT",
  customer: { name: "", address: "", phoneNumber: "", emailId: "" },
  items: [{ category: "", quantity: "", rate: "", otRate: "" }],
  approvers: [],
};

const EMPTY_ITEM     = { category: "", quantity: "", rate: "", otRate: "" };
const EMPTY_APPROVER = { approverName: "", approverId: "", approverEmail: "", decision: "PENDING" };

const STATUS_OPTS = [
  { value: "DRAFT",            label: "Draft"            },
  { value: "PENDING_APPROVAL", label: "Pending Approval" },
  { value: "APPROVED",         label: "Approved"         },
  { value: "SENT",             label: "Sent"             },
  { value: "REJECTED",         label: "Rejected"         },
];

function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

function SectionHead({ title, action }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", color: "var(--text-3)" }}>{title}</div>
      {action}
    </div>
  );
}

function Field({ label, children, required }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)" }}>
        {label}{required && <span style={{ color: "var(--red)", marginLeft: 2 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function QuotationForm({ initial, onSave, onCancel }) {
  const { useState: useS } = React;

  const isEdit = !!initial;
  const [form, setForm] = useS(() => initial ? deepClone(initial) : deepClone(EMPTY_FORM));
  const [errors, setErrors] = useS({});

  /* ── helpers ── */
  function setTop(key, val) { setForm(f => ({ ...f, [key]: val })); }
  function setCustomer(key, val) { setForm(f => ({ ...f, customer: { ...f.customer, [key]: val } })); }

  function setItem(i, key, val) {
    setForm(f => {
      const items = [...f.items];
      items[i] = { ...items[i], [key]: val };
      return { ...f, items };
    });
  }
  function addItem() { setForm(f => ({ ...f, items: [...f.items, { ...EMPTY_ITEM }] })); }
  function removeItem(i) { setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) })); }

  function setApprover(i, key, val) {
    setForm(f => {
      const approvers = [...f.approvers];
      approvers[i] = { ...approvers[i], [key]: val };
      return { ...f, approvers };
    });
  }
  function addApprover() { setForm(f => ({ ...f, approvers: [...f.approvers, { ...EMPTY_APPROVER }] })); }
  function removeApprover(i) { setForm(f => ({ ...f, approvers: f.approvers.filter((_, idx) => idx !== i) })); }

  /* ── validation ── */
  function validate() {
    const e = {};
    if (!form.quotationNumber.trim()) e.quotationNumber = "Required";
    if (!form.quotationDate)          e.quotationDate   = "Required";
    if (!form.customer.name.trim())   e["customer.name"] = "Required";
    form.items.forEach((it, i) => {
      if (!it.category.trim()) e[`item.${i}.category`] = "Required";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    const now = new Date().toISOString();
    const saved = {
      ...form,
      updatedAt: now,
      ...(isEdit ? {} : {
        id: "q-" + Date.now(),
        createdAt: now,
        createdBy: "junaid@manpowerhub.ae",
      }),
    };
    onSave(saved);
  }

  /* ── financials preview ── */
  const subtotal = form.items.reduce((s, it) => s + (parseFloat(it.quantity) || 0) * (parseFloat(it.rate) || 0), 0);
  const otTotal  = form.items.reduce((s, it) => s + (parseFloat(it.quantity) || 0) * (parseFloat(it.otRate) || 0), 0);

  const inputStyle = { width: "100%", boxSizing: "border-box" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Page header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button className="icon-btn" onClick={onCancel} title="Back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{isEdit ? "Edit Quotation" : "New Quotation"}</h2>
      </div>

      {/* ── Section 1: Basic info ── */}
      <div className="card" style={{ padding: "20px 24px" }}>
        <SectionHead title="Quotation Details" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px 20px" }}>
          <Field label="Quotation Number" required>
            <input className={`input${errors.quotationNumber ? " error" : ""}`} style={inputStyle}
              value={form.quotationNumber}
              onChange={e => setTop("quotationNumber", e.target.value)}
              placeholder="KAT/QTN/2026/05/042"
            />
            {errors.quotationNumber && <span style={{ fontSize: 11, color: "var(--red)" }}>{errors.quotationNumber}</span>}
          </Field>
          <Field label="Quotation Date" required>
            <input className={`input${errors.quotationDate ? " error" : ""}`} style={inputStyle}
              type="date" value={form.quotationDate}
              onChange={e => setTop("quotationDate", e.target.value)}
            />
          </Field>
          <Field label="Status">
            <select className="input" style={inputStyle} value={form.status} onChange={e => setTop("status", e.target.value)}>
              {STATUS_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>
        </div>
      </div>

      {/* ── Section 2: Customer ── */}
      <div className="card" style={{ padding: "20px 24px" }}>
        <SectionHead title="Customer Information" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 20px" }}>
          <Field label="Company Name" required>
            <input className={`input${errors["customer.name"] ? " error" : ""}`} style={inputStyle}
              value={form.customer.name}
              onChange={e => setCustomer("name", e.target.value)}
              placeholder="Al Naboodah Contracting"
            />
            {errors["customer.name"] && <span style={{ fontSize: 11, color: "var(--red)" }}>{errors["customer.name"]}</span>}
          </Field>
          <Field label="Email">
            <input className="input" style={inputStyle} type="email"
              value={form.customer.emailId}
              onChange={e => setCustomer("emailId", e.target.value)}
              placeholder="contact@company.ae"
            />
          </Field>
          <Field label="Phone Number">
            <input className="input" style={inputStyle}
              value={form.customer.phoneNumber}
              onChange={e => setCustomer("phoneNumber", e.target.value)}
              placeholder="+971 4 xxx xxxx"
            />
          </Field>
          <Field label="Address">
            <input className="input" style={inputStyle}
              value={form.customer.address}
              onChange={e => setCustomer("address", e.target.value)}
              placeholder="Al Quoz Industrial Area, Dubai"
            />
          </Field>
        </div>
      </div>

      {/* ── Section 3: Items ── */}
      <div className="card" style={{ padding: "20px 24px" }}>
        <SectionHead title="Manpower Items"
          action={
            <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={addItem}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Row
            </button>
          }
        />
        <table className="table" style={{ tableLayout: "fixed" }}>
          <thead>
            <tr>
              <th style={{ width: "38%" }}>Category / Description</th>
              <th style={{ textAlign: "right", width: "12%" }}>Qty</th>
              <th style={{ textAlign: "right", width: "15%" }}>Rate (AED)</th>
              <th style={{ textAlign: "right", width: "15%" }}>OT Rate (AED)</th>
              <th style={{ textAlign: "right", width: "15%" }}>Line Total</th>
              <th style={{ width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {form.items.map((it, i) => {
              const line = (parseFloat(it.quantity) || 0) * (parseFloat(it.rate) || 0);
              return (
                <tr key={i}>
                  <td>
                    <input className={`input${errors[`item.${i}.category`] ? " error" : ""}`}
                      style={{ width: "100%", boxSizing: "border-box", height: 32, fontSize: 13 }}
                      value={it.category}
                      onChange={e => setItem(i, "category", e.target.value)}
                      placeholder="General Labourers (Day)"
                    />
                  </td>
                  <td>
                    <input className="input" type="number" min="0"
                      style={{ width: "100%", boxSizing: "border-box", height: 32, fontSize: 13, textAlign: "right" }}
                      value={it.quantity}
                      onChange={e => setItem(i, "quantity", e.target.value)}
                      placeholder="0"
                    />
                  </td>
                  <td>
                    <input className="input" type="number" min="0" step="0.01"
                      style={{ width: "100%", boxSizing: "border-box", height: 32, fontSize: 13, textAlign: "right" }}
                      value={it.rate}
                      onChange={e => setItem(i, "rate", e.target.value)}
                      placeholder="0.00"
                    />
                  </td>
                  <td>
                    <input className="input" type="number" min="0" step="0.01"
                      style={{ width: "100%", boxSizing: "border-box", height: 32, fontSize: 13, textAlign: "right" }}
                      value={it.otRate}
                      onChange={e => setItem(i, "otRate", e.target.value)}
                      placeholder="0.00"
                    />
                  </td>
                  <td style={{ textAlign: "right", fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>
                    {line > 0 ? line.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "—"}
                  </td>
                  <td>
                    <button className="icon-btn danger" onClick={() => removeItem(i)} disabled={form.items.length === 1} title="Remove">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </td>
                </tr>
              );
            })}
            {/* Totals */}
            <tr style={{ background: "var(--surface-2)", borderTop: "2px solid var(--border)" }}>
              <td colSpan={4} style={{ textAlign: "right", fontSize: 13, fontWeight: 700 }}>Regular Subtotal</td>
              <td style={{ textAlign: "right", fontWeight: 700 }}>AED {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td></td>
            </tr>
            <tr style={{ background: "var(--surface-2)" }}>
              <td colSpan={4} style={{ textAlign: "right", fontSize: 13, fontWeight: 700 }}>OT Subtotal</td>
              <td style={{ textAlign: "right", fontWeight: 700 }}>AED {otTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td></td>
            </tr>
            <tr style={{ background: "var(--surface-3)" }}>
              <td colSpan={4} style={{ textAlign: "right", fontSize: 14, fontWeight: 800 }}>Grand Total</td>
              <td style={{ textAlign: "right", fontWeight: 800, fontSize: 15, color: "var(--primary)" }}>
                AED {(subtotal + otTotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Section 4: Approvers ── */}
      <div className="card" style={{ padding: "20px 24px" }}>
        <SectionHead title="Approval Workflow"
          action={
            <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={addApprover}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Approver
            </button>
          }
        />
        {form.approvers.length === 0 && (
          <div style={{ textAlign: "center", padding: "24px 0", color: "var(--text-3)", fontSize: 13 }}>
            No approvers — this quotation will skip approval workflow.
          </div>
        )}
        {form.approvers.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {form.approvers.map((ap, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 120px 36px", gap: 10, alignItems: "end" }}>
                <Field label={`Approver ${i + 1} Name`}>
                  <input className="input" style={{ width: "100%", boxSizing: "border-box" }}
                    value={ap.approverName}
                    onChange={e => setApprover(i, "approverName", e.target.value)}
                    placeholder="Nasser Al Mansoori"
                  />
                </Field>
                <Field label="Email">
                  <input className="input" style={{ width: "100%", boxSizing: "border-box" }} type="email"
                    value={ap.approverEmail}
                    onChange={e => setApprover(i, "approverEmail", e.target.value)}
                    placeholder="approver@manpowerhub.ae"
                  />
                </Field>
                <Field label="Decision">
                  <select className="input" style={{ width: "100%", boxSizing: "border-box" }}
                    value={ap.decision}
                    onChange={e => setApprover(i, "decision", e.target.value)}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </Field>
                <div style={{ paddingBottom: 1 }}>
                  <button className="icon-btn danger" onClick={() => removeApprover(i)} title="Remove">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Footer actions ── */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingBottom: 20 }}>
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          {isEdit ? "Save Changes" : "Create Quotation"}
        </button>
      </div>
    </div>
  );
}

/* ── Delete Confirmation Modal ───────────────────────────────────────────── */
function QuotationDeleteModal({ quotationNumber, onConfirm, onCancel }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onCancel}>
      <div className="card" onClick={e => e.stopPropagation()}
        style={{ width: 420, padding: "28px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%", background: "rgba(239,68,68,.12)",
            display: "grid", placeItems: "center", flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Delete Quotation</div>
            <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 2 }}>This action cannot be undone.</div>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: 14, color: "var(--text-2)", lineHeight: 1.6 }}>
          Are you sure you want to delete quotation{" "}
          <strong style={{ fontFamily: "monospace", color: "var(--text-1)" }}>{quotationNumber}</strong>?
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn" style={{ background: "var(--red)", color: "#fff" }} onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}
