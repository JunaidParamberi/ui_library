import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  {
    // Node build-time scripts (docs codegen) run outside the browser.
    files: ["apps/docs/scripts/**/*.mjs"],
    languageOptions: {
      globals: { console: "readonly", process: "readonly" },
    },
  },
  {
    ignores: [
      "**/dist/**",
      "**/.next/**",
      "**/out/**",
      "**/storybook-static/**",
      "node_modules/**",
      "apps/docs/next-env.d.ts",
      "apps/docs/next.config.mjs",
      "apps/docs/postcss-conditional-tailwind.cjs",
    ],
  }
);
