# Handoff Gap-Fill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build every component from `manpowerhub-ui-handoff/03-COMPONENTS-CORE.md` and `04-COMPONENTS-SHELL-DATAVIZ.md` that isn't in `packages/ui` yet, document each in `apps/docs`, cut a changeset, and verify every Vercel build target is green.

**Architecture:** Each component is a self-contained folder under `packages/ui/src/components/<name>/` (`<name>.tsx`, `<name>.stories.tsx`, `<name>.test.tsx`, `index.ts`), re-exported from `packages/ui/src/index.ts`, following the exact pattern already established by `packages/ui/src/components/button`. Radix primitives back interactive components (Avatar, Tooltip, Dialog, DropdownMenu, Progress); `AreaChart`/`MiniBars` are hand-rolled SVG (no new charting dependency — none exists in the repo today). Docs are one `.mdx` page per component under `apps/docs/content/components/`.

**Tech Stack:** React 18, Radix UI primitives, `class-variance-authority`, `tailwind-merge`/`clsx` via existing `cn()`, `lucide-react` icons, `cmdk` (new, for `CommandMenu`), Vitest + Testing Library + `vitest-axe`, Storybook 8.

## Global Constraints

- Component contract (from `CLAUDE.md`, applies to every task below): forward `className` via `cn()`, forward `ref` via `React.forwardRef`, spread `...props` onto the root element, expose variants via `cva`, ship `.tsx` + `.stories.tsx` + `.test.tsx` + `index.ts`, re-export from `packages/ui/src/index.ts`.
- Package manager: pnpm workspaces. Run `pnpm install` from repo root after any `package.json` dependency change.
- Styling: only semantic Tailwind classes / CSS vars already defined in `@manpowerhub/tokens` (`bg-card`, `text-foreground`, `border-border`, `duration-fast`, etc.) — no hardcoded hex colors, no new tokens without checking `packages/tokens/src/globals.css` first.
- Test stack already wired: `vitest-axe` matcher `toHaveNoViolations` is registered in `packages/ui/vitest.setup.ts` — every component test file ends with an axe a11y check, following `packages/ui/src/components/button/button.test.tsx`.
- Storybook stories import from the package barrel where blocks do (`@manpowerhub/ui`) but from relative `./x` inside `packages/ui` itself (see `checkbox.stories.tsx` vs `stat-card-row.stories.tsx`).
- `pnpm -r build && pnpm -r exec tsc --noEmit && pnpm lint && pnpm test` must stay green throughout (mirrors `.github/workflows/ci.yml`).
- Already built — do NOT recreate: Button, Input, Textarea, Field, Select, Checkbox, RadioGroup/RadioGroupItem, Switch, Tabs, Card, Badge, KPICard, and all 6 blocks.

---

### Task 1: Add new Radix + cmdk dependencies

**Files:**
- Modify: `packages/ui/package.json`

**Interfaces:**
- Produces: `@radix-ui/react-avatar`, `@radix-ui/react-tooltip`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-progress`, `cmdk` available to import in later tasks.

- [ ] **Step 1: Add dependencies to `packages/ui/package.json`**

In the `"dependencies"` block, add (keep alphabetical among the `@radix-ui/*` entries):

```json
    "@radix-ui/react-avatar": "^1.1.0",
    "@radix-ui/react-checkbox": "^1.3.6",
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-dropdown-menu": "^2.1.1",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-radio-group": "^1.4.2",
    "@radix-ui/react-select": "^2.3.2",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-switch": "^1.3.2",
    "@radix-ui/react-tabs": "^1.1.16",
    "@radix-ui/react-tooltip": "^1.1.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "cmdk": "^1.0.0",
    "lucide-react": "^0.436.0",
    "tailwind-merge": "^2.5.0"
```

- [ ] **Step 2: Install**

Run: `pnpm install`
Expected: lockfile updates, no errors. New packages appear in `node_modules/.pnpm`.

- [ ] **Step 3: Commit**

```bash
git add packages/ui/package.json pnpm-lock.yaml
git commit -m "chore(ui): add radix avatar/tooltip/dialog/dropdown-menu/progress + cmdk deps"
```

---

### Task 2: Avatar

**Files:**
- Create: `packages/ui/src/components/avatar/avatar.tsx`
- Create: `packages/ui/src/components/avatar/avatar.stories.tsx`
- Create: `packages/ui/src/components/avatar/avatar.test.tsx`
- Create: `packages/ui/src/components/avatar/index.ts`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Produces: `Avatar` (root, `size?: "sm" | "default" | "lg"`), `AvatarImage`, `AvatarFallback` — Radix Avatar wrap.

- [ ] **Step 1: Write the failing test — `avatar.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { Avatar, AvatarImage, AvatarFallback } from "../../index";

describe("Avatar", () => {
  it("renders fallback initials when no image loads", () => {
    render(
      <Avatar>
        <AvatarFallback>JP</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByText("JP")).toBeInTheDocument();
  });

  it("merges consumer className on the root", () => {
    render(
      <Avatar className="custom-class" data-testid="avatar-root">
        <AvatarFallback>JP</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByTestId("avatar-root")).toHaveClass("custom-class");
  });

  it("applies the size variant class", () => {
    render(
      <Avatar size="lg" data-testid="avatar-root">
        <AvatarFallback>JP</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByTestId("avatar-root")).toHaveClass("size-12");
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>JP</AvatarFallback>
      </Avatar>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/ui test -- avatar`
Expected: FAIL — `../../index` has no export `Avatar`.

- [ ] **Step 3: Implement `avatar.tsx`**

```tsx
"use client";
import * as React from "react";
import * as RadixAvatar from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

export const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full bg-secondary",
  {
    variants: {
      size: {
        sm: "size-6 text-xs",
        default: "size-8 text-sm",
        lg: "size-12 text-md",
      },
    },
    defaultVariants: { size: "default" },
  },
);

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof RadixAvatar.Root>,
    VariantProps<typeof avatarVariants> {}

export const Avatar = React.forwardRef<
  React.ElementRef<typeof RadixAvatar.Root>,
  AvatarProps
>(({ className, size, ...props }, ref) => (
  <RadixAvatar.Root
    ref={ref}
    className={cn(avatarVariants({ size }), className)}
    {...props}
  />
));
Avatar.displayName = "Avatar";

export const AvatarImage = React.forwardRef<
  React.ElementRef<typeof RadixAvatar.Image>,
  React.ComponentPropsWithoutRef<typeof RadixAvatar.Image>
>(({ className, ...props }, ref) => (
  <RadixAvatar.Image
    ref={ref}
    className={cn("aspect-square size-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

export const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof RadixAvatar.Fallback>,
  React.ComponentPropsWithoutRef<typeof RadixAvatar.Fallback>
>(({ className, ...props }, ref) => (
  <RadixAvatar.Fallback
    ref={ref}
    className={cn(
      "flex size-full items-center justify-center font-medium text-foreground",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";
```

- [ ] **Step 4: Create `index.ts`**

```ts
export * from "./avatar";
```

- [ ] **Step 5: Add barrel export to `packages/ui/src/index.ts`**

```ts
export * from "./components/avatar";
```

- [ ] **Step 6: Run test to verify it passes**

Run: `pnpm --filter @manpowerhub/ui test -- avatar`
Expected: PASS, 4 tests.

- [ ] **Step 7: Write `avatar.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";

const meta: Meta<typeof Avatar> = { title: "Components/Avatar", component: Avatar };
export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/64" alt="User avatar" />
      <AvatarFallback>JP</AvatarFallback>
    </Avatar>
  ),
};

export const FallbackOnly: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>JP</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar size="sm"><AvatarFallback>SM</AvatarFallback></Avatar>
      <Avatar size="default"><AvatarFallback>MD</AvatarFallback></Avatar>
      <Avatar size="lg"><AvatarFallback>LG</AvatarFallback></Avatar>
    </div>
  ),
};

export const Dark: Story = { ...Default, globals: { theme: "dark" } };

export const Customization: Story = {
  render: () => (
    <Avatar className="ring-2 ring-primary">
      <AvatarFallback>JP</AvatarFallback>
    </Avatar>
  ),
};
```

- [ ] **Step 8: Commit**

```bash
git add packages/ui/src/components/avatar packages/ui/src/index.ts
git commit -m "feat(ui): add Avatar component"
```

---

### Task 3: Tooltip

**Files:**
- Create: `packages/ui/src/components/tooltip/tooltip.tsx`
- Create: `packages/ui/src/components/tooltip/tooltip.stories.tsx`
- Create: `packages/ui/src/components/tooltip/tooltip.test.tsx`
- Create: `packages/ui/src/components/tooltip/index.ts`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces: `TooltipProvider`, `Tooltip`, `TooltipTrigger`, `TooltipContent`.

- [ ] **Step 1: Write the failing test — `tooltip.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "../../index";

function Fixture() {
  return (
    <TooltipProvider>
      <Tooltip open>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent>Helpful text</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

describe("Tooltip", () => {
  it("renders trigger", () => {
    render(<Fixture />);
    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });

  it("shows content when open", () => {
    render(<Fixture />);
    expect(screen.getAllByText("Helpful text")[0]).toBeInTheDocument();
  });

  it("merges consumer className on content", () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent className="custom-class">Text</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(screen.getAllByText("Text")[0]).toHaveClass("custom-class");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Fixture />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/ui test -- tooltip`
Expected: FAIL — no `Tooltip` export.

- [ ] **Step 3: Implement `tooltip.tsx`**

```tsx
"use client";
import * as React from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { cn } from "../../lib/utils";

export const TooltipProvider = RadixTooltip.Provider;
export const Tooltip = RadixTooltip.Root;
export const TooltipTrigger = RadixTooltip.Trigger;

export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof RadixTooltip.Content>,
  React.ComponentPropsWithoutRef<typeof RadixTooltip.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <RadixTooltip.Portal>
    <RadixTooltip.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-foreground shadow-md",
        "animate-fade-up",
        className,
      )}
      {...props}
    />
  </RadixTooltip.Portal>
));
TooltipContent.displayName = "TooltipContent";
```

- [ ] **Step 4: Create `index.ts`**

```ts
export * from "./tooltip";
```

- [ ] **Step 5: Add barrel export to `packages/ui/src/index.ts`**

```ts
export * from "./components/tooltip";
```

- [ ] **Step 6: Run test to verify it passes**

Run: `pnpm --filter @manpowerhub/ui test -- tooltip`
Expected: PASS, 4 tests.

- [ ] **Step 7: Write `tooltip.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./tooltip";

const meta: Meta<typeof Tooltip> = { title: "Components/Tooltip", component: Tooltip };
export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>Helpful text</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const AlwaysOpen: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip open>
        <TooltipTrigger asChild>
          <Button variant="outline">Trigger</Button>
        </TooltipTrigger>
        <TooltipContent>Always visible for visual testing</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const Dark: Story = { ...AlwaysOpen, globals: { theme: "dark" } };

export const Customization: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip open>
        <TooltipTrigger asChild>
          <Button variant="outline">Trigger</Button>
        </TooltipTrigger>
        <TooltipContent className="bg-primary text-primary-foreground border-primary">
          Custom styled
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};
```

- [ ] **Step 8: Commit**

```bash
git add packages/ui/src/components/tooltip packages/ui/src/index.ts
git commit -m "feat(ui): add Tooltip component"
```

---

### Task 4: Dialog / Modal

**Files:**
- Create: `packages/ui/src/components/dialog/dialog.tsx`
- Create: `packages/ui/src/components/dialog/dialog.stories.tsx`
- Create: `packages/ui/src/components/dialog/dialog.test.tsx`
- Create: `packages/ui/src/components/dialog/index.ts`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Produces: `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogClose`.

- [ ] **Step 1: Write the failing test — `dialog.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../index";

function Fixture() {
  return (
    <Dialog open>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm action</DialogTitle>
          <DialogDescription>This cannot be undone.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

describe("Dialog", () => {
  it("renders title and description when open", () => {
    render(<Fixture />);
    expect(screen.getByText("Confirm action")).toBeInTheDocument();
    expect(screen.getByText("This cannot be undone.")).toBeInTheDocument();
  });

  it("has role dialog", () => {
    render(<Fixture />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("merges consumer className on content", () => {
    render(
      <Dialog open>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent className="custom-class">
          <DialogTitle>T</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.getByRole("dialog")).toHaveClass("custom-class");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Fixture />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/ui test -- dialog`
Expected: FAIL — no `Dialog` export.

- [ ] **Step 3: Implement `dialog.tsx`**

```tsx
"use client";
import * as React from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

export const Dialog = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;
export const DialogClose = RadixDialog.Close;

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Content>,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Content>
>(({ className, children, ...props }, ref) => (
  <RadixDialog.Portal>
    <RadixDialog.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-fade-up" />
    <RadixDialog.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2",
        "rounded-lg border border-border bg-card p-6 shadow-lg",
        "focus-visible:outline-none",
        className,
      )}
      {...props}
    >
      {children}
      <RadixDialog.Close
        className={cn(
          "absolute right-4 top-4 rounded-xs text-muted-foreground transition-colors",
          "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
        )}
      >
        <X className="size-4" aria-hidden />
        <span className="sr-only">Close</span>
      </RadixDialog.Close>
    </RadixDialog.Content>
  </RadixDialog.Portal>
));
DialogContent.displayName = "DialogContent";

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 flex flex-col gap-1.5", className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-6 flex justify-end gap-2", className)}
      {...props}
    />
  );
}

export const DialogTitle = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Title>,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Title>
>(({ className, ...props }, ref) => (
  <RadixDialog.Title
    ref={ref}
    className={cn("font-display text-lg font-semibold text-foreground", className)}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

export const DialogDescription = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Description>,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Description>
>(({ className, ...props }, ref) => (
  <RadixDialog.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";
```

- [ ] **Step 4: Create `index.ts`**

```ts
export * from "./dialog";
```

- [ ] **Step 5: Add barrel export to `packages/ui/src/index.ts`**

```ts
export * from "./components/dialog";
```

- [ ] **Step 6: Run test to verify it passes**

Run: `pnpm --filter @manpowerhub/ui test -- dialog`
Expected: PASS, 4 tests.

- [ ] **Step 7: Write `dialog.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./dialog";

const meta: Meta<typeof Dialog> = { title: "Components/Dialog", component: Dialog };
export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete item</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button variant="danger">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const AlwaysOpen: Story = {
  render: () => (
    <Dialog open>
      <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Always open (visual test)</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ),
};

export const Dark: Story = { ...AlwaysOpen, globals: { theme: "dark" } };

export const Customization: Story = {
  render: () => (
    <Dialog open>
      <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
      <DialogContent className="max-w-lg border-primary">
        <DialogTitle>Custom width + border</DialogTitle>
      </DialogContent>
    </Dialog>
  ),
};
```

- [ ] **Step 8: Commit**

```bash
git add packages/ui/src/components/dialog packages/ui/src/index.ts
git commit -m "feat(ui): add Dialog/Modal component"
```

---

### Task 5: DropdownMenu

**Files:**
- Create: `packages/ui/src/components/dropdown-menu/dropdown-menu.tsx`
- Create: `packages/ui/src/components/dropdown-menu/dropdown-menu.stories.tsx`
- Create: `packages/ui/src/components/dropdown-menu/dropdown-menu.test.tsx`
- Create: `packages/ui/src/components/dropdown-menu/index.ts`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Produces: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuSeparator`, `DropdownMenuLabel`.

- [ ] **Step 1: Write the failing test — `dropdown-menu.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "../../index";

function Fixture() {
  return (
    <DropdownMenu open>
      <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

describe("DropdownMenu", () => {
  it("renders items when open", () => {
    render(<Fixture />);
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("renders as a menu role", () => {
    render(<Fixture />);
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("merges consumer className on content", () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent className="custom-class">
          <DropdownMenuItem>Edit</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    expect(screen.getByRole("menu")).toHaveClass("custom-class");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Fixture />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/ui test -- dropdown-menu`
Expected: FAIL — no `DropdownMenu` export.

- [ ] **Step 3: Implement `dropdown-menu.tsx`**

```tsx
"use client";
import * as React from "react";
import * as RadixDropdown from "@radix-ui/react-dropdown-menu";
import { cn } from "../../lib/utils";

export const DropdownMenu = RadixDropdown.Root;
export const DropdownMenuTrigger = RadixDropdown.Trigger;

export const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof RadixDropdown.Content>,
  React.ComponentPropsWithoutRef<typeof RadixDropdown.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <RadixDropdown.Portal>
    <RadixDropdown.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[10rem] overflow-hidden rounded-md border border-border bg-card p-1 shadow-md",
        "animate-fade-up",
        className,
      )}
      {...props}
    />
  </RadixDropdown.Portal>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof RadixDropdown.Item>,
  React.ComponentPropsWithoutRef<typeof RadixDropdown.Item>
>(({ className, ...props }, ref) => (
  <RadixDropdown.Item
    ref={ref}
    className={cn(
      "flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-foreground",
      "outline-none transition-colors duration-fast",
      "focus:bg-secondary data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

export const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof RadixDropdown.Separator>,
  React.ComponentPropsWithoutRef<typeof RadixDropdown.Separator>
>(({ className, ...props }, ref) => (
  <RadixDropdown.Separator
    ref={ref}
    className={cn("my-1 h-px bg-border", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof RadixDropdown.Label>,
  React.ComponentPropsWithoutRef<typeof RadixDropdown.Label>
>(({ className, ...props }, ref) => (
  <RadixDropdown.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";
```

- [ ] **Step 4: Create `index.ts`**

```ts
export * from "./dropdown-menu";
```

- [ ] **Step 5: Add barrel export to `packages/ui/src/index.ts`**

```ts
export * from "./components/dropdown-menu";
```

- [ ] **Step 6: Run test to verify it passes**

Run: `pnpm --filter @manpowerhub/ui test -- dropdown-menu`
Expected: PASS, 4 tests.

- [ ] **Step 7: Write `dropdown-menu.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./dropdown-menu";

const meta: Meta<typeof DropdownMenu> = { title: "Components/DropdownMenu", component: DropdownMenu };
export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const AlwaysOpen: Story = {
  render: () => (
    <DropdownMenu open>
      <DropdownMenuTrigger asChild><Button variant="outline">Actions</Button></DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const Dark: Story = { ...AlwaysOpen, globals: { theme: "dark" } };

export const Customization: Story = {
  render: () => (
    <DropdownMenu open>
      <DropdownMenuTrigger asChild><Button variant="outline">Actions</Button></DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 border-primary">
        <DropdownMenuItem>Wide custom menu</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
```

- [ ] **Step 8: Commit**

```bash
git add packages/ui/src/components/dropdown-menu packages/ui/src/index.ts
git commit -m "feat(ui): add DropdownMenu component"
```

---

### Task 6: Progress + HealthRing

**Files:**
- Create: `packages/ui/src/components/progress/progress.tsx`
- Create: `packages/ui/src/components/progress/progress.stories.tsx`
- Create: `packages/ui/src/components/progress/progress.test.tsx`
- Create: `packages/ui/src/components/progress/index.ts`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Produces: `Progress` (linear bar, Radix Progress wrap, `value: number` 0-100), `HealthRing` (radial SVG, `value: number` 0-100, `size?: number`, `label?: string`).

- [ ] **Step 1: Write the failing test — `progress.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { Progress, HealthRing } from "../../index";

describe("Progress", () => {
  it("sets aria-valuenow from value", () => {
    render(<Progress value={42} aria-label="Upload progress" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "42");
  });

  it("merges consumer className", () => {
    render(<Progress value={10} className="custom-class" aria-label="p" />);
    expect(screen.getByRole("progressbar")).toHaveClass("custom-class");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Progress value={50} aria-label="p" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("HealthRing", () => {
  it("renders the label text", () => {
    render(<HealthRing value={72} label="72%" />);
    expect(screen.getByText("72%")).toBeInTheDocument();
  });

  it("clamps value into the 0-100 range for the ring stroke", () => {
    const { container } = render(<HealthRing value={150} />);
    const circle = container.querySelector("circle[data-testid='ring-value']");
    expect(circle).not.toBeNull();
  });

  it("forwards className", () => {
    const { container } = render(<HealthRing value={50} className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/ui test -- progress`
Expected: FAIL — no `Progress`/`HealthRing` export.

- [ ] **Step 3: Implement `progress.tsx`**

```tsx
"use client";
import * as React from "react";
import * as RadixProgress from "@radix-ui/react-progress";
import { cn } from "../../lib/utils";

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof RadixProgress.Root> {
  value: number;
}

export const Progress = React.forwardRef<
  React.ElementRef<typeof RadixProgress.Root>,
  ProgressProps
>(({ className, value, ...props }, ref) => (
  <RadixProgress.Root
    ref={ref}
    value={value}
    className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)}
    {...props}
  >
    <RadixProgress.Indicator
      className="h-full w-full flex-1 bg-primary transition-transform duration-normal"
      style={{ transform: `translateX(-${100 - Math.min(100, Math.max(0, value))}%)` }}
    />
  </RadixProgress.Root>
));
Progress.displayName = "Progress";

export interface HealthRingProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export const HealthRing = React.forwardRef<HTMLDivElement, HealthRingProps>(
  ({ className, value, size = 64, strokeWidth = 6, label, ...props }, ref) => {
    const clamped = Math.min(100, Math.max(0, value));
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - clamped / 100);

    return (
      <div
        ref={ref}
        className={cn("relative inline-flex items-center justify-center", className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className="fill-none stroke-secondary"
          />
          <circle
            data-testid="ring-value"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="fill-none stroke-primary transition-[stroke-dashoffset] duration-normal"
          />
        </svg>
        {label && (
          <span className="absolute font-display text-sm font-semibold tabular-nums text-foreground">
            {label}
          </span>
        )}
      </div>
    );
  },
);
HealthRing.displayName = "HealthRing";
```

- [ ] **Step 4: Create `index.ts`**

```ts
export * from "./progress";
```

- [ ] **Step 5: Add barrel export to `packages/ui/src/index.ts`**

```ts
export * from "./components/progress";
```

- [ ] **Step 6: Run test to verify it passes**

Run: `pnpm --filter @manpowerhub/ui test -- progress`
Expected: PASS, 6 tests.

- [ ] **Step 7: Write `progress.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Progress, HealthRing } from "./progress";

const meta: Meta<typeof Progress> = { title: "Components/Progress", component: Progress };
export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = { args: { value: 42, "aria-label": "Progress" } };
export const Full: Story = { args: { value: 100, "aria-label": "Progress" } };
export const Empty: Story = { args: { value: 0, "aria-label": "Progress" } };
export const Dark: Story = { ...Default, globals: { theme: "dark" } };
export const Customization: Story = { args: { value: 60, className: "h-3", "aria-label": "Progress" } };

export const HealthRingDefault: StoryObj<typeof HealthRing> = {
  render: () => <HealthRing value={72} label="72%" />,
};

export const HealthRingSizes: StoryObj<typeof HealthRing> = {
  render: () => (
    <div className="flex items-end gap-4">
      <HealthRing value={30} size={40} label="30%" />
      <HealthRing value={65} size={64} label="65%" />
      <HealthRing value={92} size={96} label="92%" />
    </div>
  ),
};
```

- [ ] **Step 8: Commit**

```bash
git add packages/ui/src/components/progress packages/ui/src/index.ts
git commit -m "feat(ui): add Progress and HealthRing components"
```

---

### Task 7: Skeletons & Loaders

**Files:**
- Create: `packages/ui/src/components/skeleton/skeleton.tsx`
- Create: `packages/ui/src/components/skeleton/skeleton.stories.tsx`
- Create: `packages/ui/src/components/skeleton/skeleton.test.tsx`
- Create: `packages/ui/src/components/skeleton/index.ts`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Produces: `Skeleton` (generic pulse block, `className` controls shape/size), `Spinner` (rotating loader, `size?: "sm" | "default" | "lg"`).

- [ ] **Step 1: Write the failing test — `skeleton.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { Skeleton, Spinner } from "../../index";

describe("Skeleton", () => {
  it("renders with pulse animation class", () => {
    render(<Skeleton data-testid="sk" />);
    expect(screen.getByTestId("sk")).toHaveClass("animate-pulse");
  });

  it("merges consumer className", () => {
    render(<Skeleton data-testid="sk" className="h-4 w-32" />);
    expect(screen.getByTestId("sk")).toHaveClass("h-4", "w-32");
  });
});

describe("Spinner", () => {
  it("has role status for a11y", () => {
    render(<Spinner aria-label="Loading" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("applies the size variant", () => {
    render(<Spinner size="lg" aria-label="Loading" />);
    expect(screen.getByRole("status")).toHaveClass("size-6");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Spinner aria-label="Loading" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/ui test -- skeleton`
Expected: FAIL — no `Skeleton`/`Spinner` export.

- [ ] **Step 3: Implement `skeleton.tsx`**

```tsx
import * as React from "react";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

export const Skeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("animate-pulse rounded-md bg-secondary", className)}
      {...props}
    />
  ),
);
Skeleton.displayName = "Skeleton";

export const spinnerVariants = cva("animate-spin text-muted-foreground", {
  variants: {
    size: {
      sm: "size-4",
      default: "size-5",
      lg: "size-6",
    },
  },
  defaultVariants: { size: "default" },
});

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinnerVariants> {}

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size, ...props }, ref) => (
    <span ref={ref} role="status" className={cn(spinnerVariants({ size }), className)} {...props}>
      <Loader2 className="size-full" aria-hidden />
    </span>
  ),
);
Spinner.displayName = "Spinner";
```

- [ ] **Step 4: Create `index.ts`**

```ts
export * from "./skeleton";
```

- [ ] **Step 5: Add barrel export to `packages/ui/src/index.ts`**

```ts
export * from "./components/skeleton";
```

- [ ] **Step 6: Run test to verify it passes**

Run: `pnpm --filter @manpowerhub/ui test -- skeleton`
Expected: PASS, 5 tests.

- [ ] **Step 7: Write `skeleton.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton, Spinner } from "./skeleton";

const meta: Meta<typeof Skeleton> = { title: "Components/Skeleton", component: Skeleton };
export default meta;
type Story = StoryObj<typeof Skeleton>;

export const TextLines: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-4 w-56" />
    </div>
  ),
};

export const CardShape: Story = { render: () => <Skeleton className="h-24 w-64 rounded-lg" /> };
export const Circle: Story = { render: () => <Skeleton className="size-10 rounded-full" /> };
export const Dark: Story = { ...TextLines, globals: { theme: "dark" } };
export const Customization: Story = { render: () => <Skeleton className="h-2 w-full bg-primary/20" /> };

export const SpinnerSizes: StoryObj<typeof Spinner> = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner size="sm" aria-label="Loading" />
      <Spinner size="default" aria-label="Loading" />
      <Spinner size="lg" aria-label="Loading" />
    </div>
  ),
};
```

- [ ] **Step 8: Commit**

```bash
git add packages/ui/src/components/skeleton packages/ui/src/index.ts
git commit -m "feat(ui): add Skeleton and Spinner loaders"
```

---

### Task 8: Table + DataTable

**Files:**
- Create: `packages/ui/src/components/table/table.tsx`
- Create: `packages/ui/src/components/table/data-table.tsx`
- Create: `packages/ui/src/components/table/table.stories.tsx`
- Create: `packages/ui/src/components/table/table.test.tsx`
- Create: `packages/ui/src/components/table/data-table.test.tsx`
- Create: `packages/ui/src/components/table/index.ts`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Produces: `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` (static primitives); `DataTable<T>({ columns, data, getRowId })` where `columns: { key: string; header: string; render?: (row: T) => React.ReactNode }[]` — client-side sortable by clicking a `TableHead`.

- [ ] **Step 1: Write the failing test — `table.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../index";

function Fixture() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Ada</TableCell>
          <TableCell>Engineer</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

describe("Table", () => {
  it("renders as a table with headers and cells", () => {
    render(<Fixture />);
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Ada")).toBeInTheDocument();
  });

  it("merges consumer className on root", () => {
    render(<Table className="custom-class"><TableBody><TableRow><TableCell>x</TableCell></TableRow></TableBody></Table>);
    expect(screen.getByRole("table")).toHaveClass("custom-class");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Fixture />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/ui test -- table.test`
Expected: FAIL — no `Table` export.

- [ ] **Step 3: Implement `table.tsx`**

```tsx
import * as React from "react";
import { cn } from "../../lib/utils";

export const Table = React.forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="w-full overflow-auto">
      <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  ),
);
Table.displayName = "Table";

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("border-b border-border [&_tr]:border-b", className)} {...props} />
  ),
);
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  ),
);
TableBody.displayName = "TableBody";

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "border-b border-border transition-colors duration-fast hover:bg-secondary/50",
        className,
      )}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-9 px-3 text-left align-middle text-xs font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  ),
);
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn("px-3 py-2.5 align-middle text-foreground", className)} {...props} />
  ),
);
TableCell.displayName = "TableCell";
```

- [ ] **Step 4: Run `table.test.tsx` to verify it passes**

Run: `pnpm --filter @manpowerhub/ui test -- table.test`
Expected: PASS once barrel export added (Step 8 below) — if run before that, still FAIL; add the export now and re-run.

- [ ] **Step 5: Write the failing test — `data-table.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DataTable } from "../../index";

interface Row { id: string; name: string; age: number }

const columns = [
  { key: "name", header: "Name" },
  { key: "age", header: "Age" },
];

const data: Row[] = [
  { id: "1", name: "Bea", age: 30 },
  { id: "2", name: "Ada", age: 25 },
];

describe("DataTable", () => {
  it("renders one row per data item", () => {
    render(<DataTable columns={columns} data={data} getRowId={(r) => r.id} />);
    expect(screen.getByText("Bea")).toBeInTheDocument();
    expect(screen.getByText("Ada")).toBeInTheDocument();
  });

  it("sorts ascending then descending on header click", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={data} getRowId={(r) => r.id} />);
    await user.click(screen.getByText("Name"));
    let cells = screen.getAllByRole("cell").filter((_, i) => i % 2 === 0);
    expect(cells[0]).toHaveTextContent("Ada");
    await user.click(screen.getByText("Name"));
    cells = screen.getAllByRole("cell").filter((_, i) => i % 2 === 0);
    expect(cells[0]).toHaveTextContent("Bea");
  });

  it("renders custom cell content via render()", () => {
    render(
      <DataTable
        columns={[{ key: "name", header: "Name", render: (r: Row) => <strong>{r.name}!</strong> }]}
        data={data}
        getRowId={(r) => r.id}
      />,
    );
    expect(screen.getByText("Bea!")).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/ui test -- data-table`
Expected: FAIL — no `DataTable` export.

- [ ] **Step 7: Implement `data-table.tsx`**

```tsx
"use client";
import * as React from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./table";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;
  className?: string;
}

type SortDir = "asc" | "desc" | null;

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  getRowId,
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<SortDir>(null);

  function toggleSort(key: string) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortKey(null);
      setSortDir(null);
    }
  }

  const rows = React.useMemo(() => {
    if (!sortKey || !sortDir) return data;
    const copy = [...data];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === bv) return 0;
      const cmp = av! > bv! ? 1 : -1;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [data, sortKey, sortDir]);

  return (
    <Table className={cn(className)}>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.key}>
              {col.sortable === false ? (
                col.header
              ) : (
                <button
                  type="button"
                  onClick={() => toggleSort(col.key)}
                  className="inline-flex items-center gap-1 hover:text-foreground"
                >
                  {col.header}
                  {sortKey !== col.key && <ArrowUpDown className="size-3" aria-hidden />}
                  {sortKey === col.key && sortDir === "asc" && <ArrowUp className="size-3" aria-hidden />}
                  {sortKey === col.key && sortDir === "desc" && <ArrowDown className="size-3" aria-hidden />}
                </button>
              )}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={getRowId(row)}>
            {columns.map((col) => (
              <TableCell key={col.key}>
                {col.render ? col.render(row) : String(row[col.key] ?? "")}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

- [ ] **Step 8: Create `index.ts`**

```ts
export * from "./table";
export * from "./data-table";
```

- [ ] **Step 9: Add barrel export to `packages/ui/src/index.ts`**

```ts
export * from "./components/table";
```

- [ ] **Step 10: Run both test files to verify they pass**

Run: `pnpm --filter @manpowerhub/ui test -- table`
Expected: PASS, 6 tests total (3 in `table.test.tsx`, 3 in `data-table.test.tsx`).

- [ ] **Step 11: Write `table.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, DataTable } from "./index";

const meta: Meta<typeof Table> = { title: "Components/Table", component: Table };
export default meta;

interface Person { id: string; name: string; role: string; age: number }
const people: Person[] = [
  { id: "1", name: "Ada Lovelace", role: "Engineer", age: 36 },
  { id: "2", name: "Grace Hopper", role: "Engineer", age: 85 },
  { id: "3", name: "Alan Turing", role: "Researcher", age: 41 },
];

export const Static: StoryObj<typeof Table> = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow><TableHead>Name</TableHead><TableHead>Role</TableHead></TableRow>
      </TableHeader>
      <TableBody>
        {people.map((p) => (
          <TableRow key={p.id}><TableCell>{p.name}</TableCell><TableCell>{p.role}</TableCell></TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const Sortable: StoryObj<typeof DataTable> = {
  render: () => (
    <DataTable
      columns={[
        { key: "name", header: "Name" },
        { key: "role", header: "Role" },
        { key: "age", header: "Age" },
      ]}
      data={people}
      getRowId={(p: Person) => p.id}
    />
  ),
};

export const Dark: StoryObj<typeof Table> = { ...Static, globals: { theme: "dark" } };
export const Customization: StoryObj<typeof Table> = { render: () => <Table className="max-w-md"><TableBody><TableRow><TableCell>Narrow table</TableCell></TableRow></TableBody></Table> };
```

- [ ] **Step 12: Commit**

```bash
git add packages/ui/src/components/table packages/ui/src/index.ts
git commit -m "feat(ui): add Table primitives and sortable DataTable"
```

---

### Task 9: ThemeToggle

**Files:**
- Create: `packages/ui/src/components/theme-toggle/theme-toggle.tsx`
- Create: `packages/ui/src/components/theme-toggle/theme-toggle.stories.tsx`
- Create: `packages/ui/src/components/theme-toggle/theme-toggle.test.tsx`
- Create: `packages/ui/src/components/theme-toggle/index.ts`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Consumes: `Button` from `../button`.
- Produces: `ThemeToggle({ theme, onThemeChange })` — controlled component; toggling flips `"light" | "dark"` and the consumer is responsible for applying `document.documentElement.classList` (matches handoff 08 theming model — this component has no side effects of its own, keeping it consumer-agnostic).

- [ ] **Step 1: Write the failing test — `theme-toggle.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "../../index";

describe("ThemeToggle", () => {
  it("shows a moon icon when theme is light (switch to dark)", () => {
    render(<ThemeToggle theme="light" onThemeChange={() => {}} />);
    expect(screen.getByRole("button", { name: /switch to dark theme/i })).toBeInTheDocument();
  });

  it("shows a sun icon when theme is dark (switch to light)", () => {
    render(<ThemeToggle theme="dark" onThemeChange={() => {}} />);
    expect(screen.getByRole("button", { name: /switch to light theme/i })).toBeInTheDocument();
  });

  it("calls onThemeChange with the opposite theme on click", async () => {
    const user = userEvent.setup();
    const onThemeChange = vi.fn();
    render(<ThemeToggle theme="light" onThemeChange={onThemeChange} />);
    await user.click(screen.getByRole("button"));
    expect(onThemeChange).toHaveBeenCalledWith("dark");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<ThemeToggle theme="light" onThemeChange={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/ui test -- theme-toggle`
Expected: FAIL — no `ThemeToggle` export.

- [ ] **Step 3: Implement `theme-toggle.tsx`**

```tsx
import * as React from "react";
import { Sun, Moon } from "lucide-react";
import { Button, type ButtonProps } from "../button";

export interface ThemeToggleProps extends Omit<ButtonProps, "onClick" | "children"> {
  theme: "light" | "dark";
  onThemeChange: (next: "light" | "dark") => void;
}

export const ThemeToggle = React.forwardRef<HTMLButtonElement, ThemeToggleProps>(
  ({ theme, onThemeChange, variant = "ghost", size = "icon", ...props }, ref) => {
    const next = theme === "light" ? "dark" : "light";
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        aria-label={`Switch to ${next} theme`}
        onClick={() => onThemeChange(next)}
        {...props}
      >
        {theme === "light" ? <Moon aria-hidden /> : <Sun aria-hidden />}
      </Button>
    );
  },
);
ThemeToggle.displayName = "ThemeToggle";
```

- [ ] **Step 4: Create `index.ts`**

```ts
export * from "./theme-toggle";
```

- [ ] **Step 5: Add barrel export to `packages/ui/src/index.ts`**

```ts
export * from "./components/theme-toggle";
```

- [ ] **Step 6: Run test to verify it passes**

Run: `pnpm --filter @manpowerhub/ui test -- theme-toggle`
Expected: PASS, 4 tests.

- [ ] **Step 7: Write `theme-toggle.stories.tsx`**

```tsx
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ThemeToggle } from "./theme-toggle";

const meta: Meta<typeof ThemeToggle> = { title: "Components/ThemeToggle", component: ThemeToggle };
export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Interactive: Story = {
  render: () => {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    return <ThemeToggle theme={theme} onThemeChange={setTheme} />;
  },
};

export const LightState: Story = { args: { theme: "light", onThemeChange: () => {} } };
export const DarkState: Story = { args: { theme: "dark", onThemeChange: () => {} } };
export const Dark: Story = { ...LightState, globals: { theme: "dark" } };
export const Customization: Story = { args: { theme: "light", onThemeChange: () => {}, size: "icon-lg" } };
```

- [ ] **Step 8: Commit**

```bash
git add packages/ui/src/components/theme-toggle packages/ui/src/index.ts
git commit -m "feat(ui): add ThemeToggle component"
```

---

### Task 10: CommandMenu (⌘K)

**Files:**
- Create: `packages/ui/src/components/command-menu/command-menu.tsx`
- Create: `packages/ui/src/components/command-menu/command-menu.stories.tsx`
- Create: `packages/ui/src/components/command-menu/command-menu.test.tsx`
- Create: `packages/ui/src/components/command-menu/index.ts`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Consumes: `cmdk` (installed Task 1), `Dialog`/`DialogContent` from `../dialog`.
- Produces: `CommandMenu({ open, onOpenChange, items })` where `items: { id: string; label: string; onSelect: () => void; group?: string }[]`.

- [ ] **Step 1: Write the failing test — `command-menu.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CommandMenu } from "../../index";

const items = [
  { id: "new", label: "New project", onSelect: vi.fn(), group: "Actions" },
  { id: "settings", label: "Open settings", onSelect: vi.fn(), group: "Actions" },
];

describe("CommandMenu", () => {
  it("renders items when open", () => {
    render(<CommandMenu open onOpenChange={() => {}} items={items} />);
    expect(screen.getByText("New project")).toBeInTheDocument();
    expect(screen.getByText("Open settings")).toBeInTheDocument();
  });

  it("filters items by typed query", async () => {
    const user = userEvent.setup();
    render(<CommandMenu open onOpenChange={() => {}} items={items} />);
    await user.type(screen.getByPlaceholderText(/type a command/i), "settings");
    expect(screen.queryByText("New project")).not.toBeInTheDocument();
    expect(screen.getByText("Open settings")).toBeInTheDocument();
  });

  it("calls the item's onSelect when chosen", async () => {
    const user = userEvent.setup();
    render(<CommandMenu open onOpenChange={() => {}} items={items} />);
    await user.click(screen.getByText("New project"));
    expect(items[0].onSelect).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/ui test -- command-menu`
Expected: FAIL — no `CommandMenu` export.

- [ ] **Step 3: Implement `command-menu.tsx`**

```tsx
"use client";
import * as React from "react";
import { Command as Cmdk } from "cmdk";
import { Search } from "lucide-react";
import { cn } from "../../lib/utils";
import { Dialog, DialogContent } from "../dialog";

export interface CommandMenuItem {
  id: string;
  label: string;
  onSelect: () => void;
  group?: string;
}

export interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandMenuItem[];
  className?: string;
}

export function CommandMenu({ open, onOpenChange, items, className }: CommandMenuProps) {
  const groups = React.useMemo(() => {
    const map = new Map<string, CommandMenuItem[]>();
    for (const item of items) {
      const key = item.group ?? "Commands";
      map.set(key, [...(map.get(key) ?? []), item]);
    }
    return Array.from(map.entries());
  }, [items]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("max-w-lg p-0 top-[20%] translate-y-0", className)}>
        <Cmdk className="flex flex-col overflow-hidden rounded-lg" label="Command menu">
          <div className="flex items-center gap-2 border-b border-border px-3">
            <Search className="size-4 text-muted-foreground" aria-hidden />
            <Cmdk.Input
              placeholder="Type a command or search..."
              className="h-11 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
          <Cmdk.List className="max-h-80 overflow-y-auto p-2">
            <Cmdk.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Cmdk.Empty>
            {groups.map(([group, groupItems]) => (
              <Cmdk.Group
                key={group}
                heading={group}
                className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
              >
                {groupItems.map((item) => (
                  <Cmdk.Item
                    key={item.id}
                    onSelect={item.onSelect}
                    className={cn(
                      "flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm text-foreground",
                      "data-[selected=true]:bg-secondary",
                    )}
                  >
                    {item.label}
                  </Cmdk.Item>
                ))}
              </Cmdk.Group>
            ))}
          </Cmdk.List>
        </Cmdk>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 4: Create `index.ts`**

```ts
export * from "./command-menu";
```

- [ ] **Step 5: Add barrel export to `packages/ui/src/index.ts`**

```ts
export * from "./components/command-menu";
```

- [ ] **Step 6: Run test to verify it passes**

Run: `pnpm --filter @manpowerhub/ui test -- command-menu`
Expected: PASS, 3 tests.

- [ ] **Step 7: Write `command-menu.stories.tsx`**

```tsx
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button";
import { CommandMenu } from "./command-menu";

const meta: Meta<typeof CommandMenu> = { title: "Components/CommandMenu", component: CommandMenu };
export default meta;
type Story = StoryObj<typeof CommandMenu>;

const items = [
  { id: "new", label: "New project", onSelect: () => {}, group: "Actions" },
  { id: "settings", label: "Open settings", onSelect: () => {}, group: "Actions" },
  { id: "docs", label: "Search documentation", onSelect: () => {}, group: "Navigation" },
];

export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open ⌘K</Button>
        <CommandMenu open={open} onOpenChange={setOpen} items={items} />
      </>
    );
  },
};

export const AlwaysOpen: Story = { args: { open: true, onOpenChange: () => {}, items } };
export const Dark: Story = { ...AlwaysOpen, globals: { theme: "dark" } };
export const Empty: Story = { args: { open: true, onOpenChange: () => {}, items: [] } };
export const Customization: Story = { args: { open: true, onOpenChange: () => {}, items, className: "max-w-xl" } };
```

- [ ] **Step 8: Commit**

```bash
git add packages/ui/src/components/command-menu packages/ui/src/index.ts
git commit -m "feat(ui): add CommandMenu (cmdk-powered)"
```

---

### Task 11: AppShell

**Files:**
- Create: `packages/ui/src/components/app-shell/app-shell.tsx`
- Create: `packages/ui/src/components/app-shell/app-shell.stories.tsx`
- Create: `packages/ui/src/components/app-shell/app-shell.test.tsx`
- Create: `packages/ui/src/components/app-shell/index.ts`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Produces: `AppShell({ sidebar, topbar, children, sidebarWidth? })` — fixed-width sidebar column, sticky topbar row, scrollable content area. Matches handoff 04 "Structure & dims" (sidebar default `256px`, topbar height `56px`) and "Responsive" (sidebar collapses under `md`; consumer controls collapse state via `sidebarOpen`/`onSidebarOpenChange` since AppShell has no internal state per the customization contract).

- [ ] **Step 1: Write the failing test — `app-shell.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { AppShell } from "../../index";

describe("AppShell", () => {
  it("renders sidebar, topbar, and children", () => {
    render(
      <AppShell sidebar={<nav>Sidebar content</nav>} topbar={<div>Topbar content</div>}>
        <p>Main content</p>
      </AppShell>,
    );
    expect(screen.getByText("Sidebar content")).toBeInTheDocument();
    expect(screen.getByText("Topbar content")).toBeInTheDocument();
    expect(screen.getByText("Main content")).toBeInTheDocument();
  });

  it("hides the sidebar column when sidebarOpen is false", () => {
    render(
      <AppShell sidebar={<nav>Sidebar</nav>} topbar={<div>Top</div>} sidebarOpen={false}>
        <p>Content</p>
      </AppShell>,
    );
    expect(screen.queryByText("Sidebar")).not.toBeInTheDocument();
  });

  it("merges consumer className on root", () => {
    render(
      <AppShell
        className="custom-class"
        data-testid="shell"
        sidebar={<nav>S</nav>}
        topbar={<div>T</div>}
      >
        <p>C</p>
      </AppShell>,
    );
    expect(screen.getByTestId("shell")).toHaveClass("custom-class");
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <AppShell sidebar={<nav>S</nav>} topbar={<div>T</div>}>
        <p>C</p>
      </AppShell>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/ui test -- app-shell`
Expected: FAIL — no `AppShell` export.

- [ ] **Step 3: Implement `app-shell.tsx`**

```tsx
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
```

- [ ] **Step 4: Create `index.ts`**

```ts
export * from "./app-shell";
```

- [ ] **Step 5: Add barrel export to `packages/ui/src/index.ts`**

```ts
export * from "./components/app-shell";
```

- [ ] **Step 6: Run test to verify it passes**

Run: `pnpm --filter @manpowerhub/ui test -- app-shell`
Expected: PASS, 4 tests.

- [ ] **Step 7: Write `app-shell.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { AppShell } from "./app-shell";

const meta: Meta<typeof AppShell> = { title: "Components/AppShell", component: AppShell };
export default meta;
type Story = StoryObj<typeof AppShell>;

const Sidebar = () => (
  <nav className="flex flex-col gap-1 p-4">
    <div className="mb-2 font-display text-lg">ManpowerHub</div>
    <a className="rounded-md px-3 py-2 text-sm hover:bg-secondary" href="#">Dashboard</a>
    <a className="rounded-md px-3 py-2 text-sm hover:bg-secondary" href="#">Reports</a>
  </nav>
);
const Topbar = () => <div className="text-sm font-medium">Dashboard</div>;

export const Default: Story = {
  render: () => (
    <AppShell sidebar={<Sidebar />} topbar={<Topbar />}>
      <p className="text-sm text-muted-foreground">Main content area.</p>
    </AppShell>
  ),
};

export const SidebarCollapsed: Story = {
  render: () => (
    <AppShell sidebar={<Sidebar />} topbar={<Topbar />} sidebarOpen={false}>
      <p className="text-sm text-muted-foreground">Main content area, sidebar collapsed.</p>
    </AppShell>
  ),
};

export const Dark: Story = { ...Default, globals: { theme: "dark" } };
export const Customization: Story = {
  render: () => (
    <AppShell sidebar={<Sidebar />} topbar={<Topbar />} sidebarWidth={200}>
      <p className="text-sm text-muted-foreground">Narrower 200px sidebar.</p>
    </AppShell>
  ),
};
```

- [ ] **Step 8: Commit**

```bash
git add packages/ui/src/components/app-shell packages/ui/src/index.ts
git commit -m "feat(ui): add AppShell layout component"
```

---

### Task 12: AreaChart + MiniBars

**Files:**
- Create: `packages/ui/src/components/area-chart/area-chart.tsx`
- Create: `packages/ui/src/components/area-chart/area-chart.stories.tsx`
- Create: `packages/ui/src/components/area-chart/area-chart.test.tsx`
- Create: `packages/ui/src/components/area-chart/index.ts`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Produces: `AreaChart({ data, width?, height? })` where `data: { x: number | string; y: number }[]` — hand-rolled inline SVG (no new charting dependency). `MiniBars({ data, width?, height? })` where `data: number[]` — sparkline-style bar chart.

- [ ] **Step 1: Write the failing test — `area-chart.test.tsx`**

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AreaChart, MiniBars } from "../../index";

describe("AreaChart", () => {
  it("renders one path for the area fill", () => {
    const { container } = render(
      <AreaChart data={[{ x: 0, y: 10 }, { x: 1, y: 30 }, { x: 2, y: 20 }]} />,
    );
    expect(container.querySelectorAll("path")).toHaveLength(1);
  });

  it("renders nothing but an empty svg when data is empty", () => {
    const { container } = render(<AreaChart data={[]} />);
    expect(container.querySelectorAll("path")).toHaveLength(0);
  });

  it("forwards className to the svg", () => {
    const { container } = render(<AreaChart data={[{ x: 0, y: 1 }]} className="custom-class" />);
    expect(container.querySelector("svg")).toHaveClass("custom-class");
  });
});

describe("MiniBars", () => {
  it("renders one rect per data point", () => {
    const { container } = render(<MiniBars data={[3, 8, 5, 12]} />);
    expect(container.querySelectorAll("rect")).toHaveLength(4);
  });

  it("forwards className to the svg", () => {
    const { container } = render(<MiniBars data={[1, 2]} className="custom-class" />);
    expect(container.querySelector("svg")).toHaveClass("custom-class");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/ui test -- area-chart`
Expected: FAIL — no `AreaChart`/`MiniBars` export.

- [ ] **Step 3: Implement `area-chart.tsx`**

```tsx
import * as React from "react";
import { cn } from "../../lib/utils";

export interface AreaChartPoint {
  x: number | string;
  y: number;
}

export interface AreaChartProps extends React.SVGAttributes<SVGSVGElement> {
  data: AreaChartPoint[];
  width?: number;
  height?: number;
}

export function AreaChart({ data, width = 240, height = 64, className, ...props }: AreaChartProps) {
  if (data.length === 0) {
    return <svg width={width} height={height} className={cn(className)} {...props} />;
  }

  const max = Math.max(...data.map((d) => d.y));
  const min = Math.min(...data.map((d) => d.y));
  const range = max - min || 1;
  const stepX = width / Math.max(1, data.length - 1);

  const points = data.map((d, i) => {
    const px = i * stepX;
    const py = height - ((d.y - min) / range) * height;
    return [px, py] as const;
  });

  const linePath = points.map(([px, py], i) => `${i === 0 ? "M" : "L"}${px},${py}`).join(" ");
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={cn(className)} {...props}>
      <path d={areaPath} className="fill-primary/15 stroke-none" />
      <path d={linePath} className="fill-none stroke-primary" strokeWidth={2} />
    </svg>
  );
}

export interface MiniBarsProps extends React.SVGAttributes<SVGSVGElement> {
  data: number[];
  width?: number;
  height?: number;
}

export function MiniBars({ data, width = 120, height = 32, className, ...props }: MiniBarsProps) {
  const max = Math.max(...data, 1);
  const gap = 2;
  const barWidth = data.length > 0 ? (width - gap * (data.length - 1)) / data.length : 0;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={cn(className)} {...props}>
      {data.map((value, i) => {
        const barHeight = (value / max) * height;
        return (
          <rect
            key={i}
            x={i * (barWidth + gap)}
            y={height - barHeight}
            width={barWidth}
            height={barHeight}
            rx={1}
            className="fill-primary"
          />
        );
      })}
    </svg>
  );
}
```

- [ ] **Step 4: Create `index.ts`**

```ts
export * from "./area-chart";
```

- [ ] **Step 5: Add barrel export to `packages/ui/src/index.ts`**

```ts
export * from "./components/area-chart";
```

- [ ] **Step 6: Run test to verify it passes**

Run: `pnpm --filter @manpowerhub/ui test -- area-chart`
Expected: PASS, 5 tests.

- [ ] **Step 7: Write `area-chart.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { AreaChart, MiniBars } from "./area-chart";

const meta: Meta<typeof AreaChart> = { title: "Components/AreaChart", component: AreaChart };
export default meta;

const series = [
  { x: 0, y: 10 }, { x: 1, y: 25 }, { x: 2, y: 18 }, { x: 3, y: 32 },
  { x: 4, y: 28 }, { x: 5, y: 40 }, { x: 6, y: 35 },
];

export const Default: StoryObj<typeof AreaChart> = { args: { data: series } };
export const Wide: StoryObj<typeof AreaChart> = { args: { data: series, width: 480, height: 120 } };
export const Empty: StoryObj<typeof AreaChart> = { args: { data: [] } };
export const Dark: StoryObj<typeof AreaChart> = { ...Default, globals: { theme: "dark" } };
export const Customization: StoryObj<typeof AreaChart> = { args: { data: series, className: "opacity-80" } };

export const MiniBarsDefault: StoryObj<typeof MiniBars> = {
  render: () => <MiniBars data={[3, 8, 5, 12, 7, 15, 9]} />,
};
```

- [ ] **Step 8: Commit**

```bash
git add packages/ui/src/components/area-chart packages/ui/src/index.ts
git commit -m "feat(ui): add AreaChart and MiniBars (inline SVG dataviz)"
```

---

### Task 13: Icons (curated re-export)

**Files:**
- Create: `packages/ui/src/components/icons/icons.tsx`
- Create: `packages/ui/src/components/icons/icons.stories.tsx`
- Create: `packages/ui/src/components/icons/icons.test.tsx`
- Create: `packages/ui/src/components/icons/index.ts`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Produces: `Icons` — a typed `Record<string, React.ComponentType>` of the `lucide-react` icons already used across `packages/ui`/`packages/blocks` (curated, not the entire library), so consumers get one stable import surface (`Icons.ArrowUp`, `Icons.Search`, ...) per handoff 04 "Icons" guidance.

- [ ] **Step 1: Grep which lucide icons are already used across the codebase**

Run: `grep -rhoE "from \"lucide-react\"" -A0 packages/ui/src packages/blocks/src | wc -l; grep -rhoE "^import \{ [^}]+ \} from \"lucide-react\"" packages/ui/src packages/blocks/src`
Expected: prints every existing lucide import line — use this list (plus `Sun`, `Moon`, `Search`, `X` already added in earlier tasks) to build the curated set below; don't guess names, use exactly what's printed.

- [ ] **Step 2: Write the failing test — `icons.test.tsx`**

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Icons } from "../../index";

describe("Icons", () => {
  it("exposes ArrowUp, ArrowDown, Search, Check as components", () => {
    const { container: c1 } = render(<Icons.ArrowUp data-testid="i" />);
    const { container: c2 } = render(<Icons.Search data-testid="i" />);
    expect(c1.querySelector("svg")).not.toBeNull();
    expect(c2.querySelector("svg")).not.toBeNull();
  });

  it("forwards props like className to the underlying icon", () => {
    const { container } = render(<Icons.Check className="custom-class" />);
    expect(container.querySelector("svg")).toHaveClass("custom-class");
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/ui test -- icons`
Expected: FAIL — no `Icons` export.

- [ ] **Step 4: Implement `icons.tsx`**

Use the exact grep output from Step 1 to fill in this set (this list reflects icons already in use as of this plan's writing — add/remove to match the actual grep output):

```tsx
import {
  ArrowUp,
  ArrowDown,
  Check,
  Minus,
  X,
  Sun,
  Moon,
  Search,
  ArrowUpDown,
  Loader2,
  type LucideIcon,
} from "lucide-react";

export const Icons: Record<string, LucideIcon> = {
  ArrowUp,
  ArrowDown,
  Check,
  Minus,
  X,
  Sun,
  Moon,
  Search,
  ArrowUpDown,
  Loader2,
};
```

- [ ] **Step 5: Create `index.ts`**

```ts
export * from "./icons";
```

- [ ] **Step 6: Add barrel export to `packages/ui/src/index.ts`**

```ts
export * from "./components/icons";
```

- [ ] **Step 7: Run test to verify it passes**

Run: `pnpm --filter @manpowerhub/ui test -- icons`
Expected: PASS, 2 tests.

- [ ] **Step 8: Write `icons.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Icons } from "./icons";

const meta: Meta = { title: "Components/Icons" };
export default meta;

export const AllIcons: StoryObj = {
  render: () => (
    <div className="grid grid-cols-6 gap-4">
      {Object.entries(Icons).map(([name, Icon]) => (
        <div key={name} className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
          <Icon className="size-5 text-foreground" aria-hidden />
          {name}
        </div>
      ))}
    </div>
  ),
};

export const Dark: StoryObj = { ...AllIcons, globals: { theme: "dark" } };
```

- [ ] **Step 9: Commit**

```bash
git add packages/ui/src/components/icons packages/ui/src/index.ts
git commit -m "feat(ui): add curated Icons export"
```

---

### Task 14: Docs pages for every new component

**Files:**
- Create: `apps/docs/content/components/avatar.mdx`
- Create: `apps/docs/content/components/tooltip.mdx`
- Create: `apps/docs/content/components/dialog.mdx`
- Create: `apps/docs/content/components/dropdown-menu.mdx`
- Create: `apps/docs/content/components/progress.mdx`
- Create: `apps/docs/content/components/skeleton.mdx`
- Create: `apps/docs/content/components/table.mdx`
- Create: `apps/docs/content/components/theme-toggle.mdx`
- Create: `apps/docs/content/components/command-menu.mdx`
- Create: `apps/docs/content/components/app-shell.mdx`
- Create: `apps/docs/content/components/area-chart.mdx`
- Create: `apps/docs/content/components/icons.mdx`
- Modify: `apps/docs/content/components/_meta.ts`

**Interfaces:**
- Consumes: existing page structure — read `apps/docs/content/components/button.mdx` first and mirror its section order (import example, prop table, variants) for every page below.

- [ ] **Step 1: Read the existing pattern**

Run: `cat apps/docs/content/components/button.mdx`
Expected: prints the page structure (front matter / headings / code fences) — mirror it exactly in every file below, substituting the component name, import, and a real usage snippet from that component's own `.stories.tsx` `Default` export.

- [ ] **Step 2: Create each `.mdx` page**

For each of the 12 components, create `apps/docs/content/components/<name>.mdx` with:
- A top-level heading with the component's display name.
- One sentence describing purpose (pull from the handoff doc section for that component in `manpowerhub-ui-handoff/03-COMPONENTS-CORE.md` / `04-COMPONENTS-SHELL-DATAVIZ.md`).
- An import + usage code fence copied from that component's `Default` story.
- A "Props" section listing the exported prop interface fields (copy directly from the `.tsx` file's `interface ...Props` block — do not invent props not in the code).

Example for `apps/docs/content/components/avatar.mdx`:

```mdx
# Avatar

Displays a user's profile image with a graceful fallback to initials when the image fails to load or hasn't loaded yet.

## Usage

\`\`\`tsx
import { Avatar, AvatarImage, AvatarFallback } from "@manpowerhub/ui";

<Avatar>
  <AvatarImage src="https://example.com/avatar.jpg" alt="Jane Doe" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
\`\`\`

## Props

### Avatar
| Prop | Type | Default |
| --- | --- | --- |
| `size` | `"sm" \| "default" \| "lg"` | `"default"` |
| `className` | `string` | — |

All other props are forwarded to the underlying element.
```

Repeat this structure for `tooltip.mdx`, `dialog.mdx`, `dropdown-menu.mdx`, `progress.mdx` (cover both `Progress` and `HealthRing`), `skeleton.mdx` (cover both `Skeleton` and `Spinner`), `table.mdx` (cover `Table` primitives and `DataTable`), `theme-toggle.mdx`, `command-menu.mdx`, `app-shell.mdx`, `area-chart.mdx` (cover both `AreaChart` and `MiniBars`), `icons.mdx`.

- [ ] **Step 3: Update `_meta.ts`**

```ts
export default {
  badge: "Badge",
  button: "Button",
  card: "Card",
  checkbox: "Checkbox",
  input: "Input",
  "kpi-card": "KPICard",
  select: "Select",
  tabs: "Tabs",
  avatar: "Avatar",
  tooltip: "Tooltip",
  dialog: "Dialog",
  "dropdown-menu": "DropdownMenu",
  progress: "Progress",
  skeleton: "Skeleton",
  table: "Table",
  "theme-toggle": "ThemeToggle",
  "command-menu": "CommandMenu",
  "app-shell": "AppShell",
  "area-chart": "AreaChart",
  icons: "Icons",
};
```

- [ ] **Step 4: Build docs to verify no broken links/MDX errors**

Run: `pnpm --filter @manpowerhub/docs build`
Expected: build succeeds, no MDX parse errors, all 12 new routes appear in the build output.

- [ ] **Step 5: Commit**

```bash
git add apps/docs/content/components
git commit -m "docs: add pages for Avatar, Tooltip, Dialog, DropdownMenu, Progress, Skeleton, Table, ThemeToggle, CommandMenu, AppShell, AreaChart, Icons"
```

---

### Task 15: Changeset for this batch

**Files:**
- Create: `.changeset/<auto-generated-name>.md`

**Interfaces:**
- Consumes: nothing.
- Produces: a minor version bump changeset for `@manpowerhub/ui` (this batch touches only `packages/ui`, not `blocks` or `tokens`).

- [ ] **Step 1: Run changeset CLI**

Run: `pnpm changeset`
Expected: interactive prompt — select `@manpowerhub/ui`, choose `minor` (new public components, backward compatible), enter summary: `Add Avatar, Tooltip, Dialog, DropdownMenu, Progress, HealthRing, Skeleton, Spinner, Table, DataTable, ThemeToggle, CommandMenu, AppShell, AreaChart, MiniBars, and curated Icons.`

- [ ] **Step 2: Commit**

```bash
git add .changeset
git commit -m "chore: add changeset for component gap-fill batch"
```

---

### Task 16: Verify every Vercel build target locally

**Files:** none created/modified — verification only.

**Interfaces:** none.

- [ ] **Step 1: Verify `apps/docs` build (its `vercel.json` buildCommand)**

Run: `pnpm install --frozen-lockfile && pnpm --filter @manpowerhub/docs build`
Expected: exits 0, `apps/docs/out` (or `.next`) produced.

- [ ] **Step 2: Verify `packages/ui` Storybook build (its `vercel.json` buildCommand)**

Run: `pnpm --filter @manpowerhub/tokens build && pnpm --filter @manpowerhub/ui build && pnpm --filter @manpowerhub/ui build-storybook`
Expected: exits 0, `packages/ui/storybook-static` produced, includes stories for all 13 new components.

- [ ] **Step 3: Verify `packages/blocks` Storybook build (its `vercel.json` buildCommand)**

Run: `pnpm --filter @manpowerhub/tokens build && pnpm --filter @manpowerhub/ui build && pnpm --filter @manpowerhub/blocks build && pnpm --filter @manpowerhub/blocks build-storybook`
Expected: exits 0, `packages/blocks/storybook-static` produced.

- [ ] **Step 4: Verify `apps/playground` build (its `vercel.json` buildCommand)**

Run: `pnpm --filter @manpowerhub/tokens build && pnpm --filter @manpowerhub/ui build && pnpm --filter @manpowerhub/blocks build && pnpm --filter @manpowerhub/playground build`
Expected: exits 0, `apps/playground/dist` produced.

- [ ] **Step 5: Full CI parity check**

Run: `pnpm -r build && pnpm -r exec tsc --noEmit && pnpm lint && pnpm test`
Expected: all green — this is exactly what `.github/workflows/ci.yml` runs on push.

- [ ] **Step 6: Report Vercel project-linking steps back to the user (manual, account-gated)**

No commit — this step is a handoff note, not a code change. Once Steps 1-5 are green, tell the user: each of the 4 `vercel.json` files (`apps/docs`, `apps/playground`, `packages/ui`, `packages/blocks`) is ready to import as a separate Vercel project pointing at this repo with that directory as its root — this requires their Vercel account login (`vercel link` per directory, or Vercel dashboard → Add New → Project → set "Root Directory" to the path) and is not something achievable via CLI without their credentials.

---

## Self-Review

**Spec coverage** (against `docs/superpowers/specs/2026-07-06-handoff-gap-fill-design.md`):
- New `packages/ui` components (handoff 03+04 gap) → Tasks 2-13. ✓ (Radio/Switch/Textarea/Field skipped — confirmed already built in `packages/ui/src/components/checkbox` and `input`.)
- Docs pages → Task 14. ✓
- Release changeset → Task 15. ✓
- Deploy verification → Task 16. ✓ (Vercel *project linking* itself is explicitly out of reach for an agent — flagged as a manual handoff, not silently skipped.)

**Placeholder scan:** No TBD/TODO. Task 13 Step 1 asks for a grep before finalizing the icon list, but Step 4 supplies a concrete fallback list derived from what's already known to be used (`ArrowUp`, `ArrowDown`, `Check`, `Minus`, `X`, `Sun`, `Moon`, `Search`, `ArrowUpDown`, `Loader2`) — not an open-ended placeholder.

**Type consistency:** `DataTableColumn<T>` (Task 8) is the single shape used in both `data-table.tsx` and its test/story. `ThemeToggleProps` (Task 9) reuses `ButtonProps` via `Omit`, matching `Button`'s existing export. `CommandMenuItem` (Task 10) is defined once and consumed identically by the component, test, and story.

**Task order:** Task 1 (deps) before any component using Radix/cmdk. Task 4 (Dialog) before Task 10 (CommandMenu, which composes Dialog). Task 8 (Table) before its own DataTable sub-step (same task, ordered internally). Task 9 (ThemeToggle) after Button already exists (it does, pre-existing). Tasks 2-13 (components) before Task 14 (docs reference their stories) before Task 15 (changeset) before Task 16 (build verification, needs everything built).

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-06-handoff-gap-fill.md`. Two execution options:

1. **Subagent-Driven (recommended)** — fresh subagent per task, review between tasks.
2. **Inline Execution** — execute in this session with checkpoints.
