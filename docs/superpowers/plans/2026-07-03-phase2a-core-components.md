# @manpowerhub/ui — Phase 2a: Core Components (Foundation Set) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the first 7 core components from `03-COMPONENTS-CORE.md` (Button full spec, Input/Field/Textarea, Select, Checkbox/Radio/Switch, Card cva fix, Badge/StatusBadge fix, Tabs) plus fix Storybook dev CSS rendering.

**Architecture:** Each component follows the contract in CLAUDE.md: `React.forwardRef`, named export + exported props type, `className` merged last via `cn()`, variants via `cva`, light+dark, 3px focus ring. Components are shadcn/Radix primitives re-skinned with ManpowerHub tokens. Every component ships with a `.test.tsx` (Vitest + Testing Library + axe) and a `.stories.tsx` covering all states.

**Tech Stack:** pnpm 9 · TypeScript 5.5 strict · React 18 · Radix UI · cva · tailwind-merge · Vitest 2 · Storybook 8 (react-vite) · @testing-library/react · vitest-axe.

## Global Constraints

- Package manager: `pnpm@9.7.0`. Run commands from `/Users/junaidparamberi/Codes/manpowerhub_ui/`.
- Every component: `React.forwardRef`, `VariantProps<typeof xVariants>`, `cn(..., className)` with className last, `...props` spread, visible focus ring `focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background`.
- Variants via `cva` — not manual `cn()` conditionals.
- All new components exported from `packages/ui/src/index.ts`.
- Stories use Storybook 8 CSF3 format with `satisfies Meta<typeof X>`.
- Tests: Vitest + Testing Library + axe. Min 3 tests per component: renders, className merge, a11y.
- Token colors via Tailwind utilities only (`bg-primary`, `text-success`, etc.) — no hardcoded hex/rgb.
- Run `pnpm test` and `pnpm -r build` after every task to catch regressions.
- Exact pixel sizes per spec: Button sm=26px, default=30px, lg=38px. Input default=32px, lg=38px.
- Visual source of truth: `manpowerhub-ui-handoff/reference/styles/app.css` and `reference/src/components/primitives.jsx`.

---

## File Structure

```
packages/ui/
├── postcss.config.js                        NEW — enables Tailwind in Storybook dev
├── src/
│   ├── index.ts                             MODIFY — add new exports
│   ├── components/
│   │   ├── button/
│   │   │   ├── button.tsx                   MODIFY — add icon-sm/icon-lg sizes, fix story
│   │   │   ├── button.stories.tsx           MODIFY — full matrix
│   │   │   └── button.test.tsx              EXISTS — keep, add variant tests
│   │   ├── badge/
│   │   │   ├── badge.tsx                    EXISTS — keep
│   │   │   ├── status-badge.tsx             MODIFY — add forwardRef + HTMLAttributes
│   │   │   ├── badge.stories.tsx            MODIFY — full variant matrix + every status
│   │   │   └── badge.test.tsx               NEW
│   │   ├── card/
│   │   │   ├── card.tsx                     MODIFY — migrate interactive/dashed to cva
│   │   │   ├── card.stories.tsx             MODIFY — all stories per spec
│   │   │   └── card.test.tsx                NEW
│   │   ├── input/
│   │   │   ├── input.tsx                    NEW — Input + Textarea + Field
│   │   │   ├── input.stories.tsx            NEW
│   │   │   ├── input.test.tsx               NEW
│   │   │   └── index.ts                     NEW
│   │   ├── select/
│   │   │   ├── select.tsx                   NEW — Radix Select re-skinned
│   │   │   ├── select.stories.tsx           NEW
│   │   │   ├── select.test.tsx              NEW
│   │   │   └── index.ts                     NEW
│   │   ├── checkbox/
│   │   │   ├── checkbox.tsx                 NEW — Checkbox + Radio + Switch
│   │   │   ├── checkbox.stories.tsx         NEW
│   │   │   ├── checkbox.test.tsx            NEW
│   │   │   └── index.ts                     NEW
│   │   └── tabs/
│   │       ├── tabs.tsx                     NEW — Radix Tabs re-skinned
│   │       ├── tabs.stories.tsx             NEW
│   │       ├── tabs.test.tsx                NEW
│   │       └── index.ts                     NEW
```

---

### Task 1: Fix Storybook dev Tailwind CSS

**Files:**
- Create: `packages/ui/postcss.config.js`
- Create: `packages/ui/src/styles.css`
- Modify: `packages/ui/.storybook/preview.ts`

**Interfaces:**
- Produces: Tailwind utility classes render correctly in `pnpm storybook` dev mode.

- [ ] **Step 1: Create postcss.config.js**

Create `packages/ui/postcss.config.js`:
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 2: Create a Tailwind entry CSS file**

Create `packages/ui/src/styles.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 3: Import styles.css in Storybook preview**

Edit `packages/ui/.storybook/preview.ts` — add import before the tokens import:
```ts
import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";
import "../src/styles.css";
import "@manpowerhub/tokens/globals.css";

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

- [ ] **Step 4: Verify Storybook dev renders styled components**

Run:
```bash
pnpm --filter @manpowerhub/ui storybook
```
Open `http://localhost:6006`. Navigate to Button → Primary. Expected: button renders with green background (`bg-primary` = ManpowerHub evergreen `#35735a`), white text, rounded corners. Not a plain unstyled browser button. Stop with Ctrl-C.

- [ ] **Step 5: Verify build-storybook still works**

Run:
```bash
pnpm --filter @manpowerhub/ui build-storybook
```
Expected: PASS, `packages/ui/storybook-static/index.html` exists. Exit 0.

- [ ] **Step 6: Commit**

```bash
git add packages/ui/postcss.config.js packages/ui/src/styles.css packages/ui/.storybook/preview.ts
git commit -m "fix: enable Tailwind CSS processing in Storybook dev mode"
```

---

### Task 2: Button — full spec (icon sizes + full story matrix)

**Files:**
- Modify: `packages/ui/src/components/button/button.tsx`
- Modify: `packages/ui/src/components/button/button.stories.tsx`
- Modify: `packages/ui/src/components/button/button.test.tsx`

**Interfaces:**
- Consumes: `cn()` from `../../lib/utils`, `cva` + `VariantProps` from `class-variance-authority`, `Slot` from `@radix-ui/react-slot`, `Loader2` from `lucide-react`.
- Produces: `Button`, `ButtonProps`, `buttonVariants` — exported from `packages/ui/src/index.ts` via barrel.

- [ ] **Step 1: Add icon-sm and icon-lg size variants**

Replace `packages/ui/src/components/button/button.tsx` with:
```tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium " +
    "transition-colors duration-fast ease-out focus-visible:outline-none " +
    "focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
    "disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:   "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        secondary: "border border-border bg-card text-foreground hover:bg-secondary",
        ghost:     "text-foreground hover:bg-secondary",
        danger:    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:   "border border-border bg-transparent text-foreground hover:bg-secondary",
      },
      size: {
        sm:      "h-[26px] px-2.5 text-sm [&_svg]:size-[13px]",
        default: "h-[30px] px-3 text-base [&_svg]:size-[13px]",
        lg:      "h-[38px] px-4 text-md [&_svg]:size-[15px]",
        icon:    "h-[30px] w-[30px] p-0 [&_svg]:size-[14px]",
        "icon-sm": "h-[26px] w-[26px] p-0 [&_svg]:size-[13px]",
        "icon-lg": "h-[38px] w-[38px] p-0 [&_svg]:size-[15px]",
      },
    },
    defaultVariants: { variant: "secondary", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), "relative", className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        <span className={cn("inline-flex items-center gap-1.5", loading && "invisible")}>
          {children}
        </span>
        {loading && (
          <span className="absolute inset-0 grid place-items-center">
            <Loader2 className="size-4 animate-spin" aria-hidden />
          </span>
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";
```

- [ ] **Step 2: Write the full story matrix**

Replace `packages/ui/src/components/button/button.stories.tsx` with:
```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Plus, Trash2, Save } from "lucide-react";
import { Button } from "./button";

const meta = {
  title: "Core/Button",
  component: Button,
  parameters: { layout: "centered" },
  argTypes: {
    variant: { control: "select", options: ["primary","secondary","ghost","danger","outline"] },
    size:    { control: "select", options: ["sm","default","lg","icon","icon-sm","icon-lg"] },
    loading: { control: "boolean" },
    disabled:{ control: "boolean" },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story   = { args: { variant: "primary",   children: "Save changes" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Cancel" } };
export const Ghost: Story     = { args: { variant: "ghost",     children: "Details" } };
export const Danger: Story    = { args: { variant: "danger",    children: "Delete" } };
export const Outline: Story   = { args: { variant: "outline",   children: "Export" } };

export const AllVariants: Story = {
  name: "All Variants",
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["primary","secondary","ghost","danger","outline"] as const).map(v => (
        <Button key={v} variant={v}>{v}</Button>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  name: "All Sizes",
  render: () => (
    <div className="flex items-center flex-wrap gap-2">
      {(["sm","default","lg"] as const).map(s => (
        <Button key={s} variant="primary" size={s}>{s}</Button>
      ))}
    </div>
  ),
};

export const WithLeadingIcon: Story = {
  name: "With Leading Icon",
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="primary" size="sm"><Plus />Add item</Button>
      <Button variant="primary"><Plus />Add item</Button>
      <Button variant="primary" size="lg"><Plus />Add item</Button>
    </div>
  ),
};

export const IconOnly: Story = {
  name: "Icon Only",
  render: () => (
    <div className="flex items-center gap-2">
      <Button variant="secondary" size="icon-sm" aria-label="Delete"><Trash2 /></Button>
      <Button variant="secondary" size="icon"    aria-label="Delete"><Trash2 /></Button>
      <Button variant="secondary" size="icon-lg" aria-label="Delete"><Trash2 /></Button>
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="primary"   loading>Save changes</Button>
      <Button variant="secondary" loading>Cancel</Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["primary","secondary","ghost","danger","outline"] as const).map(v => (
        <Button key={v} variant={v} disabled>{v}</Button>
      ))}
    </div>
  ),
};

export const AsLink: Story = {
  name: "asChild (renders as <a>)",
  render: () => (
    <Button asChild variant="primary">
      <a href="#">Go to dashboard</a>
    </Button>
  ),
};

export const Customization: Story = {
  name: "Customization (className wins)",
  render: () => (
    <div className="flex gap-2">
      <Button variant="primary" className="rounded-full px-6">Rounded</Button>
      <Button variant="secondary" className="border-dashed">Dashed</Button>
    </div>
  ),
};
```

- [ ] **Step 3: Extend button tests**

Replace `packages/ui/src/components/button/button.test.tsx` with:
```tsx
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { Plus } from "lucide-react";
import { Button } from "../../index";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("merges consumer className (customization contract)", () => {
    render(<Button className="custom-class">X</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("is disabled and aria-busy when loading", () => {
    render(<Button loading>Save</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-busy", "true");
  });

  it("is disabled when disabled prop set", () => {
    render(<Button disabled>X</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("renders all 5 variants without crash", () => {
    const { unmount } = render(
      <div>
        {(["primary","secondary","ghost","danger","outline"] as const).map(v => (
          <Button key={v} variant={v}>{v}</Button>
        ))}
      </div>
    );
    expect(screen.getAllByRole("button")).toHaveLength(5);
    unmount();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Button>Accessible</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 4: Run tests**

Run:
```bash
pnpm --filter @manpowerhub/ui exec vitest run src/components/button/button.test.tsx
```
Expected: 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add packages/ui/src/components/button/
git commit -m "feat: Button icon-sm/icon-lg sizes, full story matrix, extended tests"
```

---

### Task 3: Input + Field + Textarea

**Files:**
- Create: `packages/ui/src/components/input/input.tsx`
- Create: `packages/ui/src/components/input/input.stories.tsx`
- Create: `packages/ui/src/components/input/input.test.tsx`
- Create: `packages/ui/src/components/input/index.ts`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Consumes: `cn()` from `../../lib/utils`.
- Produces:
  - `Input` — `React.forwardRef<HTMLInputElement, InputProps>`
  - `Textarea` — `React.forwardRef<HTMLTextAreaElement, TextareaProps>`
  - `Field` — `(props: FieldProps) => JSX.Element`
  - All exported from barrel.

- [ ] **Step 1: Write failing test**

Create `packages/ui/src/components/input/input.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { Input, Textarea, Field } from "../../index";

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input placeholder="Type here" />);
    expect(screen.getByPlaceholderText("Type here")).toBeInTheDocument();
  });

  it("merges consumer className", () => {
    render(<Input className="custom" placeholder="x" />);
    expect(screen.getByPlaceholderText("x")).toHaveClass("custom");
  });

  it("applies invalid styles when invalid prop set", () => {
    render(<Input invalid placeholder="x" />);
    expect(screen.getByPlaceholderText("x")).toHaveClass("border-destructive");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Field label="Name" htmlFor="name"><Input id="name" /></Field>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Textarea", () => {
  it("renders a textarea", () => {
    render(<Textarea placeholder="Notes" />);
    expect(screen.getByPlaceholderText("Notes")).toBeInTheDocument();
  });
});

describe("Field", () => {
  it("renders label and hint", () => {
    render(<Field label="Email" hint="We won't spam" htmlFor="e"><Input id="e" /></Field>);
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("We won't spam")).toBeInTheDocument();
  });

  it("renders error text", () => {
    render(<Field label="Email" error="Invalid email" htmlFor="e"><Input id="e" /></Field>);
    expect(screen.getByText("Invalid email")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

Run:
```bash
pnpm --filter @manpowerhub/ui exec vitest run src/components/input/input.test.tsx
```
Expected: FAIL — `Input` not found.

- [ ] **Step 3: Implement Input, Textarea, Field**

Create `packages/ui/src/components/input/input.tsx`:
```tsx
import * as React from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputSize?: "default" | "lg";
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputSize = "default", invalid = false, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex w-full rounded-md border border-input bg-card px-2.5 text-base",
        "placeholder:text-fg-3 text-foreground",
        "transition-colors duration-fast",
        "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        inputSize === "default" && "h-[32px]",
        inputSize === "lg"      && "h-[38px] px-3 text-md",
        invalid && "border-destructive focus-visible:ring-destructive/60",
        className,
      )}
      aria-invalid={invalid || undefined}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid = false, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-card px-2.5 py-2 text-base",
        "placeholder:text-fg-3 text-foreground resize-vertical",
        "transition-colors duration-fast",
        "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        invalid && "border-destructive focus-visible:ring-destructive/60",
        className,
      )}
      aria-invalid={invalid || undefined}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export interface FieldProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
}

export function Field({ label, hint, error, required, htmlFor, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium text-foreground"
        >
          {label}
          {required && <span className="ml-0.5 text-destructive" aria-hidden>*</span>}
        </label>
      )}
      {children}
      {error  && <p className="text-xs text-destructive" role="alert">{error}</p>}
      {!error && hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
```

Create `packages/ui/src/components/input/index.ts`:
```ts
export * from "./input";
```

- [ ] **Step 4: Add to barrel export**

Edit `packages/ui/src/index.ts` — add line:
```ts
export * from "./components/input";
```

- [ ] **Step 5: Run tests — expect PASS**

Run:
```bash
pnpm --filter @manpowerhub/ui exec vitest run src/components/input/input.test.tsx
```
Expected: 7 tests pass.

- [ ] **Step 6: Write stories**

Create `packages/ui/src/components/input/input.stories.tsx`:
```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Search } from "lucide-react";
import { Input, Textarea, Field } from "./input";

const meta = { title: "Core/Input", component: Input, parameters: { layout: "centered" } } satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { placeholder: "Enter value…" } };
export const Large: Story   = { args: { inputSize: "lg", placeholder: "Large input" } };
export const Disabled: Story = { args: { placeholder: "Disabled", disabled: true } };
export const Invalid: Story  = { args: { invalid: true, defaultValue: "bad@" } };

export const WithLabel: Story = {
  name: "With Label + Hint",
  render: () => (
    <Field label="Email address" hint="We'll never share your email." htmlFor="email">
      <Input id="email" type="email" placeholder="you@example.com" />
    </Field>
  ),
};

export const WithError: Story = {
  name: "With Error",
  render: () => (
    <Field label="Email" error="Please enter a valid email." htmlFor="email-err">
      <Input id="email-err" invalid defaultValue="notanemail" />
    </Field>
  ),
};

export const WithLeadingIcon: Story = {
  name: "With Leading Icon",
  render: () => (
    <div className="relative w-64">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-[13px] text-fg-3" />
      <Input className="pl-8" placeholder="Search…" />
    </div>
  ),
};

export const TextareaStory: Story = {
  name: "Textarea",
  render: () => (
    <Field label="Notes" htmlFor="notes">
      <Textarea id="notes" placeholder="Write something…" />
    </Field>
  ),
};

export const Customization: Story = {
  name: "Customization (className wins)",
  render: () => <Input className="border-primary ring-primary/20" defaultValue="Styled" />,
};
```

- [ ] **Step 7: Verify build and storybook**

Run:
```bash
pnpm -r build && pnpm --filter @manpowerhub/ui build-storybook
```
Expected: both exit 0.

- [ ] **Step 8: Commit**

```bash
git add packages/ui/src/components/input/ packages/ui/src/index.ts
git commit -m "feat: Input, Textarea, Field components"
```

---

### Task 4: Select

**Files:**
- Create: `packages/ui/src/components/select/select.tsx`
- Create: `packages/ui/src/components/select/select.stories.tsx`
- Create: `packages/ui/src/components/select/select.test.tsx`
- Create: `packages/ui/src/components/select/index.ts`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Consumes: `@radix-ui/react-select` (install if not present), `cn()`, `ChevronDown`, `Check` from `lucide-react`.
- Produces:
  - `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectLabel`, `SelectSeparator`, `SelectValue` — thin re-exports of Radix with ManpowerHub styles.

- [ ] **Step 1: Install Radix Select**

Run:
```bash
pnpm --filter @manpowerhub/ui add @radix-ui/react-select
```

- [ ] **Step 2: Write failing test**

Create `packages/ui/src/components/select/select.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../index";

function TestSelect() {
  return (
    <Select>
      <SelectTrigger aria-label="Pick fruit">
        <SelectValue placeholder="Select fruit…" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </SelectContent>
    </Select>
  );
}

describe("Select", () => {
  it("renders trigger with placeholder", () => {
    render(<TestSelect />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("has no a11y violations on trigger", async () => {
    const { container } = render(<TestSelect />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 3: Run test — expect FAIL**

Run:
```bash
pnpm --filter @manpowerhub/ui exec vitest run src/components/select/select.test.tsx
```
Expected: FAIL — `Select` not found.

- [ ] **Step 4: Implement Select**

Create `packages/ui/src/components/select/select.tsx`:
```tsx
"use client";
import * as React from "react";
import * as RadixSelect from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../../lib/utils";

export const Select = RadixSelect.Root;
export const SelectGroup = RadixSelect.Group;
export const SelectValue = RadixSelect.Value;

export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof RadixSelect.Trigger>,
  React.ComponentPropsWithoutRef<typeof RadixSelect.Trigger> & { inputSize?: "default" | "lg" }
>(({ className, inputSize = "default", children, ...props }, ref) => (
  <RadixSelect.Trigger
    ref={ref}
    className={cn(
      "flex w-full items-center justify-between gap-2 rounded-md border border-input bg-card px-2.5 text-base text-foreground",
      "transition-colors duration-fast",
      "focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/60 focus:ring-offset-2 focus:ring-offset-background",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[placeholder]:text-fg-3",
      inputSize === "default" && "h-[32px]",
      inputSize === "lg"      && "h-[38px] px-3 text-md",
      className,
    )}
    {...props}
  >
    {children}
    <RadixSelect.Icon asChild>
      <ChevronDown className="size-[13px] text-fg-3 shrink-0 transition-transform duration-fast data-[state=open]:rotate-180" />
    </RadixSelect.Icon>
  </RadixSelect.Trigger>
));
SelectTrigger.displayName = "SelectTrigger";

export const SelectContent = React.forwardRef<
  React.ElementRef<typeof RadixSelect.Content>,
  React.ComponentPropsWithoutRef<typeof RadixSelect.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <RadixSelect.Portal>
    <RadixSelect.Content
      ref={ref}
      position={position}
      className={cn(
        "relative z-50 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-popover shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
        className,
      )}
      {...props}
    >
      <RadixSelect.Viewport
        className={cn(
          "p-1",
          position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
        )}
      >
        {children}
      </RadixSelect.Viewport>
    </RadixSelect.Content>
  </RadixSelect.Portal>
));
SelectContent.displayName = "SelectContent";

export const SelectLabel = React.forwardRef<
  React.ElementRef<typeof RadixSelect.Label>,
  React.ComponentPropsWithoutRef<typeof RadixSelect.Label>
>(({ className, ...props }, ref) => (
  <RadixSelect.Label ref={ref} className={cn("px-2 py-1 text-xs font-semibold text-muted-foreground", className)} {...props} />
));
SelectLabel.displayName = "SelectLabel";

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof RadixSelect.Item>,
  React.ComponentPropsWithoutRef<typeof RadixSelect.Item>
>(({ className, children, ...props }, ref) => (
  <RadixSelect.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-md py-1.5 pl-8 pr-2 text-base text-foreground outline-none",
      "focus:bg-secondary focus:text-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <RadixSelect.ItemIndicator>
        <Check className="size-3.5" />
      </RadixSelect.ItemIndicator>
    </span>
    <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
  </RadixSelect.Item>
));
SelectItem.displayName = "SelectItem";

export const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof RadixSelect.Separator>,
  React.ComponentPropsWithoutRef<typeof RadixSelect.Separator>
>(({ className, ...props }, ref) => (
  <RadixSelect.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
));
SelectSeparator.displayName = "SelectSeparator";
```

Create `packages/ui/src/components/select/index.ts`:
```ts
export * from "./select";
```

- [ ] **Step 5: Add to barrel**

Edit `packages/ui/src/index.ts` — add:
```ts
export * from "./components/select";
```

- [ ] **Step 6: Run tests — expect PASS**

Run:
```bash
pnpm --filter @manpowerhub/ui exec vitest run src/components/select/select.test.tsx
```
Expected: 2 tests pass.

- [ ] **Step 7: Write stories**

Create `packages/ui/src/components/select/select.stories.tsx`:
```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectLabel, SelectSeparator } from "./select";

const meta = { title: "Core/Select", parameters: { layout: "centered" } } satisfies Meta;
export default meta;

const fruits = ["Apple","Banana","Cherry","Date","Elderberry","Fig","Grape"];

export const Default: StoryObj = {
  render: () => (
    <div className="w-48">
      <Select>
        <SelectTrigger><SelectValue placeholder="Select fruit…" /></SelectTrigger>
        <SelectContent>
          {fruits.map(f => <SelectItem key={f} value={f.toLowerCase()}>{f}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  ),
};

export const WithGroups: StoryObj = {
  name: "With Groups + Separator",
  render: () => (
    <div className="w-56">
      <Select>
        <SelectTrigger><SelectValue placeholder="Select status…" /></SelectTrigger>
        <SelectContent>
          <SelectLabel>Documents</SelectLabel>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="sent">Sent</SelectItem>
          <SelectSeparator />
          <SelectLabel>Payments</SelectLabel>
          <SelectItem value="paid">Paid</SelectItem>
          <SelectItem value="overdue">Overdue</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Disabled: StoryObj = {
  render: () => (
    <div className="w-48">
      <Select disabled>
        <SelectTrigger><SelectValue placeholder="Disabled" /></SelectTrigger>
        <SelectContent><SelectItem value="a">Option</SelectItem></SelectContent>
      </Select>
    </div>
  ),
};

export const Large: StoryObj = {
  render: () => (
    <div className="w-48">
      <Select>
        <SelectTrigger inputSize="lg"><SelectValue placeholder="Large select…" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Option A</SelectItem>
          <SelectItem value="b">Option B</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Customization: StoryObj = {
  name: "Customization (className wins)",
  render: () => (
    <div className="w-48">
      <Select>
        <SelectTrigger className="border-primary"><SelectValue placeholder="Custom border" /></SelectTrigger>
        <SelectContent><SelectItem value="a">Option</SelectItem></SelectContent>
      </Select>
    </div>
  ),
};
```

- [ ] **Step 8: Commit**

```bash
git add packages/ui/src/components/select/ packages/ui/src/index.ts
git commit -m "feat: Select component (Radix re-skinned)"
```

---

### Task 5: Checkbox + Radio + Switch

**Files:**
- Create: `packages/ui/src/components/checkbox/checkbox.tsx`
- Create: `packages/ui/src/components/checkbox/checkbox.stories.tsx`
- Create: `packages/ui/src/components/checkbox/checkbox.test.tsx`
- Create: `packages/ui/src/components/checkbox/index.ts`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Consumes: `@radix-ui/react-checkbox`, `@radix-ui/react-radio-group`, `@radix-ui/react-switch` (install all).
- Produces:
  - `Checkbox` — `React.forwardRef<..., CheckboxProps>` with `label?` prop
  - `RadioGroup`, `RadioGroupItem` — Radix re-export with ManpowerHub styles
  - `Switch` — `React.forwardRef<..., SwitchProps>` with `label?` prop

- [ ] **Step 1: Install Radix packages**

Run:
```bash
pnpm --filter @manpowerhub/ui add @radix-ui/react-checkbox @radix-ui/react-radio-group @radix-ui/react-switch
```

- [ ] **Step 2: Write failing tests**

Create `packages/ui/src/components/checkbox/checkbox.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { Checkbox, Switch, RadioGroup, RadioGroupItem } from "../../index";

describe("Checkbox", () => {
  it("renders with label", () => {
    render(<Checkbox label="Accept terms" id="cb" />);
    expect(screen.getByLabelText("Accept terms")).toBeInTheDocument();
  });

  it("merges consumer className", () => {
    render(<Checkbox className="custom" id="cb2" />);
    expect(document.querySelector("#cb2")).toHaveClass("custom");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Checkbox label="Accept terms" id="cb3" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Switch", () => {
  it("renders with label", () => {
    render(<Switch label="Dark mode" id="sw" />);
    expect(screen.getByLabelText("Dark mode")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Switch label="Notifications" id="sw2" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("RadioGroup", () => {
  it("renders radio items", () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="a" id="r1" aria-label="Option A" />
        <RadioGroupItem value="b" id="r2" aria-label="Option B" />
      </RadioGroup>
    );
    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });
});
```

- [ ] **Step 3: Run test — expect FAIL**

Run:
```bash
pnpm --filter @manpowerhub/ui exec vitest run src/components/checkbox/checkbox.test.tsx
```
Expected: FAIL — components not found.

- [ ] **Step 4: Implement Checkbox, RadioGroup, Switch**

Create `packages/ui/src/components/checkbox/checkbox.tsx`:
```tsx
"use client";
import * as React from "react";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import * as RadixRadio from "@radix-ui/react-radio-group";
import * as RadixSwitch from "@radix-ui/react-switch";
import { Check, Minus } from "lucide-react";
import { cn } from "../../lib/utils";

// ─── Checkbox ───────────────────────────────────────────────────────────────

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadixCheckbox.Root>, "children"> {
  label?: string;
}

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof RadixCheckbox.Root>,
  CheckboxProps
>(({ className, label, id, ...props }, ref) => (
  <div className="flex items-center gap-2">
    <RadixCheckbox.Root
      ref={ref}
      id={id}
      className={cn(
        "size-4 shrink-0 rounded-xs border border-input bg-card",
        "transition-colors duration-fast",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground",
        "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:text-primary-foreground",
        className,
      )}
      {...props}
    >
      <RadixCheckbox.Indicator className="flex items-center justify-center text-current">
        {props.checked === "indeterminate"
          ? <Minus className="size-3" />
          : <Check className="size-3" />
        }
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
    {label && (
      <label htmlFor={id} className="text-base text-foreground cursor-pointer select-none">
        {label}
      </label>
    )}
  </div>
));
Checkbox.displayName = "Checkbox";

// ─── RadioGroup ─────────────────────────────────────────────────────────────

export const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadixRadio.Root>,
  React.ComponentPropsWithoutRef<typeof RadixRadio.Root>
>(({ className, ...props }, ref) => (
  <RadixRadio.Root ref={ref} className={cn("flex flex-col gap-2", className)} {...props} />
));
RadioGroup.displayName = "RadioGroup";

export const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadixRadio.Item>,
  React.ComponentPropsWithoutRef<typeof RadixRadio.Item>
>(({ className, ...props }, ref) => (
  <RadixRadio.Item
    ref={ref}
    className={cn(
      "size-4 shrink-0 rounded-full border border-input bg-card",
      "transition-colors duration-fast",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:border-primary",
      className,
    )}
    {...props}
  >
    <RadixRadio.Indicator className="flex items-center justify-center">
      <span className="size-2 rounded-full bg-primary block" />
    </RadixRadio.Indicator>
  </RadixRadio.Item>
));
RadioGroupItem.displayName = "RadioGroupItem";

// ─── Switch ─────────────────────────────────────────────────────────────────

export interface SwitchProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadixSwitch.Root>, "children"> {
  label?: string;
}

export const Switch = React.forwardRef<
  React.ElementRef<typeof RadixSwitch.Root>,
  SwitchProps
>(({ className, label, id, ...props }, ref) => (
  <div className="flex items-center gap-2">
    <RadixSwitch.Root
      ref={ref}
      id={id}
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
        "bg-secondary transition-colors duration-fast",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-primary",
        className,
      )}
      {...props}
    >
      <RadixSwitch.Thumb
        className={cn(
          "pointer-events-none block size-4 rounded-full bg-card shadow-xs",
          "transition-transform duration-fast",
          "data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
        )}
      />
    </RadixSwitch.Root>
    {label && (
      <label htmlFor={id} className="text-base text-foreground cursor-pointer select-none">
        {label}
      </label>
    )}
  </div>
));
Switch.displayName = "Switch";
```

Create `packages/ui/src/components/checkbox/index.ts`:
```ts
export * from "./checkbox";
```

- [ ] **Step 5: Add to barrel**

Edit `packages/ui/src/index.ts` — add:
```ts
export * from "./components/checkbox";
```

- [ ] **Step 6: Run tests — expect PASS**

Run:
```bash
pnpm --filter @manpowerhub/ui exec vitest run src/components/checkbox/checkbox.test.tsx
```
Expected: 6 tests pass.

- [ ] **Step 7: Write stories**

Create `packages/ui/src/components/checkbox/checkbox.stories.tsx`:
```tsx
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox, Switch, RadioGroup, RadioGroupItem } from "./checkbox";

const meta = { title: "Core/Controls", parameters: { layout: "centered" } } satisfies Meta;
export default meta;

export const CheckboxStates: StoryObj = {
  name: "Checkbox – states",
  render: () => (
    <div className="flex flex-col gap-3">
      <Checkbox id="cb-unchecked" label="Unchecked" />
      <Checkbox id="cb-checked" label="Checked" defaultChecked />
      <Checkbox id="cb-indeterminate" label="Indeterminate" checked="indeterminate" />
      <Checkbox id="cb-disabled" label="Disabled" disabled />
      <Checkbox id="cb-disabled-checked" label="Disabled checked" disabled defaultChecked />
    </div>
  ),
};

export const SwitchStates: StoryObj = {
  name: "Switch – states",
  render: () => (
    <div className="flex flex-col gap-3">
      <Switch id="sw-off"  label="Notifications off" />
      <Switch id="sw-on"   label="Notifications on" defaultChecked />
      <Switch id="sw-dis"  label="Disabled" disabled />
    </div>
  ),
};

export const RadioGroupStory: StoryObj = {
  name: "RadioGroup",
  render: () => (
    <RadioGroup defaultValue="monthly">
      {["monthly","quarterly","annually"].map(v => (
        <div key={v} className="flex items-center gap-2">
          <RadioGroupItem value={v} id={`r-${v}`} />
          <label htmlFor={`r-${v}`} className="text-base capitalize cursor-pointer">{v}</label>
        </div>
      ))}
    </RadioGroup>
  ),
};

export const Customization: StoryObj = {
  name: "Customization (className wins)",
  render: () => <Checkbox id="custom" label="Custom ring" className="border-primary" />,
};
```

- [ ] **Step 8: Commit**

```bash
git add packages/ui/src/components/checkbox/ packages/ui/src/index.ts
git commit -m "feat: Checkbox, RadioGroup, Switch components"
```

---

### Task 6: Card — migrate to cva

**Files:**
- Modify: `packages/ui/src/components/card/card.tsx`
- Create: `packages/ui/src/components/card/card.test.tsx`
- Modify: `packages/ui/src/components/card/card.stories.tsx`

**Interfaces:**
- Consumes: `cn()`, `cva`, `VariantProps`.
- Produces: `Card` with `VariantProps<typeof cardVariants>` — `interactive` and `dashed` as cva variants. Compound sub-components unchanged.

- [ ] **Step 1: Write failing test**

Create `packages/ui/src/components/card/card.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { Card, CardHeader, CardTitle, CardBody, CardFooter } from "../../index";

describe("Card", () => {
  it("renders children", () => {
    render(<Card><CardBody>Hello</CardBody></Card>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("merges consumer className", () => {
    render(<Card className="custom-card"><CardBody>X</CardBody></Card>);
    expect(document.querySelector(".custom-card")).toBeInTheDocument();
  });

  it("applies interactive class via cva", () => {
    const { container } = render(<Card interactive><CardBody>X</CardBody></Card>);
    expect(container.firstChild).toHaveClass("cursor-pointer");
  });

  it("applies dashed class via cva", () => {
    const { container } = render(<Card dashed><CardBody>X</CardBody></Card>);
    expect(container.firstChild).toHaveClass("border-dashed");
  });

  it("renders compound components", () => {
    render(
      <Card>
        <CardHeader><CardTitle>Title</CardTitle></CardHeader>
        <CardBody>Body</CardBody>
        <CardFooter>Footer</CardFooter>
      </Card>
    );
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Card><CardBody>Content</CardBody></Card>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run test — check initial state**

Run:
```bash
pnpm --filter @manpowerhub/ui exec vitest run src/components/card/card.test.tsx
```
Expected: "renders children", "merges className", "renders compound" tests PASS; "interactive cva" and "dashed cva" may FAIL if classes differ.

- [ ] **Step 3: Migrate Card to cva**

Replace `packages/ui/src/components/card/card.tsx` with:
```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

export const cardVariants = cva(
  "rounded-md border bg-card text-card-foreground shadow-xs",
  {
    variants: {
      interactive: {
        true: "cursor-pointer transition-shadow duration-fast ease-out hover:shadow-sm",
      },
      dashed: {
        true: "border-dashed bg-secondary shadow-none",
      },
    },
    defaultVariants: { interactive: false, dashed: false },
  },
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive, dashed, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ interactive, dashed }), className)}
      {...props}
    />
  ),
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center justify-between gap-2 border-b px-4 py-3.5", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-md font-semibold tracking-snug", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

export const CardBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-4", className)} {...props} />,
);
CardBody.displayName = "CardBody";

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("border-t px-4 py-3 text-sm text-muted-foreground", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";
```

- [ ] **Step 4: Run tests — expect all PASS**

Run:
```bash
pnpm --filter @manpowerhub/ui exec vitest run src/components/card/card.test.tsx
```
Expected: 6 tests pass.

- [ ] **Step 5: Write full stories**

Replace `packages/ui/src/components/card/card.stories.tsx` with:
```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { MoreHorizontal } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody, CardFooter } from "./card";
import { Button } from "../button/button";

const meta = { title: "Core/Card", parameters: { layout: "centered" } } satisfies Meta;
export default meta;

export const Basic: StoryObj = {
  render: () => (
    <Card className="w-80">
      <CardBody>A simple card with body content.</CardBody>
    </Card>
  ),
};

export const WithHeaderAndAction: StoryObj = {
  name: "Header + Action",
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Recent Invoices</CardTitle>
        <Button variant="ghost" size="icon-sm" aria-label="More"><MoreHorizontal /></Button>
      </CardHeader>
      <CardBody>Invoice list goes here.</CardBody>
    </Card>
  ),
};

export const WithFooter: StoryObj = {
  name: "With Footer",
  render: () => (
    <Card className="w-80">
      <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
      <CardBody>Body content.</CardBody>
      <CardFooter>Last updated 3 days ago</CardFooter>
    </Card>
  ),
};

export const Interactive: StoryObj = {
  render: () => (
    <Card interactive className="w-80 cursor-pointer">
      <CardBody>Hover me — shadow elevates.</CardBody>
    </Card>
  ),
};

export const DashedExplainer: StoryObj = {
  name: "Dashed (Explainer)",
  render: () => (
    <Card dashed className="w-80">
      <CardBody className="text-muted-foreground text-sm">
        No workers added yet. Add your first worker to get started.
      </CardBody>
    </Card>
  ),
};

export const Customization: StoryObj = {
  name: "Customization (className wins)",
  render: () => (
    <Card className="w-80 border-primary/40 bg-primary/5">
      <CardBody>Custom border and background.</CardBody>
    </Card>
  ),
};
```

- [ ] **Step 6: Commit**

```bash
git add packages/ui/src/components/card/
git commit -m "feat: Card cva variants (interactive, dashed), full stories, tests"
```

---

### Task 7: Badge + StatusBadge — forwardRef fix + full stories

**Files:**
- Modify: `packages/ui/src/components/badge/status-badge.tsx`
- Create: `packages/ui/src/components/badge/badge.test.tsx`
- Modify: `packages/ui/src/components/badge/badge.stories.tsx`

**Interfaces:**
- Consumes: `Badge`, `BadgeProps` from `./badge`.
- Produces: `StatusBadge` as `React.forwardRef<HTMLSpanElement, StatusBadgeProps>` extending `React.HTMLAttributes<HTMLSpanElement>`.

- [ ] **Step 1: Write failing tests**

Create `packages/ui/src/components/badge/badge.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { Badge, StatusBadge } from "../../index";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("merges consumer className", () => {
    render(<Badge className="custom">X</Badge>);
    expect(screen.getByText("X")).toHaveClass("custom");
  });

  it("renders dot when dot=true", () => {
    const { container } = render(<Badge dot>Paid</Badge>);
    expect(container.querySelectorAll('[aria-hidden]')).toHaveLength(1);
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Badge variant="success">Paid</Badge>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("StatusBadge", () => {
  it("renders correct label for status", () => {
    render(<StatusBadge status="paid" />);
    expect(screen.getByText("Paid")).toBeInTheDocument();
  });

  it("renders all 17 statuses without crash", () => {
    const statuses = ["paid","sent","draft","overdue","partially_paid","written_off",
      "active","planning","on hold","done","todo","in_progress","cancelled",
      "high","med","low","approved"] as const;
    const { unmount } = render(<div>{statuses.map(s => <StatusBadge key={s} status={s} />)}</div>);
    expect(screen.getByText("Paid")).toBeInTheDocument();
    expect(screen.getByText("Written off")).toBeInTheDocument();
    unmount();
  });

  it("forwards className via forwardRef", () => {
    render(<StatusBadge status="draft" className="custom-status" />);
    expect(document.querySelector(".custom-status")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<StatusBadge status="active" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run tests — className forwarding test will FAIL**

Run:
```bash
pnpm --filter @manpowerhub/ui exec vitest run src/components/badge/badge.test.tsx
```
Expected: "forwards className" test FAILS (StatusBadge is not forwardRef).

- [ ] **Step 3: Fix StatusBadge — add forwardRef + HTMLAttributes**

Replace `packages/ui/src/components/badge/status-badge.tsx` with:
```tsx
import * as React from "react";
import { Badge, type BadgeProps } from "./badge";

export type Status =
  | "paid" | "sent" | "draft" | "overdue" | "partially_paid" | "written_off"
  | "active" | "planning" | "on hold" | "done" | "todo" | "in_progress"
  | "cancelled" | "high" | "med" | "low" | "approved";

const STATUS_MAP: Record<Status, { variant: BadgeProps["variant"]; label: string }> = {
  paid:          { variant: "success", label: "Paid" },
  sent:          { variant: "info",    label: "Sent" },
  draft:         { variant: "outline", label: "Draft" },
  overdue:       { variant: "danger",  label: "Overdue" },
  partially_paid:{ variant: "warning", label: "Partial" },
  written_off:   { variant: "outline", label: "Written off" },
  active:        { variant: "success", label: "Active" },
  planning:      { variant: "info",    label: "Planning" },
  "on hold":     { variant: "warning", label: "On hold" },
  done:          { variant: "success", label: "Done" },
  todo:          { variant: "outline", label: "To do" },
  in_progress:   { variant: "info",    label: "In progress" },
  cancelled:     { variant: "outline", label: "Cancelled" },
  high:          { variant: "danger",  label: "High" },
  med:           { variant: "warning", label: "Medium" },
  low:           { variant: "outline", label: "Low" },
  approved:      { variant: "success", label: "Approved" },
};

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: Status;
}

export const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, ...props }, ref) => {
    const m = STATUS_MAP[status] ?? { variant: "outline" as const, label: status };
    return <Badge ref={ref} variant={m.variant} dot {...props}>{m.label}</Badge>;
  },
);
StatusBadge.displayName = "StatusBadge";
```

- [ ] **Step 4: Run tests — all PASS**

Run:
```bash
pnpm --filter @manpowerhub/ui exec vitest run src/components/badge/badge.test.tsx
```
Expected: 8 tests pass.

- [ ] **Step 5: Write full badge stories**

Replace `packages/ui/src/components/badge/badge.stories.tsx` with:
```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./badge";
import { StatusBadge, type Status } from "./status-badge";

const meta = { title: "Core/Badge", parameters: { layout: "centered" } } satisfies Meta;
export default meta;

export const Default: StoryObj = { render: () => <Badge>Draft</Badge> };

export const AllVariants: StoryObj = {
  name: "All Variants",
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["success","warning","danger","info","accent","outline"] as const).map(v => (
        <Badge key={v} variant={v}>{v}</Badge>
      ))}
    </div>
  ),
};

export const AllVariantsWithDot: StoryObj = {
  name: "All Variants — With Dot",
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["success","warning","danger","info","accent","outline"] as const).map(v => (
        <Badge key={v} variant={v} dot>{v}</Badge>
      ))}
    </div>
  ),
};

export const AllStatuses: StoryObj = {
  name: "StatusBadge — All Statuses",
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["paid","sent","draft","overdue","partially_paid","written_off","active","planning",
         "on hold","done","todo","in_progress","cancelled","high","med","low","approved"] as const
      ).map(s => <StatusBadge key={s} status={s as Status} />)}
    </div>
  ),
};

export const Customization: StoryObj = {
  name: "Customization (className wins)",
  render: () => <Badge variant="success" className="text-base px-3">Custom size</Badge>,
};
```

- [ ] **Step 6: Commit**

```bash
git add packages/ui/src/components/badge/
git commit -m "feat: StatusBadge forwardRef+HTMLAttributes, full badge/status stories, tests"
```

---

### Task 8: Tabs

**Files:**
- Create: `packages/ui/src/components/tabs/tabs.tsx`
- Create: `packages/ui/src/components/tabs/tabs.stories.tsx`
- Create: `packages/ui/src/components/tabs/tabs.test.tsx`
- Create: `packages/ui/src/components/tabs/index.ts`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Consumes: `@radix-ui/react-tabs` (install), `cn()`.
- Produces: `Tabs`, `TabsList`, `TabsTrigger` (with `count?: number`), `TabsContent` — all `forwardRef`.

- [ ] **Step 1: Install Radix Tabs**

Run:
```bash
pnpm --filter @manpowerhub/ui add @radix-ui/react-tabs
```

- [ ] **Step 2: Write failing tests**

Create `packages/ui/src/components/tabs/tabs.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../index";

function TestTabs() {
  return (
    <Tabs defaultValue="invoices">
      <TabsList>
        <TabsTrigger value="invoices">Invoices</TabsTrigger>
        <TabsTrigger value="quotes" count={3}>Quotes</TabsTrigger>
      </TabsList>
      <TabsContent value="invoices">Invoice content</TabsContent>
      <TabsContent value="quotes">Quote content</TabsContent>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("renders tabs with default active tab content", () => {
    render(<TestTabs />);
    expect(screen.getByText("Invoice content")).toBeVisible();
  });

  it("renders count pill on trigger", () => {
    render(<TestTabs />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("merges className on TabsTrigger", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a" className="custom-tab">Tab A</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    expect(document.querySelector(".custom-tab")).toBeInTheDocument();
  });

  it("switches content on click", async () => {
    const user = userEvent.setup();
    render(<TestTabs />);
    await user.click(screen.getByRole("tab", { name: /quotes/i }));
    expect(screen.getByText("Quote content")).toBeVisible();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<TestTabs />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 3: Install @testing-library/user-event if missing**

Run:
```bash
pnpm --filter @manpowerhub/ui add -D @testing-library/user-event
```

- [ ] **Step 4: Run tests — expect FAIL**

Run:
```bash
pnpm --filter @manpowerhub/ui exec vitest run src/components/tabs/tabs.test.tsx
```
Expected: FAIL — `Tabs` not found.

- [ ] **Step 5: Implement Tabs**

Create `packages/ui/src/components/tabs/tabs.tsx`:
```tsx
"use client";
import * as React from "react";
import * as RadixTabs from "@radix-ui/react-tabs";
import { cn } from "../../lib/utils";

export const Tabs = RadixTabs.Root;

export const TabsList = React.forwardRef<
  React.ElementRef<typeof RadixTabs.List>,
  React.ComponentPropsWithoutRef<typeof RadixTabs.List>
>(({ className, ...props }, ref) => (
  <RadixTabs.List
    ref={ref}
    className={cn(
      "flex items-end gap-0 border-b border-border",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof RadixTabs.Trigger> {
  count?: number;
}

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof RadixTabs.Trigger>,
  TabsTriggerProps
>(({ className, children, count, ...props }, ref) => (
  <RadixTabs.Trigger
    ref={ref}
    className={cn(
      "relative inline-flex items-center gap-1.5 pb-2.5 pt-1 px-1 mr-5 text-base font-medium",
      "text-muted-foreground transition-colors duration-fast",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:text-foreground",
      // Active underline via pseudo-element
      "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:rounded-full",
      "after:transition-colors after:duration-fast",
      "data-[state=inactive]:after:bg-transparent",
      "data-[state=active]:after:bg-primary",
      className,
    )}
    {...props}
  >
    {children}
    {count !== undefined && (
      <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-xs font-medium text-muted-foreground">
        {count}
      </span>
    )}
  </RadixTabs.Trigger>
));
TabsTrigger.displayName = "TabsTrigger";

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof RadixTabs.Content>,
  React.ComponentPropsWithoutRef<typeof RadixTabs.Content>
>(({ className, ...props }, ref) => (
  <RadixTabs.Content
    ref={ref}
    className={cn(
      "mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";
```

Create `packages/ui/src/components/tabs/index.ts`:
```ts
export * from "./tabs";
```

- [ ] **Step 6: Add to barrel**

Edit `packages/ui/src/index.ts` — add:
```ts
export * from "./components/tabs";
```

- [ ] **Step 7: Run tests — expect PASS**

Run:
```bash
pnpm --filter @manpowerhub/ui exec vitest run src/components/tabs/tabs.test.tsx
```
Expected: 5 tests pass.

- [ ] **Step 8: Write stories**

Create `packages/ui/src/components/tabs/tabs.stories.tsx`:
```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";

const meta = { title: "Core/Tabs", parameters: { layout: "centered" } } satisfies Meta;
export default meta;

export const Default: StoryObj = {
  render: () => (
    <div className="w-[480px]">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview"><p className="text-muted-foreground">Overview content</p></TabsContent>
        <TabsContent value="activity"><p className="text-muted-foreground">Activity feed</p></TabsContent>
        <TabsContent value="settings"><p className="text-muted-foreground">Settings panel</p></TabsContent>
      </Tabs>
    </div>
  ),
};

export const WithCounts: StoryObj = {
  name: "With Counts",
  render: () => (
    <div className="w-[480px]">
      <Tabs defaultValue="invoices">
        <TabsList>
          <TabsTrigger value="invoices" count={12}>Invoices</TabsTrigger>
          <TabsTrigger value="quotes"   count={3}>Quotes</TabsTrigger>
          <TabsTrigger value="drafts"   count={0}>Drafts</TabsTrigger>
        </TabsList>
        <TabsContent value="invoices"><p>Invoice list</p></TabsContent>
        <TabsContent value="quotes"><p>Quote list</p></TabsContent>
        <TabsContent value="drafts"><p>No drafts</p></TabsContent>
      </Tabs>
    </div>
  ),
};

export const WithDisabled: StoryObj = {
  name: "With Disabled Tab",
  render: () => (
    <div className="w-[480px]">
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">Enabled</TabsTrigger>
          <TabsTrigger value="b" disabled>Disabled</TabsTrigger>
          <TabsTrigger value="c">Also Enabled</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Content A</TabsContent>
        <TabsContent value="c">Content C</TabsContent>
      </Tabs>
    </div>
  ),
};

export const Customization: StoryObj = {
  name: "Customization (className wins)",
  render: () => (
    <Tabs defaultValue="a">
      <TabsList className="border-primary/30">
        <TabsTrigger value="a" className="text-primary">Custom Tab</TabsTrigger>
      </TabsList>
      <TabsContent value="a">Content</TabsContent>
    </Tabs>
  ),
};
```

- [ ] **Step 9: Run full test suite + build**

Run:
```bash
pnpm test && pnpm -r build
```
Expected: all tests pass, both packages build.

- [ ] **Step 10: Commit**

```bash
git add packages/ui/src/components/tabs/ packages/ui/src/index.ts
git commit -m "feat: Tabs component with count pill"
```

---

## Phase 2a Definition of Done

- [ ] Storybook dev renders Tailwind-styled components (green primary buttons, not plain browser buttons).
- [ ] Button: 6 size variants (sm, default, lg, icon, icon-sm, icon-lg), 5 variants, loading, stories grid.
- [ ] Input + Textarea + Field: sizes, invalid, label, hint, error — all tested.
- [ ] Select: Radix re-skinned, trigger mirrors input, content with check, tested.
- [ ] Checkbox + RadioGroup + Switch: 3px focus ring, label prop, all states tested.
- [ ] Card: `interactive` and `dashed` via cva — `VariantProps<typeof cardVariants>` exported.
- [ ] StatusBadge: `React.forwardRef`, extends `HTMLAttributes<HTMLSpanElement>`, all 17 statuses covered.
- [ ] Tabs: underline indicator, count pill, forwardRef on all sub-components.
- [ ] All components: className merges, a11y clean, stories with Customization story.
- [ ] `pnpm test` passes, `pnpm -r build` passes, `pnpm --filter @manpowerhub/ui build-storybook` passes.

## Follow-on: Phase 2b

Table/DataTable (tanstack), Avatar + AvatarGroup, Tooltip, Dialog, DropdownMenu, EmptyState, thin wrappers (Separator, Label, Kbd, ScrollArea, Skeleton, Toast, Popover, Breadcrumb, Progress).
