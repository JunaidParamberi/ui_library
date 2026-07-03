# @manpowerhub/ui — Binding Rules

## Component contract (non-negotiable)
Every component in `packages/ui/src/components/**` MUST:
- Forward `className`, composed via `cn()` (tailwind-merge) so consumer classes win.
- Forward `ref` (`React.forwardRef`).
- Spread remaining `...props` onto the root element.
- Expose visual variants via `cva`, typed on the props.
- Ship alongside: `<name>.tsx`, `<name>.stories.tsx` (states: default, dark, loading, empty, error where applicable, plus a "Customization" story), `<name>.test.tsx` (Vitest + Testing Library + axe), `index.ts`.
- Be re-exported from `packages/ui/src/index.ts`.

## Packages
- `@manpowerhub/tokens`: zero React. Theme = CSS vars in `src/globals.css` + Tailwind `preset`.
- `@manpowerhub/ui`: components only. No API calls, no business logic, no secrets.

## Customization (must always hold)
1. Tokens: consumers override CSS vars to reskin globally.
2. className + cva variants: per-instance overrides.
3. `asChild` (Radix Slot): structural element swap where sensible.

## Reference
Source of truth for look/behavior: `manpowerhub-ui-handoff/` docs 01–08, `reference/`.
