import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-themes"],
  framework: { name: "@storybook/react-vite", options: {} },
  async viteFinal(config) {
    const { mergeConfig } = await import("vite");
    return mergeConfig(config, {
      resolve: {
        alias: {
          "@manpowerhub/ui": path.resolve(__dirname, "../../ui/src"),
          "@manpowerhub/tokens": path.resolve(__dirname, "../../tokens/src"),
        },
      },
    });
  },
};
export default config;
