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
