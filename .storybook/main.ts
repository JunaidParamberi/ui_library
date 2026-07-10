import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";

/**
 * Combined root Storybook — surfaces stories from BOTH workspace packages
 * (`@manpowerhub/ui` primitives and `@manpowerhub/blocks`) in one view.
 *
 * The per-package Storybooks (packages/ui, packages/blocks) still exist and
 * are what CI/Chromatic/Vercel deploy — this root config is a dev convenience.
 *
 * Tailwind: the per-package configs write their `content` globs relative to
 * their own dir (`./src`, `../ui/src`). Tailwind resolves those globs against
 * cwd — the repo root here — so they'd point nowhere and emit zero utilities.
 * We therefore use a dedicated root config (`./tailwind.config.ts`) whose
 * globs are written from the repo root and cover both packages, pinned
 * explicitly in the postcss pipeline below.
 */
const config: StorybookConfig = {
  stories: [
    "../packages/ui/src/**/*.stories.@(ts|tsx)",
    "../packages/blocks/src/**/*.stories.@(ts|tsx)",
  ],
  addons: ["@storybook/addon-a11y", "@storybook/addon-themes"],
  framework: { name: "@storybook/react-vite", options: {} },
  async viteFinal(config) {
    const { mergeConfig } = await import("vite");
    const tailwindcss = (await import("tailwindcss")).default;
    const autoprefixer = (await import("autoprefixer")).default;
    const postcssImport = (await import("postcss-import")).default;
    return mergeConfig(config, {
      resolve: {
        alias: {
          "@manpowerhub/ui": path.resolve(__dirname, "../packages/ui/src"),
          "@manpowerhub/tokens": path.resolve(__dirname, "../packages/tokens/src"),
        },
      },
      css: {
        postcss: {
          plugins: [
            postcssImport(),
            tailwindcss({
              config: path.resolve(__dirname, "./tailwind.config.ts"),
            }),
            autoprefixer(),
          ],
        },
      },
    });
  },
};
export default config;
