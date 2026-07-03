# 03 — Core components

Each entry gives: the **shadcn base** to start from, the **TypeScript API**,
**variants/states**, **behavior/a11y**, and the **story matrix** (what
`*.stories.tsx` must cover — see `06`). Visual truth is
`reference/styles/app.css` (all `.btn`, `.card`, `.badge`, `.table`… rules) and
`reference/src/components/primitives.jsx`.

General rules for every component: `forwardRef`, named export + exported props
type, `className` merged last via `cn()`, variants via `cva`, works light+dark,
visible focus ring (`ring-2 ring-ring ring-offset-2` equivalent → 3px accent).

---

## Button

**shadcn base:** `button`. **Reference:** `.btn` in `app.css`.

```ts
type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "default" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;   // default "secondary"
  size?: ButtonSize;         // default "default"
  loading?: boolean;         // swaps label for spinner, keeps width, disables
  asChild?: boolean;         // Radix Slot
  // icons: pass as children; 6px gap is built in
}
```

- **Sizes:** default 30px h · `sm` 26px · `lg` 38px · `icon` square (matches height).
- **Icon gap:** 6px. Icon sizes: 13px in sm/default, 15px in lg.
- `primary` = `bg-primary text-primary-foreground`, hover `--accent-hover`, active `--accent-press`.
- `secondary` = surface + `border-border`, hover `bg-secondary`.
- `ghost` = transparent, hover `bg-secondary`.
- `danger` = `bg-destructive text-destructive-foreground`.
- **Loading:** render spinner centered, children `visibility:hidden` to preserve width; `disabled` + `aria-busy`. (Reference: `ButtonLoading` in `skeletons.jsx`.)
- **Focus:** `:focus-visible` → 3px `--accent-ring`.

**Stories:** all variants × sizes grid · with leading icon · icon-only · loading · disabled · light+dark.

---

## Input / Textarea

**shadcn base:** `input`, `textarea`. **Reference:** `.input`, `.field`, `.field__label`.

```ts
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputSize?: "default" | "lg"; // 32px / 38px
  invalid?: boolean;            // red border + ring
  // wrap with <Field label error hint> for the labelled pattern
}
interface FieldProps {
  label?: string; hint?: string; error?: string; required?: boolean;
  htmlFor?: string; children: React.ReactNode;
}
```

- Border `border-input`; focus `border-ring` + 3px `--accent-ring`. Placeholder `text-fg-3`.
- Textarea: `padding: 8px 10px`, `resize: vertical`, `min-height: 80px`.
- `invalid` → destructive border + ring; error text below in destructive, 12.5px.
- Left/right adornment slots (icon or unit) optional — 13px icons, `text-fg-3`.

**Stories:** default · focused · with label+hint · error · disabled · sizes · with leading icon · textarea · light+dark.

---

## Select

**shadcn base:** `select` (Radix). **Reference:** select-styled-as-input + `ChevronDown` 13px right.

```ts
interface SelectProps {
  value?: string; defaultValue?: string; onValueChange?(v: string): void;
  placeholder?: string; disabled?: boolean; size?: "default" | "lg";
  children: React.ReactNode; // <SelectItem value>label</SelectItem>
}
```

- Trigger mirrors `.input` height/border/focus. Chevron rotates on open (optional).
- Content: `bg-popover`, `--shadow-md`, radius `lg`, item hover `bg-secondary`, selected shows check.

**Stories:** closed · open (list) · selected · disabled · long list (scroll) · light+dark.

---

## Checkbox · Radio · Switch

**shadcn base:** `checkbox`, `radio-group`, `switch` (all Radix).

```ts
interface CheckboxProps { checked?: boolean|"indeterminate"; onCheckedChange?(v): void; disabled?: boolean; label?: string; }
interface SwitchProps   { checked?: boolean; onCheckedChange?(v): void; disabled?: boolean; label?: string; }
```

- Checkbox 16px square, radius `xs`, checked `bg-primary` with white check; indeterminate = dash.
- Switch: track `bg-secondary` → `bg-primary` on; thumb `bg-card` with `--shadow-xs`.
- Radio: dot fills `bg-primary`. All: 3px focus ring, label click toggles.

**Stories:** unchecked/checked/indeterminate/disabled each · switch on/off/disabled · radio group · light+dark.

---

## Card

**shadcn base:** `card`. **Reference:** `.card`, `.card__header/__title/__body/__footer`.

```ts
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean; // hover elevates to --shadow-sm
  dashed?: boolean;      // dashed border + bg-secondary (explainer cards)
}
// Compound: Card.Header, Card.Title, Card.Body, Card.Footer
```

- `bg-card`, 1px `border-border`, radius `9px` (DEFAULT), `--shadow-xs` at rest.
- Header: `14px 16px`, bottom border, title 13–15px 600 + optional action on right.
- Body padding 16px. Footer: top border, muted meta.
- `interactive` → hover `--shadow-sm` + cursor pointer.

**Stories:** basic · header+action · with footer · interactive (hover) · dashed explainer · light+dark.

---

## Badge · StatusBadge

**shadcn base:** `badge`. **Reference:** `.badge`, `StatusBadge` in `primitives.jsx`.

```ts
type BadgeVariant = "success" | "warning" | "danger" | "info" | "accent" | "outline";
interface BadgeProps { variant?: BadgeVariant; dot?: boolean; children: React.ReactNode; }

type Status =
  | "paid" | "sent" | "draft" | "overdue" | "partially_paid" | "written_off"
  | "active" | "planning" | "on hold" | "done" | "todo" | "in_progress"
  | "cancelled" | "high" | "med" | "low" | "approved";
interface StatusBadgeProps { status: Status; }
```

- Soft-tint background + saturated text per variant (`--success-soft` + `--success`, etc.).
- `dot` → leading 6px filled dot in the variant color.
- **`StatusBadge`** owns the canonical status→variant+label map (copy exactly from `primitives.jsx`):
  paid→success "Paid", sent→info "Sent", draft→outline "Draft", overdue→danger "Overdue",
  partially_paid→warning "Partial", active→success "Active", planning→info "Planning",
  on hold→warning "On hold", done→success "Done", todo→outline "To do",
  in_progress→info "In progress", cancelled→outline "Cancelled", high→danger "High",
  med→warning "Medium", low→outline "Low", approved→success "Approved", written_off→outline "Written off".

**Stories:** every variant (with + without dot) · StatusBadge showing every status · light+dark.

---

## Tabs

**shadcn base:** `tabs` (Radix). **Reference:** `.tabs`, `.tabs__item`, `.tabs__count`.

```ts
// Tabs, Tabs.List, Tabs.Trigger (supports `count?: number`), Tabs.Content
interface TabTriggerProps { value: string; count?: number; children: React.ReactNode; }
```

- 1.5px underline aligned to the divider; active trigger = `text-foreground` + accent underline, inactive `text-fg-2`.
- `count` renders a small pill on the right of the label.
- Keyboard: arrow keys move, Home/End jump (Radix default).

**Stories:** 2–4 tabs · with counts · active states · keyboard nav (play) · light+dark.

---

## Table + DataTable

**shadcn base:** `table` + **@tanstack/react-table** for DataTable. **Reference:** `.table`, `.table--card`.

```ts
// Primitive Table (dumb): Table, Table.Head, Table.Body, Table.Row, Table.Th, Table.Td
// DataTable (smart) generic:
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];        // tanstack column defs
  loading?: boolean;              // renders SkeletonTableRow × pageSize
  empty?: React.ReactNode;        // EmptyState when data.length === 0
  onRowClick?(row: T): void;
  sortable?: boolean; pageSize?: number;
  card?: boolean;                 // wrap in .table--card bordered card
}
```

- **TH:** `10px 14px`, uppercase, letter-spacing `0.05em`, `text-fg-3`, sticky top.
- **TD:** `12px 14px`, vertical-align middle. Row hover `bg-secondary`.
- `table--card`: wrap in Card; first/last cells get 18px side padding.
- Money columns: `tabular-nums`, right-aligned.
- **Loading** → `SkeletonTableRow cols={n}` × pageSize. **Empty** → `EmptyState`. **Error** → inline error row with retry.

**Stories:** static table · DataTable sortable · loading (skeleton rows) · empty · error · row click · card vs plain · light+dark.

---

## Avatar

**shadcn base:** `avatar`. **Reference:** `Avatar` in `primitives.jsx`.

```ts
interface AvatarProps { name: string; size?: number; src?: string | null; }
```

- With `src` → image; else deterministic gradient from `name` hash over a fixed 6-palette set (copy the palettes exactly), showing up to 2 uppercase initials at `0.42×size`.
- `aria-label={name}`. Circle, `flex-shrink:0`.
- Provide `AvatarGroup` (overlapping, `+N` overflow chip) as a small extra.

**Stories:** with image · initials (several names → different colors) · sizes 20/28/40 · group with overflow · light+dark.

---

## Tooltip

**shadcn base:** `tooltip` (Radix).

```ts
interface TooltipProps { content: React.ReactNode; side?: "top"|"right"|"bottom"|"left"; children: React.ReactElement; }
```

- `bg-foreground text-background` (inverted), 11–12px, radius `sm`, `--shadow-md`, 6px offset, small delay.

**Stories:** four sides · on icon button · long text wrap · light+dark.

---

## Dialog / Modal

**shadcn base:** `dialog` (Radix).

```ts
// Dialog, Dialog.Trigger, Dialog.Content (size?: "sm"|"md"|"lg"), Dialog.Header,
// Dialog.Title, Dialog.Description, Dialog.Body, Dialog.Footer, Dialog.Close
```

- Overlay `--bg-overlay`. Content `bg-card`, radius `xl`, `--shadow-pop`, max-width by size (sm 400 / md 520 / lg 720).
- Focus trap + return focus (Radix). Esc closes. Header title 17px 600, description `text-muted-foreground`.
- Footer: right-aligned actions (Cancel ghost + primary).

**Stories:** basic confirm · form dialog · destructive confirm · scrolling body · sizes · light+dark.

---

## DropdownMenu

**shadcn base:** `dropdown-menu` (Radix). Used for row "…" actions, user menu, workspace switcher.

```ts
// DropdownMenu, .Trigger, .Content, .Item (destructive?, icon?), .Separator, .Label, .CheckboxItem, .Sub
```

- Content `bg-popover`, radius `lg`, `--shadow-md`, item hover `bg-secondary`, destructive item `text-destructive`.
- Icons 14px leading; keyboard nav + typeahead (Radix).

**Stories:** row actions menu · user menu (with avatar header) · with separators + destructive item · checkbox items · light+dark.

---

## EmptyState

**Reference:** the empty-state pattern (compose; no Radix base).

```ts
interface EmptyStateProps {
  icon: React.ComponentType<{ size?: number }>;
  title: string; description?: string;
  action?: React.ReactNode; // usually a primary Button
}
```

- Centered in a `Card`, `48px 24px`. Icon in a 48px `bg-secondary` rounded square, `text-fg-3`, 22px glyph.
- Title 17px (sentence case), description `text-muted-foreground` 13px max-width 280px, single primary action.

**Stories:** no invoices · no search results · no workers yet (each with its icon/copy) · light+dark.

---

## Also provide (thin wrappers, same rules)

Separator, Label, Kbd (`<kbd>` styled like `.kbd` — mono, `bg-secondary`, radius sm),
ScrollArea, Skeleton (see `04`), Toast (shadcn `sonner`, tokened), Popover,
Breadcrumb (topbar crumbs), Progress (see `04`).
