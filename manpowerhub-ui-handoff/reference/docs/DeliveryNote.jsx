// Craftly — Delivery Note
// Confirms what was handed over. No prices — just items, owner, sign-off.

function DeliveryNoteDoc() {
  return (
    <div className="sheet">
      <div className="doc-header">
        <div className="doc-header__brand">
          <div className="brandmark">L</div>
          <div>
            <div className="doc-header__org">Studio Marchetti</div>
            <div className="doc-header__meta">
              lena@studiomarchetti.com · +971 50 482 9311<br />
              DIFC Gate Avenue, Office 412, Dubai
            </div>
          </div>
        </div>
        <div className="doc-header__right">
          <div className="doc-type">Delivery note</div>
          <div className="doc-type-sub">DN-0078 · for INV-2051</div>
          <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
            <span className="pill pill--success pill--dot">Handover complete</span>
          </div>
        </div>
      </div>

      <div className="parties">
        <div>
          <div className="party__label">Delivered to</div>
          <div className="party__name">Hawthorn &amp; Co</div>
          <div className="party__line">
            Theo Bramwell, Director<br />
            17 Charlotte Mews<br />
            London W1T 4DZ, UK
          </div>
        </div>
        <div>
          <div className="party__label">Project</div>
          <div className="party__name">Hawthorn rebrand — sprint 3</div>
          <div className="party__line">
            Phase: Identity finalisation<br />
            Channel: Figma workspace + Drive<br />
            Linked invoice <span className="mono">INV-2051</span>
          </div>
        </div>
        <div>
          <div className="party__label">Details</div>
          <div className="details-grid">
            <div className="row"><span className="dim">Delivered</span><span className="tabular" style={{ fontWeight: 500 }}>12 May 2026</span></div>
            <div className="row"><span className="dim">By</span><span>Lena Marchetti</span></div>
            <div className="row"><span className="dim">Received by</span><span>Theo Bramwell</span></div>
            <div className="row"><span className="dim">Files</span><span className="tabular">38 items · 412 MB</span></div>
            <div className="row"><span className="dim">Format</span><span>Figma, PDF, SVG, OTF</span></div>
          </div>
        </div>
      </div>

      <div className="party__label" style={{ marginBottom: 8 }}>Items delivered</div>
      <table className="items">
        <thead>
          <tr>
            <th>Description</th>
            <th className="r">Format</th>
            <th className="r">Qty</th>
            <th className="r">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className="desc-title">Final logo system — primary, secondary, monogram</div>
              <div className="desc-sub">Locked vectors with clear-space guidelines and minimum sizes.</div>
            </td>
            <td className="rate">SVG · PDF</td>
            <td className="qty">12</td>
            <td className="total" style={{ color: "#1F8A52", fontWeight: 500 }}>Delivered</td>
          </tr>
          <tr>
            <td>
              <div className="desc-title">Typography license &amp; web font files</div>
              <div className="desc-sub">Söhne Buch + Halbfett, licensed to Hawthorn for web &amp; print.</div>
            </td>
            <td className="rate">OTF · WOFF2</td>
            <td className="qty">4</td>
            <td className="total" style={{ color: "#1F8A52", fontWeight: 500 }}>Delivered</td>
          </tr>
          <tr>
            <td>
              <div className="desc-title">Color &amp; texture system</div>
              <div className="desc-sub">12 swatches, ASE/Sketch palette, three repeating textures at 2× &amp; 3×.</div>
            </td>
            <td className="rate">ASE · PNG</td>
            <td className="qty">15</td>
            <td className="total" style={{ color: "#1F8A52", fontWeight: 500 }}>Delivered</td>
          </tr>
          <tr>
            <td>
              <div className="desc-title">Brand guidelines — interactive</div>
              <div className="desc-sub">Hosted at brand.hawthorn.co · editor access for Hawthorn team.</div>
            </td>
            <td className="rate">Web</td>
            <td className="qty">1</td>
            <td className="total" style={{ color: "#1F8A52", fontWeight: 500 }}>Delivered</td>
          </tr>
          <tr>
            <td>
              <div className="desc-title">Application templates</div>
              <div className="desc-sub">Letterhead, business card, email signature, deck cover, social set.</div>
            </td>
            <td className="rate">Figma · INDD</td>
            <td className="qty">6</td>
            <td className="total" style={{ color: "#1F8A52", fontWeight: 500 }}>Delivered</td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 24 }}>
        <div>
          <div className="party__label" style={{ marginBottom: 8 }}>Acceptance checklist</div>
          <div className="checklist">
            <div className="item checked">
              <div className="box">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg>
              </div>
              <div>All files accessible — link tested, no expired permissions</div>
            </div>
            <div className="item checked">
              <div className="box">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg>
              </div>
              <div>Logo lockups match the approved May 8 review</div>
            </div>
            <div className="item checked">
              <div className="box">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg>
              </div>
              <div>Font license registered to Hawthorn &amp; Co</div>
            </div>
            <div className="item">
              <div className="box" />
              <div>Brand site editor invitation accepted (sent to theo@hawthorn.co)</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div className="qr" />
          <div style={{ fontSize: 11.5, color: "#54585F", lineHeight: 1.55 }}>
            <div className="party__label" style={{ marginBottom: 6 }}>Open delivery bundle</div>
            craftly.app/d/DN-0078<br />
            Expires 12 August 2026<br />
            <span className="mono" style={{ fontSize: 11 }}>SHA-256 a7c…9b2</span>
          </div>
        </div>
      </div>

      <div className="signatures">
        <div>
          <div className="signature__label">Released by</div>
          <div className="signature__line signed" />
          <div className="signature__name">Lena Marchetti — Studio Marchetti</div>
          <div className="signature__date">12 May 2026</div>
        </div>
        <div>
          <div className="signature__label">Received by</div>
          <div className="signature__line" />
          <div className="signature__name">Theo Bramwell — Hawthorn &amp; Co</div>
          <div className="signature__date">__ / __ / 2026</div>
        </div>
      </div>

      <div className="page-num">
        <span>This document confirms handover. It is not a tax invoice.</span>
        <span>DN-0078 · Page 1 of 1</span>
      </div>
    </div>
  );
}

window.DeliveryNoteDoc = DeliveryNoteDoc;
