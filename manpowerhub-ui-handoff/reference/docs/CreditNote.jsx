// Craftly — Credit Note
// Issued against an invoice to refund, correct or credit a balance.

function CreditNoteDoc() {
  return (
    <div className="sheet">
      <div className="credit-band">
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div className="brandmark">L</div>
          <div>
            <div className="doc-header__org">Studio Marchetti</div>
            <div className="doc-header__meta" style={{ color: "#8E2828", opacity: 0.7 }}>
              TRN 100 482 931 700003
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="doc-type">Credit note</div>
          <div className="doc-type-sub">CN-0034 · against INV-2048</div>
        </div>
      </div>

      <div className="parties" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div>
          <div className="party__label">Issued to</div>
          <div className="party__name">Northwind Labs</div>
          <div className="party__line">
            Priya Anand, Head of Marketing<br />
            priya@northwind.io<br />
            6F Phoenix Mills, Lower Parel, Mumbai 400013, India
          </div>
        </div>
        <div>
          <div className="party__label">Details</div>
          <div className="details-grid">
            <div className="row"><span className="dim">Issued</span><span className="tabular">14 May 2026</span></div>
            <div className="row"><span className="dim">Original invoice</span><span className="mono">INV-2048</span></div>
            <div className="row"><span className="dim">Reason</span><span>Scope reduction — sprint 2</span></div>
            <div className="row"><span className="dim">Currency</span><span>AED</span></div>
          </div>
        </div>
      </div>

      <div className="refund-card">
        <div>
          <div className="k">Original invoice</div>
          <div className="v">4,200.00</div>
        </div>
        <div className="arrow">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="k">Credited</div>
          <div className="v" style={{ color: "#C13838" }}>− 1,200.00</div>
        </div>
      </div>

      <div className="party__label" style={{ marginBottom: 8 }}>Items credited</div>
      <table className="items">
        <thead>
          <tr>
            <th>Description</th>
            <th className="r">Qty</th>
            <th className="r">Rate</th>
            <th className="r">Credit</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className="desc-title">Custom illustration set — pulled from scope</div>
              <div className="desc-sub">Reassigned to internal team after sprint 1 review. Originally billed on INV-2048.</div>
            </td>
            <td className="qty">4</td>
            <td className="rate">240.00</td>
            <td className="total" style={{ color: "#C13838" }}>−960.00</td>
          </tr>
          <tr>
            <td>
              <div className="desc-title">Engineering pairing — 1.5h adjustment</div>
              <div className="desc-sub">Two sessions on May 4 were logged on the wrong project.</div>
            </td>
            <td className="qty">1.5</td>
            <td className="rate">160.00</td>
            <td className="total" style={{ color: "#C13838" }}>−240.00</td>
          </tr>
        </tbody>
      </table>

      <div className="totals">
        <div className="totals__inner">
          <div className="row"><span className="dim">Subtotal credit</span><span className="tabular">−1,200.00</span></div>
          <div className="row"><span className="dim">VAT 5%</span><span className="tabular">−60.00</span></div>
          <div className="row grand" style={{ color: "#C13838" }}><span>Total credit (AED)</span><span className="tabular">−1,260.00</span></div>
        </div>
      </div>

      <div className="doc-footer">
        <div>
          <h4>Applied as</h4>
          <div className="pay-line"><span className="dim">Method</span><span className="v">Reduce next invoice (INV-2053)</span></div>
          <div className="pay-line"><span className="dim">Status</span><span className="v">Queued — applies on issue</span></div>
          <div className="pay-line"><span className="dim">Alternative</span><span className="v">Bank refund within 7 days on request</span></div>
        </div>
        <div>
          <h4>Notes</h4>
          <div>
            Issued at client request following the May 12 scope call. The two
            illustration variants delivered remain Northwind's property. No
            action required from your side — the credit will appear on your
            next invoice.
          </div>
        </div>
      </div>

      <div className="page-num">
        <span>Credit notes are a tax document. Please retain for your records.</span>
        <span>CN-0034 · Page 1 of 1</span>
      </div>
    </div>
  );
}

window.CreditNoteDoc = CreditNoteDoc;
