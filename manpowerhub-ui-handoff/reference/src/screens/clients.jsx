// ManpowerHub — Workers
const { useState: useStateCl } = React;

function Clients({ goto }) {
  const [selected, setSelected] = useStateCl(MockData.clients[0].id);
  const [filter, setFilter] = useStateCl("all");

  const filtered = MockData.clients.filter((c) => {
    if (filter === "all") return true;
    if (filter === "healthy") return c.health >= 80;
    if (filter === "at-risk") return c.health < 60;
    return true;
  });

  const client = MockData.clients.find((c) => c.id === selected) || MockData.clients[0];

  return (
    <div className="page" style={{ maxWidth: "none", padding: "20px 24px 60px" }}>
      <div className="page__header fade-up">
        <div>
          <h1 className="page__title">Clients</h1>
          <div className="page__subtitle">
            {MockData.clients.length} clients · AED {MockData.clients.reduce((s,c)=>s+c.revenue,0).toLocaleString()} in revenue · 3 active this week
          </div>
        </div>
        <div className="page__actions">
          <button className="btn btn--secondary btn--sm"><Icon.Upload size={13} />Import</button>
          <button className="btn btn--primary"><Icon.Plus size={14} />New client</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs fade-up delay-1">
        <div className="tabs__item" data-active={filter === "all"} onClick={() => setFilter("all")}>
          All <span className="tabs__count">{MockData.clients.length}</span>
        </div>
        <div className="tabs__item" data-active={filter === "healthy"} onClick={() => setFilter("healthy")}>
          Active <span className="tabs__count">{MockData.clients.filter(c => c.health >= 80).length}</span>
        </div>
        <div className="tabs__item" data-active={filter === "at-risk"} onClick={() => setFilter("at-risk")}>
          At risk <span className="tabs__count">{MockData.clients.filter(c => c.health < 60).length}</span>
        </div>
        <div style={{ flex: 1 }} />
        <div className="tabs__item"><Icon.Filter size={13} />Filter</div>
        <div className="tabs__item"><Icon.ArrowDown size={13} />Health</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, alignItems: "flex-start" }}>
        {/* Table */}
        <div className="card fade-up delay-2" style={{ overflow: "hidden" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Health</th>
                <th style={{ textAlign: "right" }}>Revenue</th>
                <th>Sites</th>
                <th>Last activity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} onClick={() => setSelected(c.id)} style={{
                  cursor: "pointer",
                  background: selected === c.id ? "var(--bg-subtle)" : undefined,
                }}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar name={c.name} size={28} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500 }}>{c.name}</div>
                        <div className="dim" style={{ fontSize: 11.5 }}>{c.contact} · {c.country}</div>
                      </div>
                      {c.health < 60 && (
                        <button
                          className="ai-chip"
                          onClick={(e) => { e.stopPropagation(); window.aiPanel?.prompt(`AI brief for ${c.name} — health, overdue invoices, suggested action.`); }}
                        >
                          <Icon.Sparkles size={11} /> AI brief
                        </button>
                      )}
                    </div>
                  </td>
                  <td><HealthRing score={c.health} /></td>
                  <td className="tabular" style={{ textAlign: "right", fontWeight: 500 }}>
                    AED {c.revenue.toLocaleString()}
                  </td>
                  <td><span className="muted tabular">{c.projects}</span></td>
                  <td><span className="muted">{c.last}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        <div className="card fade-up delay-3" style={{ position: "sticky", top: 16 }}>
          <div style={{ padding: 20, borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
              <Avatar name={client.name} size={48} />
              <div style={{ flex: 1 }}>
                <h2 style={{
                  fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600,
                  letterSpacing: "-0.02em", marginBottom: 2,
                }}>{client.name}</h2>
                <div className="dim" style={{ fontSize: 12.5 }}>{client.contact}</div>
              </div>
              <button className="btn btn--ghost btn--icon btn--sm"><Icon.More size={14} /></button>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button className="btn btn--primary btn--sm"><Icon.FileText size={12} />New invoice</button>
              <button className="btn btn--secondary btn--sm"><Icon.FileText size={12} />New quote</button>
              <button className="btn btn--secondary btn--sm"><Icon.Mail size={12} />Email</button>
              <button
                className="btn btn--secondary btn--sm"
                onClick={() => window.aiPanel?.prompt(`AI brief for ${client.name} — relationship health, overdue invoices, next best action.`)}
              ><Icon.Sparkles size={12} />AI brief</button>
            </div>
          </div>

          {/* Health */}
          <div style={{ padding: 20, borderBottom: "1px solid var(--border)" }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Relationship health</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <HealthRing score={client.health} size={56} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 4 }}>
                  {client.health >= 80 ? "Strong & active" : client.health >= 60 ? "Steady" : "Cooling — needs attention"}
                </div>
                <div className="dim" style={{ fontSize: 12, lineHeight: 1.5 }}>
                  {client.health >= 80
                    ? "On-time payments and regular touchpoints."
                    : client.health >= 60
                    ? "Average pay 14d. Last note 3 weeks ago."
                    : "Slow replies, 1 overdue invoice. Suggest a soft check-in."}
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div style={{ padding: 20, borderBottom: "1px solid var(--border)" }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Details</div>
            <div style={{ display: "grid", gap: 10, fontSize: 13 }}>
              <DetailRow label="Email"    value={client.email}                                  icon={Icon.Mail} />
              <DetailRow label="Country"  value={client.country}                                icon={Icon.Globe} />
              <DetailRow label="Revenue"  value={`AED ${client.revenue.toLocaleString()}`}      icon={Icon.DollarSign} bold />
              <DetailRow label="Sites"    value={`${client.projects} active`}                   icon={Icon.Layers} />
              <DetailRow label="Last seen" value={client.last}                                  icon={Icon.Clock} />
            </div>
          </div>

          {/* Recent docs */}
          <div style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div className="eyebrow">Recent invoices</div>
              <button className="btn btn--ghost btn--sm">All</button>
            </div>
            <div style={{ display: "grid", gap: 6 }}>
              {MockData.invoices.filter((i) => i.client === client.name).slice(0, 4).map((i) => (
                <div key={i.id} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 10px", borderRadius: 8, background: "var(--bg-subtle)", fontSize: 13,
                }}>
                  <Icon.Receipt size={13} style={{ color: "var(--fg-3)" }} />
                  <span style={{ flex: 1, fontWeight: 500, fontFamily: "var(--font-mono)", fontSize: 12 }}>{i.id}</span>
                  <span className="tabular muted" style={{ fontSize: 12 }}>
                    {i.amount ? `AED ${i.amount.toLocaleString()}` : "—"}
                  </span>
                  <StatusBadge status={i.status} />
                </div>
              ))}
              {MockData.invoices.filter((i) => i.client === client.name).length === 0 && (
                <div className="dim" style={{ fontSize: 12.5 }}>No invoices yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, icon, bold }) {
  const I = icon;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ color: "var(--fg-3)" }}><I size={13} /></span>
      <span className="dim" style={{ width: 88 }}>{label}</span>
      <span style={{ fontWeight: bold ? 600 : 400 }} className={bold ? "tabular" : ""}>{value}</span>
    </div>
  );
}

window.Screens = window.Screens || {};
window.Screens.Clients = Clients;
