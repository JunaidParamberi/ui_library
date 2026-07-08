import path from "node:path";
import { Project } from "ts-morph";

/**
 * Reads packages/ui/src/index.ts (the barrel) and, for each
 * `export * from "./components/<name>"` / `export * from "./lib/utils"`,
 * resolves that module's exported symbol names into a
 * Map<symbolName, registryName>. Components → their dir name; lib/utils → "utils".
 */
export function buildSymbolMap(uiSrcDir: string): Map<string, string> {
  const project = new Project({
    tsConfigFilePath: path.join(uiSrcDir, "..", "tsconfig.json"),
    skipAddingFilesFromTsConfig: true,
  });
  const barrel = project.addSourceFileAtPath(path.join(uiSrcDir, "index.ts"));
  const map = new Map<string, string>();

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
    for (const [name] of mod.getExportedDeclarations()) {
      map.set(name, registryName);
    }
  }
  return map;
}
