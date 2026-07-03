// Craftly — LPO (Local Purchase Order)
// An INBOUND authorisation: the client issues this PO to the studio, committing to
// the spend. Recorded in Craftly, linked to a project, and surfaced in the portal.
// Accent band + client brandmark signal that this document originates with the buyer.
// Number OX-2026-04 matches the PO referenced on INV-2052 — same engagement.

function LPODoc() {
  return (
    <div className="sheet">
      <div className="lpo-band">
        <div className="doc-header__brand">
          <div className="brandmark">O</div>
          <div>
            <div className="doc-header__org">Onyx Ventures</div>
            <div className="doc-header__meta">
              Procurement · Dana Cole<br />
              dana@onyx.vc · +1 212 555 0148<br />
              228 Lafayette St, 4F, New York, NY 10012, USA
            </div>
          </div>
        </div>
        <div className="doc-header__right">
          <div className="doc-type">Purchase order</div>
          <div className="doc-type-sub">LPO · OX-2026-04</div>
          <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
            <span className="pill pill--accent pill--dot">Authorised · received in Craftly</span>
          </div>
        </div>
      </div>

      <div className="parties">
        <div>
          <div className="party__label">Issued to (supplier)</div>
          <div className="party__name">Studio Marchetti FZ-LLC</div>
          <div className="party__line">
            Attn: Lena Marchetti<br />
            DIFC Gate Avenue, Office 412, Dubai<br />
            TRN 100 482 931 700003
          </div>
        </div>
        <div>
          <div className="party__label">Project &amp; engagement</div>
          <div className="party__name">Onyx — Site v2</div>
          <div className="party__line">
            Sprint 4 of 5 · Build &amp; polish<br />
            Against quote <span className="mono">Q-0418</span><br />
            Under MSA dated 4 Feb 2026
          </div>
        </div>
        <div>
          <div className="party__label">Details</div>
          <div className="details-grid">
            <div className="row"><span className="dim">Raised</span><span className="tabular">06 May 2026</span></div>
            <div className="row"><span className="dim">Valid until</span><span className="tabular" style={{ fontWeight: 500 }}>30 Jun 2026</span></div>
            <div className="row"><span className="dim">Terms</span><span>Net 14</span></div>
            <div className="row"><span className="dim">Currency</span><span>AED</span></div>
            <div className="row"><span className="dim">Cost centre</span><span className="mono" style={{ fontSize: 11.5 }}>MKT-WEB-26</span></div>
          </div>
        </div>
      </div>

      <div className="authband">
        <div>
          <div className="authband__label">What this order authorises</div>
          <div className="authband__note">
            Approved spend against quote <span className="mono">Q-0418</span> for the work below.
            All invoices must reference <span className="mono">OX-2026-04</span> and may not exceed the authorised total without a revised PO.
          </div>
        </div>
        <div className="authband__value">
          <div className="cap">Authorised total</div>
          <div className="v">AED 10,000.00</div>
        </div>
      </div>

      <div className="party__label" style={{ marginBottom: 8 }}>Ordered items</div>
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
              <div className="desc-title">Engineering pairing — capped at 12 sessions</div>
              <div className="desc-sub">90-min calls with the Onyx eng team, billed as logged in Craftly.</div>
            </td>
            <td className="qty">12</td>
            <td className="rate">220.00</td>
            <td className="total">2,640.00</td>
          </tr>
          <tr>
            <td>
              <div className="desc-title">Post-launch tweaks, QA &amp; contingency</div>
              <div className="desc-sub">Mobile fixes, OG image set, analytics handoff. Drawn down as needed.</div>
            </td>
            <td className="qty">1</td>
            <td className="rate">880.00</td>
            <td className="total">880.00</td>
          </tr>
        </tbody>
      </table>

      <div className="totals">
        <div className="totals__inner">
          <div className="row"><span className="dim">Subtotal</span><span className="tabular">9,520.00</span></div>
          <div className="row"><span className="dim">VAT 5%</span><span className="tabular">476.00</span></div>
          <div className="row"><span className="dim">Rounding to PO cap</span><span className="tabular">4.00</span></div>
          <div className="row grand"><span>Authorised (AED)</span><span className="tabular">10,000.00</span></div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 32, marginBottom: 8 }}>
        <div>
          <div className="party__label" style={{ marginBottom: 10 }}>Terms of this order</div>
          <div className="checklist">
            <div className="item">
              <div className="box" />
              <div>Invoice on milestone completion; quote <span className="mono">OX-2026-04</span> as the PO reference on every invoice.</div>
            </div>
            <div className="item">
              <div className="box" />
              <div>Deliver via the Onyx Figma workspace and shared Drive; no email attachments over 25&nbsp;MB.</div>
            </div>
            <div className="item">
              <div className="box" />
              <div>Engineering pairing capped at 12 sessions — overage requires a revised PO before work proceeds.</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div className="qr" />
          <div style={{ fontSize: 11.5, color: "#54585F", lineHeight: 1.55 }}>
            <div className="party__label" style={{ marginBottom: 6 }}>View in client portal</div>
            craftly.app/p/OX-2026-04<br />
            Linked to invoice <span className="mono">INV-2052</span><br />
            <span className="mono" style={{ fontSize: 11 }}>Received 06 May 2026</span>
          </div>
        </div>
      </div>

      <div className="signatures">
        <div>
          <div className="signature__label">Authorised by (Onyx Ventures)</div>
          <div className="signature__line signed" />
          <div className="signature__name">Dana Cole — Head of Procurement</div>
          <div className="signature__date">06 May 2026</div>
        </div>
        <div>
          <div className="signature__label">Accepted by (Studio Marchetti)</div>
          <div className="signature__line signed" />
          <div className="signature__name">Lena Marchetti — Principal</div>
          <div className="signature__date">07 May 2026</div>
        </div>
      </div>

      <div className="page-num">
        <span>Purchase order issued by Onyx Ventures · governs work under the MSA dated 4 Feb 2026.</span>
        <span>OX-2026-04 · Page 1 of 1</span>
      </div>
    </div>
  );
}

window.LPODoc = LPODoc;
