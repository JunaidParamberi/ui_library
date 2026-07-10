import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";
// blocks/src/styles.css is the superset stylesheet — its Tailwind config
// (pinned in main.ts) scans both ui and blocks source, so this single import
// carries every utility both packages' stories need.
import "../packages/blocks/src/styles.css";

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: { light: "", dark: "dark" },
      defaultTheme: "light",
    }),
  ],
};
export default preview;
