"use client";
import { AppShell } from "@manpowerhub/ui";

const Sidebar = () => (
  <nav className="flex flex-col gap-1 p-4">
    <div className="mb-2 font-display text-lg">ManpowerHub</div>
    <a className="rounded-md px-3 py-2 text-sm hover:bg-secondary" href="#">
      Dashboard
    </a>
    <a className="rounded-md px-3 py-2 text-sm hover:bg-secondary" href="#">
      Reports
    </a>
  </nav>
);
const Topbar = () => <div className="text-sm font-medium">Dashboard</div>;

export function AppShellDemo() {
  return (
    <AppShell
      className="h-64 min-h-0 overflow-hidden rounded-md border border-border"
      sidebar={<Sidebar />}
      topbar={<Topbar />}
    >
      <p className="text-sm text-muted-foreground">Main content area.</p>
    </AppShell>
  );
}
