// ManpowerHub — Timesheets
const { useState: useStateTi, useEffect: useEffectTi } = React;

function TimeTracker({ goto }) {
  const [running, setRunning] = useStateTi(true);
  const [secs, setSecs] = useStateTi(2 * 3600 + 14 * 60 + 22);

  useEffectTi(() => {
    if (!running) return;
    const id = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const fmt = (s) => {
    const h = Math.floor(s / 3600).toString().padStart(2, "0");
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  const entries = [
    { id: "t1", task: "Site Alpha — Day shift",         project: "Emaar Properties",       duration: "8h 00m", time: "07:00 — 15:00", running: false },
    { id: "t2", task: "Festival City — Night shift",    project: "Al Futtaim Carillion",   duration: "8h 00m", time: "22:00 — 06:00", running: false },
    { id: "t3", task: "Al Quoz Industrial — Day shift", project: "Al Naboodah Contracting", duration: "2h 14m", time: "07:00 — now",   running: true  },
  ];

  const days = [
    { d: "Mon", h: 5.2 }, { d: "Tue", h: 6.8 }, { d: "Wed", h: 7.4 },
    { d: "Thu", h: 4.1 }, { d: "Fri", h: 2.2 }, { d: "Sat", h: 0 }, { d: "Sun", h: 0 },
  ];
  const maxH = 8;

  return (
    <div className="page">
      <div className="page__header fade-up">
        <div>
          <h1 className="page__title">Timesheets</h1>
          <div className="page__subtitle">2,847 workers · May 2026 · 24 active sites</div>
        </div>
        <div className="page__actions">
          <button className="btn btn--secondary"><Icon.Plus size={14} />Add entry</button>
          <button className="btn btn--secondary"><Icon.Download size={14} />Export all</button>
        </div>
      </div>

      {/* Running timer hero */}
      <div className="card fade-up delay-1" style={{
        padding: 24, marginBottom: 22, display: "grid",
        gridTemplateColumns: "1fr auto", gap: 20, alignItems: "center",
        background: running ? "linear-gradient(135deg, var(--accent-soft), var(--bg-surface) 70%)" : "var(--bg-surface)",
      }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 10, color: running ? "var(--accent)" : "var(--fg-3)" }}>
            {running ? "● Recording" : "Idle"}
          </div>
          <div style={{
            fontFamily: "var(--font-display)", fontSize: 56, fontWeight: 600,
            letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums",
            lineHeight: 1, marginBottom: 12,
          }}>
            {fmt(secs)}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontWeight: 500 }}>Al Quoz Industrial — Day shift</span>
            <span className="dim">·</span>
            <span className="muted">Al Naboodah Contracting</span>
            <span className="badge badge--accent">Active shift</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn btn--secondary btn--lg btn--icon"
            style={{ width: 50, height: 50, borderRadius: 25 }}
            onClick={() => setRunning(r => !r)}
            title={running ? "Pause" : "Resume"}
          >
            {running ? <Icon.Pause size={18} /> : <Icon.Play size={18} />}
          </button>
          <button className="btn btn--secondary btn--lg btn--icon" style={{ width: 50, height: 50, borderRadius: 25 }} title="Stop">
            <Icon.Stop size={16} />
          </button>
        </div>
      </div>

      {/* Week bars */}
      <section className="card fade-up delay-2" style={{ marginBottom: 22 }}>
        <div className="card__header">
          <div className="card__title">This week</div>
          <div style={{ display: "flex", gap: 14, fontSize: 12 }}>
            <span><strong className="tabular">2,847</strong> <span className="dim">workers</span></span>
            <span><strong className="tabular">98.4%</strong> <span className="dim">attendance</span></span>
            <span><strong className="tabular">AED 284K</strong> <span className="dim">payroll</span></span>
          </div>
        </div>
        <div className="card__body">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 12, alignItems: "flex-end", height: 200 }}>
            {days.map((d, i) => {
              const isToday = i === 4;
              return (
                <div key={d.d} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%" }}>
                  <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
                    <div style={{
                      width: "100%",
                      height: `${(d.h / maxH) * 100}%`,
                      background: isToday ? "var(--accent)" : d.h > 0 ? "var(--accent-soft-2)" : "var(--bg-subtle)",
                      borderRadius: 6,
                      minHeight: d.h > 0 ? 4 : 0,
                    }} />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: isToday ? "var(--fg)" : "var(--fg-3)" }}>{d.d}</div>
                  <div className="tabular" style={{ fontSize: 11, color: isToday ? "var(--accent)" : "var(--fg-3)" }}>
                    {d.h ? `${d.h}h` : "—"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Today's entries */}
      <section className="card fade-up delay-3">
        <div className="card__header">
          <div className="card__title">Today · Thursday 26 June 2026</div>
          <span className="dim" style={{ fontSize: 12 }}>3 active shifts · 2,847 workers</span>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Project</th>
              <th>Time</th>
              <th>Duration</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {e.running && <span className="status-dot status-dot--accent" style={{ animation: "pulse 1.6s ease-in-out infinite" }} />}
                    <span style={{ fontWeight: 500 }}>{e.task}</span>
                  </div>
                </td>
                <td><span className="muted">{e.project}</span></td>
                <td><span className="dim tabular">{e.time}</span></td>
                <td className="tabular" style={{ fontWeight: 500, color: e.running ? "var(--accent)" : "var(--fg)" }}>{e.duration}</td>
                <td>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 4 }}>
                    {!e.running && <button className="btn btn--ghost btn--icon btn--sm"><Icon.Play size={12} /></button>}
                    <button className="btn btn--ghost btn--icon btn--sm"><Icon.Edit size={12} /></button>
                    <button className="btn btn--ghost btn--icon btn--sm"><Icon.More size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
}

window.Screens = window.Screens || {};
window.Screens.TimeTracker = TimeTracker;
