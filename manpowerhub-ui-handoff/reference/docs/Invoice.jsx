// Craftly — Invoice template
// Clean, professional invoice. Uses brand mark + light bottom-bar payment instructions.

function InvoiceDoc() {
  return (
    <div className="sheet">
      <div className="doc-header">
        <div className="doc-header__brand">
          <div className="brandmark">L</div>
          <div>
            <div className="doc-header__org">Studio Marchetti</div>
            <div className="doc-header__meta">
              Lena Marchetti<br />
              lena@studiomarchetti.com · +971 50 482 9311<br />
              DIFC Gate Avenue, Office 412, Dubai
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
            <th>Description</th>
            <th className="r">Qty</th>
            <th className="r">Rate</th>
            <th className="r">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className="desc-title">Design system &amp; component library</div>
              <div className="desc-sub">Tokens, 28 components, documentation site, dark/light themes.</div>
            </td>
            <td className="qty">1</td>
            <td className="rate">3,200.00</td>
            <td className="total">3,200.00</td>
          </tr>
          <tr>
            <td>
              <div className="desc-title">Landing page — responsive build</div>
              <div className="desc-sub">4 sections, hero animation, CMS-driven case studies module.</div>
            </td>
            <td className="qty">1</td>
            <td className="rate">2,800.00</td>
            <td className="total">2,800.00</td>
          </tr>
          <tr>
            <td>
              <div className="desc-title">Engineering pairing — week of May 6</div>
              <div className="desc-sub">Daily 90-min calls with Onyx eng team. Logged via Craftly.</div>
            </td>
            <td className="qty">12</td>
            <td className="rate">220.00</td>
            <td className="total">2,640.00</td>
          </tr>
          <tr>
            <td>
              <div className="desc-title">Post-launch tweaks &amp; QA</div>
              <div className="desc-sub">Mobile breakpoint fixes, OG image set, analytics handoff.</div>
            </td>
            <td className="qty">1</td>
            <td className="rate">560.00</td>
            <td className="total">560.00</td>
          </tr>
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
          <div className="pay-line"><span className="dim">Account name</span><span className="v">Studio Marchetti FZ-LLC</span></div>
          <div className="pay-line"><span className="dim">IBAN</span><span className="v mono">AE07 0260 0010 1535 9241 802</span></div>
          <div className="pay-line"><span className="dim">SWIFT</span><span className="v mono">EBILAEAD</span></div>
          <div className="pay-line"><span className="dim">Reference</span><span className="v mono">INV-2052</span></div>
        </div>
        <div>
          <h4>Notes</h4>
          <div>Thanks for the continued partnership — sprint 5 kicks off June 2. Late payments accrue 1.5% per week after the due date, per our MSA §7.2.</div>
          <div style={{ marginTop: 14 }}>
            <span className="pill pill--success pill--dot">Pay online · craftly.app/pay/INV-2052</span>
          </div>
        </div>
      </div>

      <div className="page-num">
        <span>Studio Marchetti · TRN 100 482 931 700003</span>
        <span>Page 1 of 1</span>
      </div>
    </div>
  );
}

window.InvoiceDoc = InvoiceDoc;
