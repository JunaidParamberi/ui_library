# 08 — Theming & multi-app reuse

The whole point of splitting `@manpowerhub/tokens` out: **one component library,
many apps, each reskinned by tokens alone** — no component forks.

## The mechanism

Components never hardcode colors. They use Tailwind **semantic** classes
(`bg-background`, `text-foreground`, `bg-primary`, `border-border`,
`text-muted-foreground`, `bg-secondary`, …) which resolve to CSS variables. Change
the variables → every component in every app updates. This is the shadcn theming
model; we just own the variable set.

```
@manpowerhub/tokens (vars + preset)
        │
        ▼
@manpowerhub/ui (semantic classes only)
        │
   ┌────┴─────┬──────────┐
   ▼          ▼          ▼
Workforce   App B      App C     ← each imports globals.css + can override vars
 (default)  (blue)    (client brand)
```

## How a new app consumes the library

```ts
// app entry
import "@manpowerhub/tokens/globals.css";   // base tokens (light+dark)
import "./brand.css";                        // optional overrides for THIS app
```
```ts
// tailwind.config.ts
import preset from "@manpowerhub/tokens/preset";
export default { presets: [preset], content: ["./src/**/*.{ts,tsx}"] };
```
```tsx
// root
<ThemeProvider defaultTheme="system">
  <AppShell …>{routes}</AppShell>
</ThemeProvider>
```
That's it — all `@manpowerhub/ui` components render in the app's brand.

## Overriding tokens for a brand

An app supplies a `brand.css` that redefines only what changes. Because everything
derives from a handful of anchors, a rebrand is usually **just the primary hue +
neutrals**:

```css
/* brand.css — "App B" uses a blue primary on cooler neutrals */
:root {
  --primary: 214 80% 48%;          /* was evergreen 156 37% 33% */
  --ring: 214 80% 48%;
  --chart-1: 214 80% 48%;
  --background: 210 20% 99%;       /* cooler paper */
  --border: 214 20% 90%;
  --radius: 0.5rem;                /* tighter corners */
}
.dark {
  --primary: 214 70% 60%;
  --ring: 214 70% 60%;
  --background: 214 15% 6%;
}
```

Nothing else needs touching. Test the app's Storybook — the whole catalog now
renders in the new brand. **This is the acceptance test for Phase 6.**

## Theme presets (ship a few)

Provide named presets in `@manpowerhub/tokens` so apps opt in without hand-writing CSS:

```ts
// @manpowerhub/tokens/presets
export const themes = {
  evergreen: {/* default */},
  slate:     { primary: "215 25% 27%", … },
  azure:     { primary: "214 80% 48%", … },
};
```
A preset is just a map of var → value; applying one writes those vars onto
`:root` / `.dark`. Document each preset as a Foundations story showing the full
palette.

## Dark mode

- `.dark` class on `<html>` (Tailwind `darkMode: ["class"]`). `ThemeProvider`
  toggles it and persists to `localStorage` (`manpowerhub-theme`); first load
  honors `prefers-color-scheme`.
- Every token has a `.dark` value already (see `02`). New brand overrides should
  set both `:root` and `.dark`.

## Rules to keep multi-app clean

1. **No hex in components.** Ever. Only semantic Tailwind classes / CSS vars. (Lint for `#[0-9a-f]{3,6}` in `packages/ui/src`.)
2. **No app-specific logic in `@manpowerhub/ui`.** Apps pass data + config via props.
3. **Charts read `--chart-N`**, not literal colors, so they rebrand too.
4. **Soft tints** (`--mph-*-soft`) are alpha-baked rgba today; when adding a brand, regenerate them from the new hue, or switch them to `hsl(var(--…) / <alpha>)` so they follow automatically (preferred going forward).
5. **Versioning:** a token rename/removal is a breaking `@manpowerhub/tokens` major; add before you remove and document in the changeset.

## Density / radius / font as brand levers

Beyond color, apps can override:
- `--radius` (corner softness),
- `font-family` vars (swap Geist for a client typeface — keep the mono for numbers),
- spacing extras if a denser product is needed (define a compact preset).

Keep these in the token layer so a single import changes the feel of the whole
app.
