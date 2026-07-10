import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

/** Tailwind preset consuming the ManpowerHub CSS variables. */
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
        // ManpowerHub extras — use with opacity, e.g. bg-success/10
        success: "hsl(var(--mph-success))",
        warning: "hsl(var(--mph-warning))",
        info: "hsl(var(--mph-info))",
        sunken: "hsl(var(--mph-bg-sunken))",
        "fg-2": "hsl(var(--mph-fg-2))",
        "fg-3": "hsl(var(--mph-fg-3))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        xs: "3px",
        sm: "4px",
        DEFAULT: "6px",
        md: "6px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
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
        tight: "-0.021em",
        snug: "-0.012em",
        normal: "-0.003em",
        wide: "0.04em",
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        pop: "var(--shadow-pop)",
      },
      spacing: { "7.5": "30px", "13": "52px", "15": "60px" },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16,1,0.3,1)",
        "in-out": "cubic-bezier(0.65,0,0.35,1)",
      },
      transitionDuration: { fast: "130ms", DEFAULT: "220ms", slow: "360ms" },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: { "fade-up": "fade-up 0.36s cubic-bezier(0.16,1,0.3,1) both" },
    },
  },
  plugins: [animate],
};

export default preset;
