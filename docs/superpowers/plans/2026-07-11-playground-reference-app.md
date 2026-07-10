# Playground Reference App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the playground's showcase grids with a wired, routed ManpowerHub reference app whose first slice is the app shell + Dashboard + full Quotations flow, composed only from `@manpowerhub/ui` and `@manpowerhub/blocks`.

**Architecture:** The playground stays a Vite SPA. `react-router-dom` provides real routes rendered inside the `app-shell` block. Dashboard data comes from a local `mock.ts` + a `useResource` fake-fetch hook driven by a dev `StateToggle` (four states). The Quotations flow reuses the library's `createMockQuotationApi()` (`list/get/create/update/remove/submitForApproval/decide`, all with built-in delay), shared across quotations routes via a React context, composing the quotation sub-blocks directly.

**Tech Stack:** React 18, Vite, TypeScript, Vitest + Testing Library, react-router-dom, `@manpowerhub/ui`, `@manpowerhub/blocks`.

## Global Constraints

- Screen/app files import ONLY from `@manpowerhub/ui` and `@manpowerhub/blocks` (plus `react`, `react-router-dom`, `lucide-react`). Never from `manpowerhub-ui-handoff/` reference source. Never reach into a raw primitive a block already wraps.
- The playground is a consumer app, NOT a library package: the component contract (cva/ref/className/stories/axe per component) does NOT apply to files created here.
- Dark mode = a `dark` class on `document.documentElement` (tokens define `.dark` in `globals.css`).
- Currency for quotations defaults to `"AED"`.
- Verify commands run from repo root: `pnpm --filter @manpowerhub/playground test` and `pnpm --filter @manpowerhub/playground build`.
- Frequent commits: one per task, Conventional Commits, scope `playground`.

---

## File Structure

```
apps/playground/src/
  main.tsx                 # MODIFY: mount <RouterProvider>
  App.tsx                  # MODIFY: export routes + <App/> = <RouterProvider router={createBrowserRouter(routes)}/>
  router.tsx               # CREATE: `routes` array (exported for tests)
  app/
    AppShell.tsx           # CREATE: wraps app-shell block; sidebar + topbar + theme + StateToggle + <Outlet/>
  data/
    mock.ts                # CREATE: dashboard mock data + types
    state-toggle.tsx       # CREATE: StateToggleProvider, useStateToggle, StateToggle widget
    use-resource.ts        # CREATE: useResource fake-fetch hook (Dashboard)
    quotation-api.tsx      # CREATE: QuotationApiProvider, useQuotationApi (shared mock api)
  screens/
    Dashboard.tsx          # CREATE
    QuotationsList.tsx      # CREATE
    QuotationDetail.tsx     # CREATE
    QuotationForm.tsx       # CREATE
  App.test.tsx             # MODIFY: router smoke test (createMemoryRouter)
  data/use-resource.test.tsx # CREATE: Dashboard state test

DELETE:
  apps/playground/src/pages/kitchen-sink.tsx
  apps/playground/src/pages/components-showcase.tsx
  apps/playground/src/pages/blocks-showcase.tsx
  apps/playground/src/pages/anchors.test.tsx
  apps/playground/src/pages/blocks-showcase.test.tsx
```

---

## Task 1: App frame — router, AppShell, delete grids

Stands up the routed shell. Dashboard and Quotations render trivial placeholders in this task; later tasks fill them. Proves the frame boots and routes resolve.

**Files:**
- Add dep: `apps/playground/package.json`
- Create: `apps/playground/src/router.tsx`
- Create: `apps/playground/src/app/AppShell.tsx`
- Create: `apps/playground/src/data/state-toggle.tsx`
- Create: `apps/playground/src/data/quotation-api.tsx`
- Modify: `apps/playground/src/App.tsx`
- Modify: `apps/playground/src/main.tsx`
- Modify: `apps/playground/src/App.test.tsx`
- Delete: the 5 files listed under DELETE above.

**Interfaces:**
- Produces:
  - `routes: RouteObject[]` (from `router.tsx`) — consumed by `App.tsx` and tests.
  - `AppShell` — React component, no required props; renders `<Outlet/>`.
  - `StateToggleProvider` (props: `{ initial?: Forced; children }`), `useStateToggle(): { forced: Forced; setForced(f: Forced): void }`, `StateToggle` component. `type Forced = "auto" | "loading" | "loaded" | "empty" | "error"`.
  - `QuotationApiProvider` (props: `{ children }`), `useQuotationApi(): QuotationApi`.

- [ ] **Step 1: Add react-router-dom dependency**

Edit `apps/playground/package.json` `dependencies`, adding (keep alphabetical near `react`):

```json
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
```

Then install:

Run: `pnpm install`
Expected: lockfile updates, `react-router-dom` linked into playground.

- [ ] **Step 2: Delete the showcase grid pages and their tests**

Run:
```bash
git rm apps/playground/src/pages/kitchen-sink.tsx \
       apps/playground/src/pages/components-showcase.tsx \
       apps/playground/src/pages/blocks-showcase.tsx \
       apps/playground/src/pages/anchors.test.tsx \
       apps/playground/src/pages/blocks-showcase.test.tsx
```
Expected: 5 files removed. (The `pages/` dir may now be empty — that's fine.)

- [ ] **Step 3: Create the StateToggle context + widget**

Create `apps/playground/src/data/state-toggle.tsx`:

```tsx
import * as React from "react";
import { Button } from "@manpowerhub/ui";

export type Forced = "auto" | "loading" | "loaded" | "empty" | "error";

interface StateToggleValue {
  forced: Forced;
  setForced: (f: Forced) => void;
}

const StateToggleContext = React.createContext<StateToggleValue | null>(null);

export function StateToggleProvider({
  initial = "auto",
  children,
}: {
  initial?: Forced;
  children: React.ReactNode;
}) {
  const [forced, setForced] = React.useState<Forced>(initial);
  const value = React.useMemo(() => ({ forced, setForced }), [forced]);
  return <StateToggleContext.Provider value={value}>{children}</StateToggleContext.Provider>;
}

export function useStateToggle(): StateToggleValue {
  const ctx = React.useContext(StateToggleContext);
  if (!ctx) throw new Error("useStateToggle must be used within StateToggleProvider");
  return ctx;
}

const OPTIONS: Forced[] = ["auto", "loading", "loaded", "empty", "error"];

export function StateToggle() {
  const { forced, setForced } = useStateToggle();
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1 rounded-md border border-border bg-background p-1 shadow-md">
      <span className="px-2 text-xs text-muted-foreground">State</span>
      {OPTIONS.map((o) => (
        <Button
          key={o}
          size="sm"
          variant={forced === o ? "default" : "ghost"}
          onClick={() => setForced(o)}
        >
          {o}
        </Button>
      ))}
    </div>
  );
}
```

Note: `Button` accepts `size`/`variant` via cva — confirm names by reading `packages/ui/src/components/button/button.tsx` before running; if `size="sm"` is absent, drop the `size` prop.

- [ ] **Step 4: Create the shared Quotation api context**

Create `apps/playground/src/data/quotation-api.tsx`:

```tsx
import * as React from "react";
import { createMockQuotationApi, type QuotationApi } from "@manpowerhub/blocks";

const QuotationApiContext = React.createContext<QuotationApi | null>(null);

export function QuotationApiProvider({ children }: { children: React.ReactNode }) {
  const apiRef = React.useRef<QuotationApi>(createMockQuotationApi());
  return (
    <QuotationApiContext.Provider value={apiRef.current}>{children}</QuotationApiContext.Provider>
  );
}

export function useQuotationApi(): QuotationApi {
  const api = React.useContext(QuotationApiContext);
  if (!api) throw new Error("useQuotationApi must be used within QuotationApiProvider");
  return api;
}
```

- [ ] **Step 5: Create the AppShell**

Create `apps/playground/src/app/AppShell.tsx`:

```tsx
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
```

Note: confirm the `font-display` utility and `LayoutDashboard`/`FileText` icon names exist (`lucide-react` is already a dep). If `font-display` is absent, drop it.

- [ ] **Step 6: Create the route table with placeholder screens**

Create `apps/playground/src/router.tsx`:

```tsx
import type { RouteObject } from "react-router-dom";
import { AppShell } from "./app/AppShell";
import { QuotationApiProvider } from "./data/quotation-api";

function Placeholder({ name }: { name: string }) {
  return <div className="text-muted-foreground">{name} — coming in a later task.</div>;
}

export const routes: RouteObject[] = [
  {
    element: <AppShell />,
    children: [
      { index: true, element: <Placeholder name="Dashboard" /> },
      {
        element: (
          <QuotationApiProvider>
            <PlaceholderOutlet />
          </QuotationApiProvider>
        ),
        children: [
          { path: "quotations", element: <Placeholder name="Quotations list" /> },
          { path: "quotations/new", element: <Placeholder name="Quotation form" /> },
          { path: "quotations/:id", element: <Placeholder name="Quotation detail" /> },
          { path: "quotations/:id/edit", element: <Placeholder name="Quotation form" /> },
        ],
      },
    ],
  },
];

import { Outlet } from "react-router-dom";
function PlaceholderOutlet() {
  return <Outlet />;
}
```

(Move the two `import` lines to the top of the file when writing — shown inline here for locality.)

- [ ] **Step 7: Rewrite App.tsx and main.tsx**

Replace `apps/playground/src/App.tsx` entirely:

```tsx
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "./router";

const router = createBrowserRouter(routes);

export function App() {
  return <RouterProvider router={router} />;
}
```

`main.tsx` already renders `<App />` and imports `./index.css` — no change needed. Verify it still reads:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

- [ ] **Step 8: Rewrite the smoke test**

Replace `apps/playground/src/App.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { routes } from "./router";

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
}

describe("Playground app frame", () => {
  it("renders the shell and Dashboard at /", () => {
    renderAt("/");
    expect(screen.getByText("ManpowerHub")).toBeInTheDocument();
    expect(screen.getByText(/Dashboard/)).toBeInTheDocument();
  });

  it("renders the quotations list route", () => {
    renderAt("/quotations");
    expect(screen.getByText(/Quotations list/)).toBeInTheDocument();
  });

  it("renders a quotation detail route", () => {
    renderAt("/quotations/abc");
    expect(screen.getByText(/Quotation detail/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 9: Run tests + typecheck/build**

Run: `pnpm --filter @manpowerhub/playground test`
Expected: PASS (3 tests).

Run: `pnpm --filter @manpowerhub/playground build`
Expected: `tsc -b` clean, Vite build succeeds.

- [ ] **Step 10: Commit**

```bash
git add apps/playground
git commit -m "feat(playground): routed app shell, delete showcase grids"
```

---

## Task 2: Dashboard data layer — mock.ts + useResource

The fake-fetch layer the Dashboard renders from. Independently testable via a unit test that exercises all four states.

**Files:**
- Create: `apps/playground/src/data/mock.ts`
- Create: `apps/playground/src/data/use-resource.ts`
- Create: `apps/playground/src/data/use-resource.test.tsx`

**Interfaces:**
- Consumes: `useStateToggle` from `./state-toggle` (Task 1).
- Produces:
  - Types `ActivityItem`, `RecentRow`, `DashboardData`; value `dashboardData: DashboardData`.
  - `type ResourceStatus = "loading" | "loaded" | "empty" | "error"`.
  - `useResource<T>(loader: () => T, delayMs?: number): { data: T | null; status: ResourceStatus; refetch: () => void }`.

- [ ] **Step 1: Create the dashboard mock data**

Create `apps/playground/src/data/mock.ts`:

```ts
import type { KPI } from "@manpowerhub/ui";
import type { AreaChartPoint } from "@manpowerhub/ui";

export interface ActivityItem {
  id: string;
  name: string;
  initials: string;
  action: string;
  when: string;
}

export interface RecentRow {
  id: string;
  number: string;
  client: string;
  amount: string;
  status: string;
}

export interface DashboardData {
  kpis: KPI[];
  revenue: AreaChartPoint[];
  activity: ActivityItem[];
  recent: RecentRow[];
}

export const dashboardData: DashboardData = {
  kpis: [
    { label: "Active workers", value: "342", delta: "+12", trend: "up" },
    { label: "Open quotations", value: "18", delta: "+3", trend: "up" },
    { label: "Revenue (MTD)", value: "AED 1.24M", delta: "+8%", trend: "up" },
    { label: "Overdue invoices", value: "5", delta: "-2", trend: "down" },
  ],
  revenue: [
    { x: "Jan", y: 820 }, { x: "Feb", y: 910 }, { x: "Mar", y: 870 },
    { x: "Apr", y: 1020 }, { x: "May", y: 1180 }, { x: "Jun", y: 1240 },
  ],
  activity: [
    { id: "a1", name: "Priya Nair", initials: "PN", action: "approved Q-1002", when: "2h ago" },
    { id: "a2", name: "Sam Okoro", initials: "SO", action: "added 4 scaffolders to Phoenix Mills", when: "5h ago" },
    { id: "a3", name: "Lena Marchetti", initials: "LM", action: "created Q-1004", when: "1d ago" },
  ],
  recent: [
    { id: "r1", number: "Q-1004", client: "Northwind Labs", amount: "AED 48,200", status: "Draft" },
    { id: "r2", number: "Q-1003", client: "Phoenix Mills", amount: "AED 12,000", status: "Pending" },
    { id: "r3", number: "Q-1002", client: "Delta Rigging", amount: "AED 96,500", status: "Approved" },
  ],
};
```

Note: confirm `KPI` and `AreaChartPoint` are exported from `@manpowerhub/ui` root (they are re-exported from kpi-card / area-chart). If a type import fails, import from the same root package it lives in.

- [ ] **Step 2: Write the failing useResource test**

Create `apps/playground/src/data/use-resource.test.tsx`:

```tsx
import { render, screen, act } from "@testing-library/react";
import { StateToggleProvider, type Forced } from "./state-toggle";
import { useResource } from "./use-resource";

function Probe() {
  const { data, status } = useResource(() => "payload", 100);
  return (
    <div>
      <span data-testid="status">{status}</span>
      <span data-testid="data">{data ?? "null"}</span>
    </div>
  );
}

function renderForced(forced: Forced) {
  return render(
    <StateToggleProvider initial={forced}>
      <Probe />
    </StateToggleProvider>,
  );
}

describe("useResource", () => {
  it("forces loaded and returns loader data", () => {
    renderForced("loaded");
    expect(screen.getByTestId("status")).toHaveTextContent("loaded");
    expect(screen.getByTestId("data")).toHaveTextContent("payload");
  });

  it("forces empty with null data", () => {
    renderForced("empty");
    expect(screen.getByTestId("status")).toHaveTextContent("empty");
    expect(screen.getByTestId("data")).toHaveTextContent("null");
  });

  it("forces error", () => {
    renderForced("error");
    expect(screen.getByTestId("status")).toHaveTextContent("error");
  });

  it("auto starts loading then resolves to loaded", async () => {
    vi.useFakeTimers();
    renderForced("auto");
    expect(screen.getByTestId("status")).toHaveTextContent("loading");
    await act(async () => {
      vi.advanceTimersByTime(150);
    });
    expect(screen.getByTestId("status")).toHaveTextContent("loaded");
    vi.useRealTimers();
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `pnpm --filter @manpowerhub/playground test use-resource`
Expected: FAIL — `use-resource` module / `useResource` not found.

- [ ] **Step 4: Implement useResource**

Create `apps/playground/src/data/use-resource.ts`:

```ts
import * as React from "react";
import { useStateToggle } from "./state-toggle";

export type ResourceStatus = "loading" | "loaded" | "empty" | "error";

export function useResource<T>(
  loader: () => T,
  delayMs = 600,
): { data: T | null; status: ResourceStatus; refetch: () => void } {
  const { forced } = useStateToggle();
  const [status, setStatus] = React.useState<ResourceStatus>("loading");
  const [data, setData] = React.useState<T | null>(null);
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    if (forced !== "auto") {
      setStatus(forced);
      setData(forced === "loaded" ? loader() : null);
      return;
    }
    setStatus("loading");
    setData(null);
    const t = setTimeout(() => {
      setData(loader());
      setStatus("loaded");
    }, delayMs);
    return () => clearTimeout(t);
    // loader is treated as stable (module-level mock); tick forces re-run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forced, tick, delayMs]);

  const refetch = React.useCallback(() => setTick((n) => n + 1), []);
  return { data, status, refetch };
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `pnpm --filter @manpowerhub/playground test use-resource`
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add apps/playground/src/data
git commit -m "feat(playground): dashboard mock data + useResource lifecycle hook"
```

---

## Task 3: Dashboard screen

Composes the dashboard from library blocks, branching on all four `useResource` states. Wires into the router (replacing the index placeholder).

**Files:**
- Create: `apps/playground/src/screens/Dashboard.tsx`
- Modify: `apps/playground/src/router.tsx` (index route → `<Dashboard/>`)
- Modify: `apps/playground/src/App.test.tsx` (assert Dashboard content)

**Interfaces:**
- Consumes: `useResource`, `dashboardData`, `DashboardData` (Task 2); `useStateToggle` (Task 1); blocks `PageHeader`, `StatCardRow`, `EmptyState`; ui `AreaChart`, `Card`/`CardHeader`/`CardTitle`/`CardBody`, `Avatar`/`AvatarFallback`, `Badge`, `Table`/`TableHeader`/`TableBody`/`TableRow`/`TableHead`/`TableCell`, `Skeleton`, `Button`.
- Produces: `Dashboard` component.

- [ ] **Step 1: Create the Dashboard screen**

Create `apps/playground/src/screens/Dashboard.tsx`:

```tsx
import { PageHeader, StatCardRow, EmptyState } from "@manpowerhub/blocks";
import {
  AreaChart,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Avatar,
  AvatarFallback,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Skeleton,
  Button,
} from "@manpowerhub/ui";
import { LayoutDashboard } from "lucide-react";
import { useResource } from "../data/use-resource";
import { dashboardData, type DashboardData } from "../data/mock";

export function Dashboard() {
  const { data, status, refetch } = useResource<DashboardData>(() => dashboardData);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" description="Overview of your workforce and quotations." />

      {status === "loading" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      )}

      {status === "empty" && (
        <EmptyState
          variant="dashed"
          icon={<LayoutDashboard />}
          title="Nothing to show yet"
          description="Once you add workers and quotations, your dashboard lights up here."
        />
      )}

      {status === "error" && (
        <div className="flex flex-col items-start gap-3 rounded-md border border-border p-6">
          <p className="text-sm text-destructive">Could not load the dashboard.</p>
          <Button onClick={refetch}>Retry</Button>
        </div>
      )}

      {status === "loaded" && data && (
        <div className="flex flex-col gap-6">
          <StatCardRow stats={data.kpis} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
              </CardHeader>
              <CardBody>
                <AreaChart data={data.revenue} height={220} className="w-full" />
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity</CardTitle>
              </CardHeader>
              <CardBody>
                <ul className="flex flex-col gap-4">
                  {data.activity.map((a) => (
                    <li key={a.id} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{a.initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm">
                          <span className="font-medium">{a.name}</span> {a.action}
                        </p>
                        <p className="text-xs text-muted-foreground">{a.when}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent quotations</CardTitle>
            </CardHeader>
            <CardBody>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Number</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recent.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.number}</TableCell>
                      <TableCell>{r.client}</TableCell>
                      <TableCell className="text-right tabular-nums">{r.amount}</TableCell>
                      <TableCell>
                        <Badge>{r.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
```

Note: confirm `AreaChart` accepts `height`/`className` (it extends `SVGAttributes`, `height` is a prop). Confirm `Card`/`CardBody` names against `packages/ui/src/components/card/card.tsx` (exports are `Card`, `CardHeader`, `CardTitle`, `CardBody`, `CardFooter`).

- [ ] **Step 2: Wire the Dashboard into the router**

In `apps/playground/src/router.tsx`: add `import { Dashboard } from "./screens/Dashboard";` at the top, and change the index route:

```tsx
      { index: true, element: <Dashboard /> },
```

Remove the now-unused `Placeholder name="Dashboard"` usage (keep `Placeholder` for the still-stubbed quotations routes).

- [ ] **Step 3: Update the smoke test to assert real Dashboard content**

In `apps/playground/src/App.test.tsx`, change the first test's assertion from `/Dashboard/` placeholder to real content:

```tsx
  it("renders the shell and Dashboard at /", () => {
    renderAt("/");
    expect(screen.getByText("ManpowerHub")).toBeInTheDocument();
    expect(
      screen.getByText("Overview of your workforce and quotations."),
    ).toBeInTheDocument();
  });
```

- [ ] **Step 4: Add a Dashboard state test**

Append to `apps/playground/src/App.test.tsx`:

```tsx
import { StateToggleProvider } from "./data/state-toggle";
import { Dashboard } from "./screens/Dashboard";

describe("Dashboard states", () => {
  it("shows the empty state when forced empty", () => {
    render(
      <StateToggleProvider initial="empty">
        <Dashboard />
      </StateToggleProvider>,
    );
    expect(screen.getByText("Nothing to show yet")).toBeInTheDocument();
  });

  it("shows retry when forced error", () => {
    render(
      <StateToggleProvider initial="error">
        <Dashboard />
      </StateToggleProvider>,
    );
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("renders KPIs when forced loaded", () => {
    render(
      <StateToggleProvider initial="loaded">
        <Dashboard />
      </StateToggleProvider>,
    );
    expect(screen.getByText("Active workers")).toBeInTheDocument();
  });
});
```

- [ ] **Step 5: Run tests + build**

Run: `pnpm --filter @manpowerhub/playground test`
Expected: PASS (all suites).

Run: `pnpm --filter @manpowerhub/playground build`
Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add apps/playground
git commit -m "feat(playground): dashboard screen composed from blocks with four states"
```

---

## Task 4: Quotations list screen

Real list route reading from the shared mock api, with search toolbar, navigate-to-detail, and an explicit empty state.

**Files:**
- Create: `apps/playground/src/screens/QuotationsList.tsx`
- Modify: `apps/playground/src/router.tsx` (`quotations` route → `<QuotationsList/>`)
- Modify: `apps/playground/src/App.test.tsx` (assert list renders)

**Interfaces:**
- Consumes: `useQuotationApi` (Task 1); blocks `PageHeader`, `DataTableToolbar`, `QuotationList`, `EmptyState`; type `PersistedQuotation` from `@manpowerhub/blocks`; ui `Button`; react-router `useNavigate`.
- Produces: `QuotationsList` component.

- [ ] **Step 1: Create the QuotationsList screen**

Create `apps/playground/src/screens/QuotationsList.tsx`:

```tsx
import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  PageHeader,
  DataTableToolbar,
  QuotationList,
  EmptyState,
  type PersistedQuotation,
} from "@manpowerhub/blocks";
import { Button } from "@manpowerhub/ui";
import { FileText } from "lucide-react";
import { useQuotationApi } from "../data/quotation-api";

type Status = "loading" | "loaded" | "error";

export function QuotationsList() {
  const api = useQuotationApi();
  const navigate = useNavigate();
  const [items, setItems] = React.useState<PersistedQuotation[]>([]);
  const [status, setStatus] = React.useState<Status>("loading");
  const [search, setSearch] = React.useState("");

  const load = React.useCallback(() => {
    setStatus("loading");
    api
      .list()
      .then((rows) => {
        setItems(rows);
        setStatus("loaded");
      })
      .catch(() => setStatus("error"));
  }, [api]);

  React.useEffect(() => {
    load();
  }, [load]);

  const filtered = items.filter((q) =>
    `${q.quotationNumber} ${q.customer.name}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Quotations"
        description="Create, review, and approve quotations."
        actions={<Button onClick={() => navigate("/quotations/new")}>New quotation</Button>}
      />

      <DataTableToolbar
        search={{ value: search, onChange: setSearch, placeholder: "Search quotations…" }}
      />

      {status === "error" && (
        <div className="flex flex-col items-start gap-3 rounded-md border border-border p-6">
          <p className="text-sm text-destructive">Could not load quotations.</p>
          <Button onClick={load}>Retry</Button>
        </div>
      )}

      {status !== "error" && status === "loaded" && filtered.length === 0 && (
        <EmptyState
          variant="dashed"
          icon={<FileText />}
          title="No quotations yet"
          description="Create your first quotation to get started."
          action={{ label: "New quotation", onClick: () => navigate("/quotations/new") }}
        />
      )}

      {status !== "error" && !(status === "loaded" && filtered.length === 0) && (
        <QuotationList
          quotations={filtered}
          isLoading={status === "loading"}
          onOpen={(id) => navigate(`/quotations/${id}`)}
          onNew={() => navigate("/quotations/new")}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Wire into the router**

In `apps/playground/src/router.tsx`: add `import { QuotationsList } from "./screens/QuotationsList";`, and change the `quotations` child route:

```tsx
          { path: "quotations", element: <QuotationsList /> },
```

- [ ] **Step 3: Update the smoke test**

In `apps/playground/src/App.test.tsx`, change the quotations-list test. The mock api's `list()` resolves async, so assert the header (synchronous) instead of the placeholder:

```tsx
  it("renders the quotations list route", () => {
    renderAt("/quotations");
    expect(
      screen.getByText("Create, review, and approve quotations."),
    ).toBeInTheDocument();
  });
```

- [ ] **Step 4: Run tests + build**

Run: `pnpm --filter @manpowerhub/playground test`
Expected: PASS.

Run: `pnpm --filter @manpowerhub/playground build`
Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add apps/playground
git commit -m "feat(playground): quotations list screen from mock api"
```

---

## Task 5: Quotation detail screen

Master-detail composition: list pane + detail pane + full-document view (toggled via a `view=full` search param), with all detail handlers wired to the api. Mirrors the wiring in `packages/blocks/src/components/quotations-page/quotations-page.tsx`, split across routes.

**Files:**
- Create: `apps/playground/src/screens/QuotationDetail.tsx`
- Modify: `apps/playground/src/router.tsx` (`quotations/:id` route → `<QuotationDetail/>`)

**Interfaces:**
- Consumes: `useQuotationApi` (Task 1); blocks `MasterDetailShell`, `QuotationListPane`, `QuotationDetail` (the block; alias on import), `QuotationDocument`, `EmptyState`; type `PersistedQuotation`; react-router `useParams`, `useNavigate`, `useSearchParams`; `FileText` icon.
- Produces: `QuotationDetail` screen component (exported name `QuotationDetailScreen` to avoid colliding with the block).

- [ ] **Step 1: Create the QuotationDetail screen**

Create `apps/playground/src/screens/QuotationDetail.tsx`:

```tsx
import * as React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  MasterDetailShell,
  QuotationListPane,
  QuotationDetail as QuotationDetailBlock,
  QuotationDocument,
  EmptyState,
  type PersistedQuotation,
} from "@manpowerhub/blocks";
import { FileText } from "lucide-react";
import { useQuotationApi } from "../data/quotation-api";

export function QuotationDetailScreen() {
  const api = useQuotationApi();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [params, setParams] = useSearchParams();
  const isFull = params.get("view") === "full";

  const [items, setItems] = React.useState<PersistedQuotation[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const refetch = React.useCallback(() => {
    setLoading(true);
    return api
      .list()
      .then((rows) => setItems(rows))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [api]);

  React.useEffect(() => {
    void refetch();
  }, [refetch]);

  const current = id ? items.find((q) => q.id === id) : undefined;

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const listPane = (
    <QuotationListPane
      quotations={items}
      selectedId={id ?? null}
      isLoading={loading}
      onOpen={(nextId) => navigate(`/quotations/${nextId}`)}
      onNew={() => navigate("/quotations/new")}
    />
  );

  const detail = current ? (
    <QuotationDetailBlock
      quotation={current}
      busy={busy}
      onEdit={() => navigate(`/quotations/${current.id}/edit`)}
      onFullView={() => setParams({ view: "full" })}
      onPrint={() => setParams({ view: "full" })}
      onSubmitForApproval={() =>
        run(async () => {
          await api.submitForApproval(current.id);
          await refetch();
        })
      }
      onDecide={(approverId, decision, comment) =>
        run(async () => {
          await api.decide(current.id, approverId, decision, comment);
          await refetch();
        })
      }
      onDelete={() =>
        run(async () => {
          await api.remove(current.id);
          await refetch();
          navigate("/quotations");
        })
      }
    />
  ) : undefined;

  const placeholder = (
    <EmptyState
      variant="dashed"
      icon={<FileText />}
      title="Select a quotation"
      description="Choose a quotation from the list to see its details."
    />
  );

  const full = current ? (
    <div className="flex flex-col items-center gap-4">
      <QuotationDocument quotation={current} />
    </div>
  ) : undefined;

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <MasterDetailShell
        list={listPane}
        detail={detail}
        detailPlaceholder={placeholder}
        full={full}
        isFull={isFull && !!current}
        hasSelection={!!current}
        onBack={() => (isFull ? setParams({}) : navigate("/quotations"))}
      />
    </div>
  );
}
```

- [ ] **Step 2: Wire into the router**

In `apps/playground/src/router.tsx`: add `import { QuotationDetailScreen } from "./screens/QuotationDetail";`, and change the route:

```tsx
          { path: "quotations/:id", element: <QuotationDetailScreen /> },
```

- [ ] **Step 3: Add a detail smoke test**

Append to `apps/playground/src/App.test.tsx` a test that the detail route mounts the master-detail placeholder (no valid id → placeholder shows). Since list loads async, assert the placeholder text which renders immediately when `current` is undefined:

```tsx
import { findByText } from "@testing-library/react";

describe("Quotation detail route", () => {
  it("shows the select-a-quotation placeholder for an unknown id", async () => {
    renderAt("/quotations/does-not-exist");
    expect(await screen.findByText("Select a quotation")).toBeInTheDocument();
  });
});
```

(`renderAt` and `screen` are already imported at the top of the file from Task 1/3. Remove the unused `findByText` import if your linter flags it — `screen.findByText` is used instead.)

- [ ] **Step 4: Run tests + build**

Run: `pnpm --filter @manpowerhub/playground test`
Expected: PASS.

Run: `pnpm --filter @manpowerhub/playground build`
Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add apps/playground
git commit -m "feat(playground): quotation detail master-detail screen with document view"
```

---

## Task 6: Quotation form screen

New + edit routes. Loads initial data for edit, submits via `create`/`update`, navigates to the detail on success.

**Files:**
- Create: `apps/playground/src/screens/QuotationForm.tsx`
- Modify: `apps/playground/src/router.tsx` (`quotations/new` and `quotations/:id/edit` → `<QuotationFormScreen/>`)

**Interfaces:**
- Consumes: `useQuotationApi` (Task 1); block `QuotationForm` (aliased) and types `QuotationAggregateData`, `PersistedQuotation`; react-router `useParams`, `useNavigate`.
- Produces: `QuotationFormScreen` component.

- [ ] **Step 1: Create the QuotationForm screen**

Create `apps/playground/src/screens/QuotationForm.tsx`:

```tsx
import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  QuotationForm as QuotationFormBlock,
  type QuotationAggregateData,
  type PersistedQuotation,
} from "@manpowerhub/blocks";
import { useQuotationApi } from "../data/quotation-api";

export function QuotationFormScreen() {
  const api = useQuotationApi();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [initial, setInitial] = React.useState<PersistedQuotation | undefined>(undefined);
  const [ready, setReady] = React.useState(!isEdit);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!id) return;
    let alive = true;
    api.get(id).then((q) => {
      if (!alive) return;
      setInitial(q);
      setReady(true);
    });
    return () => {
      alive = false;
    };
  }, [api, id]);

  const handleSubmit = (data: QuotationAggregateData) => {
    setSubmitting(true);
    const op = isEdit && id ? api.update(id, data) : api.create(data);
    op.then((saved) => {
      const savedId = "id" in saved ? saved.id : id;
      navigate(`/quotations/${savedId}`);
    }).finally(() => setSubmitting(false));
  };

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <QuotationFormBlock
        initial={initial}
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={() => navigate(id ? `/quotations/${id}` : "/quotations")}
      />
    </div>
  );
}
```

Note: `api.update` resolves to a `PersistedQuotation` and `api.create` likewise, both carrying `id` — the `"id" in saved` guard is defensive; `saved.id` is always present. Confirm `QuotationForm`'s `initial` accepts a `PersistedQuotation` (it is typed `QuotationAggregateData`, and `PersistedQuotation extends`/is-assignable-to it — if TypeScript complains, spread the aggregate fields: `initial={initial as QuotationAggregateData | undefined}`).

- [ ] **Step 2: Wire both routes into the router**

In `apps/playground/src/router.tsx`: add `import { QuotationFormScreen } from "./screens/QuotationForm";`, and change both form routes:

```tsx
          { path: "quotations/new", element: <QuotationFormScreen /> },
          ...
          { path: "quotations/:id/edit", element: <QuotationFormScreen /> },
```

Remove the now-unused `Placeholder` component and its import if no route references it anymore.

- [ ] **Step 3: Add a form route smoke test**

Append to `apps/playground/src/App.test.tsx`:

```tsx
describe("Quotation form route", () => {
  it("mounts the new-quotation form", () => {
    renderAt("/quotations/new");
    // The form renders synchronously in create mode (ready = true).
    // Assert a stable form control label from the QuotationForm block.
    expect(document.querySelector("form")).toBeTruthy();
  });
});
```

- [ ] **Step 4: Run tests + build**

Run: `pnpm --filter @manpowerhub/playground test`
Expected: PASS (all suites).

Run: `pnpm --filter @manpowerhub/playground build`
Expected: clean.

- [ ] **Step 5: Manual end-to-end check (run the app)**

Run: `pnpm --filter @manpowerhub/playground dev`
Verify in the browser:
- `/` shows the shell + Dashboard; StateToggle (bottom-right) flips loading/empty/error/loaded.
- Sidebar → Quotations shows the list; a row opens `/quotations/:id` with the master-detail + document.
- "New quotation" → form → save → lands on the new detail; "Edit" → form prefilled → save updates.
- Theme toggle switches light/dark.

- [ ] **Step 6: Commit**

```bash
git add apps/playground
git commit -m "feat(playground): quotation create/edit form screen"
```

---

## Self-Review Notes

- **Spec coverage:** replace grids (Task 1 delete) ✓; router + app-shell (Task 1) ✓; simulated lifecycle + StateToggle (Tasks 2–3) ✓; Dashboard composition (Task 3) ✓; Quotations composed from sub-blocks with real URLs (Tasks 4–6) ✓; shared mock api, empty via `createMockQuotationApi([])` philosophy — here empty is reached via filtered/empty list and `EmptyState` (Task 4) ✓; thin router + state tests (all tasks) ✓; out-of-scope screens untouched ✓.
- **Import rule:** every screen imports only from `@manpowerhub/ui` / `@manpowerhub/blocks` / react-router / lucide ✓.
- **Known verification points flagged inline** (button `size` prop, `font-display` utility, `Card`/`AreaChart`/type re-exports, `QuotationForm.initial` assignability) — the implementer confirms each against the referenced source file before running; these are the only uncertainties and each has a stated fallback.
```
