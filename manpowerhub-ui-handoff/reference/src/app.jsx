// ManpowerHub — main app shell.
const { useState: useStateA, useEffect: useEffectA, useMemo: useMemoA } = React;

// ----- Flat sidebar navigation -----
// Each section is a labelled group; first group has no label.
const SIDEBAR_NAV = [
  { items: [
    { id: "dashboard",  icon: "Home",        label: "Dashboard",   route: "dashboard" },
    { id: "workers",    icon: "Users",        label: "Workers",     route: "clients",   count: 2847 },
    { id: "sites",      icon: "Layers",       label: "Sites",       route: "projects",  count: 24 },
    { id: "tasks",      icon: "CheckSquare",  label: "Tasks",       route: "tasks",     count: 8 },
  ]},
  { label: "Finance", items: [
    { id: "quotations", icon: "FileText",     label: "Quotations",  route: "documents", count: 5 },
    { id: "invoices",   icon: "Receipt",      label: "Invoices",    route: "finance",   count: 5 },
    { id: "expenses",   icon: "Wallet",       label: "Expenses",    route: "expenses" },
  ]},
  { label: "Operations", items: [
    { id: "timesheets", icon: "Timer",        label: "Timesheets",  route: "time" },
  ]},
];

const SIDEBAR_PINNED = [
  { id: "pin-sitealpha", icon: "Layers", label: "Site Alpha — Emaar",  route: "projects", color: "var(--accent)"  },
  { id: "pin-festival",  icon: "Layers", label: "Festival City Exp.",  route: "projects", color: "var(--warning)" },
];

// Internal section — kept tiny, lives at the bottom of the sidebar.
const SIDEBAR_INTERNAL = [
  { id: "ds",       icon: "Layers", label: "Design system",      route: "design-system" },
  { id: "login",    icon: "Lock",   label: "Login / onboarding", route: "login" },
];

// Mobile bottom tab bar — 4 primary destinations; the rest live under "More".
const MOBILE_TABS = [
  { id: "m-dashboard", icon: "Home",        label: "Home",    route: "dashboard" },
  { id: "m-workers",   icon: "Users",       label: "Workers", route: "clients"   },
  { id: "m-sites",     icon: "Layers",      label: "Sites",   route: "projects"  },
  { id: "m-tasks",     icon: "CheckSquare", label: "Tasks",   route: "tasks"     },
];

const ROUTE_LABELS = {
  "design-system": ["Internal",    "Design system"],
  "dashboard":     ["Overview",    "Dashboard"    ],
  "clients":       ["Operations",  "Workers"      ],
  "projects":      ["Operations",  "Sites"        ],
  "documents":     ["Finance",     "Quotations"   ],
  "finance":       ["Finance",     "Invoices"     ],
  "tasks":         ["Operations",  "Tasks"        ],
  "time":          ["Operations",  "Timesheets"   ],
  "expenses":      ["Finance",     "Expenses"     ],
  "settings":      ["Settings",    "General"      ],
  "login":         ["Internal",    "Sign in"      ],
};

function App() {
  // Allow ?route=... and ?theme=... overrides (used by Figma export workflow)
  const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const urlRoute = urlParams && urlParams.get("route");
  const urlTheme = urlParams && urlParams.get("theme");

  const [theme, setTheme] = useStateA(() => urlTheme || localStorage.getItem("manpowerhub-theme") || "light");
  const [route, setRoute] = useStateA(() => urlRoute || localStorage.getItem("manpowerhub-route") || "dashboard");
  const [cmdkOpen, setCmdkOpen] = useStateA(false);
  const [navOpen, setNavOpen] = useStateA(false);

  useEffectA(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("manpowerhub-theme", theme);
  }, [theme]);

  useEffectA(() => {
    localStorage.setItem("manpowerhub-route", route);
  }, [route]);

  // Cmd+K trigger
  useEffectA(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdkOpen(true);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const goto = (r) => { setRoute(r); setNavOpen(false); };

  // Hide sidebar for login/full-screen routes
  const fullscreen = route === "login";

  if (fullscreen) {
    return (
      <>
        <Screens.Login goto={goto} theme={theme} setTheme={setTheme} />
        <CmdK open={cmdkOpen} onClose={() => setCmdkOpen(false)} onNavigate={goto} />
      </>
    );
  }

  const crumbs = ROUTE_LABELS[route] || ["", ""];

  // Helper — render a sidebar nav item
  const navItem = (it, opts = {}) => {
    const Ic = Icon[it.icon];
    const active = opts.activeRoute === it.route || route === it.route;
    return (
      <div
        key={it.id}
        className="sidebar__item"
        data-active={active}
        onClick={() => goto(it.route)}
      >
        <span className="sidebar__item-icon" style={it.color ? { color: it.color } : undefined}>
          <Ic size={15} />
        </span>
        <span className="sidebar__item-label">{it.label}</span>
        {typeof it.count === "number" && <span className="sidebar__item-count">{it.count}</span>}
      </div>
    );
  };

  return (
    <>
      <div className="app" data-nav-open={navOpen}>
        {/* Flat sidebar */}
        <aside className="sidebar">
          <div className="sidebar__header">
            <div className="sidebar__logo" title="ManpowerHub">M</div>
            <div className="sidebar__workspace" title="Workspace">
              <span className="sidebar__workspace-name">ManpowerHub</span>
              <Icon.ChevronDown size={13} />
            </div>
            <button
              className="sidebar__icon-btn"
              title="Settings"
              onClick={() => goto("settings")}
              aria-label="Settings"
            >
              <Icon.Settings size={14} />
            </button>
          </div>

          <div className="sidebar__body">
            {SIDEBAR_NAV.map((sec, i) => (
              <div className="sidebar__section" key={i}>
                {sec.label && (
                  <div className="sidebar__section-label">
                    <span>{sec.label}</span>
                    <button
                      className="sidebar__section-label-add"
                      title={`New in ${sec.label}`}
                      onClick={(e) => { e.stopPropagation(); setCmdkOpen(true); }}
                      aria-label={`New in ${sec.label}`}
                    >
                      <Icon.Plus size={11} />
                    </button>
                  </div>
                )}
                {sec.items.map((it) => navItem(it))}
              </div>
            ))}

            {SIDEBAR_PINNED.length > 0 && (
              <div className="sidebar__section">
                <div className="sidebar__section-label"><span>Pinned</span></div>
                {SIDEBAR_PINNED.map((it) => navItem(it))}
              </div>
            )}

            <div className="sidebar__section">
              <div className="sidebar__section-label"><span>Internal</span></div>
              {SIDEBAR_INTERNAL.map((it) => navItem(it))}
            </div>
          </div>

          <div className="sidebar__footer">
            <div className="sidebar__user">
              <Avatar name={MockData.user.name} size={28} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="sidebar__user-name">{MockData.user.name}</div>
                <div className="sidebar__user-plan">{MockData.user.plan} plan</div>
              </div>
              <Icon.ChevronDown size={14} />
            </div>
          </div>
        </aside>

        {navOpen && <div className="nav-backdrop" onClick={() => setNavOpen(false)} aria-hidden="true" />}

        {/* Main */}
        <main className="main">
          <header className="topbar">
            <button
              className="topbar__burger"
              onClick={() => setNavOpen(true)}
              aria-label="Open menu"
            >
              <Icon.Menu size={18} />
            </button>
            <div className="topbar__crumbs">
              <span>{crumbs[0]}</span>
              <Icon.ChevronRight size={12} />
              <strong>{crumbs[1]}</strong>
            </div>

            {/* Promoted global search (the V3 idea we kept) */}
            <div
              className="topbar__search"
              role="button"
              tabIndex={0}
              onClick={() => setCmdkOpen(true)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setCmdkOpen(true); } }}
              aria-label="Search workers, sites, invoices…"
            >
              <Icon.Search size={14} />
              <span>Search workers, sites, invoices…</span>
              <kbd>⌘K</kbd>
            </div>

            <div className="topbar__actions">
              <button className="btn btn--ghost btn--sm" onClick={() => window.aiPanel ? window.aiPanel.toggle() : setCmdkOpen(true)}>
                <Icon.Sparkles size={14} />
                AI Agent
              </button>
              <button className="btn btn--ghost btn--icon btn--sm" title="Notifications">
                <Icon.Bell size={15} />
              </button>
              <ThemeToggle theme={theme} setTheme={setTheme} />
            </div>
          </header>
          <div className="main__body">
            <Router route={route} goto={goto} />
          </div>
        </main>
        <AIContainer route={route} />

        {/* Mobile bottom tab bar — phone only (CSS-gated) */}
        <nav className="mobile-tabs" aria-label="Primary">
          {MOBILE_TABS.map((t) => {
            const Ic = Icon[t.icon];
            const active = route === t.route;
            return (
              <button
                key={t.id}
                className="mobile-tabs__btn"
                data-active={active}
                onClick={() => goto(t.route)}
              >
                <Ic size={20} />
                <span>{t.label}</span>
              </button>
            );
          })}
          <button
            className="mobile-tabs__btn"
            data-active={navOpen}
            onClick={() => setNavOpen(true)}
          >
            <Icon.Menu size={20} />
            <span>More</span>
          </button>
        </nav>
      </div>

      <CmdK open={cmdkOpen} onClose={() => setCmdkOpen(false)} onNavigate={goto} />
    </>
  );
}

function ThemeToggle({ theme, setTheme }) {
  return (
    <div className="theme-toggle">
      <button data-active={theme === "light"} onClick={() => setTheme("light")} title="Light"><Icon.Sun size={13} /></button>
      <button data-active={theme === "dark"} onClick={() => setTheme("dark")} title="Dark"><Icon.Moon size={13} /></button>
    </div>
  );
}

function Router({ route, goto }) {
  const S = window.Screens;
  switch (route) {
    case "design-system": return <S.DesignSystem />;
    case "dashboard":     return <S.Dashboard goto={goto} />;
    case "clients":       return <S.Clients goto={goto} />;
    case "projects":      return <S.Projects goto={goto} />;
    case "documents":     return <S.Documents goto={goto} />;
    case "finance":       return <S.Finance goto={goto} />;
    case "tasks":         return <S.Tasks goto={goto} />;
    case "time":          return <S.TimeTracker goto={goto} />;
    case "expenses":      return <S.Expenses goto={goto} />;
    case "settings":      return <S.Settings goto={goto} />;
    default:              return <S.DesignSystem />;
  }
}

window.App = App;
