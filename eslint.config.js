import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    ignores: ["**/dist/**", "**/storybook-static/**", "node_modules/**"],
  },
];
