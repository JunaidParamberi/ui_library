// CraftlyAI — AI Panel (right-side docked assistant)
// Rail (44px closed) ↔ Panel (300px open). Exposes window.aiPanel API.

const { useState: useAIPSt, useEffect: useAIPEff, useRef: useAIPRef } = React;

// ── Context per route ─────────────────────────────────────────────────────────
const ROUTE_CTX = {
  dashboard: { name: "Dashboard", suggestions: ["Summarize my week",         "What needs action today?",    "Draft a status update"   ] },
  clients:   { name: "Clients",   suggestions: ["Who has overdue payments?",  "Draft a reminder email",      "Summarise top clients"   ] },
  projects:  { name: "Projects",  suggestions: ["What's blocked?",            "Summarise project health",    "Flag overdue work"       ] },
  finance:   { name: "Finance",   suggestions: ["Revenue this month",         "Overdue invoices",            "Expense summary"         ] },
  tasks:     { name: "Tasks",     suggestions: ["What's due today?",          "What's overdue?",             "Create a task"           ] },
  documents: { name: "Documents", suggestions: ["Draft a proposal",           "Create a contract",           "Summarise recent docs"   ] },
  time:      { name: "Time",      suggestions: ["Hours this week",            "Unbilled hours",              "Log time now"            ] },
  expenses:  { name: "Expenses",  suggestions: ["This month's spend",         "Unreimbursed expenses",       "Add expense"             ] },
};

// ── Response bank ─────────────────────────────────────────────────────────────
const RESPONSES = {
  clients: [
    { kw: ["overdue","payment","owe","unpaid","late","chase","due"],
      lines: ["**2 clients** have overdue balances totalling **AED 23,400**:", "• Maple Studio — AED 18,900 · 28 days overdue", "• Acme Corp — AED 4,500 · 14 days overdue"],
      card:  { label: "Top overdue", title: "Maple Studio · INV-0089", sub: "AED 18,900 · 28 days overdue", cta: "View invoice" } },
    { kw: ["reminder","email","draft","send","follow","nudge"],
      lines: ["I've drafted reminder emails for both overdue clients, pre-filled with invoice numbers and amounts. Want to review or send directly?"],
      card:  { label: "Ready to send", title: "2 reminder emails drafted", sub: "Maple Studio + Acme Corp", cta: "Review & send" } },
    { kw: ["invoice","create","new","bill","generate"],
      lines: ["Who should I invoice? I can pull in their last project, rate, and net terms automatically — just pick a client."] },
    { kw: ["brief","summary","overview","report","revenue","total"],
      lines: ["**8 clients** · AED 186,650 total revenue · up 18% this quarter.", "Verde Agency leads at AED 52,100. 6 active, 1 at-risk, 1 cooling."] },
    { kw: ["health","risk","weak","cooling","trouble","status"],
      lines: ["**2 clients** need attention:", "• Orbis Media — slow replies, 1 overdue invoice", "• Maple Studio — no contact in 5 weeks", "I'd suggest a check-in with both this week."] },
    { kw: [],
      lines: ["I can help draft reminders, create invoices, check payment status, or summarise your client portfolio. What do you need?"] },
  ],
  dashboard: [
    { kw: ["revenue","earned","money","income","collected"],
      lines: ["You've collected **AED 18,200** this week — up 23% vs last week. Best day was Tuesday at AED 4,800."] },
    { kw: ["task","due","todo","today","urgent","overdue"],
      lines: ["**3 tasks** are due today:", "• Send Acme retainer contract", "• Review Maple homepage designs", "• Log Kestrel dev hours"] },
    { kw: ["summary","week","overview","report","status"],
      lines: ["**Week so far:**", "• Revenue: AED 18,200  (+23%)", "• Invoices sent: 4  ·  Paid: 2", "• Tasks closed: 8 of 12", "• 2 overdue invoices need attention"] },
    { kw: [],
      lines: ["Dashboard looks healthy. 3 tasks due today and 2 overdue invoices (AED 23,400). Want me to action either?"] },
  ],
  finance: [
    { kw: ["overdue","unpaid","outstanding","owe"],
      lines: ["**AED 23,400** outstanding — Maple Studio (AED 18,900) and Acme Corp (AED 4,500), both past 14 days."],
      card:  { label: "Outstanding", title: "AED 23,400 overdue", sub: "2 clients · longest 28 days", cta: "View invoices" } },
    { kw: ["revenue","total","year","month","income"],
      lines: ["**AED 186,650** year to date. Best month was March at AED 28,400. On track for AED 220k this year."] },
    { kw: [],
      lines: ["Finances look solid. AED 186,650 YTD with 2 invoices overdue. Want a breakdown by client or period?"] },
  ],
  tasks: [
    { kw: ["overdue","late","missed","behind"],
      lines: ["**2 tasks** are overdue:", "• Send Acme retainer contract (due Jun 5)", "• Design review for Maple Studio (due Jun 6)"] },
    { kw: ["today","due","urgent"],
      lines: ["**3 tasks** due today:", "• Send Acme retainer contract", "• Review Maple homepage designs", "• Log Kestrel dev hours"] },
    { kw: [],
      lines: ["You have 12 open tasks, 3 due today, 2 overdue. Want me to prioritise them or create a new one?"] },
  ],
  projects: [
    { kw: ["blocked","stuck","problem","issue","delay","risk"],
      lines: ["**Hawthorn rebrand** is at risk — deadline in 5 days with 2 open tasks unassigned.", "Maple seasonal site is on track for Jun 20."] },
    { kw: [],
      lines: ["4 active projects. Hawthorn rebrand needs attention — 5 days to deadline. Want a full status rundown?"] },
  ],
  default: [
    { kw: [],
      lines: ["I'm here. Ask me about clients, invoices, tasks, or projects — or switch to Agent mode and give me a job to run."] },
  ],
};

function getAIResponse(input, route) {
  const lower = input.toLowerCase();
  const bank = RESPONSES[route] || RESPONSES.default;
  const match = bank.find(r => r.kw.length > 0 && r.kw.some(k => lower.includes(k)));
  return match || bank[bank.length - 1];
}

// ── Bold markdown renderer ────────────────────────────────────────────────────
function AIText({ lines }) {
  const arr = Array.isArray(lines) ? lines : [lines];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {arr.map((line, i) => {
        const parts = line.split(/\*\*([^*]+)\*\*/g);
        return (
          <span key={i} style={{ display: "block" }}>
            {parts.map((p, j) => (j % 2 === 1 ? <strong key={j}>{p}</strong> : p))}
          </span>
        );
      })}
    </div>
  );
}

// ── Action card (Cursor-style diff) ──────────────────────────────────────────
function AIActionCard({ card, isAgent }) {
  return (
    <div className="ai-action-card" data-agent={isAgent}>
      <div className="ai-action-card__label">
        {isAgent ? <Icon.Zap size={11} /> : <Icon.Receipt size={11} />}
        {card.label}
      </div>
      <div className="ai-action-card__title">{card.title}</div>
      <div className="ai-action-card__sub">{card.sub}</div>
      <button className="btn btn--secondary btn--sm" style={{ marginTop: 2 }}>{card.cta} →</button>
    </div>
  );
}

// ── Rail (collapsed, 44 px) ───────────────────────────────────────────────────
function AIRail({ onOpen }) {
  return (
    <div
      className="ai-rail"
      onClick={onOpen}
      role="button"
      tabIndex={0}
      title="Open AI  (⌘J)"
      onKeyDown={e => (e.key === "Enter" || e.key === " ") && onOpen()}
    >
      <div className="ai-rail__btn">
        <Icon.Sparkles size={16} />
        <span className="ai-rail__dot" />
      </div>
      <span className="ai-rail__label">AI</span>
      <span className="ai-rail__kbd">⌘J</span>
    </div>
  );
}

// ── Panel (expanded, 300 px) ──────────────────────────────────────────────────
function AIPanel({ route, onClose, mode, setMode }) {
  const [msgs, setMsgs]     = useAIPSt([]);
  const [input, setInput]   = useAIPSt("");
  const [typing, setTyping] = useAIPSt(false);
  const endRef  = useAIPRef(null);
  const inpRef  = useAIPRef(null);

  const ctx     = ROUTE_CTX[route] || { name: "Workspace", suggestions: ["Summarize", "What's due?", "Help me"] };
  const isAgent = mode === "agent";

  // Reset when route changes
  useAIPEff(() => { setMsgs([]); setInput(""); setTyping(false); }, [route]);

  // Scroll to bottom
  useAIPEff(() => {
    if (endRef.current) {
      const el = endRef.current.parentElement;
      el.scrollTop = el.scrollHeight;
    }
  }, [msgs, typing]);

  // Listen for programmatic prompts (from inline chips, detail panel, etc.)
  useAIPEff(() => {
    const h = (e) => {
      const text = e.detail;
      if (!text?.trim()) return;
      setInput("");
      setMsgs(m => [...m, { id: Date.now(), role: "user", text }]);
      setTyping(true);
      setTimeout(() => {
        const resp = getAIResponse(text, route);
        setMsgs(m => [...m, { id: Date.now() + 1, role: "ai", lines: resp.lines, card: resp.card || null, isAgent }]);
        setTyping(false);
      }, 500 + Math.random() * 500);
    };
    document.addEventListener("craftly-ai-prompt", h);
    return () => document.removeEventListener("craftly-ai-prompt", h);
  }, [route, isAgent]);

  const sendMsg = (text) => {
    const t = (text || input).trim();
    if (!t) return;
    setInput("");
    setMsgs(m => [...m, { id: Date.now(), role: "user", text: t }]);
    setTyping(true);
    setTimeout(() => {
      const resp = getAIResponse(t, route);
      setMsgs(m => [...m, { id: Date.now() + 1, role: "ai", lines: resp.lines, card: resp.card || null, isAgent }]);
      setTyping(false);
    }, 500 + Math.random() * 500);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(); }
  };

  return (
    <div className="ai-panel">

      {/* ── Header ── */}
      <div className="ai-panel__hd">
        <span className="ai-panel__hd-spark"><Icon.Sparkles size={15} /></span>
        <span className="ai-panel__hd-title">AI</span>
        <span className="ai-panel__hd-ctx">{ctx.name}</span>

        <div className="ai-panel__mode">
          <button
            className={"ai-panel__mode-btn" + (!isAgent ? " ai-panel__mode-btn--ask" : "")}
            onClick={() => setMode("ask")}
          >Ask</button>
          <button
            className={"ai-panel__mode-btn" + (isAgent ? " ai-panel__mode-btn--agent" : "")}
            onClick={() => setMode("agent")}
          >Agent</button>
        </div>

        <button className="ai-panel__close" onClick={onClose} title="Close (⌘J)">
          <Icon.X size={12} />
        </button>
      </div>

      {/* ── Agent bar ── */}
      {isAgent && (
        <div className="ai-panel__agent-bar">
          <Icon.Zap size={13} />
          Agent active — I can take actions in your workspace
        </div>
      )}

      {/* ── Messages ── */}
      <div className="ai-panel__msgs">
        {msgs.length === 0 && (
          <div className="ai-panel__empty">
            <div className="ai-panel__empty-ico"><Icon.Sparkles size={20} /></div>
            <div className="ai-panel__empty-title">
              {isAgent ? "Give me a task" : `Ask about ${ctx.name.toLowerCase()}`}
            </div>
            <div className="ai-panel__empty-sub">
              {isAgent
                ? "I can create invoices, send reminders, log time and more."
                : "I know your clients, invoices, projects and tasks."}
            </div>
          </div>
        )}

        {msgs.map(msg => (
          <div key={msg.id} className={"ai-panel__msg" + (msg.role === "user" ? " ai-panel__msg--user" : "")}>
            {msg.role === "ai" && (
              <div className="ai-panel__ava ai-panel__ava--ai"><Icon.Sparkles size={11} /></div>
            )}
            <div className={"ai-panel__bubble ai-panel__bubble--" + msg.role}>
              {msg.role === "user" ? msg.text : <AIText lines={msg.lines} />}
              {msg.card && <AIActionCard card={msg.card} isAgent={msg.isAgent} />}
            </div>
            {msg.role === "user" && (
              <div className="ai-panel__ava ai-panel__ava--user">JK</div>
            )}
          </div>
        ))}

        {typing && (
          <div className="ai-panel__msg">
            <div className="ai-panel__ava ai-panel__ava--ai"><Icon.Sparkles size={11} /></div>
            <div className="ai-panel__bubble ai-panel__bubble--ai" style={{ padding: "10px 12px" }}>
              <div className="dot-pulse dot-pulse--accent">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* ── Suggestions (only when thread empty) ── */}
      {msgs.length === 0 && (
        <div className="ai-panel__sugg">
          {ctx.suggestions.map(s => (
            <button key={s} className="ai-panel__sugg-btn" onClick={() => sendMsg(s)}>
              <Icon.Sparkles size={11} />{s}
            </button>
          ))}
        </div>
      )}

      {/* ── Input ── */}
      <div className="ai-panel__foot">
        <div className={"ai-panel__input" + (isAgent ? " ai-panel__input--agent" : "")}>
          <textarea
            ref={inpRef}
            className="ai-panel__textarea"
            placeholder={isAgent ? "Give me a task…" : "Ask anything or @ mention…"}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
          />
          <div className="ai-panel__input-row">
            <button className="ai-panel__at-btn" title="@ mention">@</button>
            <button
              className={"ai-panel__send" + (input.trim() ? " ai-panel__send--on" : "")}
              onClick={() => sendMsg()}
              disabled={!input.trim() || typing}
              title="Send (Enter)"
            >
              <Icon.Send size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Container: state + global API + keyboard shortcut ────────────────────────
function AIContainer({ route }) {
  const [open, setOpen] = useAIPSt(() => {
    try { return localStorage.getItem("craftly-ai-open") === "true"; } catch { return false; }
  });
  const [mode, setMode] = useAIPSt(() => {
    try { return localStorage.getItem("craftly-ai-mode") || "ask"; } catch { return "ask"; }
  });

  useAIPEff(() => { try { localStorage.setItem("craftly-ai-open", open); } catch {} }, [open]);
  useAIPEff(() => { try { localStorage.setItem("craftly-ai-mode", mode); } catch {} }, [mode]);

  // Global API for inline chips and other components
  useAIPEff(() => {
    window.aiPanel = {
      open:   () => setOpen(true),
      close:  () => setOpen(false),
      toggle: () => setOpen(o => !o),
      prompt: (text) => {
        setOpen(true);
        setTimeout(() => {
          document.dispatchEvent(new CustomEvent("craftly-ai-prompt", { detail: text }));
        }, 80);
      },
    };
    return () => { window.aiPanel = null; };
  }, []);

  // ⌘J toggle
  useAIPEff(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setOpen(o => !o);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  if (!open) return <AIRail onOpen={() => setOpen(true)} />;
  return <AIPanel route={route} onClose={() => setOpen(false)} mode={mode} setMode={setMode} />;
}

window.AIContainer = AIContainer;
