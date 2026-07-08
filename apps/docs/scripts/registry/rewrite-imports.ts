type Rewrite = { code: string; registryDeps: Set<string> };

const BARREL = /import\s+\{([^}]*)\}\s+from\s+["']@manpowerhub\/ui["'];?/g;
const TOKENS = /import\s+[^;]*from\s+["']@manpowerhub\/tokens["'];?/g;

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

  return { code, registryDeps };
}
