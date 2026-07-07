import * as React from "react";
import { cn } from "../../lib/utils";

export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  sidebar: React.ReactNode;
  topbar: React.ReactNode;
  sidebarOpen?: boolean;
  sidebarWidth?: number;
  children: React.ReactNode;
}

export const AppShell = React.forwardRef<HTMLDivElement, AppShellProps>(
  (
    { className, sidebar, topbar, sidebarOpen = true, sidebarWidth = 256, children, ...props },
    ref,
  ) => (
    <div ref={ref} className={cn("flex min-h-screen bg-background text-foreground", className)} {...props}>
      {sidebarOpen && (
        <aside
          style={{ width: sidebarWidth }}
          className="hidden shrink-0 border-r border-border md:block"
        >
          {sidebar}
        </aside>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center border-b border-border bg-background px-4">
          {topbar}
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  ),
);
AppShell.displayName = "AppShell";
