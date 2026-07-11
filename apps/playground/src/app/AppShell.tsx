import * as React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { AppShell as AppShellBlock, ThemeToggle } from "@manpowerhub/ui";
import { LayoutDashboard, FileText } from "lucide-react";
import { StateToggleProvider, StateToggle } from "../data/state-toggle";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, enabled: true, end: true },
  { to: "/quotations", label: "Quotations", icon: FileText, enabled: true, end: false },
];

const SOON = ["Workers", "Sites", "Tasks", "Invoices", "Expenses", "Timesheets", "Settings"];

function Sidebar() {
  return (
    <nav className="flex h-full flex-col gap-1 p-4">
      <div className="mb-4 px-2 font-display text-lg">ManpowerHub</div>
      {NAV.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
              isActive
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary"
            }`
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
      <div className="mt-4 px-3 text-xs uppercase text-muted-foreground">Soon</div>
      {SOON.map((label) => (
        <span
          key={label}
          className="cursor-not-allowed rounded-md px-3 py-2 text-sm text-muted-foreground/50"
        >
          {label}
        </span>
      ))}
    </nav>
  );
}

export function AppShell() {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <StateToggleProvider>
      <AppShellBlock
        sidebar={<Sidebar />}
        topbar={
          <div className="flex w-full items-center justify-end">
            <ThemeToggle theme={theme} onThemeChange={setTheme} />
          </div>
        }
      >
        <Outlet />
      </AppShellBlock>
      <StateToggle />
    </StateToggleProvider>
  );
}
