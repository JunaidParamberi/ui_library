import type { Config } from "tailwindcss";
import preset from "@manpowerhub/tokens/preset";

export default {
  presets: [preset],
  darkMode: "class",
  // Nextra ships its own base reset; Tailwind's preflight would clobber the
  // docs typography. We only need utilities + component classes for the demos.
  corePlugins: { preflight: false },
  content: [
    "./app/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
    "../../packages/blocks/src/**/*.{ts,tsx}",
  ],
} satisfies Config;
