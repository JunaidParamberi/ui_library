// ManpowerHub — Proforma Invoices
const { useState: useStateF } = React;

function Finance({ goto }) {
  const [tab, setTab] = useStateF("all");
  const [search, setSearch] = useStateF("");
  const [chartMode, setChartMode] = useStateF("billed");

  const inv = MockData.invoices;
  const filtered = inv.filter((i) => {
    if (tab !== "all" && i.status !== tab) return false;
    if (search && !i.client.toLowerCase().includes(search.toLowerCase()) && !i.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalBilled = inv.filter(i => i.status !== "draft").reduce((s, i) => s + (i.amount || 0), 0);
  const vatCollected = Math.round(totalBilled * 0.05 * (680 / 1511.25));

  // Sparkline data for stat cards
  const sparkVals = [30, 45, 38, 52, 48, 60, 55, 70, 65, 80, 75, 90];

  const statCards = [
    { label: "TOTAL INVOICES",    value: "5",                  sub: "All PI records in the system",          spark: sparkVals.slice(0,8),  accent: false },
    { label: "PENDING APPROVAL",  value: "1",                  sub: "Awaiting Operation & Account sign-off", spark: [20,35,28,42,38,52,30,45], accent: "warning" },
    { label: "TOTAL BILLED",      value: "AED 30,225.00",      sub: "Sum of grant totals (AED)",             spark: sparkVals,             accent: true  },
    { label: "VAT COLLECTED",     value: "AED 680.00",         sub: "Total VAT across all invoices",         spark: sparkVals.slice(4),    accent: false },
  ];

  // Line chart data — invoice activity last 30 days
  const lineData = [
    { m: "Apr 26", v: 4200 }, { m: "Apr 28", v: 6800 }, { m: "Apr 30", v: 5200 },
    { m: "May 1",  v: 8750 }, { m: "May 3",  v: 7100 }, { m: "May 5",  v: 9400 },
    { m: "May 6",  v: 6900 }, { m: "May 8",  v: 11200 },{ m: "May 10", v: 8600 },
    { m: "May 11", v: 10400 },{ m: "May 13", v: 9800 }, { m: "May 15", v: 13200 },
    { m: "May 16", v: 11600 },{ m: "May 18", v: 14385 },
  ];

  const approvals = MockData.invoiceApprovals;

  const statusLabel = {
    pending_approval: { cls: "warning", label: "Pending approval" },
    sent:             { cls: "info",    label: "Sent to client"   },
    draft:            { cls: "outline", label: "Draft"            },
    approved:         { cls: "success", label: "Approved"         },
    overdue:          { cls: "danger",  label: "Expired"          },
  };

  const TABS = [
    { key: "all",              label: "All"      },
    { key: "draft",            label: "Draft"    },
    { key: "pending_approval", label: "Pending"  },
    { key: "approved",         label: "Approved" },
    { key: "sent",             label: "Sent"     },
  ];

  return (
    <div className="page">
      {/* Header */}
      <div className="page__header fade-up">
        <div>
          <h1 className="page__title">Proforma invoices</h1>
          <div className="page__subtitle">Thursday, 26 June 2026</div>
        </div>
        <div className="page__actions">
          <button className="btn btn--primary">
            <Icon.Plus size={14} />New draft
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {statCards.map((s, i) => (
          <div key={s.label} className={`card fade-up delay-${i + 1}`} style={{ padding: "16px 18px" }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 10,
            }}>
              <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg-3)" }}>
                {s.label}
              </span>
              <MiniBars
                values={s.spark}
                color={s.accent === true ? "var(--accent)" : s.accent === "warning" ? "var(--warning)" : "var(--fg-3)"}
                height={22}
              />
            </div>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: s.value.length > 6 ? 22 : 28,
              fontWeight: 600, letterSpacing: "-0.022em",
              color: s.accent === true ? "var(--accent)" : "var(--fg)",
              marginBottom: 6,
            }}>{s.value}</div>
            <div style={{ fontSize: 11.5, color: "var(--fg-3)" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Activity chart */}
      <section className="card fade-up delay-2" style={{ marginBottom: 20 }}>
        <div className="card__header">
          <div>
            <div className="card__title">Invoice activity</div>
            <div className="dim" style={{ fontSize: 12, marginTop: 2 }}>Last 30 days</div>
          </div>
          <div style={{ display: "flex", gap: 2, background: "var(--bg-subtle)", border: "1px solid var(--border)", borderRadius: 6, padding: 2 }}>
            {["billed", "by_status"].map((m) => (
              <button key={m} onClick={() => setChartMode(m)} className="btn btn--ghost btn--sm" style={{
                background: chartMode === m ? "var(--bg-surface)" : "transparent",
                boxShadow: chartMode === m ? "var(--shadow-xs)" : "none",
                height: 26, borderRadius: 4,
              }}>
                {m === "billed" ? "Billed" : "By Status"}
              </button>
            ))}
          </div>
        </div>
        <div className="card__body">
          <LineChart data={lineData} height={200} />
        </div>
      </section>

      {/* Recent invoices table */}
      <section className="card fade-up delay-3">
        <div style={{ padding: "14px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div className="card__title">Recent invoices</div>
              <div className="dim" style={{ fontSize: 12, marginTop: 2 }}>5 invoices · Draft, approval, and send workflow</div>
            </div>
          </div>

          {/* Tabs + search */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 0 }}>
            <div style={{ display: "flex", gap: 0 }}>
              {TABS.map((t) => (
                <button key={t.key} onClick={() => setTab(t.key)} style={{
                  padding: "7px 12px", fontSize: 13, fontWeight: 500, cursor: "pointer",
                  borderBottom: tab === t.key ? "2px solid var(--accent)" : "2px solid transparent",
                  color: tab === t.key ? "var(--accent)" : "var(--fg-2)",
                  background: "none", border: "none", borderBottom: tab === t.key ? "2px solid var(--accent)" : "2px solid transparent",
                  transition: "color 120ms, border-color 120ms",
                }}>{t.label}</button>
              ))}
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "5px 10px", borderRadius: "var(--radius-md)",
              background: "var(--bg-subtle)", border: "1px solid var(--border)",
              fontSize: 12.5, color: "var(--fg-3)",
            }}>
              <Icon.Search size={13} />
              <input
                placeholder="Search PI number or bill to..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  border: "none", background: "transparent", outline: "none",
                  fontSize: 12.5, color: "var(--fg)", width: 200,
                }}
              />
            </div>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>PI NUMBER</th>
              <th>BILL TO</th>
              <th>DATE</th>
              <th>STATUS</th>
              <th>APPROVAL</th>
              <th style={{ textAlign: "right" }}>GRANT TOTAL</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inv) => {
              const s = statusLabel[inv.status] || { cls: "outline", label: inv.status };
              const apprv = approvals[inv.id];
              return (
                <tr key={inv.id} style={{ cursor: "pointer" }}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Icon.FileText size={13} style={{ color: "var(--fg-3)", flexShrink: 0 }} />
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, fontWeight: 500 }}>{inv.id}</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 500 }}>{inv.client}</td>
                  <td className="muted">{inv.issued}</td>
                  <td>
                    <span className={`badge badge--${s.cls}`}>{s.label}</span>
                  </td>
                  <td>
                    {apprv ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {apprv.map((a) => (
                          <div key={a.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }}></span>
                            <strong style={{ fontWeight: 500 }}>{a.name}</strong>
                            <span className="dim">· {a.dept}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="dim">—</span>
                    )}
                  </td>
                  <td className="tabular" style={{ textAlign: "right", fontWeight: 500 }}>
                    {inv.amount ? `AED ${inv.amount.toLocaleString()}.00` : <span className="dim">—</span>}
                  </td>
                  <td style={{ width: 32 }}>
                    <button className="btn btn--ghost btn--icon btn--sm"><Icon.More size={13} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

// Simple line chart (no fill, just a clean stroke — matches ManpowerHub screenshots)
function LineChart({ data, height = 200 }) {
  const w = 800;
  const padL = 8, padR = 8, padT = 12, padB = 28;
  const innerW = w - padL - padR;
  const innerH = height - padT - padB;
  const vals = data.map((d) => d.v);
  const max = Math.max(...vals) * 1.1;
  const min = Math.min(...vals) * 0.85;
  const xStep = innerW / (data.length - 1);
  const points = data.map((d, i) => ({
    x: padL + i * xStep,
    y: padT + innerH - ((d.v - min) / (max - min)) * innerH,
  }));
  // Smooth bezier
  const path = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cpX = (prev.x + p.x) / 2;
    return acc + ` C ${cpX} ${prev.y}, ${cpX} ${p.y}, ${p.x} ${p.y}`;
  }, "");
  const areaPath = path + ` L ${points[points.length - 1].x} ${padT + innerH} L ${points[0].x} ${padT + innerH} Z`;

  // X-axis labels — only show a few
  const labelIdxs = [0, 3, 6, 9, 13];

  return (
    <svg viewBox={`0 0 ${w} ${height}`} style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <linearGradient id="lineAreaFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#lineAreaFill)" />
      <path d={path} stroke="var(--accent)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {labelIdxs.filter(i => i < data.length).map((i) => (
        <text key={i} x={points[i].x} y={height - 8} textAnchor="middle" fontSize="10.5" fill="var(--fg-3)">
          {data[i].m}
        </text>
      ))}
    </svg>
  );
}

window.Screens = window.Screens || {};
window.Screens.Finance = Finance;
