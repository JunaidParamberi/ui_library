// Craftly — Quote template
// Adds: validity banner, optional line items, accept CTA preview.

function QuoteDoc() {
  return (
    <div className="sheet">
      <div className="doc-header">
        <div className="doc-header__brand">
          <div className="brandmark">L</div>
          <div>
            <div className="doc-header__org">Studio Marchetti</div>
            <div className="doc-header__meta">
              Prepared by Lena Marchetti<br />
              lena@studiomarchetti.com · +971 50 482 9311
            </div>
          </div>
        </div>
        <div className="doc-header__right">
          <div className="doc-type">Quote</div>
          <div className="doc-type-sub">Q-0418 · v2</div>
          <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
            <span className="pill pill--dot">Awaiting client decision</span>
          </div>
        </div>
      </div>

      <div className="banner">
        <div className="banner__left">
          <div className="banner__icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 500, color: "#7A4A0C" }}>Valid until 06 June 2026</div>
            <div style={{ color: "#9A6A2E", fontSize: 11.5, marginTop: 1 }}>14 days · pricing locked at acceptance</div>
          </div>
        </div>
        <div className="banner__right">Q-0418</div>
      </div>

      <div className="parties">
        <div>
          <div className="party__label">Prepared for</div>
          <div className="party__name">Northwind Labs</div>
          <div className="party__line">
            Priya Anand, Head of Marketing<br />
            priya@northwind.io<br />
            6F Phoenix Mills, Lower Parel<br />
            Mumbai 400013, India
          </div>
        </div>
        <div>
          <div className="party__label">Project</div>
          <div className="party__name">Northwind — Landing v3</div>
          <div className="party__line">
            Estimated start: 02 Jun 2026<br />
            Duration: ~5 weeks<br />
            Team: 1 designer, 1 engineer (60%)
          </div>
        </div>
        <div>
          <div className="party__label">Summary</div>
          <div className="details-grid">
            <div className="row"><span className="dim">Subtotal</span><span className="tabular">12,800.00</span></div>
            <div className="row"><span className="dim">VAT 5%</span><span className="tabular">640.00</span></div>
            <div className="row" style={{ paddingTop: 6, marginTop: 4, borderTop: "1px solid #ECECE7", fontWeight: 500, fontSize: 14 }}>
              <span>Total AED</span><span className="tabular">13,440.00</span>
            </div>
          </div>
        </div>
      </div>

      <table className="items">
        <thead>
          <tr>
            <th>Scope</th>
            <th className="r">Qty</th>
            <th className="r">Rate</th>
            <th className="r">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className="desc-title">Discovery &amp; positioning workshop</div>
              <div className="desc-sub">Half-day remote workshop, audience map, message hierarchy.</div>
            </td>
            <td className="qty">1</td>
            <td className="rate">1,400.00</td>
            <td className="total">1,400.00</td>
          </tr>
          <tr>
            <td>
              <div className="desc-title">Visual direction — 2 routes</div>
              <div className="desc-sub">Moodboard, type pair, color set, 1 hero comp per direction.</div>
            </td>
            <td className="qty">2</td>
            <td className="rate">1,200.00</td>
            <td className="total">2,400.00</td>
          </tr>
          <tr>
            <td>
              <div className="desc-title">Landing page design (chosen route)</div>
              <div className="desc-sub">7 sections, responsive at 3 breakpoints, hover &amp; scroll states.</div>
            </td>
            <td className="qty">1</td>
            <td className="rate">3,800.00</td>
            <td className="total">3,800.00</td>
          </tr>
          <tr>
            <td>
              <div className="desc-title">Build &amp; deploy (Next.js + Vercel)</div>
              <div className="desc-sub">Component library, CMS-backed sections, custom domain setup.</div>
            </td>
            <td className="qty">1</td>
            <td className="rate">5,200.00</td>
            <td className="total">5,200.00</td>
          </tr>
          <tr>
            <td>
              <div className="desc-title">
                Motion pass — hero &amp; section reveals
                <span className="optional-tag">Optional</span>
              </div>
              <div className="desc-sub">Lottie + scroll-linked reveals. Not included in totals.</div>
            </td>
            <td className="qty">1</td>
            <td className="rate">1,600.00</td>
            <td className="total" style={{ color: "#898E96" }}>+1,600.00</td>
          </tr>
          <tr>
            <td>
              <div className="desc-title">
                Custom illustration set (8 pieces)
                <span className="optional-tag">Optional</span>
              </div>
              <div className="desc-sub">Editorial style, licensed to Northwind in perpetuity.</div>
            </td>
            <td className="qty">8</td>
            <td className="rate">240.00</td>
            <td className="total" style={{ color: "#898E96" }}>+1,920.00</td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 32, alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div className="party__label">Terms</div>
          <ul style={{ paddingLeft: 18, margin: "6px 0 0", color: "#54585F", fontSize: 12, lineHeight: 1.7 }}>
            <li>50% deposit on acceptance, balance on launch.</li>
            <li>Two rounds of revisions per design phase.</li>
            <li>Source files handed over via Figma + GitHub on final payment.</li>
            <li>Optional items can be added before kickoff at quoted rates.</li>
          </ul>
        </div>
        <div className="totals__inner">
          <div className="row"><span className="dim">Core scope</span><span className="tabular">12,800.00</span></div>
          <div className="row"><span className="dim">VAT 5%</span><span className="tabular">640.00</span></div>
          <div className="row grand"><span>Total AED</span><span className="tabular">13,440.00</span></div>
          <div className="row" style={{ fontSize: 11, color: "#898E96", marginTop: 2 }}>
            <span>With optionals</span><span className="tabular">+ 3,696.00</span>
          </div>
        </div>
      </div>

      <hr />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingTop: 24, gap: 32 }}>
        <div style={{ maxWidth: 360 }}>
          <h4 style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#898E96", marginBottom: 8 }}>To accept</h4>
          <div style={{ fontSize: 12.5, color: "#54585F", lineHeight: 1.6 }}>
            Reply to this quote inside Craftly or sign the line below. We'll
            convert it into a contract + first invoice automatically.
          </div>
          <div className="cta-row">
            <div className="cta cta--primary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg>
              Accept quote
            </div>
            <div className="cta cta--ghost">Request changes</div>
          </div>
          <div className="cta-meta">craftly.app/q/Q-0418 · expires 06 Jun 2026</div>
        </div>
        <div style={{ width: 280 }}>
          <div className="signature__label">Signed by client</div>
          <div className="signature__line" style={{ marginTop: 6 }} />
          <div className="signature__name">Name &amp; title</div>
          <div className="signature__date">Date</div>
        </div>
      </div>

      <div className="page-num">
        <span>Studio Marchetti · craftly.app/marchetti</span>
        <span>Page 1 of 1</span>
      </div>
    </div>
  );
}

window.QuoteDoc = QuoteDoc;
