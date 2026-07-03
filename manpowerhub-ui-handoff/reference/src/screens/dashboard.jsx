// ManpowerHub — Dashboard
function Dashboard({ goto }) {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-AE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const k = MockData.kpis;
  const feed = MockData.agentFeed;

  return (
    <div className="page">
      {/* Header */}
      <div className="page__header fade-up">
        <div>
          <div className="eyebrow" style={{ marginBottom: 8, color: "var(--fg-3)" }}>Overview · All sites · Jun 2026</div>
          <h1 className="page__title">Good morning, Junaid.</h1>
          <div className="page__subtitle" style={{ marginTop: 4 }}>
            {dateStr} · All systems operational
          </div>
        </div>
        <div className="page__actions">
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "5px 10px 5px 8px",
            background: "var(--accent-soft)", border: "1px solid var(--accent-ring)",
            borderRadius: "var(--radius-full)", fontSize: 12.5, fontWeight: 500,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }}></span>
            <span style={{ color: "var(--accent)" }}>6 Agents Active</span>
          </div>
          <button className="btn btn--secondary btn--sm"><Icon.Download size={13} />Export</button>
        </div>
      </div>

      {/* KPI grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "ACTIVE WORKERS",  value: "2,847",    delta: "↗ 12% this month",    accent: false },
          { label: "MONTHLY PAYROLL", value: "AED 284K", delta: "↗ 8% vs last month",   accent: false },
          { label: "COLLECTION RATE", value: "98.4%",    delta: "↗ 2.1% improvement",   accent: true  },
          { label: "ACTIVE SITES",    value: "24",       delta: "↗ +3 this quarter",    accent: false },
        ].map((kpi, i) => (
          <div key={kpi.label} className={`card fade-up delay-${i + 1}`} style={{ padding: "16px 18px" }}>
            <div style={{
              fontSize: 10.5, fontWeight: 600, letterSpacing: "0.08em",
              textTransform: "uppercase", color: "var(--fg-3)", marginBottom: 10,
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              {kpi.label}
              <MiniBars values={[40,55,48,62,58,70,75,80,72,85,90,95]} color={kpi.accent ? "var(--accent)" : "var(--fg-3)"} height={22} />
            </div>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600,
              letterSpacing: "-0.025em", color: kpi.accent ? "var(--accent)" : "var(--fg)",
              marginBottom: 6,
            }}>{kpi.value}</div>
            <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 500 }}>{kpi.delta}</div>
          </div>
        ))}
      </div>

      {/* Agent Feed + Planning Agent */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 14, marginBottom: 20 }}>
        {/* Agent Feed */}
        <div className="card fade-up delay-2">
          <div className="card__header">
            <div className="card__title">Agent Feed</div>
          </div>
          <div style={{ padding: "6px 0" }}>
            {feed.map((item) => {
              const IconMap = {
                payroll:  Icon.CircleCheck,
                planning: Icon.Users,
                alert:    Icon.AlertTriangle,
              };
              const I = IconMap[item.type] || Icon.Info;
              const toneMap = {
                payroll:  { bg: "var(--success-soft)", fg: "var(--success)" },
                planning: { bg: "var(--accent-soft)",  fg: "var(--accent)"  },
                alert:    { bg: "var(--warning-soft)", fg: "var(--warning)" },
              };
              const tone = toneMap[item.type] || { bg: "var(--bg-subtle)", fg: "var(--fg-2)" };
              return (
                <div key={item.id} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "13px 16px",
                  borderBottom: "1px solid var(--border)",
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: tone.bg, color: tone.fg,
                    display: "grid", placeItems: "center",
                  }}>
                    <I size={15} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 2 }}>{item.sub}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--fg-3)", flexShrink: 0 }}>{item.when}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Planning Agent */}
        <div className="card fade-up delay-3" style={{ display: "flex", flexDirection: "column" }}>
          <div className="card__header">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon.Sparkles size={15} style={{ color: "var(--accent)" }} />
              <div className="card__title">Planning Agent</div>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 5,
              fontSize: 12, fontWeight: 500, color: "var(--accent)",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }}></span>
              Live
            </div>
          </div>
          <div className="card__body" style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: "var(--fg-2)", marginBottom: 18 }}>
              Auto-allocates workers across sites.
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                fontSize: 12.5, marginBottom: 7,
              }}>
                <span style={{ color: "var(--fg-2)" }}>Today</span>
                <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>142 / 200</span>
              </div>
              <Progress value={0.71} />
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 12.5, color: "var(--fg-2)",
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)" }}></span>
              Active 24/7
            </div>
          </div>
        </div>
      </div>

      {/* Active contracts / pipeline */}
      <section className="card fade-up">
        <div className="card__header">
          <div>
            <div className="card__title">Active contracts</div>
          </div>
          <button className="btn btn--ghost btn--sm" onClick={() => goto("projects")}>
            All sites <Icon.ChevronRight size={12} />
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Site / Project</th>
              <th>Client</th>
              <th>Status</th>
              <th>Allocation</th>
              <th style={{ textAlign: "right" }}>Value</th>
              <th>Deadline</th>
            </tr>
          </thead>
          <tbody>
            {MockData.pipeline.map((p) => (
              <tr key={p.id} onClick={() => goto("projects")} style={{ cursor: "pointer" }}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className={`status-dot status-dot--${
                      p.risk === "high" ? "danger" : p.risk === "med" ? "warning" : "success"
                    }`} />
                    <span style={{ fontWeight: 500 }}>{p.title}</span>
                  </div>
                </td>
                <td><span className="muted">{p.client}</span></td>
                <td><StatusBadge status={p.status} /></td>
                <td style={{ width: 180 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Progress value={p.progress} />
                    <span className="dim tabular" style={{ fontSize: 11, minWidth: 30 }}>{Math.round(p.progress * 100)}%</span>
                  </div>
                </td>
                <td className="tabular" style={{ textAlign: "right", fontWeight: 500 }}>{p.value}</td>
                <td><span className="muted">{p.deadline}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

window.Screens = window.Screens || {};
window.Screens.Dashboard = Dashboard;
