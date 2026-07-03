# 04 — App shell & data-viz

Reference: `reference/src/app.jsx` (shell), `reference/src/components/cmdk.jsx`
(⌘K), `reference/src/components/primitives.jsx` (charts/KPI),
`reference/src/components/skeletons.jsx` (all loaders).

---

## AppShell

The whole application chrome. In the reference it's a **flat sidebar + topbar**
layout (the earlier rail+pane concept was dropped — build the flat version).

```ts
interface NavItem { id: string; icon: IconName; label: string; route: string; count?: number; color?: string; }
interface NavSection { label?: string; items: NavItem[]; }

interface AppShellProps {
  nav: NavSection[];               // grouped sidebar sections (first group unlabelled)
  pinned?: NavItem[];              // "Pinned" section
  internal?: NavItem[];           // bottom "Internal" section
  activeRoute: string;
  onNavigate(route: string): void;
  workspace: { name: string; logo?: React.ReactNode };
  user: { name: string; plan?: string; avatarSrc?: string };
  crumbs: [string, string];        // [section, page] for the topbar breadcrumb
  onOpenCommandMenu(): void;
  theme: "light" | "dark"; onThemeChange(t): void;
  mobileTabs?: NavItem[];          // 4 primary + "More"
  children: React.ReactNode;       // routed page content
}
```

### Structure & dims

- **Sidebar** `--sidebar-w` 260px, `bg-card`, right border.
  - Header: 30px logo square (`bg-primary text-primary-foreground` "M"), workspace name + chevron (switcher → DropdownMenu), settings icon button.
  - Body: scrollable. Sections with optional uppercase label + a `+` add button on the section row (opens command menu). Items: 15px icon + label + optional count pill on the right.
  - **Active item:** `bg-secondary` + 2px accent left bar. Item padding ~`8px 10px`, radius `sm`, hover `bg-secondary`.
  - Pinned items may carry a `color` for the icon.
  - Footer: user card (avatar + name + plan + chevron → user DropdownMenu).
- **Topbar** `--topbar-h` 60px, bottom border, `bg-background/80` + backdrop-blur.
  - Left: mobile burger (hidden ≥ lg) + breadcrumb (`section › **page**`).
  - Center: **global search trigger** — a button styled like an input, opens ⌘K; shows "Search workers, sites, invoices…" + `⌘K` kbd. Full width, max ~420px.
  - Right: "AI Agent" ghost button (Sparkles icon), notifications bell, ThemeToggle.
- **Main** = topbar + scrollable `main__body` (page padding ~24–32px).

### Responsive

- `< lg`: sidebar becomes an off-canvas drawer (burger opens; backdrop closes).
- Phone: **bottom tab bar** (`mobileTabs`) — 4 destinations + "More" (opens drawer). Hit target ≥ 44px.

**a11y:** `<nav aria-label>`, active item `aria-current="page"`, drawer focus-traps, Esc closes.

**Stories:** full shell (light/dark) · collapsed drawer (mobile) · active on each section · with pinned + counts · user menu open.

---

## ThemeToggle

```ts
interface ThemeToggleProps { theme: "light"|"dark"; onThemeChange(t): void; }
```

- Segmented pill in the topbar: sun / moon buttons. Track `bg-secondary`, active thumb `bg-card` + `--shadow-xs`.
- Persist to `localStorage` (`manpowerhub-theme`) and apply `document.documentElement.classList.toggle("dark")`. Provide a `<ThemeProvider>` + `useTheme()` hook that also honors `prefers-color-scheme` on first load.

**Stories:** light selected · dark selected · inside topbar.

---

## CommandMenu (⌘K)

**shadcn base:** `command` (cmdk lib) inside a `dialog`. **Reference:** `cmdk.jsx`.

```ts
interface CommandGroup { heading: string; items: CommandItem[]; }
interface CommandItem { id: string; label: string; icon?: IconName; shortcut?: string; onSelect(): void; keywords?: string[]; }
interface CommandMenuProps {
  open: boolean; onOpenChange(o: boolean): void;
  groups: CommandGroup[];
  onNavigate?(route: string): void;
  aiHint?: boolean; // accent "Ask AI" footer hint
}
```

- 640px max-width modal, **12vh from top**, `bg-popover`, radius `xl`, `--shadow-pop`.
- Rows: input → grouped results → footer with kbd hints + accent AI hint.
- **Keyboard:** `⌘K`/`Ctrl+K` toggles (global listener), `↑/↓` move, `Enter` triggers, `Esc` closes. Type filters (fuzzy). Selected row `bg-secondary`.
- Groups e.g. Navigation, Create (new invoice/quote/worker…), Recent.

**Stories:** open empty · typing (filtered) · grouped results · keyboard selection (play: open, arrow, enter) · light+dark.

---

## KPICard

**Reference:** `KPICard` in `primitives.jsx`.

```ts
interface KPI { label: string; value: string; delta?: string; trend?: "up"|"down"|"flat"; sub?: string; }
interface KPICardProps { kpi: KPI; delay?: number; }  // delay = fade-up stagger index
```

- Layout: tiny label (12.5px `text-fg-2`) → big value (26px display 600, `tabular-nums`) with trend badge on the right (ArrowUp/Down 11px + delta), optional sub-line (11.5px `text-fg-3`).
- Trend up → success badge, down → outline/muted. Entrance: `fade-up` with `delay-N` stagger.
- **Loading:** `SkeletonKPI` mirrors this exactly.

**Stories:** up · down · flat · no delta · grid of 4 · loading (SkeletonKPI) · light+dark.

---

## AreaChart

**Reference:** `AreaChart` in `primitives.jsx` (hand-rolled SVG — reproduce, or wrap Recharts/visx matching the look).

```ts
interface AreaChartProps {
  data: { m: string; v: number }[];   // m = x label, v = value
  height?: number;                     // default 180
  valueFormatter?(v: number | string): string;
}
```

- 600-wide viewBox, responsive width. Line `stroke=hsl(var(--chart-1))` 1.8px; area fill = accent gradient 0.18 → 0. 4 dashed grid lines (`border`), left value labels (`text-fg-3`), x labels under points, 3px point markers (`bg-card` fill + accent stroke).
- Y max = `max × 1.15`, min 0. Provide optional hover tooltip (value + label).

**Stories:** default series · single point edge · large numbers (formatter) · loading (`SkeletonChart`) · light+dark.

---

## MiniBars (sparkline)

```ts
interface MiniBarsProps { values: number[]; color?: string; height?: number; } // default color accent, h 28
```

- Flex row of 5px bars, `gap 3`, height scaled to max, opacity `0.25 + ratio·0.75`, radius 2. Used in row summaries (weekly time per client, etc.).

**Stories:** rising · noisy · flat · in a table row · light+dark.

---

## Progress

```ts
interface ProgressProps { value: number; tint?: string; } // value 0..1
interface ProgressIndeterminateProps { className?: string; }
```

- Determinate: 6px track `bg-secondary`, fill `tint` (default accent), animated width `--dur-slow`.
- Indeterminate: `.progress-indet` sliding bar for unknown-duration work.

**Stories:** 0 / 35 / 68 / 100% · custom tint · indeterminate · light+dark.

---

## HealthRing

**Reference:** `HealthRing` in `primitives.jsx`.

```ts
interface HealthRingProps { score: number; size?: number; } // 0..100, size default 32
```

- SVG donut, track `bg-subtle`, arc tint by band: ≥80 success · ≥60 warning · else danger. Centered numeric score, `tabular-nums`.

**Stories:** 92 / 73 / 41 (three bands) · sizes 24/32/48 · light+dark.

---

## Skeletons & loaders

**Reference:** `skeletons.jsx` — reproduce the whole set. Policy: **server data →
Skeleton** (matches final shape); **known background work → Loader**; never both
on one surface.

### Skeletons
`Skeleton` (base shimmer; `w/h/r/variant: text|textLg|circle|block`),
`SkeletonText` (lines, last shorter), `SkeletonAvatar`, `SkeletonKPI`,
`SkeletonListRow` / `SkeletonList`, `SkeletonTableRow` / `SkeletonTable`,
`SkeletonChart` (SVG-shaped), `SkeletonCard`.

```ts
interface SkeletonProps { w?: number|string; h?: number; r?: number; variant?: "text"|"textLg"|"circle"|"block"; pulse?: boolean; className?: string; }
```
- Shimmer via animated gradient; `aria-hidden`. Match the real component's dimensions 1:1 so swap-in is seamless.

### Loaders
`Spinner` (`size: sm|md|lg`, `tone: default|muted|on-accent`), `DotPulse`
(`accent?`), `ProgressIndeterminate`, `AIThinking` (sparkle + shimmer "Thinking…"),
`InlineLoader` (spinner + "Saving…"), `ButtonLoading` (wraps a Button, see 03).

- All loaders `role="status"` with `aria-label`.

**Stories (one file `states.stories.tsx`):** each skeleton beside its real component · every loader · a full "loading dashboard" · light+dark.

---

## Icons

Reference set in `reference/src/icons.jsx` (lucide-style, stroke 1.6). **Use
`lucide-react`** in the library. Map any custom glyph to its lucide equivalent;
keep names used across the app: Home, Users, Layers, CheckSquare, FileText,
Receipt, Wallet, Timer, Settings, Lock, Search, Bell, Sparkles, Plus, ChevronDown,
ChevronRight, ArrowUp, ArrowDown, Menu, Sun, Moon, Inbox, More. Default size 15–16,
`strokeWidth={1.6}`, `currentColor`.
