import type { Config } from "tailwindcss";
import preset from "@manpowerhub/tokens/preset";

/**
 * Tailwind config for the combined ROOT Storybook only.
 *
 * Tailwind resolves `content` globs relative to cwd (the repo root when the
 * root Storybook runs), so — unlike the per-package configs — these paths are
 * written from the repo root and cover both packages' source.
 */
export default {
  presets: [preset],
  content: [
    "./packages/ui/src/**/*.{ts,tsx}",
    "./packages/blocks/src/**/*.{ts,tsx}",
  ],
} satisfies Config;
