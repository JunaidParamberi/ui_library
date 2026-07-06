import nextra from "nextra";
import path from "node:path";
import { fileURLToPath } from "node:url";

const monorepoRoot = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

const withNextra = nextra({
  latex: false,
  search: { codeblocks: false },
});

/** @type {import("next").NextConfig} */
const nextConfig = {
  ...(process.env.NODE_ENV === "production" ? { output: "export" } : {}),
  images: { unoptimized: true },
  transpilePackages: ["@manpowerhub/ui", "@manpowerhub/blocks"],
  outputFileTracingRoot: monorepoRoot,
  eslint: { ignoreDuringBuilds: true },
};

export default withNextra(nextConfig);
