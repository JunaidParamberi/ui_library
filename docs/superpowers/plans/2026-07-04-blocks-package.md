# @manpowerhub/blocks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `packages/blocks` — six fully-controlled composed sections (EmptyState, PageHeader, StatCardRow, AuthForm, DataTableToolbar, PricingTable) built from `@manpowerhub/ui`, mirroring the ui package's tooling, and consumed by a playground showcase page.

**Architecture:** New workspace package `@manpowerhub/blocks` that imports only the `@manpowerhub/ui` public API plus semantic Tailwind classes/CSS vars. Same tsup build + vitest+axe + own Storybook as `packages/ui`. Every block is presentational: all data and callbacks arrive via props, zero internal state or fetching. Strict one-way dep flow `tokens ← ui ← blocks ← apps`.

**Tech Stack:** React 18, TypeScript (strict), tsup, Vitest + Testing Library + vitest-axe, Storybook 8 (react-vite), Tailwind 3 (tokens preset), class-variance-authority, clsx, tailwind-merge, lucide-react.

## Global Constraints

- Component contract (CLAUDE.md, per block, non-negotiable): forward `className` via `cn()`; forward `ref` with `React.forwardRef`; spread remaining `...props` onto the root element; expose visual variants via `cva` typed on props; ship `<name>.tsx` + `<name>.stories.tsx` + `<name>.test.tsx` + `index.ts`; re-export from `packages/blocks/src/index.ts`.
- Stories states, where applicable: default, dark, loading, empty, error, plus a "Customization" story.
- `blocks` imports ONLY from `@manpowerhub/ui` (and lucide-react icons); NEVER `@manpowerhub/tokens` directly.
- Fully controlled: no internal component state, no data fetching. Values + callbacks are props.
- React/react-dom are peer deps, externalized in tsup; `@manpowerhub/ui` and `@manpowerhub/tokens` are also externalized in tsup.
- Node/tooling versions mirror `packages/ui` exactly (React ^18.3.0, tailwindcss ^3.4.0, tsup ^8.2.0, vitest ^2.0.0, storybook ^8.6.18).
- `cn` is imported from `@manpowerhub/ui` (it is re-exported there from `./lib/utils`). Do not duplicate the util unless the import fails to resolve in build/test/storybook.
- Branch: `feat/blocks-package` off `main`. Commit after each green step. Update `.superpowers/sdd/progress.md` per task.

**Reference — exact `@manpowerhub/ui` exports blocks compose (verified from source):**

```ts
// button
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean; loading?: boolean;
}
// variant: primary|secondary|ghost|danger|outline ; size: sm|default|lg|icon|icon-sm|icon-lg
// badge
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> { dot?: boolean; }
// variant: success|warning|danger|info|accent|outline
// card
export const Card, CardHeader, CardTitle, CardBody, CardFooter // cardVariants: interactive?, dashed?
// input
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { inputSize?: "default"|"lg"; invalid?: boolean; }
export const Input, Textarea, Field // Field props: label?, hint?, error?, required?, htmlFor?, children
// select (Radix parts)
export const Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator
// SelectTrigger extra prop: inputSize?: "default"|"lg"
// checkbox
export interface CheckboxProps extends Omit<RadixCheckbox.Root props,"children"> { label?: string; }
export const Checkbox, RadioGroup, RadioGroupItem, Switch
// kpi-card  — NOTE: plain function, NOT forwardRef; no loading state
export interface KPI { label: string; value: string; delta?: string; trend?: "up"|"down"|"flat"; sub?: string; }
export interface KPICardProps { kpi: KPI; delay?: number; }
export function KPICard(props: KPICardProps)
// util
export function cn(...inputs: ClassValue[]): string
```

---

### Task 1: Scaffold package + EmptyState (proves build/test/storybook wire)

**Files:**
- Create: `packages/blocks/package.json`
- Create: `packages/blocks/tsup.config.ts`
- Create: `packages/blocks/tsconfig.json`
- Create: `packages/blocks/vitest.config.ts`
- Create: `packages/blocks/vitest.setup.ts`
- Create: `packages/blocks/tailwind.config.ts`
- Create: `packages/blocks/postcss.config.js`
- Create: `packages/blocks/.storybook/main.ts`
- Create: `packages/blocks/.storybook/preview.ts`
- Create: `packages/blocks/src/styles.css`
- Create: `packages/blocks/src/index.ts`
- Create: `packages/blocks/src/components/empty-state/empty-state.tsx`
- Create: `packages/blocks/src/components/empty-state/empty-state.test.tsx`
- Create: `packages/blocks/src/components/empty-state/empty-state.stories.tsx`
- Create: `packages/blocks/src/components/empty-state/index.ts`

**Interfaces:**
- Consumes: `@manpowerhub/ui` exports (Card, CardBody, Button, cn).
- Produces: package `@manpowerhub/blocks` with working build/test/storybook; `EmptyState` block; the `cn` import pattern all later tasks copy.

- [ ] **Step 1: Create `packages/blocks/package.json`**

```json
{
  "name": "@manpowerhub/blocks",
  "version": "0.1.0",
  "license": "MIT",
  "type": "module",
  "publishConfig": { "access": "public", "provenance": true },
  "repository": { "type": "git", "url": "https://github.com/junaidparamberi/manpowerhub-ui.git" },
  "sideEffects": ["*.css"],
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "storybook": "storybook dev -p 6007",
    "build-storybook": "storybook build",
    "test": "vitest run"
  },
  "peerDependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "dependencies": {
    "@manpowerhub/tokens": "workspace:*",
    "@manpowerhub/ui": "workspace:*",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "lucide-react": "^0.436.0",
    "tailwind-merge": "^2.5.0"
  },
  "devDependencies": {
    "@storybook/addon-a11y": "^8.2.0",
    "@storybook/addon-themes": "^8.2.0",
    "@storybook/react": "^8.6.18",
    "@storybook/react-vite": "^8.2.0",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@testing-library/user-event": "^14.6.1",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.7.0",
    "autoprefixer": "^10.4.0",
    "jsdom": "^29.1.1",
    "postcss": "^8.4.0",
    "postcss-import": "^16.1.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "storybook": "^8.6.18",
    "tailwindcss": "^3.4.0",
    "tsup": "^8.2.0",
    "typescript": "^5.5.0",
    "vitest": "^2.0.0",
    "vitest-axe": "^0.1.0"
  }
}
```

- [ ] **Step 2: Create `packages/blocks/tsup.config.ts`**

```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  external: ["react", "react-dom", "@manpowerhub/ui", "@manpowerhub/tokens"],
  treeshake: true,
});
```

- [ ] **Step 3: Create `packages/blocks/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src", "vitest.setup.ts"],
  "exclude": ["**/*.stories.tsx", "**/*.stories.ts"]
}
```

- [ ] **Step 4: Create `packages/blocks/vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
});
```

- [ ] **Step 5: Create `packages/blocks/vitest.setup.ts`** (identical to `packages/ui/vitest.setup.ts`)

```ts
import "@testing-library/jest-dom/vitest";
import { expect } from "vitest";
import type { Assertion } from "vitest";
import { axe } from "vitest-axe";

expect.extend({
  async toHaveNoViolations(received: any) {
    const violations = received.violations ?? [];
    const pass = violations.length === 0;
    return {
      pass,
      message: () =>
        pass
          ? "Expected accessibility violations but found none."
          : `Expected no accessibility violations but found ${violations.length}:\n` +
            violations
              .map(
                (v: { id: string; help: string; nodes: { html: string }[] }) =>
                  `  [${v.id}] ${v.help}\n` +
                  v.nodes.map((n) => `    ${n.html}`).join("\n"),
              )
              .join("\n"),
    };
  },
});

declare module "vitest" {
  interface Assertion<T = any> {
    toHaveNoViolations(): T;
  }
}

export {};
```

- [ ] **Step 6: Create `packages/blocks/tailwind.config.ts`**

```ts
import type { Config } from "tailwindcss";
import preset from "@manpowerhub/tokens/preset";

export default {
  presets: [preset],
  content: [
    "./src/**/*.{ts,tsx}",
    "../ui/src/**/*.{ts,tsx}",
    "../../apps/**/*.{ts,tsx}",
  ],
} satisfies Config;
```

- [ ] **Step 7: Create `packages/blocks/postcss.config.js`**

```js
export default {
  plugins: {
    "postcss-import": {},
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 8: Create `packages/blocks/src/styles.css`**

```css
@import "@manpowerhub/tokens/globals.css";
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 9: Create `packages/blocks/.storybook/main.ts`** (aliases ui + tokens to workspace source for live dev)

```ts
import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-themes"],
  framework: { name: "@storybook/react-vite", options: {} },
  async viteFinal(config) {
    const { mergeConfig } = await import("vite");
    return mergeConfig(config, {
      resolve: {
        alias: {
          "@manpowerhub/ui": path.resolve(__dirname, "../../ui/src"),
          "@manpowerhub/tokens": path.resolve(__dirname, "../../tokens/src"),
        },
      },
    });
  },
};
export default config;
```

- [ ] **Step 10: Create `packages/blocks/.storybook/preview.ts`** (identical pattern to ui)

```ts
import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";
import "../src/styles.css";

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: { light: "", dark: "dark" },
      defaultTheme: "light",
    }),
  ],
};
export default preview;
```

- [ ] **Step 11: Write the failing test `packages/blocks/src/components/empty-state/empty-state.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, it, expect, vi } from "vitest";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("renders title and description", () => {
    render(<EmptyState title="No projects" description="Create one to begin" />);
    expect(screen.getByText("No projects")).toBeInTheDocument();
    expect(screen.getByText("Create one to begin")).toBeInTheDocument();
  });

  it("renders an action button and fires onClick", async () => {
    const onClick = vi.fn();
    render(<EmptyState title="Empty" action={{ label: "Add item", onClick }} />);
    await userEvent.click(screen.getByRole("button", { name: "Add item" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("forwards className and ref to the root", () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(
      <EmptyState ref={ref} className="custom-x" title="Empty" />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.firstChild).toHaveClass("custom-x");
  });

  it("applies the dashed variant class", () => {
    const { container } = render(<EmptyState variant="dashed" title="Empty" />);
    expect(container.firstChild).toHaveClass("border-dashed");
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <EmptyState title="No data" description="Nothing yet" action={{ label: "Add", onClick: () => {} }} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 12: Install workspace deps and run the test to verify it fails**

Run: `pnpm install && pnpm --filter @manpowerhub/blocks test`
Expected: FAIL — `Failed to resolve import "./empty-state"` / EmptyState not defined.

- [ ] **Step 13: Implement `packages/blocks/src/components/empty-state/empty-state.tsx`**

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Card, CardBody, Button, cn } from "@manpowerhub/ui";

export const emptyStateVariants = cva(
  "flex flex-col items-center justify-center text-center",
  {
    variants: {
      variant: {
        dashed: "",
        plain: "",
      },
      size: {
        sm: "gap-2 py-8 px-6",
        md: "gap-3 py-14 px-8",
      },
    },
    defaultVariants: { variant: "dashed", size: "md" },
  },
);

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

export interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, variant, size, icon, title, description, action, secondaryAction, ...props }, ref) => {
    const body = (
      <div className={cn(emptyStateVariants({ variant, size }))}>
        {icon && <div className="mb-1 text-fg-3 [&_svg]:size-8">{icon}</div>}
        <h3 className="text-md font-semibold tracking-snug text-foreground">{title}</h3>
        {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
        {(action || secondaryAction) && (
          <div className="mt-2 flex items-center gap-2">
            {action && (
              <Button variant="primary" onClick={action.onClick}>
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button variant="ghost" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    );

    if (variant === "plain") {
      return (
        <div ref={ref} className={className} {...props}>
          {body}
        </div>
      );
    }

    return (
      <Card ref={ref} dashed className={className} {...props}>
        <CardBody>{body}</CardBody>
      </Card>
    );
  },
);
EmptyState.displayName = "EmptyState";
```

- [ ] **Step 14: Create `packages/blocks/src/components/empty-state/index.ts`**

```ts
export * from "./empty-state";
```

- [ ] **Step 15: Create `packages/blocks/src/index.ts`**

```ts
export * from "./components/empty-state";
```

- [ ] **Step 16: Run the test to verify it passes**

Run: `pnpm --filter @manpowerhub/blocks test`
Expected: PASS — 5 tests.

- [ ] **Step 17: Create `packages/blocks/src/components/empty-state/empty-state.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { FolderOpen } from "lucide-react";
import { EmptyState } from "./empty-state";

const meta: Meta<typeof EmptyState> = {
  title: "Blocks/EmptyState",
  component: EmptyState,
};
export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    icon: <FolderOpen />,
    title: "No projects yet",
    description: "Create your first project to get started.",
    action: { label: "New project", onClick: () => {} },
  },
};

export const Plain: Story = {
  args: { variant: "plain", title: "Nothing here", description: "This list is empty." },
};

export const NoAction: Story = {
  args: { icon: <FolderOpen />, title: "All caught up", description: "You have no pending items." },
};

export const Dark: Story = {
  args: { ...Default.args },
  globals: { theme: "dark" },
};

export const Customization: Story = {
  args: {
    ...Default.args,
    className: "border-primary/40 bg-primary/5",
  },
};
```

- [ ] **Step 18: Verify build + storybook build are green**

Run: `pnpm --filter @manpowerhub/blocks build && pnpm --filter @manpowerhub/blocks build-storybook`
Expected: tsup emits `dist/index.js`, `dist/index.cjs`, `dist/index.d.ts`; storybook static build completes with no PostCSS/preset errors.

- [ ] **Step 19: Update progress ledger + commit**

Append to `.superpowers/sdd/progress.md` a `=== BLOCKS PHASE START ===` section noting Task 1 complete.

```bash
git add packages/blocks pnpm-lock.yaml .superpowers/sdd/progress.md
git commit -m "feat(blocks): scaffold package + EmptyState block"
```

---

### Task 2: PageHeader

**Files:**
- Create: `packages/blocks/src/components/page-header/page-header.tsx`
- Create: `packages/blocks/src/components/page-header/page-header.test.tsx`
- Create: `packages/blocks/src/components/page-header/page-header.stories.tsx`
- Create: `packages/blocks/src/components/page-header/index.ts`
- Modify: `packages/blocks/src/index.ts` (add export)

**Interfaces:**
- Consumes: `@manpowerhub/ui` (Badge, cn). `actions` and `badge` are `ReactNode`.
- Produces: `PageHeader` block; `PageHeaderProps` with `title`, `description?`, `badge?`, `actions?`, `breadcrumbs?`.

- [ ] **Step 1: Write the failing test `page-header.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, it, expect } from "vitest";
import { PageHeader } from "./page-header";

describe("PageHeader", () => {
  it("renders the title as a heading and the description", () => {
    render(<PageHeader title="Team" description="Manage members" />);
    expect(screen.getByRole("heading", { name: "Team" })).toBeInTheDocument();
    expect(screen.getByText("Manage members")).toBeInTheDocument();
  });

  it("renders a badge and actions", () => {
    render(<PageHeader title="Team" badge={<span>Beta</span>} actions={<button>Invite</button>} />);
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Invite" })).toBeInTheDocument();
  });

  it("renders breadcrumbs as a nav landmark", () => {
    render(
      <PageHeader
        title="Settings"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Settings" }]}
      />,
    );
    expect(screen.getByRole("navigation", { name: /breadcrumb/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
  });

  it("forwards className and ref to the header element", () => {
    const ref = { current: null as HTMLElement | null };
    const { container } = render(<PageHeader ref={ref} className="hx" title="T" />);
    expect(ref.current?.tagName).toBe("HEADER");
    expect(container.firstChild).toHaveClass("hx");
  });

  it("applies the bordered variant class", () => {
    const { container } = render(<PageHeader bordered title="T" />);
    expect(container.firstChild).toHaveClass("border-b");
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <PageHeader title="Team" description="Manage members" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Team" }]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/blocks test page-header`
Expected: FAIL — cannot resolve `./page-header`.

- [ ] **Step 3: Implement `page-header.tsx`**

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@manpowerhub/ui";

export const pageHeaderVariants = cva("flex flex-col gap-3 pb-4", {
  variants: {
    align: {
      start: "",
      between: "",
    },
    bordered: {
      true: "border-b border-border",
      false: "",
    },
  },
  defaultVariants: { align: "between", bordered: false },
});

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface PageHeaderProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof pageHeaderVariants> {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
}

export const PageHeader = React.forwardRef<HTMLElement, PageHeaderProps>(
  ({ className, align, bordered, title, description, badge, actions, breadcrumbs, ...props }, ref) => (
    <header ref={ref} className={cn(pageHeaderVariants({ align, bordered }), className)} {...props}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
            {breadcrumbs.map((c, i) => (
              <li key={i} className="flex items-center gap-1.5">
                {c.href ? (
                  <a href={c.href} className="hover:text-foreground">{c.label}</a>
                ) : (
                  <span aria-current="page" className="text-foreground">{c.label}</span>
                )}
                {i < breadcrumbs.length - 1 && <span aria-hidden>/</span>}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className={cn("flex gap-4", align === "between" ? "items-start justify-between" : "flex-col")}>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">{title}</h1>
            {badge}
          </div>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </header>
  ),
);
PageHeader.displayName = "PageHeader";
```

- [ ] **Step 4: Create `index.ts` and add export to `src/index.ts`**

`page-header/index.ts`:
```ts
export * from "./page-header";
```
Append to `src/index.ts`:
```ts
export * from "./components/page-header";
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm --filter @manpowerhub/blocks test page-header`
Expected: PASS — 6 tests.

- [ ] **Step 6: Create `page-header.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Badge, Button } from "@manpowerhub/ui";
import { PageHeader } from "./page-header";

const meta: Meta<typeof PageHeader> = { title: "Blocks/PageHeader", component: PageHeader };
export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: { title: "Team members", description: "Invite and manage your team." },
};

export const WithBadgeAndActions: Story = {
  args: {
    title: "Billing",
    description: "Manage your subscription and invoices.",
    badge: <Badge variant="accent">Pro</Badge>,
    actions: (
      <>
        <Button variant="secondary">Export</Button>
        <Button variant="primary">Upgrade</Button>
      </>
    ),
  },
};

export const WithBreadcrumbs: Story = {
  args: {
    title: "General",
    bordered: true,
    breadcrumbs: [{ label: "Settings", href: "#" }, { label: "General" }],
  },
};

export const Dark: Story = {
  args: { ...WithBadgeAndActions.args },
  globals: { theme: "dark" },
};

export const Customization: Story = {
  args: { ...Default.args, className: "rounded-lg bg-secondary p-4" },
};
```

- [ ] **Step 7: Commit**

```bash
git add packages/blocks/src/components/page-header packages/blocks/src/index.ts
git commit -m "feat(blocks): add PageHeader block"
```

---

### Task 3: StatCardRow

**Files:**
- Create: `packages/blocks/src/components/stat-card-row/stat-card-row.tsx`
- Create: `packages/blocks/src/components/stat-card-row/stat-card-row.test.tsx`
- Create: `packages/blocks/src/components/stat-card-row/stat-card-row.stories.tsx`
- Create: `packages/blocks/src/components/stat-card-row/index.ts`
- Modify: `packages/blocks/src/index.ts`

**Interfaces:**
- Consumes: `@manpowerhub/ui` (KPICard, Card, cn) and the `KPI` type. `KPICard` is a plain function (no ref) and has NO loading state — the row renders its own skeleton for `loading`.
- Produces: `StatCardRow` block; `StatCardRowProps` with `stats: KPI[]`, `columns?: 2|3|4`, `loading?: boolean`.

- [ ] **Step 1: Write the failing test `stat-card-row.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, it, expect } from "vitest";
import { StatCardRow } from "./stat-card-row";
import type { KPI } from "@manpowerhub/ui";

const stats: KPI[] = [
  { label: "Revenue", value: "$12.4k", delta: "+8%", trend: "up" },
  { label: "Users", value: "1,204", delta: "-2%", trend: "down" },
  { label: "Churn", value: "1.1%" },
];

describe("StatCardRow", () => {
  it("renders one card per stat", () => {
    render(<StatCardRow stats={stats} />);
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("Churn")).toBeInTheDocument();
  });

  it("applies the columns grid class", () => {
    const { container } = render(<StatCardRow stats={stats} columns={4} />);
    expect(container.firstChild).toHaveClass("lg:grid-cols-4");
  });

  it("renders skeletons and no stat labels when loading", () => {
    render(<StatCardRow stats={stats} loading columns={3} />);
    expect(screen.queryByText("Revenue")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("stat-skeleton")).toHaveLength(3);
  });

  it("renders nothing but the grid when stats is empty", () => {
    const { container } = render(<StatCardRow stats={[]} />);
    expect(container.firstChild?.childNodes).toHaveLength(0);
  });

  it("forwards className and ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(<StatCardRow ref={ref} className="gx" stats={stats} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.firstChild).toHaveClass("gx");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<StatCardRow stats={stats} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/blocks test stat-card-row`
Expected: FAIL — cannot resolve `./stat-card-row`.

- [ ] **Step 3: Implement `stat-card-row.tsx`**

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Card, KPICard, cn, type KPI } from "@manpowerhub/ui";

export const statCardRowVariants = cva("grid gap-4", {
  variants: {
    columns: {
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    },
  },
  defaultVariants: { columns: 3 },
});

export interface StatCardRowProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof statCardRowVariants> {
  stats: KPI[];
  loading?: boolean;
}

function StatSkeleton() {
  return (
    <Card className="p-[18px]" data-testid="stat-skeleton" aria-hidden>
      <div className="mb-2 h-4 w-20 animate-pulse rounded bg-secondary" />
      <div className="h-7 w-28 animate-pulse rounded bg-secondary" />
    </Card>
  );
}

export const StatCardRow = React.forwardRef<HTMLDivElement, StatCardRowProps>(
  ({ className, columns, stats, loading = false, ...props }, ref) => {
    const count = loading ? (typeof columns === "number" ? columns : 3) : stats.length;
    return (
      <div ref={ref} className={cn(statCardRowVariants({ columns }), className)} {...props}>
        {loading
          ? Array.from({ length: count }).map((_, i) => <StatSkeleton key={i} />)
          : stats.map((kpi, i) => <KPICard key={kpi.label} kpi={kpi} delay={i} />)}
      </div>
    );
  },
);
StatCardRow.displayName = "StatCardRow";
```

- [ ] **Step 4: Create `index.ts` and add export to `src/index.ts`**

`stat-card-row/index.ts`:
```ts
export * from "./stat-card-row";
```
Append to `src/index.ts`:
```ts
export * from "./components/stat-card-row";
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm --filter @manpowerhub/blocks test stat-card-row`
Expected: PASS — 6 tests.

- [ ] **Step 6: Create `stat-card-row.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import type { KPI } from "@manpowerhub/ui";
import { StatCardRow } from "./stat-card-row";

const stats: KPI[] = [
  { label: "Revenue", value: "$48.2k", delta: "+12%", trend: "up", sub: "vs last month" },
  { label: "Active users", value: "3,912", delta: "+4%", trend: "up" },
  { label: "Churn", value: "1.4%", delta: "-0.2%", trend: "down" },
  { label: "NPS", value: "62", sub: "last 30 days" },
];

const meta: Meta<typeof StatCardRow> = { title: "Blocks/StatCardRow", component: StatCardRow };
export default meta;
type Story = StoryObj<typeof StatCardRow>;

export const ThreeUp: Story = { args: { stats: stats.slice(0, 3), columns: 3 } };
export const FourUp: Story = { args: { stats, columns: 4 } };
export const Loading: Story = { args: { stats, columns: 4, loading: true } };
export const Empty: Story = { args: { stats: [] } };
export const Dark: Story = { args: { stats: stats.slice(0, 3), columns: 3 }, globals: { theme: "dark" } };
export const Customization: Story = { args: { stats: stats.slice(0, 3), columns: 3, className: "gap-8" } };
```

- [ ] **Step 7: Commit**

```bash
git add packages/blocks/src/components/stat-card-row packages/blocks/src/index.ts
git commit -m "feat(blocks): add StatCardRow block"
```

---

### Task 4: AuthForm

**Files:**
- Create: `packages/blocks/src/components/auth-form/auth-form.tsx`
- Create: `packages/blocks/src/components/auth-form/auth-form.test.tsx`
- Create: `packages/blocks/src/components/auth-form/auth-form.stories.tsx`
- Create: `packages/blocks/src/components/auth-form/index.ts`
- Modify: `packages/blocks/src/index.ts`

**Interfaces:**
- Consumes: `@manpowerhub/ui` (Card, CardBody, Field, Input, Button, Checkbox, cn).
- Produces: `AuthForm` block. Fully controlled: `email`/`password` are `{ value, onChange }` control objects; `onSubmit(e)` fires on form submit; `remember?` control object; optional controlled `showPassword`/`onTogglePassword`.

```ts
export interface AuthFieldControl {
  value: string;
  onChange: (value: string) => void;
}
export interface AuthFormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  mode?: "login" | "signup";
  email: AuthFieldControl;
  password: AuthFieldControl;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  title?: string;
  error?: string;
  loading?: boolean;
  remember?: { checked: boolean; onChange: (checked: boolean) => void };
  showPassword?: boolean;
  onTogglePassword?: () => void;
  footer?: React.ReactNode;
  width?: "sm" | "md";
}
```

- [ ] **Step 1: Write the failing test `auth-form.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, it, expect, vi } from "vitest";
import { AuthForm } from "./auth-form";

function setup(overrides = {}) {
  const props = {
    email: { value: "", onChange: vi.fn() },
    password: { value: "", onChange: vi.fn() },
    onSubmit: vi.fn((e) => e.preventDefault()),
    ...overrides,
  };
  render(<AuthForm {...props} />);
  return props;
}

describe("AuthForm", () => {
  it("renders email and password inputs", () => {
    setup();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("calls email.onChange with the typed value", async () => {
    const props = setup();
    await userEvent.type(screen.getByLabelText(/email/i), "a");
    expect(props.email.onChange).toHaveBeenCalledWith("a");
  });

  it("submits the form via the submit button", async () => {
    const props = setup();
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(props.onSubmit).toHaveBeenCalledOnce();
  });

  it("shows a signup CTA when mode is signup", () => {
    setup({ mode: "signup" });
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("renders the error in an alert region", () => {
    setup({ error: "Invalid credentials" });
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid credentials");
  });

  it("disables the submit button when loading", () => {
    setup({ loading: true });
    expect(screen.getByRole("button", { name: /sign in/i })).toBeDisabled();
  });

  it("forwards className and ref to the form", () => {
    const ref = { current: null as HTMLFormElement | null };
    setup({ ref, className: "fx" } as any);
    expect(ref.current?.tagName).toBe("FORM");
    expect(ref.current).toHaveClass("fx");
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <AuthForm
        email={{ value: "a@b.com", onChange: () => {} }}
        password={{ value: "secret", onChange: () => {} }}
        onSubmit={(e) => e.preventDefault()}
        error="Invalid credentials"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/blocks test auth-form`
Expected: FAIL — cannot resolve `./auth-form`.

- [ ] **Step 3: Implement `auth-form.tsx`**

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Card, CardBody, Field, Input, Button, Checkbox, cn } from "@manpowerhub/ui";

export const authFormVariants = cva("w-full", {
  variants: {
    width: { sm: "max-w-sm", md: "max-w-md" },
  },
  defaultVariants: { width: "sm" },
});

export interface AuthFieldControl {
  value: string;
  onChange: (value: string) => void;
}

export interface AuthFormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit">,
    VariantProps<typeof authFormVariants> {
  mode?: "login" | "signup";
  email: AuthFieldControl;
  password: AuthFieldControl;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  title?: string;
  error?: string;
  loading?: boolean;
  remember?: { checked: boolean; onChange: (checked: boolean) => void };
  showPassword?: boolean;
  onTogglePassword?: () => void;
  footer?: React.ReactNode;
}

export const AuthForm = React.forwardRef<HTMLFormElement, AuthFormProps>(
  (
    { className, width, mode = "login", email, password, onSubmit, title, error, loading = false, remember, showPassword, footer, onTogglePassword, ...props },
    ref,
  ) => {
    const isSignup = mode === "signup";
    const heading = title ?? (isSignup ? "Create your account" : "Sign in");
    const submitLabel = isSignup ? "Create account" : "Sign in";
    const emailId = React.useId();
    const pwId = React.useId();

    return (
      <Card className={cn(authFormVariants({ width }), className)}>
        <CardBody>
          <form ref={ref} onSubmit={onSubmit} className="flex flex-col gap-4" {...props}>
            <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">{heading}</h2>

            {error && (
              <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <Field label="Email" htmlFor={emailId} required>
              <Input
                id={emailId}
                type="email"
                autoComplete="email"
                value={email.value}
                onChange={(e) => email.onChange(e.target.value)}
              />
            </Field>

            <Field label="Password" htmlFor={pwId} required>
              <Input
                id={pwId}
                type={showPassword ? "text" : "password"}
                autoComplete={isSignup ? "new-password" : "current-password"}
                value={password.value}
                onChange={(e) => password.onChange(e.target.value)}
              />
            </Field>

            {onTogglePassword && (
              <Button type="button" variant="ghost" size="sm" className="self-start" onClick={onTogglePassword}>
                {showPassword ? "Hide password" : "Show password"}
              </Button>
            )}

            {remember && !isSignup && (
              <Checkbox
                id={`${emailId}-remember`}
                label="Remember me"
                checked={remember.checked}
                onCheckedChange={(c) => remember.onChange(c === true)}
              />
            )}

            <Button type="submit" variant="primary" loading={loading} className="w-full">
              {submitLabel}
            </Button>

            {footer && <div className="text-center text-sm text-muted-foreground">{footer}</div>}
          </form>
        </CardBody>
      </Card>
    );
  },
);
AuthForm.displayName = "AuthForm";
```

- [ ] **Step 4: Create `index.ts` and add export to `src/index.ts`**

`auth-form/index.ts`:
```ts
export * from "./auth-form";
```
Append to `src/index.ts`:
```ts
export * from "./components/auth-form";
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm --filter @manpowerhub/blocks test auth-form`
Expected: PASS — 8 tests.

- [ ] **Step 6: Create `auth-form.stories.tsx`**

```tsx
import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AuthForm } from "./auth-form";

const meta: Meta<typeof AuthForm> = { title: "Blocks/AuthForm", component: AuthForm };
export default meta;
type Story = StoryObj<typeof AuthForm>;

function Controlled(args: Partial<React.ComponentProps<typeof AuthForm>>) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(false);
  return (
    <AuthForm
      email={{ value: email, onChange: setEmail }}
      password={{ value: password, onChange: setPassword }}
      remember={{ checked: remember, onChange: setRemember }}
      onSubmit={(e) => e.preventDefault()}
      footer={<a href="#" className="text-primary hover:underline">Forgot password?</a>}
      {...args}
    />
  );
}

export const Login: Story = { render: (a) => <Controlled {...a} /> };
export const Signup: Story = { render: (a) => <Controlled {...a} mode="signup" /> };
export const Loading: Story = { render: (a) => <Controlled {...a} loading /> };
export const WithError: Story = { render: (a) => <Controlled {...a} error="Invalid email or password." /> };
export const Dark: Story = { render: (a) => <Controlled {...a} />, globals: { theme: "dark" } };
export const Customization: Story = { render: (a) => <Controlled {...a} className="max-w-lg ring-1 ring-primary/30" /> };
```

- [ ] **Step 7: Commit**

```bash
git add packages/blocks/src/components/auth-form packages/blocks/src/index.ts
git commit -m "feat(blocks): add AuthForm block"
```

---

### Task 5: DataTableToolbar

**Files:**
- Create: `packages/blocks/src/components/data-table-toolbar/data-table-toolbar.tsx`
- Create: `packages/blocks/src/components/data-table-toolbar/data-table-toolbar.test.tsx`
- Create: `packages/blocks/src/components/data-table-toolbar/data-table-toolbar.stories.tsx`
- Create: `packages/blocks/src/components/data-table-toolbar/index.ts`
- Modify: `packages/blocks/src/index.ts`

**Interfaces:**
- Consumes: `@manpowerhub/ui` (Input, Select + SelectTrigger/Content/Item/Value, Button, Badge, cn).
- Produces: `DataTableToolbar` block. Fully controlled search + filters.

```ts
export interface ToolbarFilter {
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}
export interface DataTableToolbarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  search: { value: string; onChange: (value: string) => void; placeholder?: string };
  filters?: ToolbarFilter[];
  actions?: React.ReactNode;
  selectedCount?: number;
  bulkActions?: React.ReactNode;
  density?: "comfortable" | "compact";
}
```

- [ ] **Step 1: Write the failing test `data-table-toolbar.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, it, expect, vi } from "vitest";
import { DataTableToolbar } from "./data-table-toolbar";

describe("DataTableToolbar", () => {
  it("renders a search box and forwards typed input", async () => {
    const onChange = vi.fn();
    render(<DataTableToolbar search={{ value: "", onChange, placeholder: "Search…" }} />);
    await userEvent.type(screen.getByPlaceholderText("Search…"), "x");
    expect(onChange).toHaveBeenCalledWith("x");
  });

  it("renders provided actions", () => {
    render(
      <DataTableToolbar search={{ value: "", onChange: () => {} }} actions={<button>New</button>} />,
    );
    expect(screen.getByRole("button", { name: "New" })).toBeInTheDocument();
  });

  it("shows the selected-count badge and bulk actions when count > 0", () => {
    render(
      <DataTableToolbar
        search={{ value: "", onChange: () => {} }}
        selectedCount={3}
        bulkActions={<button>Delete</button>}
      />,
    );
    expect(screen.getByText(/3 selected/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("hides the selected-count badge when count is 0", () => {
    render(<DataTableToolbar search={{ value: "", onChange: () => {} }} selectedCount={0} />);
    expect(screen.queryByText(/selected/i)).not.toBeInTheDocument();
  });

  it("forwards className and ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(
      <DataTableToolbar ref={ref} className="tx" search={{ value: "", onChange: () => {} }} />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.firstChild).toHaveClass("tx");
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <DataTableToolbar search={{ value: "", onChange: () => {}, placeholder: "Search" }} actions={<button>New</button>} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/blocks test data-table-toolbar`
Expected: FAIL — cannot resolve `./data-table-toolbar`.

- [ ] **Step 3: Implement `data-table-toolbar.tsx`**

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Search } from "lucide-react";
import {
  Input,
  Button,
  Badge,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  cn,
} from "@manpowerhub/ui";

export const dataTableToolbarVariants = cva("flex flex-wrap items-center gap-2", {
  variants: {
    density: {
      comfortable: "py-2",
      compact: "py-1",
    },
  },
  defaultVariants: { density: "comfortable" },
});

export interface ToolbarFilter {
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}

export interface DataTableToolbarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof dataTableToolbarVariants> {
  search: { value: string; onChange: (value: string) => void; placeholder?: string };
  filters?: ToolbarFilter[];
  actions?: React.ReactNode;
  selectedCount?: number;
  bulkActions?: React.ReactNode;
}

export const DataTableToolbar = React.forwardRef<HTMLDivElement, DataTableToolbarProps>(
  ({ className, density, search, filters, actions, selectedCount = 0, bulkActions, ...props }, ref) => (
    <div ref={ref} className={cn(dataTableToolbarVariants({ density }), className)} {...props}>
      <div className="relative min-w-[180px] flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-fg-3" aria-hidden />
        <Input
          type="search"
          className="pl-8"
          placeholder={search.placeholder ?? "Search…"}
          value={search.value}
          onChange={(e) => search.onChange(e.target.value)}
        />
      </div>

      {filters?.map((f) => (
        <Select key={f.id} value={f.value} onValueChange={f.onChange}>
          <SelectTrigger className="w-auto min-w-[140px]">
            <SelectValue placeholder={f.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {f.options.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      {selectedCount > 0 && (
        <div className="flex items-center gap-2">
          <Badge variant="accent">{selectedCount} selected</Badge>
          {bulkActions}
        </div>
      )}

      {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
    </div>
  ),
);
DataTableToolbar.displayName = "DataTableToolbar";
```

- [ ] **Step 4: Create `index.ts` and add export to `src/index.ts`**

`data-table-toolbar/index.ts`:
```ts
export * from "./data-table-toolbar";
```
Append to `src/index.ts`:
```ts
export * from "./components/data-table-toolbar";
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm --filter @manpowerhub/blocks test data-table-toolbar`
Expected: PASS — 6 tests.

- [ ] **Step 6: Create `data-table-toolbar.stories.tsx`**

```tsx
import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@manpowerhub/ui";
import { DataTableToolbar } from "./data-table-toolbar";

const meta: Meta<typeof DataTableToolbar> = { title: "Blocks/DataTableToolbar", component: DataTableToolbar };
export default meta;
type Story = StoryObj<typeof DataTableToolbar>;

function Controlled(args: Partial<React.ComponentProps<typeof DataTableToolbar>>) {
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState("");
  return (
    <DataTableToolbar
      search={{ value: q, onChange: setQ, placeholder: "Search members…" }}
      filters={[
        {
          id: "status",
          placeholder: "Status",
          value: status,
          onChange: setStatus,
          options: [
            { label: "Active", value: "active" },
            { label: "Invited", value: "invited" },
            { label: "Disabled", value: "disabled" },
          ],
        },
      ]}
      actions={<Button variant="primary">Add member</Button>}
      {...args}
    />
  );
}

export const Default: Story = { render: (a) => <Controlled {...a} /> };
export const WithSelection: Story = {
  render: (a) => <Controlled {...a} selectedCount={3} bulkActions={<Button variant="danger" size="sm">Delete</Button>} />,
};
export const Compact: Story = { render: (a) => <Controlled {...a} density="compact" /> };
export const Dark: Story = { render: (a) => <Controlled {...a} />, globals: { theme: "dark" } };
export const Customization: Story = { render: (a) => <Controlled {...a} className="rounded-md border border-border px-3" /> };
```

- [ ] **Step 7: Commit**

```bash
git add packages/blocks/src/components/data-table-toolbar packages/blocks/src/index.ts
git commit -m "feat(blocks): add DataTableToolbar block"
```

---

### Task 6: PricingTable

**Files:**
- Create: `packages/blocks/src/components/pricing-table/pricing-table.tsx`
- Create: `packages/blocks/src/components/pricing-table/pricing-table.test.tsx`
- Create: `packages/blocks/src/components/pricing-table/pricing-table.stories.tsx`
- Create: `packages/blocks/src/components/pricing-table/index.ts`
- Modify: `packages/blocks/src/index.ts`

**Interfaces:**
- Consumes: `@manpowerhub/ui` (Card, CardBody, CardHeader, CardTitle, Button, Badge, cn).
- Produces: `PricingTable` block. Fully controlled billing-period toggle.

```ts
export interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  cta: { label: string; onClick: () => void };
  highlighted?: boolean;
  badge?: string;
}
export interface PricingTableProps extends React.HTMLAttributes<HTMLDivElement> {
  tiers: PricingTier[];
  billingPeriod?: { value: "monthly" | "annual"; onChange: (value: "monthly" | "annual") => void };
  columns?: 2 | 3 | 4;
}
```

- [ ] **Step 1: Write the failing test `pricing-table.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, it, expect, vi } from "vitest";
import { PricingTable, type PricingTier } from "./pricing-table";

const tiers: PricingTier[] = [
  { name: "Starter", price: "$0", period: "/mo", features: ["1 seat", "Community support"], cta: { label: "Start free", onClick: vi.fn() } },
  { name: "Pro", price: "$29", period: "/mo", features: ["5 seats", "Priority support"], cta: { label: "Choose Pro", onClick: vi.fn() }, highlighted: true, badge: "Popular" },
];

describe("PricingTable", () => {
  it("renders each tier name, price, and features", () => {
    render(<PricingTable tiers={tiers} />);
    expect(screen.getByText("Starter")).toBeInTheDocument();
    expect(screen.getByText("$29")).toBeInTheDocument();
    expect(screen.getByText("Priority support")).toBeInTheDocument();
  });

  it("fires the tier CTA onClick", async () => {
    render(<PricingTable tiers={tiers} />);
    await userEvent.click(screen.getByRole("button", { name: "Choose Pro" }));
    expect(tiers[1]!.cta.onClick).toHaveBeenCalledOnce();
  });

  it("marks the highlighted tier with its badge", () => {
    render(<PricingTable tiers={tiers} />);
    expect(screen.getByText("Popular")).toBeInTheDocument();
  });

  it("renders a billing-period toggle and fires onChange", async () => {
    const onChange = vi.fn();
    render(<PricingTable tiers={tiers} billingPeriod={{ value: "monthly", onChange }} />);
    await userEvent.click(screen.getByRole("button", { name: /annual/i }));
    expect(onChange).toHaveBeenCalledWith("annual");
  });

  it("applies the columns grid class", () => {
    const { container } = render(<PricingTable tiers={tiers} columns={2} />);
    expect(container.querySelector(".sm\\:grid-cols-2")).toBeInTheDocument();
  });

  it("forwards className and ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(<PricingTable ref={ref} className="px" tiers={tiers} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.firstChild).toHaveClass("px");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<PricingTable tiers={tiers} billingPeriod={{ value: "monthly", onChange: () => {} }} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/blocks test pricing-table`
Expected: FAIL — cannot resolve `./pricing-table`.

- [ ] **Step 3: Implement `pricing-table.tsx`**

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check } from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle, Button, Badge, cn } from "@manpowerhub/ui";

export const pricingGridVariants = cva("grid gap-4", {
  variants: {
    columns: {
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    },
  },
  defaultVariants: { columns: 3 },
});

export interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  cta: { label: string; onClick: () => void };
  highlighted?: boolean;
  badge?: string;
}

export interface PricingTableProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pricingGridVariants> {
  tiers: PricingTier[];
  billingPeriod?: { value: "monthly" | "annual"; onChange: (value: "monthly" | "annual") => void };
}

export const PricingTable = React.forwardRef<HTMLDivElement, PricingTableProps>(
  ({ className, columns, tiers, billingPeriod, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-6", className)} {...props}>
      {billingPeriod && (
        <div className="mx-auto inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1" role="group" aria-label="Billing period">
          {(["monthly", "annual"] as const).map((p) => (
            <Button
              key={p}
              type="button"
              size="sm"
              variant={billingPeriod.value === p ? "primary" : "ghost"}
              aria-pressed={billingPeriod.value === p}
              onClick={() => billingPeriod.onChange(p)}
            >
              {p === "monthly" ? "Monthly" : "Annual"}
            </Button>
          ))}
        </div>
      )}

      <div className={cn(pricingGridVariants({ columns }))}>
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={cn(tier.highlighted && "border-primary ring-1 ring-primary/40")}
          >
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              {tier.badge && <Badge variant="accent">{tier.badge}</Badge>}
            </CardHeader>
            <CardBody>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-2xl font-semibold tracking-tight">{tier.price}</span>
                {tier.period && <span className="text-sm text-muted-foreground">{tier.period}</span>}
              </div>
              {tier.description && <p className="mt-1 text-sm text-muted-foreground">{tier.description}</p>}
              <ul className="mt-4 flex flex-col gap-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="size-4 shrink-0 text-success" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={tier.highlighted ? "primary" : "secondary"}
                className="mt-6 w-full"
                onClick={tier.cta.onClick}
              >
                {tier.cta.label}
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  ),
);
PricingTable.displayName = "PricingTable";
```

- [ ] **Step 4: Create `index.ts` and add export to `src/index.ts`**

`pricing-table/index.ts`:
```ts
export * from "./pricing-table";
```
Append to `src/index.ts`:
```ts
export * from "./components/pricing-table";
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm --filter @manpowerhub/blocks test pricing-table`
Expected: PASS — 7 tests.

- [ ] **Step 6: Create `pricing-table.stories.tsx`**

```tsx
import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PricingTable, type PricingTier } from "./pricing-table";

const tiers: PricingTier[] = [
  { name: "Starter", price: "$0", period: "/mo", description: "For trying things out.", features: ["1 seat", "Community support", "1 GB storage"], cta: { label: "Start free", onClick: () => {} } },
  { name: "Pro", price: "$29", period: "/mo", description: "For growing teams.", features: ["5 seats", "Priority support", "50 GB storage", "Analytics"], cta: { label: "Choose Pro", onClick: () => {} }, highlighted: true, badge: "Popular" },
  { name: "Enterprise", price: "Custom", description: "For large orgs.", features: ["Unlimited seats", "SSO & SAML", "Dedicated support"], cta: { label: "Contact sales", onClick: () => {} } },
];

const meta: Meta<typeof PricingTable> = { title: "Blocks/PricingTable", component: PricingTable };
export default meta;
type Story = StoryObj<typeof PricingTable>;

export const ThreeTiers: Story = { args: { tiers, columns: 3 } };

export const WithBillingToggle: Story = {
  render: (a) => {
    const [period, setPeriod] = React.useState<"monthly" | "annual">("monthly");
    return <PricingTable {...a} tiers={tiers} billingPeriod={{ value: period, onChange: setPeriod }} />;
  },
};

export const Dark: Story = { args: { tiers, columns: 3 }, globals: { theme: "dark" } };
export const Customization: Story = { args: { tiers, columns: 3, className: "gap-10" } };
```

- [ ] **Step 7: Full package verification + commit**

Run: `pnpm --filter @manpowerhub/blocks test && pnpm --filter @manpowerhub/blocks build && pnpm --filter @manpowerhub/blocks build-storybook`
Expected: all tests pass; tsup emits dist; storybook static build clean.

```bash
git add packages/blocks/src/components/pricing-table packages/blocks/src/index.ts
git commit -m "feat(blocks): add PricingTable block"
```

---

### Task 7: Playground blocks showcase page

**Files:**
- Modify: `apps/playground/package.json` (add `@manpowerhub/blocks` dep)
- Create: `apps/playground/src/pages/blocks-showcase.tsx`
- Modify: `apps/playground/src/App.tsx` (register the page)

**Interfaces:**
- Consumes: `@manpowerhub/blocks` (all six blocks) via the workspace dep, resolving to the built `dist` (blocks must be built first). Playground `tailwind.config.ts` already globs `../../packages/blocks/src/**`.
- Produces: a routed "Blocks" page rendering every block with sample data — proves the `apps ← blocks` edge.

- [ ] **Step 1: Add the dependency and install**

Edit `apps/playground/package.json` `dependencies` to add:
```json
"@manpowerhub/blocks": "workspace:*",
```

Run: `pnpm --filter @manpowerhub/blocks build && pnpm install`
Expected: install links `@manpowerhub/blocks` into the playground; blocks `dist` exists.

- [ ] **Step 2: Create `apps/playground/src/pages/blocks-showcase.tsx`**

```tsx
import * as React from "react";
import {
  EmptyState,
  PageHeader,
  StatCardRow,
  AuthForm,
  DataTableToolbar,
  PricingTable,
  type PricingTier,
} from "@manpowerhub/blocks";
import { Badge, Button, type KPI } from "@manpowerhub/ui";
import { FolderOpen } from "lucide-react";

const stats: KPI[] = [
  { label: "Revenue", value: "$48.2k", delta: "+12%", trend: "up", sub: "vs last month" },
  { label: "Active users", value: "3,912", delta: "+4%", trend: "up" },
  { label: "Churn", value: "1.4%", delta: "-0.2%", trend: "down" },
];

const tiers: PricingTier[] = [
  { name: "Starter", price: "$0", period: "/mo", features: ["1 seat", "Community support"], cta: { label: "Start free", onClick: () => {} } },
  { name: "Pro", price: "$29", period: "/mo", features: ["5 seats", "Priority support", "Analytics"], cta: { label: "Choose Pro", onClick: () => {} }, highlighted: true, badge: "Popular" },
  { name: "Enterprise", price: "Custom", features: ["Unlimited seats", "SSO & SAML"], cta: { label: "Contact sales", onClick: () => {} } },
];

export function BlocksShowcase() {
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [period, setPeriod] = React.useState<"monthly" | "annual">("monthly");

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-12">
      <PageHeader
        title="Blocks showcase"
        description="Composed sections from @manpowerhub/blocks."
        badge={<Badge variant="accent">Preview</Badge>}
        actions={<Button variant="primary">Primary action</Button>}
        bordered
      />

      <StatCardRow stats={stats} columns={3} />

      <DataTableToolbar
        search={{ value: q, onChange: setQ, placeholder: "Search members…" }}
        filters={[
          {
            id: "status",
            placeholder: "Status",
            value: status,
            onChange: setStatus,
            options: [
              { label: "Active", value: "active" },
              { label: "Invited", value: "invited" },
            ],
          },
        ]}
        actions={<Button variant="primary">Add member</Button>}
      />

      <EmptyState
        icon={<FolderOpen />}
        title="No projects yet"
        description="Create your first project to get started."
        action={{ label: "New project", onClick: () => {} }}
      />

      <div className="flex justify-center">
        <AuthForm
          email={{ value: email, onChange: setEmail }}
          password={{ value: password, onChange: setPassword }}
          onSubmit={(e) => e.preventDefault()}
          footer={<a href="#" className="text-primary hover:underline">Forgot password?</a>}
        />
      </div>

      <PricingTable tiers={tiers} columns={3} billingPeriod={{ value: period, onChange: setPeriod }} />
    </div>
  );
}
```

- [ ] **Step 3: Register the page in `apps/playground/src/App.tsx`**

Add the import near the top:
```tsx
import { BlocksShowcase } from "./pages/blocks-showcase";
```
Add an entry to the `PAGES` array:
```tsx
  { id: "blocks", label: "Blocks", element: <BlocksShowcase /> },
```

- [ ] **Step 4: Verify the playground builds and typechecks**

Run: `pnpm --filter @manpowerhub/playground build`
Expected: `tsc -b` passes (blocks types resolve from dist) and Vite build succeeds.

- [ ] **Step 5: Verify the dev server renders (manual visual check)**

Run: `pnpm --filter @manpowerhub/playground dev`
Open `http://localhost:5173`, click the "Blocks" nav item, confirm all six blocks render themed in light + dark (toggle `dark` class on `<html>` via devtools if no toggle). Stop the server.

- [ ] **Step 6: Commit**

```bash
git add apps/playground/package.json apps/playground/src/pages/blocks-showcase.tsx apps/playground/src/App.tsx pnpm-lock.yaml
git commit -m "feat(playground): add blocks showcase page consuming @manpowerhub/blocks"
```

---

## Final verification (whole branch, before finishing)

- [ ] `pnpm -r build` — all packages incl. blocks build green.
- [ ] `pnpm -r test` — all tests pass (ui + blocks + playground).
- [ ] `pnpm --filter @manpowerhub/blocks build-storybook` — clean, no PostCSS/preset errors.
- [ ] `grep -rn "@manpowerhub/tokens" packages/blocks/src` returns nothing (blocks never imports tokens directly; the tokens dep exists only for the tailwind preset/globals config, not source imports).
- [ ] Each block satisfies the contract: className+cn, forwardRef, spread props, cva variants, 4 files present, re-exported from `src/index.ts`.
- [ ] Update `.superpowers/sdd/progress.md`: mark all tasks complete, `=== BLOCKS PHASE COMPLETE ===`.
- [ ] Run whole-branch code review (superpowers:requesting-code-review) before finishing the branch.

## Notes on decomposition & spec coverage

- All six spec blocks covered: EmptyState (T1), PageHeader (T2), StatCardRow (T3), AuthForm (T4), DataTableToolbar (T5), PricingTable (T6). Playground consumption (T7).
- Package tooling parity (tsup/vitest/storybook/tailwind/postcss) established in T1 and reused unchanged.
- `cn` sourced from `@manpowerhub/ui` per Global Constraints — no util duplication.
- StatCardRow owns a local skeleton because `KPICard` has no loading state (verified from ui source).
- Storybook `Dark` stories use `globals: { theme: "dark" }` matching the `withThemeByClassName` addon config in preview.ts.
