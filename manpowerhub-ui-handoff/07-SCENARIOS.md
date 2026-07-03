# 07 — Scenarios (screens as usage examples)

The screens are **compositions** of the library — they prove the components work
together and serve as copy-ready examples. Build each as a Storybook page under
`Pages/*` and as a route in the example app. Each is defined exactly in
`reference/src/screens/<name>.jsx` — that is the visual truth; mock data lives in
`reference/src/data.jsx`.

For every scenario, ship **three states**: loaded, **loading** (skeletons),
**empty** (EmptyState). Data-fetching screens also get an **error** state (retry).

Route map (sidebar → screen file):

| Nav label | Route | Reference file |
|---|---|---|
| Dashboard | `dashboard` | `dashboard.jsx` |
| Workers | `clients` | `clients.jsx` |
| Sites | `projects` | `projects.jsx` |
| Tasks | `tasks` | `tasks.jsx` |
| Quotations | `documents` | `documents.jsx` |
| Invoices | `finance` | `finance.jsx` |
| Expenses | `expenses` | `expenses.jsx` |
| Timesheets | `time` | `time.jsx` |
| Settings | `settings` | `settings.jsx` |
| Sign in / onboarding | `login` | `login.jsx` |
| Design system | `design-system` | `design-system.jsx` |

---

## Dashboard
KPI row (4 `KPICard`) → `AreaChart` revenue panel + activity list → a
`DataTable` of recent items. Composes KPICard, AreaChart, Card, StatusBadge,
Avatar, DataTable. Loading = SkeletonKPI row + SkeletonChart + SkeletonTable.

## Workers (`clients`)
Directory of workers. Search + filter toolbar, `DataTable` (Avatar + name + role
+ site + status + HealthRing), row → detail. Bulk actions via checkboxes +
DropdownMenu. Empty = "No workers yet" EmptyState with add CTA.

## Sites (`projects`)
Card grid **or** table of sites/projects: name, client, `Progress`, team avatars
(AvatarGroup), `StatusBadge` (planning/active/on hold/done), `MiniBars`. Pinned
sites appear in the sidebar. Detail view = tabs (Overview / Workers / Documents /
Timeline).

## Tasks
Board or list. `StatusBadge` (todo/in_progress/done) + priority (high/med/low),
assignee Avatar, due date. Inline create row. Tabs for grouping. Empty per column.

## Quotations (`documents`)
List of quotes/documents with StatusBadge, amount (tabular), client, validity.
Opening one renders the **document template** (see `05`) in a preview pane. Create
flow = quotation form (fields, line items, optional items, live totals).

## Invoices (`finance`)
Finance overview: KPIs (outstanding / paid / overdue), `AreaChart`, invoices
`DataTable` with StatusBadge + aging. Row actions (send, record payment, credit
note) via DropdownMenu → dialogs.

## Expenses
Expense list with category, amount, receipt thumbnail, approval StatusBadge
(approved/todo). Approve/reject actions. Filter by date/category/site.

## Timesheets (`time`)
Weekly grid: workers × days, hours per cell, `MiniBars` weekly summary per row,
totals column. Approve week action. Empty = "No time logged".

## Settings
Sectioned form page: workspace, branding (document brand style picker — mono /
branded / serif from `05`), team & roles, billing, tax (TRN, VAT toggle that
drives document VAT rows), notifications. Uses Field/Input/Select/Switch/Tabs.

## Sign in / onboarding (`login`)
Full-screen (no shell). Centered auth card + marketing panel. Sign in / sign up /
onboarding steps. Theme toggle available. (The many earlier auth directions are
archived — build the one in `login.jsx`.)

## Design system (`design-system`)
The internal reference gallery — every primitive with its variants. In the
library this is largely **replaced by Storybook**, but keep an in-app version for
non-dev stakeholders. Mirror the Foundations + Core stories.

---

### Scenario story example

```tsx
// pages/dashboard.stories.tsx
export const Loaded: Story = { render: () => <Dashboard data={mock.dashboard} /> };
export const Loading: Story = { render: () => <Dashboard loading /> };
export const Empty:  Story = { render: () => <Dashboard data={mock.empty} /> };
export const Error:  Story = { render: () => <Dashboard error onRetry={() => {}} /> };
```

Wrap page stories in `<AppShell>` (with `parameters.layout: "fullscreen"`) so
reviewers see them in the real chrome, in light and dark.
