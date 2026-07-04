import type { Config } from "tailwindcss";
import preset from "@manpowerhub/tokens/preset";

export default {
  presets: [preset],
  content: [
    "./src/**/*.{ts,tsx}",
    "../ui/src/**/*.{ts,tsx}",
    "../../apps/**/*.{ts,tsx}",
  ],
} satisfies Config;
