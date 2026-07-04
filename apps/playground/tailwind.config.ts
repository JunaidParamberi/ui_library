import type { Config } from "tailwindcss";
import preset from "@manpowerhub/tokens/preset";

export default {
  presets: [preset],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
    "../../packages/blocks/src/**/*.{ts,tsx}",
  ],
} satisfies Config;
