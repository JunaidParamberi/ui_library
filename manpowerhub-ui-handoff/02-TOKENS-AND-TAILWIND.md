# 02 — Tokens → shadcn + Tailwind

The tokens are the **theming layer**. This doc translates
`reference/styles/tokens.css` (the exact source values) into the shadcn/Tailwind
world: HSL CSS variables + a Tailwind preset. A new app reskins by editing these
variables only (see `08`).

> **Source of truth:** `reference/styles/tokens.css`. The HSL triplets below are
> converted from those hex values. If a value ever disagrees, the hex file wins —
> regenerate with the script at the bottom.

## Two layers of variables

We keep **both** naming systems so nothing is lost:

1. **shadcn semantic names** (`--background`, `--foreground`, `--primary`, …) —
   what Tailwind utility classes (`bg-background`, `text-primary`) resolve to.
2. **ManpowerHub raw names** (`--accent`, `--fg`, `--fg-2`, `--bg-subtle`, …) —
   the reference vocabulary, kept as extra vars for 1:1 fidelity and charts.

shadcn expects HSL **channels** (no `hsl()` wrapper) so utilities can add opacity:
`--primary: 156 37% 33%;` → used as `hsl(var(--primary))`.

## `packages/tokens/src/globals.css`

```css
@import url("https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap");

@layer base {
  :root {
    /* ── shadcn semantic (light) ── */
    --background: 60 20% 98%;        /* #fbfbf9 bg-canvas */
    --foreground: 43 12% 12%;        /* #22201b fg */
    --card: 0 0% 100%;               /* #ffffff bg-surface */
    --card-foreground: 43 12% 12%;
    --popover: 0 0% 100%;
    --popover-foreground: 43 12% 12%;
    --primary: 156 37% 33%;          /* #35735a accent (evergreen) */
    --primary-foreground: 0 0% 100%; /* fg-on-accent */
    --secondary: 48 20% 95%;         /* #f5f4f0 bg-subtle */
    --secondary-foreground: 43 12% 12%;
    --muted: 48 20% 95%;             /* #f5f4f0 */
    --muted-foreground: 42 7% 39%;   /* #6a665d fg-2 */
    --accent: 48 20% 95%;            /* hover surfaces (shadcn "accent" = subtle bg) */
    --accent-foreground: 43 12% 12%;
    --destructive: 5 49% 50%;        /* #bf4d42 danger */
    --destructive-foreground: 0 0% 100%;
    --border: 47 24% 90%;            /* #ebe9e2 */
    --input: 47 24% 90%;
    --ring: 156 36% 33%;             /* focus ring = accent */
    --radius: 0.5625rem;             /* 9px = --radius-md */

    /* charts (shadcn --chart-N) */
    --chart-1: 156 37% 33%;          /* #35735a */
    --chart-2: 148 22% 57%;          /* #7aa88f */
    --chart-3: 148 28% 43%;          /* #4e8c67 */
    --chart-4: 37 59% 46%;           /* #bd8830 */
    --chart-5: 213 37% 47%;          /* #4c74a6 */

    /* ── ManpowerHub raw vocabulary (kept for fidelity) ── */
    --mph-bg-canvas: 60 20% 98%;
    --mph-bg-surface: 0 0% 100%;
    --mph-bg-subtle: 48 20% 95%;
    --mph-bg-sunken: 45 21% 92%;     /* #eeece6 */
    --mph-border-strong: 46 24% 84%; /* #dcd9cf */
    --mph-fg: 43 12% 12%;
    --mph-fg-2: 42 7% 39%;
    --mph-fg-3: 44 8% 60%;           /* #a19d92 */
    --mph-accent: 156 37% 33%;
    --mph-accent-hover: 157 37% 27%; /* #2c6049 */
    --mph-accent-press: 157 36% 21%; /* #234c3c */
    --mph-success: 148 28% 43%;      /* #4e8c67 */
    --mph-warning: 37 59% 46%;       /* #bd8830 */
    --mph-danger: 5 49% 50%;         /* #bf4d42 */
    --mph-info: 213 37% 47%;         /* #4c74a6 */

    /* soft/alpha tints — kept as rgba (opacity baked) */
    --mph-accent-soft: rgba(53, 115, 90, 0.09);
    --mph-accent-soft-2: rgba(53, 115, 90, 0.16);
    --mph-success-soft: rgba(78, 140, 103, 0.11);
    --mph-warning-soft: rgba(189, 136, 48, 0.12);
    --mph-danger-soft: rgba(191, 77, 66, 0.10);
    --mph-info-soft: rgba(76, 116, 166, 0.10);

    /* elevation (warm-tinted) */
    --shadow-xs: 0 1px 0 rgba(40,36,28,.03);
    --shadow-sm: 0 1px 2px rgba(40,36,28,.05), 0 1px 0 rgba(40,36,28,.02);
    --shadow-md: 0 6px 16px -4px rgba(40,36,28,.09), 0 2px 6px -3px rgba(40,36,28,.06);
    --shadow-lg: 0 18px 40px -12px rgba(40,36,28,.14), 0 6px 12px -6px rgba(40,36,28,.08);
    --shadow-pop: 0 28px 60px -16px rgba(40,36,28,.22), 0 10px 20px -10px rgba(40,36,28,.12);
  }

  .dark {
    --background: 0 0% 5%;           /* #0e0e0e */
    --foreground: 60 3% 93%;         /* #ededec */
    --card: 0 0% 9%;                 /* #161616 */
    --card-foreground: 60 3% 93%;
    --popover: 0 0% 9%;
    --popover-foreground: 60 3% 93%;
    --primary: 148 29% 49%;          /* #58a07c */
    --primary-foreground: 0 0% 100%;
    --secondary: 0 0% 11%;           /* #1d1d1d */
    --secondary-foreground: 60 3% 93%;
    --muted: 0 0% 11%;
    --muted-foreground: 45 2% 60%;   /* #9b9a97 */
    --accent: 0 0% 11%;
    --accent-foreground: 60 3% 93%;
    --destructive: 6 55% 60%;        /* #d46a5f */
    --destructive-foreground: 0 0% 100%;
    --border: 0 0% 15%;              /* #262626 */
    --input: 0 0% 15%;
    --ring: 148 29% 49%;
    --chart-1: 148 29% 49%; --chart-2: 148 30% 65%;
    --chart-3: 148 32% 55%; --chart-4: 38 57% 57%; --chart-5: 213 45% 62%;

    --mph-bg-sunken: 0 0% 3%;        /* #080808 */
    --mph-border-strong: 0 0% 20%;   /* #343434 */
    --mph-fg-3: 43 6% 37%;           /* #625f5b */
    --mph-accent-hover: 148 30% 56%; /* #6cb18d */
    --shadow-xs: 0 1px 0 rgba(0,0,0,.4);
    --shadow-sm: 0 1px 2px rgba(0,0,0,.45);
    --shadow-md: 0 6px 16px -4px rgba(0,0,0,.5), 0 2px 6px -3px rgba(0,0,0,.35);
    --shadow-lg: 0 18px 40px -12px rgba(0,0,0,.6), 0 6px 12px -6px rgba(0,0,0,.4);
    --shadow-pop: 0 28px 60px -16px rgba(0,0,0,.7), 0 10px 20px -10px rgba(0,0,0,.5);
  }

  * { border-color: hsl(var(--border)); }
  body {
    background: hsl(var(--background));
    color: hsl(var(--foreground));
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
    letter-spacing: -0.003em;
  }
}
```

## `packages/tokens/src/preset.ts` (Tailwind preset)

```ts
import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const preset: Partial<Config> = {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // ManpowerHub extras (opacity-capable)
        success: "hsl(var(--mph-success))",
        warning: "hsl(var(--mph-warning))",
        info: "hsl(var(--mph-info))",
        sunken: "hsl(var(--mph-bg-sunken))",
        "fg-2": "hsl(var(--mph-fg-2))",
        "fg-3": "hsl(var(--mph-fg-3))",
        chart: {
          1: "hsl(var(--chart-1))", 2: "hsl(var(--chart-2))", 3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))", 5: "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        xs: "5px", sm: "7px", DEFAULT: "9px", md: "9px",
        lg: "13px", xl: "18px", "2xl": "24px",
      },
      fontFamily: {
        display: ["Geist", "Inter Tight", "system-ui", "sans-serif"],
        body: ["Geist", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "ui-monospace", "Menlo", "monospace"],
      },
      fontSize: {
        xs: ["11px", { lineHeight: "1.4" }],
        sm: ["12.5px", { lineHeight: "1.45" }],
        base: ["14px", { lineHeight: "1.55" }],
        md: ["15px", { lineHeight: "1.55" }],
        lg: ["17px", { lineHeight: "1.4" }],
        xl: ["20px", { lineHeight: "1.3" }],
        "2xl": ["24px", { lineHeight: "1.2" }],
        "3xl": ["30px", { lineHeight: "1.15" }],
        "4xl": ["38px", { lineHeight: "1.12" }],
        "5xl": ["52px", { lineHeight: "1.08" }],
      },
      letterSpacing: {
        tight: "-0.021em", snug: "-0.012em", normal: "-0.003em", wide: "0.04em",
      },
      boxShadow: {
        xs: "var(--shadow-xs)", sm: "var(--shadow-sm)", md: "var(--shadow-md)",
        lg: "var(--shadow-lg)", pop: "var(--shadow-pop)",
      },
      spacing: {
        // 4px base — Tailwind's default scale already matches (1=4px). Extras:
        "7.5": "30px", "13": "52px", "15": "60px",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16,1,0.3,1)",
        "in-out": "cubic-bezier(0.65,0,0.35,1)",
      },
      transitionDuration: { fast: "130ms", DEFAULT: "220ms", slow: "360ms" },
    },
  },
  plugins: [animate],
};

export default preset;
```

## `packages/ui/tailwind.config.ts`

```ts
import type { Config } from "tailwindcss";
import preset from "@manpowerhub/tokens/preset";

export default {
  presets: [preset],
  content: ["./src/**/*.{ts,tsx}", "../../apps/**/*.{ts,tsx}"],
} satisfies Config;
```

## Key layout dims (from tokens.css)

| Token | Value | Use |
|---|---|---|
| `--sidebar-w` | 260px | Flat sidebar width |
| `--rail-w` | 60px | Collapsed rail |
| `--pane-w` | 244px | Contextual pane |
| `--topbar-h` | 60px | Top bar height |

## Type & spacing quick reference

- **Fonts:** Geist (display + body), JetBrains Mono (numbers, IDs, kbd). Numbers use `font-variant-numeric: tabular-nums`.
- **Weights:** 400 / 500 / 600 / 700. Headings 600, body 400, labels 500.
- **Spacing:** 4px base (Tailwind `1`=4px … `24`=96px). All reference `--space-N` map directly.
- **Radius:** xs 5 / sm 7 / md(DEFAULT) 9 / lg 13 / xl 18 / 2xl 24 / full 9999.
- **Motion:** fast 130ms, base 220ms, slow 360ms; ease-out `cubic-bezier(.16,1,.3,1)`.

## Regenerating HSL from the hex source (optional script)

If you'd rather not trust the hand-converted triplets, generate them:

```js
// scripts/tokens-to-hsl.mjs — reads reference/styles/tokens.css, prints HSL channels
import fs from "node:fs";
const css = fs.readFileSync("docs/ui-handoff/reference/styles/tokens.css", "utf8");
const hexToHsl = (hex) => {
  let [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0, s = 0, l = (max + min) / 2;
  if (d) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60;
  }
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};
for (const m of css.matchAll(/(--[\w-]+):\s*(#[0-9a-fA-F]{6})/g)) {
  console.log(`${m[1]}: ${hexToHsl(m[2])};  /* ${m[2]} */`);
}
```
