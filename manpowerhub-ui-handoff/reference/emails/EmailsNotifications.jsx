// Craftly — notification / lifecycle emails.
// Some go to the client (quote sent), some to the freelancer (quote accepted,
// doc viewed, weekly digest, magic link). All map 1:1 to React Email.

/* ------------------------ 4. Quote sent (→ client) ------------------------ */

function EmailQuoteSent() {
  return (
    <div className="em-canvas">
      <div className="em-wrap">
        <div className="em-preheader">
          Your quote for the Northwind landing page — AED 13,440, valid 14 days.
        </div>
        <EmFrom name="Lena Marchetti" email="lena@studiomarchetti.com" initials="LM" />

        <div className="em-container">
          <div className="em-brand">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="em-brandmark">L</div>
              <span className="em-brand-name">Studio Marchetti</span>
            </div>
            <div className="em-meta">Q-0418</div>
          </div>

          <div className="em-section">
            <div className="em-eyebrow">Quote</div>
            <h1 className="em-h1">Here's the quote for Northwind's landing page.</h1>
            <p className="em-text em-text--muted em-text--lede">
              Hi Priya — scoped exactly as we discussed on Tuesday. Two visual
              routes, full build, and a couple of optional add-ons you can fold
              in before kickoff.
            </p>

            <div className="em-quote">
              "A five-week build to ship before your Q3 push — designed,
              built, and deployed end to end."
            </div>

            <div className="em-amount-card">
              <div className="em-amount-row">
                <span className="k">Core scope</span>
                <span className="v">12,800.00</span>
              </div>
              <div className="em-amount-row">
                <span className="k">VAT 5%</span>
                <span className="v">640.00</span>
              </div>
              <div className="em-amount-row grand">
                <span className="k" style={{ color: "#14161A", fontWeight: 500 }}>Total</span>
                <span className="v">AED 13,440.00</span>
              </div>
            </div>

            <div className="em-alert em-alert--warn">
              <div className="icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
              </div>
              <div><span className="title">Valid until 06 June 2026.</span> Pricing locks the moment you accept.</div>
            </div>

            <div className="em-btn-row">
              <a className="em-btn em-btn--primary" href="#">Review &amp; accept →</a>
              <a className="em-btn em-btn--secondary" href="#">Ask a question</a>
            </div>
            <div className="em-btn-meta">craftly.app/q/Q-0418</div>
          </div>

          <hr className="em-hr" />
          <div className="em-section em-section--tight">
            <EmAttach id="Q-0418" name="Quote — Northwind landing v3" size="96 KB" />
          </div>
        </div>

        <EmFooter />
      </div>
    </div>
  );
}

/* ------------------------ 5. Quote accepted (→ freelancer) ------------------------ */

function EmailQuoteAccepted() {
  return (
    <div className="em-canvas">
      <div className="em-wrap">
        <div className="em-preheader">
          🎉 Northwind accepted Q-0418 — AED 13,440. Time to spin up the project.
        </div>
        <EmFrom name="Craftly" email="hello@craftly.app" initials="C" />

        <div className="em-container">
          <div className="em-brand">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="em-brandmark" style={{ background: "#3550E0" }}>C</div>
              <span className="em-brand-name">Craftly</span>
            </div>
            <span className="em-pill em-pill--success em-pill--dot">Accepted</span>
          </div>

          <div className="em-section em-section--accent">
            <h1 className="em-h1">Northwind just accepted your quote.</h1>
            <p className="em-text em-text--muted em-text--lede">
              Priya Anand signed <strong>Q-0418</strong> two minutes ago. We've
              drafted the project and the 50% deposit invoice — just hit send
              when you're ready.
            </p>
          </div>

          <div className="em-section">
            <div className="em-amount-card">
              <div className="em-amount-row">
                <span className="k">Quote</span>
                <span className="v" style={{ fontFamily: "JetBrains Mono, monospace" }}>Q-0418</span>
              </div>
              <div className="em-amount-row">
                <span className="k">Client</span>
                <span className="v">Northwind Labs</span>
              </div>
              <div className="em-amount-row grand">
                <span className="k" style={{ color: "#14161A", fontWeight: 500 }}>Accepted value</span>
                <span className="v">AED 13,440.00</span>
              </div>
            </div>

            <h3 className="em-h3" style={{ marginTop: 20 }}>Craftly already did this for you</h3>
            <div className="em-row-list">
              <div className="em-row-item">
                <span className="ico ico--ok"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg></span>
                <span><span className="name">Created project</span><div className="sub">Northwind — Landing v3</div></span>
                <span className="amount em-text--dim" style={{ fontWeight: 400 }}>Done</span>
              </div>
              <div className="em-row-item">
                <span className="ico ico--accent"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg></span>
                <span><span className="name">Drafted deposit invoice</span><div className="sub">INV-2053 · 50% · AED 6,720</div></span>
                <span className="amount em-pill em-pill--accent" style={{ fontWeight: 500 }}>Review</span>
              </div>
            </div>

            <div className="em-btn-row">
              <a className="em-btn em-btn--accent" href="#">Send deposit invoice →</a>
              <a className="em-btn em-btn--secondary" href="#">Open project</a>
            </div>
          </div>
        </div>

        <EmFooter />
      </div>
    </div>
  );
}

/* ------------------------ 6. Document viewed (→ freelancer) ------------------------ */

function EmailDocViewed() {
  return (
    <div className="em-canvas">
      <div className="em-wrap">
        <div className="em-preheader">
          Onyx Ventures opened invoice INV-2052 — 3 times in the last hour.
        </div>
        <EmFrom name="Craftly" email="hello@craftly.app" initials="C" />

        <div className="em-container">
          <div className="em-brand">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="em-brandmark" style={{ background: "#3550E0" }}>C</div>
              <span className="em-brand-name">Craftly</span>
            </div>
            <span className="em-pill em-pill--accent em-pill--dot">Activity</span>
          </div>

          <div className="em-section">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#EAEEFC", color: "#3550E0", display: "grid", placeItems: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
              </div>
              <div className="em-avatars">
                <div className="avatar">DC</div>
                <div className="avatar" style={{ background: "linear-gradient(135deg,#1F8A52,#4FB87E)" }}>OV</div>
              </div>
            </div>
            <h1 className="em-h1">Onyx Ventures is looking at INV-2052.</h1>
            <p className="em-text em-text--muted">
              Dana Cole opened your invoice <strong>3 times</strong> in the last
              hour — usually a sign payment is close. Here's the timeline.
            </p>

            <div className="em-row-list" style={{ marginTop: 8 }}>
              <div className="em-row-item">
                <span className="ico ico--accent"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></span>
                <span><span className="name">Opened invoice</span><div className="sub">Just now · New York, US</div></span>
                <span className="amount em-text--dim" style={{ fontWeight: 400 }}>3rd view</span>
              </div>
              <div className="em-row-item">
                <span className="ico"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a3 3 0 0 0-3-3 3 3 0 0 0-3 3z"/></svg></span>
                <span><span className="name">Downloaded PDF</span><div className="sub">42 min ago</div></span>
                <span className="amount em-text--dim" style={{ fontWeight: 400 }}>—</span>
              </div>
              <div className="em-row-item">
                <span className="ico"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4z" opacity="0"/><path d="M22 6 12 13 2 6"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg></span>
                <span><span className="name">First opened</span><div className="sub">1 hr ago · from your email</div></span>
                <span className="amount em-text--dim" style={{ fontWeight: 400 }}>1st view</span>
              </div>
            </div>

            <div className="em-btn-row">
              <a className="em-btn em-btn--secondary" href="#">View invoice status</a>
              <a className="em-btn em-btn--secondary" href="#">Send a nudge</a>
            </div>
          </div>
        </div>

        <EmFooter />
      </div>
    </div>
  );
}

/* ------------------------ 7. Weekly digest (→ freelancer) ------------------------ */

function EmailWeeklyDigest() {
  return (
    <div className="em-canvas">
      <div className="em-wrap">
        <div className="em-preheader">
          Your week: AED 16,800 collected, 2 invoices due, 1 quote awaiting reply.
        </div>
        <EmFrom name="Craftly" email="digest@craftly.app" initials="C" />

        <div className="em-container">
          <div className="em-brand">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="em-brandmark" style={{ background: "#3550E0" }}>C</div>
              <span className="em-brand-name">Craftly</span>
            </div>
            <div className="em-meta">Week 20 · 2026</div>
          </div>

          <div className="em-section">
            <div className="em-eyebrow">Your week in review</div>
            <h1 className="em-h1">Good week, Lena — AED 16,800 landed.</h1>
            <p className="em-text em-text--muted">
              11–17 May. Cash in is up 22% on last week. Two invoices need a
              nudge and Northwind still hasn't opened your quote.
            </p>

            <div className="em-kpi-grid">
              <div className="em-kpi">
                <div className="k">Collected</div>
                <div className="v">16,800</div>
                <div className="d">↑ 22%</div>
              </div>
              <div className="em-kpi">
                <div className="k">Outstanding</div>
                <div className="v">11,250</div>
                <div className="d d--down">2 overdue</div>
              </div>
              <div className="em-kpi">
                <div className="k">Hours logged</div>
                <div className="v">34.5</div>
                <div className="d">↑ 6%</div>
              </div>
            </div>

            <h3 className="em-h3">Needs your attention</h3>
            <div className="em-row-list">
              <div className="em-row-item">
                <span className="ico ico--warn"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg></span>
                <span><span className="name">INV-2049 overdue</span><div className="sub">Hawthorn · 4 days past due</div></span>
                <span className="amount">2,850</span>
              </div>
              <div className="em-row-item">
                <span className="ico ico--warn"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg></span>
                <span><span className="name">INV-2050 due tomorrow</span><div className="sub">Maple Co. · Net 14</div></span>
                <span className="amount">8,400</span>
              </div>
              <div className="em-row-item">
                <span className="ico ico--accent"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></span>
                <span><span className="name">Q-0418 not opened</span><div className="sub">Northwind · sent 3 days ago</div></span>
                <span className="amount em-text--dim" style={{ fontWeight: 400 }}>13,440</span>
              </div>
            </div>

            <div className="em-btn-row">
              <a className="em-btn em-btn--primary" href="#">Open dashboard →</a>
            </div>
          </div>
        </div>

        <EmFooter />
      </div>
    </div>
  );
}

/* ------------------------ 8. Magic link / sign-in (→ user) ------------------------ */

function EmailMagicLink() {
  return (
    <div className="em-canvas">
      <div className="em-wrap">
        <div className="em-preheader">
          Your Craftly sign-in link — expires in 10 minutes.
        </div>
        <EmFrom name="Craftly" email="accounts@craftly.app" initials="C" />

        <div className="em-container">
          <div className="em-brand" style={{ justifyContent: "center", paddingBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="em-brandmark" style={{ background: "#3550E0" }}>C</div>
              <span className="em-brand-name">Craftly</span>
            </div>
          </div>

          <div className="em-section" style={{ textAlign: "center" }}>
            <h1 className="em-h1">Sign in to Craftly</h1>
            <p className="em-text em-text--muted" style={{ maxWidth: 380, margin: "0 auto 8px" }}>
              Tap the button below to sign in. This link works once and expires
              in 10 minutes.
            </p>

            <div className="em-btn-row" style={{ justifyContent: "center", margin: "20px 0 4px" }}>
              <a className="em-btn em-btn--accent" href="#" style={{ padding: "13px 28px" }}>Sign in to Craftly →</a>
            </div>

            <p className="em-text em-text--dim" style={{ margin: "16px 0 6px" }}>
              Or enter this code manually:
            </p>
            <div className="em-code">F4 K9 2X</div>
            <p className="em-text em-text--dim" style={{ marginBottom: 0 }}>
              Didn't request this? You can safely ignore this email — no one can
              sign in without the link.
            </p>
          </div>

          <hr className="em-hr" />
          <div className="em-section em-section--tight" style={{ textAlign: "center" }}>
            <p className="em-text em-text--dim" style={{ marginBottom: 0, fontSize: 11.5 }}>
              Requested from Dubai, UAE · Chrome on macOS · 14 May 2026, 09:42
            </p>
          </div>
        </div>

        <EmFooter />
      </div>
    </div>
  );
}

window.EmailQuoteSent = EmailQuoteSent;
window.EmailQuoteAccepted = EmailQuoteAccepted;
window.EmailDocViewed = EmailDocViewed;
window.EmailWeeklyDigest = EmailWeeklyDigest;
window.EmailMagicLink = EmailMagicLink;
