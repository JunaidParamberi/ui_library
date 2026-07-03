// Craftly — transactional emails sent to clients.
// Each component maps 1:1 to React Email <Html>/<Body>/<Container>/<Section>.

/* ------------------------ shared bits ------------------------ */

function EmFrom({ name, email, initials = "L" }) {
  return (
    <div className="em-from">
      <div className="avatar">{initials}</div>
      <div>
        <span className="name">{name}</span> <span className="addr">&lt;{email}&gt;</span>
      </div>
    </div>
  );
}

function EmFooter() {
  return (
    <div className="em-footer">
      You're receiving this because you're a client of Studio Marchetti.<br />
      <a href="#">Manage notifications</a> · <a href="#">View in browser</a>
      <div className="em-footer-brand">Sent via Craftly</div>
    </div>
  );
}

function EmAttach({ id, name, size }) {
  return (
    <div className="em-attach">
      <div className="thumb" />
      <div className="info">
        <div className="name">{name}</div>
        <div className="meta">{id} · PDF · {size}</div>
      </div>
    </div>
  );
}

window.EmFrom = EmFrom;
window.EmFooter = EmFooter;
window.EmAttach = EmAttach;

/* ------------------------ 1. Invoice sent ------------------------ */

function EmailInvoiceSent() {
  return (
    <div className="em-canvas">
      <div className="em-wrap">
        <div className="em-preheader">
          Invoice INV-2052 for AED 9,466.80 · due 28 May 2026 · review &amp; pay online.
        </div>
        <EmFrom name="Lena Marchetti" email="lena@studiomarchetti.com" initials="LM" />

        <div className="em-container">
          <div className="em-brand">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="em-brandmark">L</div>
              <span className="em-brand-name">Studio Marchetti</span>
            </div>
            <div className="em-meta">INV-2052</div>
          </div>

          <div className="em-section">
            <div className="em-eyebrow">Invoice</div>
            <h1 className="em-h1">A new invoice for the Onyx site, sprint 4.</h1>
            <p className="em-text em-text--muted em-text--lede">
              Hi Dana — invoice <strong>INV-2052</strong> covers everything we
              shipped between May 6 and May 13. Card or bank transfer, whichever's
              easier on your side.
            </p>

            <div className="em-amount-card">
              <div className="em-amount-row">
                <span className="k">Subtotal</span>
                <span className="v">9,200.00</span>
              </div>
              <div className="em-amount-row">
                <span className="k">Loyalty discount (−2%)</span>
                <span className="v">−184.00</span>
              </div>
              <div className="em-amount-row">
                <span className="k">VAT 5%</span>
                <span className="v">450.80</span>
              </div>
              <div className="em-amount-row grand">
                <span className="k" style={{ color: "#14161A", fontWeight: 500 }}>Total due</span>
                <span className="v">AED 9,466.80</span>
              </div>
            </div>

            <div className="em-kv">
              <div>
                <div className="k">Billed to</div>
                <div className="v">Onyx Ventures<br />228 Lafayette St, NY 10012</div>
              </div>
              <div>
                <div className="k">Due</div>
                <div className="v"><strong>28 May 2026</strong><br />Net 14 terms</div>
              </div>
            </div>

            <div className="em-btn-row">
              <a className="em-btn em-btn--primary" href="#">Pay invoice →</a>
              <a className="em-btn em-btn--secondary" href="#">Download PDF</a>
            </div>
            <div className="em-btn-meta">craftly.app/pay/INV-2052 · expires 28 May</div>
          </div>

          <hr className="em-hr" />
          <div className="em-section em-section--tight">
            <EmAttach id="INV-2052" name="Invoice — Onyx Ventures sprint 4" size="128 KB" />
          </div>

          <hr className="em-hr" />
          <div className="em-section em-section--tight">
            <p className="em-text em-text--dim" style={{ marginBottom: 0 }}>
              Replies go straight to my inbox — let me know if anything looks off.
              Sprint 5 brief lands Monday.
            </p>
            <p className="em-text" style={{ margin: "12px 0 0", fontSize: 13 }}>— Lena</p>
          </div>
        </div>

        <EmFooter />
      </div>
    </div>
  );
}

/* ------------------------ 2. Payment reminder ------------------------ */

function EmailPaymentReminder() {
  return (
    <div className="em-canvas">
      <div className="em-wrap">
        <div className="em-preheader">
          Friendly reminder — INV-2049 (AED 2,850) is due in 3 days.
        </div>
        <EmFrom name="Lena Marchetti" email="lena@studiomarchetti.com" initials="LM" />

        <div className="em-container">
          <div className="em-brand">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="em-brandmark">L</div>
              <span className="em-brand-name">Studio Marchetti</span>
            </div>
            <span className="em-pill em-pill--warn em-pill--dot">Reminder</span>
          </div>

          <div className="em-section">
            <h1 className="em-h1">Quick nudge — INV-2049 is due Thursday.</h1>
            <p className="em-text em-text--muted">
              Hi Reza — this is the gentle pre-due reminder for invoice
              <strong> INV-2049</strong>, originally issued April 28. Nothing
              urgent on my end, just wanted to flag it before it slips past
              the due date.
            </p>

            <div className="em-alert em-alert--warn">
              <div className="icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
                </svg>
              </div>
              <div>
                <div className="title">Due Thursday, 28 May 2026 — in 3 days</div>
                <div style={{ marginTop: 2, color: "#9A6A2E" }}>
                  Late fee of 1.5%/week applies after the due date, per our MSA.
                </div>
              </div>
            </div>

            <div className="em-amount-card">
              <div className="em-amount-row">
                <span className="k">Invoice</span>
                <span className="v" style={{ fontFamily: "JetBrains Mono, monospace" }}>INV-2049</span>
              </div>
              <div className="em-amount-row">
                <span className="k">Issued</span>
                <span className="v">28 April 2026</span>
              </div>
              <div className="em-amount-row grand">
                <span className="k" style={{ color: "#14161A", fontWeight: 500 }}>Amount due</span>
                <span className="v">AED 2,850.00</span>
              </div>
            </div>

            <div className="em-btn-row">
              <a className="em-btn em-btn--primary" href="#">Pay now →</a>
              <a className="em-btn em-btn--secondary" href="#">Reply with question</a>
            </div>
          </div>

          <hr className="em-hr" />
          <div className="em-section em-section--tight">
            <p className="em-text em-text--dim" style={{ marginBottom: 0 }}>
              If this has already been paid in the last 24h, you can ignore this
              note — bank transfers from your side usually clear overnight.
            </p>
          </div>
        </div>

        <EmFooter />
      </div>
    </div>
  );
}

/* ------------------------ 3. Payment received ------------------------ */

function EmailPaymentReceived() {
  return (
    <div className="em-canvas">
      <div className="em-wrap">
        <div className="em-preheader">
          Got it — AED 8,400 received for INV-2051. Receipt attached.
        </div>
        <EmFrom name="Lena Marchetti" email="lena@studiomarchetti.com" initials="LM" />

        <div className="em-container">
          <div className="em-brand">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="em-brandmark">L</div>
              <span className="em-brand-name">Studio Marchetti</span>
            </div>
            <span className="em-pill em-pill--success em-pill--dot">Paid</span>
          </div>

          <div className="em-section em-section--accent" style={{ background: "linear-gradient(180deg, #E6F2EB 0%, #ffffff 100%)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "#1F8A52", color: "#fff",
                display: "grid", placeItems: "center",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg>
              </div>
              <div className="em-eyebrow" style={{ margin: 0 }}>Payment received</div>
            </div>
            <h1 className="em-h1">Thanks, Theo — payment landed today.</h1>
            <p className="em-text em-text--muted em-text--lede">
              We've recorded <strong>AED 8,400.00</strong> against invoice
              <strong> INV-2051</strong>. Receipt PV-0218 is attached for your
              records.
            </p>
          </div>

          <div className="em-section">
            <div className="em-amount-card">
              <div className="em-amount-row">
                <span className="k">Received</span>
                <span className="v" style={{ fontWeight: 500 }}>14 May 2026 · SWIFT</span>
              </div>
              <div className="em-amount-row">
                <span className="k">Bank reference</span>
                <span className="v" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12 }}>EBL/2026/05/14/948817</span>
              </div>
              <div className="em-amount-row">
                <span className="k">Applied to</span>
                <span className="v" style={{ fontFamily: "JetBrains Mono, monospace" }}>INV-2051</span>
              </div>
              <div className="em-amount-row grand">
                <span className="k" style={{ color: "#14161A", fontWeight: 500 }}>Amount</span>
                <span className="v">AED 8,400.00</span>
              </div>
            </div>

            <div className="em-alert em-alert--ok" style={{ marginTop: 12 }}>
              <div className="icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg>
              </div>
              <div>
                <div className="title">Hawthorn account is fully settled.</div>
                <div style={{ marginTop: 2, color: "#1F6E40" }}>Sprint 4 invoice goes out on May 26.</div>
              </div>
            </div>

            <div className="em-btn-row">
              <a className="em-btn em-btn--secondary" href="#">Download receipt</a>
              <a className="em-btn em-btn--secondary" href="#">View account</a>
            </div>
          </div>

          <hr className="em-hr" />
          <div className="em-section em-section--tight">
            <EmAttach id="PV-0218" name="Payment voucher — Hawthorn sprint 3" size="84 KB" />
          </div>
        </div>

        <EmFooter />
      </div>
    </div>
  );
}

window.EmailInvoiceSent = EmailInvoiceSent;
window.EmailPaymentReminder = EmailPaymentReminder;
window.EmailPaymentReceived = EmailPaymentReceived;
