type Rewrite = { code: string; registryDeps: Set<string> };

const BARREL = /import\s+\{([^}]*)\}\s+from\s+["']@manpowerhub\/ui["'];?/g;
const TOKENS = /import\s+[^;]*from\s+["']@manpowerhub\/tokens["'];?/g;
// Relative import of the shared cn/utils helper, e.g. "../../lib/utils", "../lib/utils", "./lib/utils".
const RELATIVE_UTILS = /import\s+\{([^}]*)\}\s+from\s+["'](?:\.\.\/)+lib\/utils["'];?/g;
// Relative import of a sibling component one level up, e.g. "../button", "../card" (never "../lib").
const RELATIVE_SIBLING = /import\s+\{([^}]*)\}\s+from\s+["']\.\.\/([a-z][a-z0-9-]*)["'];?/g;

/** Split one `{ A, type B }` clause into named entries preserving `type` modifier. */
function parseSpecifiers(clause: string): { text: string; name: string }[] {
  return clause.split(",").map((raw) => raw.trim()).filter(Boolean).map((text) => {
    const name = text.replace(/^type\s+/, "").trim();
    return { text, name };
  });
}

export function rewriteImports(
  source: string,
  symbolMap: Map<string, string>,
  _kind: "ui" | "block",
): Rewrite {
  const registryDeps = new Set<string>();

  let code = source.replace(BARREL, (_full, clause: string) => {
    const byModule = new Map<string, string[]>(); // aliasPath -> specifier texts
    for (const spec of parseSpecifiers(clause)) {
      const reg = symbolMap.get(spec.name);
      if (!reg) throw new Error(`Unknown @manpowerhub/ui export: ${spec.name}`);
      registryDeps.add(reg);
      const aliasPath = reg === "utils" ? "@/lib/utils" : `@/components/ui/${reg}`;
      const list = byModule.get(aliasPath) ?? [];
      list.push(spec.text);
      byModule.set(aliasPath, list);
    }
    return [...byModule.entries()]
      .map(([aliasPath, specs]) => `import { ${specs.join(", ")} } from "${aliasPath}";`)
      .join("\n");
  });

  code = code.replace(TOKENS, "// tokens: install @/styles/globals.css + tailwind preset");

  // Relative imports of the shared utils helper (must run before sibling-component rewrite).
  code = code.replace(RELATIVE_UTILS, (_full, clause: string) => {
    registryDeps.add("utils");
    return `import { ${clause.trim()} } from "@/lib/utils";`;
  });

  // Relative imports of a sibling component, e.g. "../button" -> "@/components/ui/button".
  code = code.replace(RELATIVE_SIBLING, (full, clause: string, segment: string) => {
    if (segment === "lib") return full;
    registryDeps.add(segment);
    return `import { ${clause.trim()} } from "@/components/ui/${segment}";`;
  });

  return { code, registryDeps };
}
