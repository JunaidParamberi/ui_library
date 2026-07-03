// ManpowerHub — Sites (portfolio redesign)
const { useState: useStatePr } = React;

// Per-site display extras (derived; MockData.pipeline is the shared source of truth)
const SITE_META = {
  p1: { location: "Downtown Dubai",      workers: 142, cap: 160, manager: "Junaid Al-Rashid",  trades: ["Civil", "MEP", "Safety"] },
  p2: { location: "Al Quoz, Dubai",      workers: 88,  cap: 120, manager: "Mariam Haddad",     trades: ["Industrial", "Logistics"] },
  p3: { location: "Business Bay",        workers: 24,  cap: 40,  manager: "Omar Farouk",       trades: ["Maintenance"] },
  p4: { location: "Dubai Festival City", workers: 61,  cap: 90,  manager: "Nasser Al Mansoori", trades: ["Civil", "Safety"] },
  p5: { location: "Yas Island, AUH",     workers: 30,  cap: 140, manager: "Faisal Al Hammadi",  trades: ["Civil", "Finishing"] },
};

function riskTone(risk) {
  return risk === "high" ? "var(--danger)" : risk === "med" ? "var(--warning)" : "var(--success)";
}
function parseAED(v) {
  return Number(String(v).replace(/[^0-9.]/g, "")) || 0;
}

function Projects({ goto }) {
  const [view, setView] = useStatePr("board");
  const sites = MockData.pipeline;

  const totalValue   = sites.reduce((s, p) => s + parseAED(p.value), 0);
  const totalWorkers = sites.reduce((s, p) => s + (SITE_META[p.id]?.workers || 0), 0);
  const atRisk       = sites.filter((p) => p.risk === "high").length;

  return (
    <div className="page" style={{ maxWidth: 1340, padding: "36px 40px 96px" }}>
      <div className="page__header fade-up">
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Operations · Portfolio</div>
          <h1 className="page__title">Sites</h1>
          <div className="page__subtitle" style={{ marginTop: 4 }}>
            {sites.length} active sites across Dubai & Abu Dhabi
          </div>
        </div>
        <div className="page__actions">
          <div style={{ display: "flex", padding: 2, background: "var(--bg-subtle)", borderRadius: 8, border: "1px solid var(--border)" }}>
            <button className="btn btn--ghost btn--sm" style={{ background: view === "board" ? "var(--bg-surface)" : "transparent", boxShadow: view === "board" ? "var(--shadow-xs)" : "none", height: 26 }} onClick={() => setView("board")}>
              <Icon.Layers size={12} />Board
            </button>
            <button className="btn btn--ghost btn--sm" style={{ background: view === "list" ? "var(--bg-surface)" : "transparent", boxShadow: view === "list" ? "var(--shadow-xs)" : "none", height: 26 }} onClick={() => setView("list")}>
              <Icon.ListIcon size={12} />List
            </button>
          </div>
          <button className="btn btn--primary"><Icon.Plus size={14} />New site</button>
        </div>
      </div>

      {/* Portfolio stats */}
      <div className="sites-stats fade-up delay-1">
        <div className="sites-stat">
          <div className="sites-stat__label">Active sites</div>
          <div className="sites-stat__value">{sites.length}</div>
          <div className="sites-stat__sub">{sites.filter(s => s.status === "active").length} in progress · {sites.filter(s => s.status === "planning").length} planning</div>
        </div>
        <div className="sites-stat">
          <div className="sites-stat__label">Contract value in flight</div>
          <div className="sites-stat__value">AED {totalValue.toLocaleString()}</div>
          <div className="sites-stat__sub">Across all engagements</div>
        </div>
        <div className="sites-stat">
          <div className="sites-stat__label">Workers deployed</div>
          <div className="sites-stat__value">{totalWorkers.toLocaleString()}</div>
          <div className="sites-stat__sub">of 2,847 total workforce</div>
        </div>
        <div className="sites-stat">
          <div className="sites-stat__label" style={{ color: atRisk ? "var(--danger)" : "var(--fg-3)" }}>
            {atRisk > 0 && <Icon.AlertTriangle size={12} />}At risk
          </div>
          <div className="sites-stat__value" style={{ color: atRisk ? "var(--danger)" : "var(--fg)" }}>{atRisk}</div>
          <div className="sites-stat__sub">Behind schedule or over budget</div>
        </div>
      </div>

      {view === "board" ? <SiteBoard sites={sites} goto={goto} /> : <SiteList sites={sites} goto={goto} />}
    </div>
  );
}

function SiteBoard({ sites, goto }) {
  return (
    <div className="sites-grid fade-up delay-2">
      {sites.map((p) => {
        const m = SITE_META[p.id] || { location: "—", workers: 0, cap: 0, manager: "—", trades: [] };
        const util = m.cap ? m.workers / m.cap : 0;
        return (
          <div
            key={p.id}
            className="site-card"
            style={{ "--site-accent": riskTone(p.risk) }}
            onClick={() => goto("tasks")}
          >
            <div className="site-card__top">
              <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
                <span className="status-dot" style={{ background: riskTone(p.risk), width: 8, height: 8 }} />
                <div className="site-card__name">{p.title}</div>
              </div>
              <button className="site-card__menu" onClick={(e) => e.stopPropagation()} aria-label="More">
                <Icon.More size={16} />
              </button>
            </div>
            <div className="site-card__client">{p.client}</div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 16 }}>
              <div className="site-card__meta" style={{ margin: 0 }}>
                <Icon.MapPin size={14} />{m.location}
              </div>
              <StatusBadge status={p.status} />
            </div>

            {/* Allocation */}
            <div className="site-card__alloc-head">
              <span className="site-card__alloc-label">Worker allocation</span>
              <span className="site-card__alloc-count">
                {m.workers}<span style={{ color: "var(--fg-3)", fontWeight: 400 }}> / {m.cap}</span>
              </span>
            </div>
            <Progress value={util} tint={util > 0.9 ? "var(--warning)" : "var(--accent)"} />

            {/* Trades */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 14 }}>
              {m.trades.map((t) => (
                <span key={t} className="badge badge--outline" style={{ fontSize: 10.5 }}>{t}</span>
              ))}
            </div>

            <div className="site-card__foot">
              <div>
                <div className="site-card__value tabular">{p.value}</div>
                <div className="site-card__value-label">Contract value · {Math.round(p.progress * 100)}% billed</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="site-card__due">
                  <div style={{ fontSize: 13, fontWeight: 500, color: p.risk === "high" ? "var(--danger)" : "var(--fg)" }}>{p.deadline}</div>
                  <div style={{ fontSize: 10.5, color: "var(--fg-3)" }}>Deadline</div>
                </div>
                <Avatar name={m.manager} size={30} />
              </div>
            </div>
          </div>
        );
      })}

      {/* Add-site tile */}
      <button
        className="site-card"
        onClick={() => {}}
        style={{
          alignItems: "center", justifyContent: "center", minHeight: 260,
          borderStyle: "dashed", boxShadow: "none", color: "var(--fg-3)",
          background: "transparent",
        }}
      >
        <div style={{ width: 42, height: 42, borderRadius: 12, background: "var(--bg-subtle)", display: "grid", placeItems: "center", marginBottom: 12 }}>
          <Icon.Plus size={20} />
        </div>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--fg-2)" }}>New site</div>
        <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 3 }}>Set up a new engagement</div>
      </button>
    </div>
  );
}

function SiteList({ sites, goto }) {
  return (
    <div className="card fade-up delay-2" style={{ overflow: "hidden" }}>
      <table className="table">
        <thead>
          <tr>
            <th>Site</th>
            <th>Client</th>
            <th>Status</th>
            <th style={{ width: 200 }}>Allocation</th>
            <th style={{ textAlign: "right" }}>Contract value</th>
            <th>Deadline</th>
            <th>Manager</th>
          </tr>
        </thead>
        <tbody>
          {sites.map((p) => {
            const m = SITE_META[p.id] || { location: "—", workers: 0, cap: 0, manager: "—" };
            const util = m.cap ? m.workers / m.cap : 0;
            return (
              <tr key={p.id} style={{ cursor: "pointer" }} onClick={() => goto("tasks")}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="status-dot" style={{ background: riskTone(p.risk) }} />
                    <div>
                      <div style={{ fontWeight: 500 }}>{p.title}</div>
                      <div className="dim" style={{ fontSize: 11, marginTop: 1, display: "flex", alignItems: "center", gap: 4 }}>
                        <Icon.MapPin size={11} />{m.location}
                      </div>
                    </div>
                  </div>
                </td>
                <td><span className="muted">{p.client}</span></td>
                <td><StatusBadge status={p.status} /></td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Progress value={util} tint={util > 0.9 ? "var(--warning)" : "var(--accent)"} />
                    <span className="dim tabular" style={{ fontSize: 11, minWidth: 52, textAlign: "right" }}>{m.workers}/{m.cap}</span>
                  </div>
                </td>
                <td className="tabular" style={{ textAlign: "right", fontWeight: 500 }}>{p.value}</td>
                <td>
                  <span style={{ color: p.risk === "high" ? "var(--danger)" : undefined, fontWeight: p.risk === "high" ? 500 : 400 }}>{p.deadline}</span>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Avatar name={m.manager} size={24} />
                    <span style={{ fontSize: 12.5 }}>{m.manager.split(" ")[0]}</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

window.Screens = window.Screens || {};
window.Screens.Projects = Projects;
