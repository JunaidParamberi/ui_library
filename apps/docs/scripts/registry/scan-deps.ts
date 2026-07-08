const IMPORT = /from\s+["']([^"']+)["']/g;
const EXCLUDE = new Set(["react", "react-dom"]);

/** Reduce a specifier to its package root: "@scope/pkg/x" -> "@scope/pkg", "pkg/x" -> "pkg". */
function packageRoot(spec: string): string {
  const parts = spec.split("/");
  return spec.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

export function scanNpmDeps(source: string): string[] {
  const deps = new Set<string>();
  for (const m of source.matchAll(IMPORT)) {
    const spec = m[1];
    if (spec.startsWith("@/") || spec.startsWith(".") || spec.startsWith("@manpowerhub/")) continue;
    const root = packageRoot(spec);
    if (EXCLUDE.has(root)) continue;
    deps.add(root);
  }
  return [...deps];
}
