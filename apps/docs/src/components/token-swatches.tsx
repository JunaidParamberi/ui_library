/**
 * Visual foundations showcases for the docs' Color/Spacing/Typography pages.
 *
 * These read live from @manpowerhub/tokens CSS vars (imported globally via
 * apps/docs/app/globals.css -> `@import "@manpowerhub/tokens/globals.css"`),
 * so they stay in sync with the tokens package and reflect light/dark theme
 * automatically. No hooks/state, so no "use client" is needed.
 *
 * Note: token color vars are stored as bare "H S% L%" triples (see
 * packages/tokens/src/globals.css), so consumers must wrap them in hsl(...)
 * — e.g. `hsl(var(--primary))` — rather than using the var directly as a color.
 */

const COLORS = [
  "primary",
  "secondary",
  "accent",
  "muted",
  "destructive",
  "border",
  "background",
  "foreground",
  "mph-success",
  "mph-warning",
  "mph-danger",
  "mph-info",
] as const;

export function ColorSwatches() {
  return (
    <div className="not-prose my-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {COLORS.map((c) => (
        <div key={c} className="rounded-md border border-border p-3 text-xs">
          <div
            className="mb-2 h-10 rounded border border-border"
            style={{ background: `hsl(var(--${c}))` }}
          />
          <code>--{c}</code>
        </div>
      ))}
    </div>
  );
}

export function SpacingScale() {
  const steps = [1, 2, 3, 4, 6, 8, 12, 16];
  return (
    <div className="not-prose my-6 space-y-2">
      {steps.map((s) => (
        <div key={s} className="flex items-center gap-3 text-xs">
          <span className="w-10 font-mono">{s}</span>
          <div className="h-3 bg-primary" style={{ width: `${s * 0.25}rem` }} />
        </div>
      ))}
    </div>
  );
}

export function TypeRamp() {
  const sizes = ["text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-2xl", "text-3xl"];
  return (
    <div className="not-prose my-6 space-y-1 font-body">
      {sizes.map((s) => (
        <p key={s} className={s}>
          {s} — The quick brown fox
        </p>
      ))}
    </div>
  );
}
