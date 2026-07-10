/**
 * Typed token reference. The runtime source of truth is `globals.css`
 * (CSS variables). These objects are for docs, tooling, and JS consumers
 * (e.g. chart libraries) that need values outside CSS.
 *
 * Values are HSL channel strings — wrap as `hsl(<value>)` to use.
 */
export const layout = {
  sidebarWidth: 260,
  railWidth: 60,
  paneWidth: 244,
  topbarHeight: 60,
} as const;

export const radius = {
  xs: 3,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  "2xl": 16,
  full: 9999,
} as const;

export const motion = {
  fast: "130ms",
  base: "220ms",
  slow: "360ms",
  easeOut: "cubic-bezier(0.16,1,0.3,1)",
  easeInOut: "cubic-bezier(0.65,0,0.35,1)",
} as const;

/** Chart series colors, in order. Read from CSS vars at runtime when possible. */
export const chartVars = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

export type ThemeName = "light" | "dark";
