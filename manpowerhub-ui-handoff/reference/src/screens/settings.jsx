// ManpowerHub — Settings
const { useState: useStateS } = React;

function Settings({ goto }) {
  const [tab, setTab] = useStateS("brand");

  return (
    <div className="page">
      <div className="page__header fade-up">
        <div>
          <h1 className="page__title">Settings</h1>
          <div className="page__subtitle">ManpowerHub FZCO · Enterprise plan · Junaid Al-Rashid</div>
        </div>
      </div>

      <div className="tabs fade-up delay-1">
        <div className="tabs__item" data-active={tab === "brand"} onClick={() => setTab("brand")}>Brand kit</div>
        <div className="tabs__item" data-active={tab === "billing"} onClick={() => setTab("billing")}>Billing & plan</div>
        <div className="tabs__item" data-active={tab === "team"} onClick={() => setTab("team")}>Team</div>
        <div className="tabs__item" data-active={tab === "ai"} onClick={() => setTab("ai")}>AI agents</div>
        <div className="tabs__item">Profile</div>
        <div className="tabs__item">Notifications</div>
      </div>

      {tab === "brand"   && <BrandKit />}
      {tab === "billing" && <Billing />}
      {tab === "team"    && <Placeholder title="Team" sub="Invite up to 5 members on Agency plan." />}
      {tab === "ai"      && <AIAgents />}
    </div>
  );
}

function BrandKit() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, alignItems: "flex-start" }}>
      <section className="card fade-up">
        <div className="card__header"><div className="card__title">Brand kit</div></div>
        <div className="card__body" style={{ display: "grid", gap: 20 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Logo</div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{
                width: 64, height: 64, borderRadius: 12,
                background: "var(--fg)", color: "var(--bg-surface)",
                display: "grid", placeItems: "center",
                fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 700, letterSpacing: "-0.04em",
              }}>L</div>
              <div>
                <button className="btn btn--secondary btn--sm" style={{ marginRight: 6 }}><Icon.Upload size={12} />Replace</button>
                <button className="btn btn--ghost btn--sm">Remove</button>
                <div className="dim" style={{ fontSize: 11.5, marginTop: 8 }}>PNG · 512×512 recommended</div>
              </div>
            </div>
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Colors</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="field">
                <label className="field__label">Primary</label>
                <div className="input" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 5, background: "#10b981", border: "1px solid var(--border)" }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>#10b981</span>
                </div>
              </div>
              <div className="field">
                <label className="field__label">Accent</label>
                <div className="input" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 5, background: "#059669", border: "1px solid var(--border)" }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>#059669</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="field">
              <label className="field__label">Studio name</label>
              <input className="input" defaultValue="ManpowerHub FZCO" />
            </div>
            <div className="field">
              <label className="field__label">Document font</label>
              <div className="input" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Geist · JetBrains Mono</span><Icon.ChevronDown size={13} />
              </div>
            </div>
          </div>
          <div className="field">
            <label className="field__label">Email signature</label>
            <textarea className="input" defaultValue={"Junaid Al-Rashid\nManpowerHub FZCO — Workforce Management\njunaid@manpowerhub.ae · +971 50 100 2847"} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button className="btn btn--ghost">Discard</button>
            <button className="btn btn--primary"><Icon.Check size={13} />Save changes</button>
          </div>
        </div>
      </section>

      {/* Live preview */}
      <aside className="card fade-up delay-1" style={{ position: "sticky", top: 16 }}>
        <div className="card__header">
          <div className="card__title">Preview</div>
          <span className="badge badge--accent">Invoice</span>
        </div>
        <div style={{ padding: 18, background: "var(--bg-subtle)" }}>
          <div style={{
            background: "var(--bg-surface)", padding: 18,
            borderRadius: 8, boxShadow: "var(--shadow-sm)",
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              background: "var(--accent)", color: "#fff",
              display: "grid", placeItems: "center",
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, marginBottom: 12,
            }}>M</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600 }}>ManpowerHub FZCO</div>
            <div className="dim" style={{ fontSize: 11, marginTop: 2 }}>junaid@manpowerhub.ae</div>
            <hr style={{ margin: "14px 0" }} />
            <div style={{
              fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600,
              letterSpacing: "-0.022em", marginBottom: 8,
            }}>PI KAT/2026/05/024</div>
            <div className="dim" style={{ fontSize: 11.5 }}>Al Naboodah · AED 14,385</div>
            <div style={{
              marginTop: 14, padding: "8px 12px",
              background: "#3550E0", color: "#fff",
              borderRadius: 6, fontSize: 12, fontWeight: 500, textAlign: "center",
            }}>Pay invoice →</div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Billing() {
  const plans = [
    { id: "free",    name: "Free",    price: "$0",   per: "/mo", features: ["3 clients", "5 docs/month", "Router + Doc Writer", "20 AI actions"] },
    { id: "starter", name: "Starter", price: "$19",  per: "/mo", features: ["15 clients", "Unlimited docs", "Agents 1–4", "100 AI actions"] },
    { id: "pro",     name: "Pro",     price: "$49",  per: "/mo", features: ["Unlimited everything", "All agents 0–7", "Custom portal domain", "API access"], current: true, recommended: true },
    { id: "agency",  name: "Agency",  price: "$99",  per: "/mo", features: ["Pro + 5 members", "Shared workspace", "White-label portal", "Priority support"] },
  ];

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <section className="card fade-up" style={{ padding: 20, background: "linear-gradient(135deg, var(--accent-soft), var(--bg-surface) 70%)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10, background: "var(--accent)",
            color: "#fff", display: "grid", placeItems: "center",
          }}>
            <Icon.Zap size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600 }}>You're on Enterprise</div>
            <div className="dim" style={{ fontSize: 12.5, marginTop: 2 }}>Next billing Jul 1 · AED 1,490.00 / month</div>
          </div>
          <button className="btn btn--secondary"><Icon.CreditCard size={13} />Manage</button>
          <button className="btn btn--ghost">Cancel</button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {plans.map((p, i) => (
          <div key={p.id} className={`card fade-up delay-${i + 1}`} style={{
            padding: 18, position: "relative", display: "flex", flexDirection: "column", gap: 14,
            borderColor: p.current ? "var(--fg)" : "var(--border)",
            background: p.recommended ? "linear-gradient(180deg, var(--bg-surface), var(--bg-subtle))" : "var(--bg-surface)",
            boxShadow: p.current ? "var(--shadow-md)" : "var(--shadow-xs)",
          }}>
            {p.recommended && (
              <div style={{
                position: "absolute", top: -10, right: 14,
                background: "var(--fg)", color: "var(--bg-surface)",
                padding: "3px 8px", borderRadius: 99, fontSize: 10.5, fontWeight: 600,
              }}>Recommended</div>
            )}
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600 }}>{p.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 6 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, letterSpacing: "-0.025em" }}>{p.price}</span>
                <span className="dim" style={{ fontSize: 12 }}>{p.per}</span>
              </div>
            </div>
            <div style={{ display: "grid", gap: 7, flex: 1 }}>
              {p.features.map((f) => (
                <div key={f} style={{ display: "flex", gap: 6, fontSize: 12.5 }}>
                  <Icon.Check size={13} stroke={2} />
                  <span>{f}</span>
                </div>
              ))}
            </div>
            {p.current
              ? <button className="btn btn--secondary" disabled style={{ width: "100%" }}>Current plan</button>
              : <button className="btn btn--ghost" style={{ width: "100%", border: "1px solid var(--border)" }}>
                  {p.id === "free" || p.id === "starter" ? "Downgrade" : "Upgrade"}
                </button>}
          </div>
        ))}
      </div>

      {/* Usage */}
      <section className="card fade-up">
        <div className="card__header"><div className="card__title">Usage this month</div></div>
        <div className="card__body" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
          {[
            { label: "AI actions",     used: 124, total: 1000 },
            { label: "Documents sent", used: 18,  total: 999 },
            { label: "Storage",        used: 1.2, total: 10, unit: "GB" },
          ].map((u) => (
            <div key={u.label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12.5, color: "var(--fg-2)" }}>{u.label}</span>
                <span className="tabular" style={{ fontSize: 12 }}>
                  <strong>{u.used}{u.unit ? ` ${u.unit}` : ""}</strong>{" "}
                  <span className="dim">/ {u.total}{u.unit ? ` ${u.unit}` : ""}</span>
                </span>
              </div>
              <Progress value={u.used / u.total} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function AIAgents() {
  const agents = [
    { id: 0, name: "Router Agent",          model: "Haiku",  tier: "All",        desc: "Classifies every Cmd+K query and routes to the right agent." },
    { id: 1, name: "Document Writer",       model: "Sonnet", tier: "All",        desc: "Drafts quotations, proforma invoices, and cover letters." },
    { id: 2, name: "Payroll Agent",         model: "Haiku",  tier: "All",        desc: "Processes payroll cycles, flags anomalies, confirms hours." },
    { id: 3, name: "Planning Agent",        model: "Haiku",  tier: "Enterprise", desc: "Auto-allocates workers to sites based on demand and skills." },
    { id: 4, name: "Compliance Agent",      model: "Haiku",  tier: "Enterprise", desc: "Tracks visa expiries, safety docs, and regulatory deadlines." },
    { id: 5, name: "Relationship Manager",  model: "Haiku",  tier: "Enterprise", desc: "Client health scores, follow-up suggestions, churn signals." },
    { id: 6, name: "Finance Analyst",       model: "Sonnet", tier: "Enterprise", desc: "Revenue Q&A, cashflow forecasting, invoice anomalies." },
    { id: 7, name: "Business Strategist",   model: "Opus",   tier: "Enterprise", desc: "Monthly operational briefing and strategic recommendations." },
  ];

  return (
    <section className="card fade-up">
      <div className="card__header">
        <div className="card__title">AI agent fleet</div>
        <span className="dim" style={{ fontSize: 12 }}>Toggle agents · view system prompts · audit costs</span>
      </div>
      <div style={{ padding: "0 0 8px" }}>
        {agents.map((a) => (
          <div key={a.id} style={{
            display: "grid", gridTemplateColumns: "auto 1fr auto auto auto",
            gap: 14, alignItems: "center",
            padding: "14px 18px", borderBottom: "1px solid var(--border)",
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: a.model === "Opus" ? "linear-gradient(135deg, var(--accent), #34d399)" :
                           a.model === "Sonnet" ? "var(--accent-soft-2)" : "var(--bg-subtle)",
              color: a.model === "Opus" ? "#fff" : "var(--accent)",
              display: "grid", placeItems: "center",
            }}>
              <Icon.Sparkles size={15} />
            </div>
            <div>
              <div style={{ fontWeight: 500 }}>{a.name}</div>
              <div className="dim" style={{ fontSize: 12, marginTop: 2 }}>{a.desc}</div>
            </div>
            <span className="badge badge--outline" style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}>{a.model}</span>
            <span className="badge">{a.tier}</span>
            <div style={{
              width: 32, height: 18, borderRadius: 99,
              background: "var(--accent)", padding: 2,
              display: "flex", justifyContent: "flex-end",
            }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff" }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Placeholder({ title, sub }) {
  return (
    <div className="card fade-up" style={{ padding: 60, textAlign: "center" }}>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, marginBottom: 8 }}>{title}</h3>
      <div className="dim">{sub}</div>
    </div>
  );
}

window.Screens = window.Screens || {};
window.Screens.Settings = Settings;
