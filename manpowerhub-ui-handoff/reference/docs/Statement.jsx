// Craftly — Statement of Account
// Period summary across one client. Includes aging buckets + transaction ledger.

function StatementDoc() {
  return (
    <div className="sheet">
      <div className="doc-header">
        <div className="doc-header__brand">
          <div className="brandmark">L</div>
          <div>
            <div className="doc-header__org">Studio Marchetti</div>
            <div className="doc-header__meta">
              lena@studiomarchetti.com · TRN 100 482 931 700003
            </div>
          </div>
        </div>
        <div className="doc-header__right">
          <div className="doc-type">Statement</div>
          <div className="doc-type-sub">SOA-0042 · 01 Apr — 14 May 2026</div>
        </div>
      </div>

      <div className="parties" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div>
          <div className="party__label">Account</div>
          <div className="party__name">Hawthorn &amp; Co</div>
          <div className="party__line">
            Theo Bramwell · theo@hawthorn.co<br />
            17 Charlotte Mews, London W1T 4DZ, UK
          </div>
        </div>
        <div>
          <div className="party__label">Statement details</div>
          <div className="details-grid">
            <div className="row"><span className="dim">Period</span><span className="tabular">01 Apr — 14 May 2026</span></div>
            <div className="row"><span className="dim">Issued</span><span className="tabular">14 May 2026</span></div>
            <div className="row"><span className="dim">Currency</span><span>AED</span></div>
            <div className="row"><span className="dim">Account manager</span><span>Lena Marchetti</span></div>
          </div>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat">
          <div className="k">Opening balance</div>
          <div className="v">AED 4,200</div>
        </div>
        <div className="stat">
          <div className="k">Invoiced</div>
          <div className="v">+ 26,800</div>
        </div>
        <div className="stat stat--ok">
          <div className="k">Received</div>
          <div className="v">− 28,150</div>
        </div>
        <div className="stat">
          <div className="k">Closing balance</div>
          <div className="v">AED 2,850</div>
        </div>
      </div>

      <div className="party__label" style={{ marginBottom: 8 }}>Aging — outstanding balance</div>
      <div className="aging-bar">
        <span style={{ width: "0%",  background: "#1F8A52" }} />
        <span style={{ width: "0%",  background: "#3550E0" }} />
        <span style={{ width: "100%", background: "#B36A12" }} />
        <span style={{ width: "0%",  background: "#C13838" }} />
      </div>
      <div className="aging-legend">
        <div className="item"><span className="swatch" style={{ background: "#1F8A52" }} />Current · 0</div>
        <div className="item"><span className="swatch" style={{ background: "#3550E0" }} />1–30d · 0</div>
        <div className="item"><span className="swatch" style={{ background: "#B36A12" }} />31–60d · <strong>AED 2,850</strong></div>
        <div className="item"><span className="swatch" style={{ background: "#C13838" }} />60d+ · 0</div>
      </div>

      <div style={{ height: 24 }} />

      <div className="party__label" style={{ marginBottom: 8 }}>Transactions</div>
      <table className="allocations">
        <thead>
          <tr>
            <th>Date</th>
            <th>Reference</th>
            <th>Description</th>
            <th className="r">Charge</th>
            <th className="r">Credit</th>
            <th className="r">Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="dim">01 Apr</td>
            <td><span className="mono-id">—</span></td>
            <td>Opening balance carried forward</td>
            <td className="r tabular dim">—</td>
            <td className="r tabular dim">—</td>
            <td className="r tabular">4,200.00</td>
          </tr>
          <tr>
            <td className="dim">12 Apr</td>
            <td><span className="mono-id">INV-2046</span></td>
            <td>Hawthorn rebrand — sprint 1</td>
            <td className="r tabular">11,400.00</td>
            <td className="r tabular dim">—</td>
            <td className="r tabular">15,600.00</td>
          </tr>
          <tr>
            <td className="dim">22 Apr</td>
            <td><span className="mono-id">PV-0214</span></td>
            <td>Bank transfer received</td>
            <td className="r tabular dim">—</td>
            <td className="r tabular" style={{ color: "#1F8A52" }}>15,600.00</td>
            <td className="r tabular">0.00</td>
          </tr>
          <tr>
            <td className="dim">28 Apr</td>
            <td><span className="mono-id">INV-2049</span></td>
            <td>Hawthorn rebrand — sprint 2</td>
            <td className="r tabular">2,850.00</td>
            <td className="r tabular dim">—</td>
            <td className="r tabular">2,850.00</td>
          </tr>
          <tr>
            <td className="dim">12 May</td>
            <td><span className="mono-id">INV-2051</span></td>
            <td>Hawthorn rebrand — sprint 3</td>
            <td className="r tabular">8,400.00</td>
            <td className="r tabular dim">—</td>
            <td className="r tabular">11,250.00</td>
          </tr>
          <tr>
            <td className="dim">14 May</td>
            <td><span className="mono-id">PV-0218</span></td>
            <td>Bank transfer received (SWIFT)</td>
            <td className="r tabular dim">—</td>
            <td className="r tabular" style={{ color: "#1F8A52" }}>8,400.00</td>
            <td className="r tabular">2,850.00</td>
          </tr>
          <tr style={{ background: "#FBFBF9" }}>
            <td style={{ fontWeight: 500 }}>14 May</td>
            <td><span className="mono-id">—</span></td>
            <td style={{ fontWeight: 500 }}>Closing balance</td>
            <td className="r tabular dim">—</td>
            <td className="r tabular dim">—</td>
            <td className="r tabular" style={{ fontWeight: 600, fontSize: 14 }}>2,850.00</td>
          </tr>
        </tbody>
      </table>

      <div className="doc-footer" style={{ marginTop: 24 }}>
        <div>
          <h4>Action required</h4>
          <div>
            <strong style={{ color: "#B36A12" }}>INV-2049</strong> (AED 2,850) was due 12 May and is now <strong>4 days overdue</strong>.
            Please settle by 21 May to avoid a 1.5% late fee per our MSA §7.2.
          </div>
          <div style={{ marginTop: 14 }}>
            <span className="pill pill--accent pill--dot">Pay open balance · craftly.app/pay/hawthorn</span>
          </div>
        </div>
        <div>
          <h4>How to pay</h4>
          <div className="pay-line"><span className="dim">Bank</span><span className="v">Emirates NBD</span></div>
          <div className="pay-line"><span className="dim">IBAN</span><span className="v mono">AE07 0260 0010 1535 9241 802</span></div>
          <div className="pay-line"><span className="dim">SWIFT</span><span className="v mono">EBILAEAD</span></div>
          <div className="pay-line"><span className="dim">Reference</span><span className="v mono">INV-2049</span></div>
        </div>
      </div>

      <div className="page-num">
        <span>Statement is informational — not a tax invoice.</span>
        <span>SOA-0042 · Page 1 of 1</span>
      </div>
    </div>
  );
}

window.StatementDoc = StatementDoc;
