// Craftly — Invoice theme variants
// Same underlying structure as InvoiceDoc, swapped visual treatment to show
// how the system flexes for different brand vibes.

// Shared row helper for the line items used by all variants.
function VLineRow({ title, sub, qty, rate, total }) {
  return (
    <tr>
      <td>
        <div className="desc-title">{title}</div>
        {sub && <div className="desc-sub">{sub}</div>}
      </td>
      <td className="qty">{qty}</td>
      <td className="rate">{rate}</td>
      <td className="total">{total}</td>
    </tr>
  );
}

/* ---------- MONO ---------- */
function InvoiceMonoDoc() {
  return (
    <div className="sheet sheet--mono">
      <div className="doc-header">
        <div className="doc-header__brand">
          <div className="brandmark">SM</div>
          <div>
            <div className="doc-header__org">Studio Marchetti</div>
            <div className="doc-header__meta">
              Lena Marchetti<br />
              lena@studiomarchetti.com
            </div>
          </div>
        </div>
        <div className="doc-header__right">
          <div className="doc-type">Invoice</div>
          <div className="doc-type-sub">INV-2052</div>
          <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
            <span className="pill pill--dot">Sent — awaiting payment</span>
          </div>
        </div>
      </div>

      <div className="parties">
        <div>
          <div className="party__label">Billed to</div>
          <div className="party__name">Onyx Ventures</div>
          <div className="party__line">
            Attn: Dana Cole<br />
            228 Lafayette St, 4F<br />
            New York, NY 10012, USA<br />
            VAT EU372 884 991
          </div>
        </div>
        <div>
          <div className="party__label">Project</div>
          <div className="party__name">Onyx — Site v2</div>
          <div className="party__line">
            Sprint 4 of 5<br />
            Phase: Build &amp; polish<br />
            PO #OX-2026-04
          </div>
        </div>
        <div>
          <div className="party__label">Details</div>
          <div className="details-grid">
            <div className="row"><span className="dim">Issued</span><span className="tabular">14 May 2026</span></div>
            <div className="row"><span className="dim">Due</span><span className="tabular" style={{ fontWeight: 500 }}>28 May 2026</span></div>
            <div className="row"><span className="dim">Terms</span><span>Net 14</span></div>
            <div className="row"><span className="dim">Currency</span><span>AED</span></div>
          </div>
        </div>
      </div>

      <table className="items">
        <thead>
          <tr>
            <th>Description</th><th className="r">Qty</th><th className="r">Rate</th><th className="r">Amount</th>
          </tr>
        </thead>
        <tbody>
          <VLineRow title="Design system & component library" sub="Tokens, 28 components, documentation site, dark/light themes."
            qty="1" rate="3,200.00" total="3,200.00" />
          <VLineRow title="Landing page — responsive build" sub="4 sections, hero animation, CMS-driven case studies module."
            qty="1" rate="2,800.00" total="2,800.00" />
          <VLineRow title="Engineering pairing — week of May 6" sub="Daily 90-min calls. Logged via Craftly."
            qty="12" rate="220.00" total="2,640.00" />
          <VLineRow title="Post-launch tweaks & QA" sub="Mobile breakpoint fixes, OG image set, analytics handoff."
            qty="1" rate="560.00" total="560.00" />
        </tbody>
      </table>

      <div className="totals">
        <div className="totals__inner">
          <div className="row"><span className="dim">Subtotal</span><span className="tabular">9,200.00</span></div>
          <div className="row"><span className="dim">Discount (loyalty −2%)</span><span className="tabular">−184.00</span></div>
          <div className="row"><span className="dim">VAT 5%</span><span className="tabular">450.80</span></div>
          <div className="row grand"><span>Total due (AED)</span><span className="tabular">9,466.80</span></div>
        </div>
      </div>

      <div className="doc-footer">
        <div>
          <h4>Payment</h4>
          <div className="pay-line"><span className="dim">Bank</span><span className="v">Emirates NBD</span></div>
          <div className="pay-line"><span className="dim">IBAN</span><span className="v mono">AE07 0260 0010 1535 9241 802</span></div>
          <div className="pay-line"><span className="dim">SWIFT</span><span className="v mono">EBILAEAD</span></div>
          <div className="pay-line"><span className="dim">Reference</span><span className="v mono">INV-2052</span></div>
        </div>
        <div>
          <h4>Notes</h4>
          <div>Thanks for the continued partnership. Sprint 5 kicks off June 2. Late payments accrue 1.5% per week after the due date.</div>
        </div>
      </div>

      <div className="page-num"><span>Studio Marchetti · TRN 100 482 931 700003</span><span>Page 1 of 1</span></div>
    </div>
  );
}

/* ---------- BRAND ---------- */
function InvoiceBrandDoc() {
  return (
    <div className="sheet sheet--brand">
      <div className="brand-band">
        <div className="doc-header" style={{ marginBottom: 0 }}>
          <div className="doc-header__brand">
            <div className="brandmark">L</div>
            <div>
              <div className="doc-header__org">Studio Marchetti</div>
              <div className="doc-header__meta">
                lena@studiomarchetti.com · DIFC, Dubai
              </div>
            </div>
          </div>
          <div className="doc-header__right">
            <div className="doc-type">Invoice</div>
            <div className="doc-type-sub">INV-2052</div>
            <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
              <span className="pill pill--accent pill--dot">Sent · awaiting payment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="parties">
        <div>
          <div className="party__label">Billed to</div>
          <div className="party__name">Onyx Ventures</div>
          <div className="party__line">
            Attn: Dana Cole<br />
            228 Lafayette St, 4F<br />
            New York, NY 10012, USA
          </div>
        </div>
        <div>
          <div className="party__label">Project</div>
          <div className="party__name">Onyx — Site v2</div>
          <div className="party__line">
            Sprint 4 of 5 · Build &amp; polish<br />
            PO #OX-2026-04
          </div>
        </div>
        <div>
          <div className="party__label">Details</div>
          <div className="details-grid">
            <div className="row"><span className="dim">Issued</span><span className="tabular">14 May 2026</span></div>
            <div className="row"><span className="dim">Due</span><span className="tabular" style={{ fontWeight: 500 }}>28 May 2026</span></div>
            <div className="row"><span className="dim">Terms</span><span>Net 14</span></div>
            <div className="row"><span className="dim">Currency</span><span>AED</span></div>
          </div>
        </div>
      </div>

      <table className="items">
        <thead>
          <tr>
            <th>Description</th><th className="r">Qty</th><th className="r">Rate</th><th className="r">Amount</th>
          </tr>
        </thead>
        <tbody>
          <VLineRow title="Design system & component library" sub="Tokens, 28 components, documentation site, dark/light themes."
            qty="1" rate="3,200.00" total="3,200.00" />
          <VLineRow title="Landing page — responsive build" sub="4 sections, hero animation, CMS-driven case studies module."
            qty="1" rate="2,800.00" total="2,800.00" />
          <VLineRow title="Engineering pairing — week of May 6" sub="Daily 90-min calls with Onyx eng team."
            qty="12" rate="220.00" total="2,640.00" />
          <VLineRow title="Post-launch tweaks & QA" sub="Mobile breakpoint fixes, OG image set, analytics handoff."
            qty="1" rate="560.00" total="560.00" />
        </tbody>
      </table>

      <div className="totals">
        <div className="totals__inner">
          <div className="row"><span className="dim">Subtotal</span><span className="tabular">9,200.00</span></div>
          <div className="row"><span className="dim">Discount (loyalty −2%)</span><span className="tabular">−184.00</span></div>
          <div className="row"><span className="dim">VAT 5%</span><span className="tabular">450.80</span></div>
          <div className="row grand"><span>Total due (AED)</span><span className="tabular">9,466.80</span></div>
        </div>
      </div>

      <div className="doc-footer">
        <div>
          <h4>Payment instructions</h4>
          <div className="pay-line"><span className="dim">Bank</span><span className="v">Emirates NBD</span></div>
          <div className="pay-line"><span className="dim">IBAN</span><span className="v mono">AE07 0260 0010 1535 9241 802</span></div>
          <div className="pay-line"><span className="dim">SWIFT</span><span className="v mono">EBILAEAD</span></div>
          <div className="pay-line"><span className="dim">Reference</span><span className="v mono">INV-2052</span></div>
        </div>
        <div>
          <h4>Pay online</h4>
          <div>One-tap card &amp; bank-transfer link below. Auto-reconciles when settled.</div>
          <div style={{ marginTop: 14 }}>
            <span className="pill pill--accent pill--dot">craftly.app/pay/INV-2052</span>
          </div>
        </div>
      </div>

      <div className="page-num"><span>Studio Marchetti · TRN 100 482 931 700003</span><span>Page 1 of 1</span></div>
    </div>
  );
}

/* ---------- SERIF / EDITORIAL ---------- */
function InvoiceSerifDoc() {
  return (
    <div className="sheet sheet--serif">
      <div className="doc-header">
        <div className="doc-header__brand">
          <div className="brandmark">M</div>
          <div>
            <div className="doc-header__org">Studio Marchetti</div>
            <div className="doc-header__meta">
              Lena Marchetti<br />
              lena@studiomarchetti.com · +971 50 482 9311
            </div>
          </div>
        </div>
        <div className="doc-header__right">
          <div className="doc-type">Invoice</div>
          <div className="doc-type-sub">№ INV-2052</div>
          <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
            <span className="pill">Sent · awaiting payment</span>
          </div>
        </div>
      </div>

      <div className="parties">
        <div>
          <div className="party__label">Billed to</div>
          <div className="party__name">Onyx Ventures</div>
          <div className="party__line">
            Attn: Dana Cole<br />
            228 Lafayette St, 4F<br />
            New York, NY 10012, USA
          </div>
        </div>
        <div>
          <div className="party__label">Project</div>
          <div className="party__name">Onyx — Site v2</div>
          <div className="party__line">
            Sprint 4 of 5<br />
            Build &amp; polish phase
          </div>
        </div>
        <div>
          <div className="party__label">Details</div>
          <div className="details-grid">
            <div className="row"><span className="dim">Issued</span><span className="tabular">14 May 2026</span></div>
            <div className="row"><span className="dim">Due</span><span className="tabular" style={{ fontWeight: 500 }}>28 May 2026</span></div>
            <div className="row"><span className="dim">Terms</span><span>Net 14</span></div>
            <div className="row"><span className="dim">Currency</span><span>AED</span></div>
          </div>
        </div>
      </div>

      <table className="items">
        <thead>
          <tr>
            <th>Description</th><th className="r">Qty</th><th className="r">Rate</th><th className="r">Amount</th>
          </tr>
        </thead>
        <tbody>
          <VLineRow title="Design system & component library" sub="Tokens, 28 components, documentation site, dark/light themes."
            qty="1" rate="3,200.00" total="3,200.00" />
          <VLineRow title="Landing page — responsive build" sub="Four sections, hero animation, case-studies module."
            qty="1" rate="2,800.00" total="2,800.00" />
          <VLineRow title="Engineering pairing — week of May 6" sub="Daily 90-min calls. Logged via Craftly."
            qty="12" rate="220.00" total="2,640.00" />
          <VLineRow title="Post-launch tweaks & QA" sub="Mobile breakpoint fixes, OG image set, analytics handoff."
            qty="1" rate="560.00" total="560.00" />
        </tbody>
      </table>

      <div className="totals">
        <div className="totals__inner">
          <div className="row"><span className="dim">Subtotal</span><span className="tabular">9,200.00</span></div>
          <div className="row"><span className="dim">Discount (loyalty −2%)</span><span className="tabular">−184.00</span></div>
          <div className="row"><span className="dim">VAT 5%</span><span className="tabular">450.80</span></div>
          <div className="row grand"><span>Total due, AED</span><span className="tabular">9,466.80</span></div>
        </div>
      </div>

      <div className="doc-footer">
        <div>
          <h4>Payment</h4>
          <div className="pay-line"><span className="dim">Bank</span><span className="v">Emirates NBD</span></div>
          <div className="pay-line"><span className="dim">IBAN</span><span className="v mono">AE07 0260 0010 1535 9241 802</span></div>
          <div className="pay-line"><span className="dim">SWIFT</span><span className="v mono">EBILAEAD</span></div>
          <div className="pay-line"><span className="dim">Reference</span><span className="v mono">INV-2052</span></div>
        </div>
        <div>
          <h4>A note</h4>
          <div style={{ fontStyle: "italic" }}>
            "Thank you for another considered, careful sprint. Looking forward
            to the launch on June 18."
          </div>
        </div>
      </div>

      <div className="page-num"><span>Studio Marchetti · est. 2019</span><span>Page 1 of 1</span></div>
    </div>
  );
}

window.InvoiceMonoDoc = InvoiceMonoDoc;
window.InvoiceBrandDoc = InvoiceBrandDoc;
window.InvoiceSerifDoc = InvoiceSerifDoc;
