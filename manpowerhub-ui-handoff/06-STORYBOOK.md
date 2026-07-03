# 06 — Storybook

Storybook is the **living catalog** — how developers discover and adopt the
library. Every component ships a story covering all variants **and** all states.

## Setup

```bash
pnpm dlx storybook@latest init --builder vite
pnpm add -D @storybook/addon-a11y @storybook/addon-themes \
  @storybook/test @storybook/addon-interactions
```

`.storybook/preview.ts`:

```ts
import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";
import "@manpowerhub/tokens/globals.css";

export const decorators = [
  withThemeByClassName({
    themes: { light: "", dark: "dark" },   // toggles .dark on <html>
    defaultTheme: "light",
  }),
];

const preview: Preview = {
  parameters: {
    backgrounds: { disable: true },        // tokens own the bg
    layout: "centered",
    a11y: { test: "error" },               // a11y violations fail
  },
};
export default preview;
```

- The **theme switcher** in the toolbar flips light/dark for any story — use it to sanity-check both.
- Organize the sidebar: `Foundations/*` (Tokens, Type, Color, Icons), `Core/*`, `Data viz/*`, `Shell/*`, `Documents/*`, `Emails/*`, `Pages/*` (scenarios).

## Story conventions

```tsx
// button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { Download } from "lucide-react";

const meta = {
  title: "Core/Button",
  component: Button,
  tags: ["autodocs"],                 // auto API table from TS props
  argTypes: {
    variant: { control: "select", options: ["primary","secondary","ghost","danger","outline"] },
    size: { control: "select", options: ["sm","default","lg","icon"] },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: "primary", children: "Save changes" } };
export const WithIcon: Story = { args: { variant: "secondary", children: [<Download size={13} key="i" />, "Download"] } };
export const Loading: Story = { args: { variant: "primary", loading: true, children: "Saving" } };
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {["primary","secondary","ghost","danger","outline"].map(v => (
        <Button key={v} variant={v as any}>{v}</Button>
      ))}
    </div>
  ),
};
```

Rules:
- `tags: ["autodocs"]` on every meta → generated docs page + props table from the TS interface. Add JSDoc on props; it surfaces in the table.
- One **matrix story** per component (`AllVariants` / `AllStates`) showing every option at a glance, plus focused stories for individual states.
- Use `argTypes` controls so designers/PMs can poke live.
- Interaction tests via `play` for anything stateful (⌘K, Dialog focus, Tabs keyboard).

## Required state matrix (every component)

The story set for a component is complete when it shows, where applicable:

| State | Applies to |
|---|---|
| **All variants** | Button, Badge, Card, Alert, StatusBadge… |
| **All sizes** | Button, Input, Avatar, Spinner… |
| **Default / hover / focus / active / disabled** | all interactive |
| **Loading** | Button, DataTable, KPICard, Card, page scenarios |
| **Empty** | DataTable, lists, search, any collection surface |
| **Error** | DataTable, forms (invalid), data panels (retry) |
| **Light + Dark** | everything (via theme toolbar; add a side-by-side story for key ones) |
| **Long content / overflow** | Table, Tooltip, Select, Dialog body, breadcrumbs |
| **RTL** (if in scope) | text-heavy components |

Put the cross-cutting loading/empty/error stories for data components in a shared
`states.stories.tsx` so reviewers see the whole loading system in one place
(pairs each Skeleton next to its real component — see `04`).

## Foundations stories

- **Tokens** — swatches for every color var (light+dark), with the CSS var name + HSL + hex.
- **Type** — the full type scale rendered (Geist + JetBrains Mono), weights, tracking.
- **Spacing / Radius / Shadow** — visual scales.
- **Icons** — the lucide set used, searchable grid.

These double as the design-system reference page (equivalent to the reference
app's `design-system.jsx` route).

## CI

- `pnpm build-storybook` in CI; publish to Chromatic (optional) for visual regression on light + dark.
- `@storybook/test-runner` runs `play` + a11y across all stories headless.
