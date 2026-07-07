# Docs App Overhaul — Design

**Date:** 2026-07-07
**Status:** Approved (design), pending spec review
**Target:** `apps/docs` (Nextra 4, Next 15, static export) in the `@manpowerhub/ui` monorepo

## Problem

The docs app has full component coverage (20 components + 6 blocks, all with a page and a
demo), but is shallow and disconnected:

- **Thin pages.** Each page = title + one-line description + Storybook link + a single live
  preview + a hand-written props table. No copyable code, no variant/state gallery, no usage
  guidance, no accessibility notes.
- **Props tables drift.** Hand-authored per page; diverge from the real component types.
- **Plain design.** Stock Nextra theme; the preview shell is a plain bordered box; the docs
  do not dogfood `@manpowerhub/tokens` branding.
- **Not connected.** Playground (separate Vite app: `kitchen-sink`, `components-showcase`,
  `blocks-showcase`) and Storybook are not bridged into the docs as a "full view".
- **Near-zero tests.** Docs app has 0 tests; nothing guards demo render, prop accuracy, or
  link integrity.

## Goals

1. Rich per-page template: live preview **with a copyable code tab**, a states gallery,
   auto-generated props table, usage + accessibility sections.
2. Props + code derived from source (no hand-drift).
3. Branded, cleaner visual design on top of Nextra.
4. Bridge each page to its Storybook story and Playground anchor ("full view").
5. Tests guarding demo render (+ axe), prop generation, and link integrity.

## Non-goals

- No new UI/blocks components (separate effort).
- No move off Nextra (restyle only).
- No per-component Playground routes (anchor deep-links only).
- No live in-browser code editor / sandpack.

## Key constraint

`apps/docs` builds with `output: "export"` in production (`next.config.mjs`). There is **no
request-time server** — all code and prop data must be produced at **build time** via prebuild
codegen, then imported as static modules. This rules out request-time `fs` reads.

## Architecture

Two build-time codegen scripts feed upgraded MDX primitives. No runtime file reads.

```
apps/docs/
  scripts/
    gen-demo-sources.mjs   # demos/*.tsx        -> src/generated/demo-sources.generated.ts
    gen-props.mjs          # ui + blocks types  -> src/generated/props.generated.json
  src/generated/           # gitignored, produced by prebuild/predev
    demo-sources.generated.ts
    props.generated.json
  src/components/
    component-preview.tsx   # UPGRADED: Preview | Code tabs + copy button
    props-table.tsx         # NEW: renders from props.generated.json
    variant-gallery.tsx     # NEW: labeled state matrix
    full-view-links.tsx     # NEW: Storybook + Playground deep links
    storybook-link.tsx      # EXISTING: reused by full-view-links
```

`package.json` gains `predev` and `prebuild` scripts that run both generators, so
`src/generated/*` always exists before Next compiles. `postbuild` (pagefind) is unchanged.

### Approach chosen

**Prebuild codegen** (over webpack `?raw` loader or a remark plugin): explicit, debuggable,
survives static export and Turbopack, one mechanism for both code and props, cacheable.

## Components & data flow

### gen-demo-sources.mjs
- Read every `src/components/demos/<name>.tsx`.
- Strip the leading `"use client";` directive line (keep it out of the displayed snippet).
- Emit a keyed map: `export const demoSources = { "button-demo": "…raw source…", … }`.
- Key = demo file basename without extension.

### gen-props.mjs
- Run `react-docgen-typescript` over the exported components of `packages/ui/src` and
  `packages/blocks/src`.
- Emit JSON keyed by component display name:
  `{ "Button": [{ name, type, defaultValue, required, description }], … }`.
- Types resolved from the real component props (including `cva` variant unions where docgen
  can extract them).

### ComponentPreview (upgraded)
- Props: `children` (rendered demo), `source?: string`.
- Renders a tabbed shell: **Preview** (live) and **Code** (source, syntax-highlighted, with a
  copy-to-clipboard button). A per-preview light/dark toggle on the toolbar.
- Fallback: if `source` is absent, render preview-only (no Code tab), no crash.

### PropsTable (new)
- `<PropsTable of="Button" />` looks up `props.generated.json["Button"]`.
- Renders name / type / default / description columns.
- Missing entry → renders a "No documented props" row and logs a build-time warning.

### VariantGallery (new)
- Renders `children` as labeled cells for states (default, dark, loading, empty, error where
  applicable). State content authored per component as an exported `<Name>StatesDemo` in the
  demo file.

### FullViewLinks (new)
- `<FullViewLinks component="button" story="core-button" storyId="primary" />`.
- Composes the existing `StorybookLink` (already deep-links by `storyId`) plus a Playground
  link to `${PLAYGROUND_URL}/#<component-anchor>`.
- Base URLs from env, matching the existing `NEXT_PUBLIC_STORYBOOK_*_URL` pattern
  (`NEXT_PUBLIC_PLAYGROUND_URL`).

## Page template

Every component MDX migrates to:

```mdx
# <Name>
<one-line description>

<FullViewLinks component="button" story="core-button" storyId="primary" />

## Preview
<ComponentPreview source={demoSources["button-demo"]}><ButtonDemo /></ComponentPreview>

## States
<VariantGallery>…labeled state cells…</VariantGallery>

## Usage
When to use / when not — short hand-written prose.

## Props
<PropsTable of="Button" />

## Accessibility
Short hand-written notes (keyboard, ARIA, focus).
```

Applies to all 20 component pages and (adapted) 6 block pages. This migration is the bulk of
the work.

## Design polish (Nextra restyle)

- `app/globals.css`: map Nextra theme CSS vars onto `@manpowerhub/tokens` vars (brand primary,
  radius, font family) for both light and dark.
- Preview shell: bordered card, muted toolbar strip, tab underline, per-preview dark toggle,
  optional transparent/checker background.
- Foundations pages: render color swatches, spacing scale, and type ramp directly from tokens
  (upgrade the existing foundations content to be visual, not just prose).

## Wiring

- Playground: add stable `id` anchors per component in `components-showcase.tsx` and per block
  in `blocks-showcase.tsx`.
- `FullViewLinks` targets Storybook (`storyId`, existing) and Playground (`#anchor`).
- Env: `NEXT_PUBLIC_PLAYGROUND_URL` (default `http://localhost:5173`), alongside the existing
  Storybook URL envs.

## Testing

- **Demo smoke + axe:** one parameterized Vitest + RTL test that imports every
  `demos/*.tsx` export, renders it, and runs `axe` — no throw, no violations.
- **Generator tests:** unit-test `gen-demo-sources` and `gen-props` output shape against small
  fixtures (source key mapping; props JSON shape).
- **Link integrity:** a test asserting every MDX `component=` / `story=` / `storyId=` resolves
  to a real demo key and a real story id; and every Playground anchor referenced by
  `FullViewLinks` exists in a showcase page for the known component/block list.

## Error handling

- Missing demo source → `ComponentPreview` renders preview-only.
- Missing props entry → `PropsTable` renders "No documented props" + build warning.
- Generator scripts exit non-zero on failure so CI (`ci.yml`) catches broken generation before
  build.

## Rollout / sequencing

1. Generators + `src/generated` + prebuild wiring.
2. Upgraded `ComponentPreview` + new `PropsTable`, `VariantGallery`, `FullViewLinks`.
3. Migrate pages to the new template (bulk).
4. Nextra restyle + foundations visuals.
5. Playground anchors + wiring.
6. Tests.

Each step ships behind the existing PR/CI/changeset workflow (docs app is `private`, so no
changeset needed for the app itself; component/token changes, if any, do).

## Open decisions (resolved)

- **States gallery** is in scope for v1; authored per component during migration.
- Props source = `react-docgen-typescript` (auto), accepting that exotic types may render
  loosely.
