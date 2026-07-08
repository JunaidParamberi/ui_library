import path from "node:path";
import { Project } from "ts-morph";

export interface SymbolEntry {
  /** Registry item/dir name — used for registryDependencies. */
  item: string;
  /** Basename (no extension) of the source file that actually exports the symbol — used for the import alias. */
  file: string;
}

/**
 * Reads packages/ui/src/index.ts (the barrel) and, for each
 * `export * from "./components/<name>"` / `export * from "./lib/utils"`,
 * resolves that module's exported symbol names into a
 * Map<symbolName, SymbolEntry>. Components → their dir name (item) plus the
 * actual source file that exports the symbol (file); lib/utils → "utils"/"utils".
 */
export function buildSymbolMap(uiSrcDir: string): Map<string, SymbolEntry> {
  const project = new Project({
    tsConfigFilePath: path.join(uiSrcDir, "..", "tsconfig.json"),
    skipAddingFilesFromTsConfig: true,
  });
  const barrel = project.addSourceFileAtPath(path.join(uiSrcDir, "index.ts"));
  const map = new Map<string, SymbolEntry>();

  for (const exp of barrel.getExportDeclarations()) {
    const spec = exp.getModuleSpecifierValue(); // e.g. "./components/card" | "./lib/utils"
    if (!spec) continue;
    const registryName = spec === "./lib/utils"
      ? "utils"
      : spec.replace("./components/", "");

    const modPath = path.join(uiSrcDir, spec + ".ts");
    const tsxPath = path.join(uiSrcDir, spec + ".tsx");
    const dirIndex = path.join(uiSrcDir, spec, "index.ts");
    const target = [modPath, tsxPath, dirIndex].find((p) => project.getFileSystem().fileExistsSync(p));
    if (!target) continue;

    const mod = project.addSourceFileAtPath(target);
    for (const [name, decls] of mod.getExportedDeclarations()) {
      if (registryName === "utils") {
        map.set(name, { item: "utils", file: "utils" });
        continue;
      }
      const sourceFile = decls[0]?.getSourceFile() ?? mod;
      const file = sourceFile.getBaseNameWithoutExtension();
      map.set(name, { item: registryName, file });
    }
  }
  return map;
}
