// Craftly — Payment Voucher
// Official receipt. Bold dark band + PAID stamp + amount-in-words + allocations table.

function PaymentVoucherDoc() {
  return (
    <div className="sheet">
      <div className="voucher-band">
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div className="brandmark">L</div>
          <div>
            <div className="doc-header__org">Studio Marchetti</div>
            <div className="doc-header__meta">TRN 100 482 931 700003</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="doc-type">Payment voucher</div>
          <div className="doc-type-sub">PV-0218</div>
        </div>
      </div>

      <div className="stamp">
        PAID
        <span className="stamp__sub">14 MAY 2026</span>
      </div>

      <div className="parties" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div>
          <div className="party__label">Received from</div>
          <div className="party__name">Hawthorn &amp; Co</div>
          <div className="party__line">
            Theo Bramwell, Director<br />
            theo@hawthorn.co<br />
            17 Charlotte Mews, London W1T 4DZ, UK
          </div>
        </div>
        <div>
          <div className="party__label">Payment details</div>
          <div className="details-grid">
            <div className="row"><span className="dim">Date received</span><span className="tabular" style={{ fontWeight: 500 }}>14 May 2026</span></div>
            <div className="row"><span className="dim">Method</span><span>Bank transfer (SWIFT)</span></div>
            <div className="row"><span className="dim">Bank reference</span><span className="mono">EBL/2026/05/14/948817</span></div>
            <div className="row"><span className="dim">Currency</span><span>AED</span></div>
            <div className="row"><span className="dim">FX rate</span><span className="tabular">1 GBP = 4.6121 AED</span></div>
          </div>
        </div>
      </div>

      <div className="bigamount">
        <div>
          <div className="label">Amount received</div>
          <div className="words">Eight thousand four hundred dirhams only</div>
        </div>
        <div className="value">AED 8,400.00</div>
      </div>

      <div className="party__label" style={{ marginBottom: 8 }}>Allocated to</div>
      <table className="allocations">
        <thead>
          <tr>
            <th>Document</th>
            <th>Project</th>
            <th>Issued</th>
            <th className="r">Invoice total</th>
            <th className="r">Applied</th>
            <th className="r">Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span className="mono-id">INV-2051</span></td>
            <td>Hawthorn rebrand — sprint 3</td>
            <td><span className="dim">12 May 2026</span></td>
            <td className="r tabular">8,400.00</td>
            <td className="r tabular" style={{ fontWeight: 500, color: "#1F8A52" }}>8,400.00</td>
            <td className="r tabular dim">0.00</td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 32 }}>
        <div>
          <div className="party__label" style={{ marginBottom: 8 }}>Account ledger</div>
          <div style={{ background: "#FBFBF9", border: "1px solid #ECECE7", borderRadius: 10, padding: "14px 16px", fontSize: 12.5 }}>
            <div className="pay-line"><span className="dim">Opening balance</span><span className="v tabular">8,400.00</span></div>
            <div className="pay-line"><span className="dim">This payment</span><span className="v tabular" style={{ color: "#1F8A52" }}>−8,400.00</span></div>
            <div className="pay-line" style={{ borderTop: "1px solid #ECECE7", marginTop: 4, paddingTop: 8, fontWeight: 500 }}>
              <span>Closing balance</span><span className="v tabular">0.00</span>
            </div>
          </div>
        </div>
        <div>
          <div className="party__label" style={{ marginBottom: 8 }}>Notes</div>
          <div style={{ fontSize: 12, color: "#54585F", lineHeight: 1.6 }}>
            Payment received in full for sprint 3 deliverables. No outstanding
            items on Hawthorn account as of this receipt. Sprint 4 invoice will
            be issued on May 26.
          </div>
        </div>
      </div>

      <div className="signatures">
        <div>
          <div className="signature__label">Received &amp; recorded by</div>
          <div className="signature__line signed" />
          <div className="signature__name">Lena Marchetti — Studio Marchetti</div>
          <div className="signature__date">14 May 2026</div>
        </div>
        <div>
          <div className="signature__label">Authorised by client</div>
          <div className="signature__line" />
          <div className="signature__name">Theo Bramwell — Hawthorn &amp; Co</div>
          <div className="signature__date">__ / __ / 2026</div>
        </div>
      </div>

      <div className="page-num">
        <span>This document is a system-generated receipt — no signature required for validity.</span>
        <span>PV-0218</span>
      </div>
    </div>
  );
}

window.PaymentVoucherDoc = PaymentVoucherDoc;
