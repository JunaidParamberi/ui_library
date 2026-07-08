import fs from "node:fs";
import path from "node:path";
import { buildSymbolMap, type SymbolEntry } from "./symbol-map";
import { rewriteImports } from "./rewrite-imports";
import { scanNpmDeps } from "./scan-deps";

type ItemType = "registry:ui" | "registry:block" | "registry:lib";
type FileType = "registry:ui" | "registry:block" | "registry:lib";
export interface RegistryItem {
  name: string;
  type: ItemType;
  dependencies?: string[];
  registryDependencies?: string[];
  files: { path: string; type: FileType; target?: string }[];
}
export interface Registry {
  $schema: string;
  name: string;
  homepage: string;
  items: RegistryItem[];
  stageDir: string; // convenience for tests/build; stripped before writing registry.json
}

interface Opts {
  uiSrc: string; blocksSrc: string; utilsSrc: string;
  tokensSrc: string; outDir: string; stageDir: string;
  baseUrl?: string;
}

const DEFAULT_BASE_URL = "https://ui.manpowerhub.com";

const isShipped = (f: string) =>
  f.endsWith(".tsx") && !f.endsWith(".stories.tsx") && !f.endsWith(".test.tsx");

function stage(stageDir: string, relPath: string, code: string) {
  const dest = path.join(stageDir, relPath);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, code);
}

function buildComponentItems(
  baseDir: string, group: "ui" | "blocks", itemType: ItemType,
  fileType: FileType, symbolMap: Map<string, SymbolEntry>, stageDir: string, baseUrl: string,
): RegistryItem[] {
  const componentsDir = path.join(baseDir, "components");
  // Staged paths are flattened to `${group}/${file}` (no per-component subdir) so shadcn's
  // `add`, which strips the leading type segment (`ui/`), lands files flat at
  // `components/ui/<file>` — matching the `@/components/ui/<name>` import alias. Since the
  // per-component subdir namespace is gone, guard against two components staging the same
  // filename and silently clobbering each other.
  const seenPaths = new Map<string, string>(); // relPath -> owning component name

  return fs.readdirSync(componentsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()
    .map((name) => {
      const dir = path.join(componentsDir, name);
      const deps = new Set<string>();
      const registryDeps = new Set<string>();
      const files = fs.readdirSync(dir).sort().filter(isShipped).map((file) => {
        const raw = fs.readFileSync(path.join(dir, file), "utf8");
        const { code, registryDeps: rd } = rewriteImports(raw, symbolMap);
        scanNpmDeps(code).forEach((x) => deps.add(x));
        rd.forEach((x) => registryDeps.add(x));
        const relPath = `${group}/${file}`;
        const prevOwner = seenPaths.get(relPath);
        if (prevOwner && prevOwner !== name) {
          throw new Error(
            `Registry file path collision: "${relPath}" is staged by both "${prevOwner}" and "${name}". ` +
              `Flattened staging drops the per-component subdir, so filenames must be unique within the "${group}" group.`,
          );
        }
        seenPaths.set(relPath, name);
        stage(stageDir, relPath, code);
        return { path: relPath, type: fileType };
      });
      const item: RegistryItem = { name, type: itemType, files };
      if (deps.size) item.dependencies = [...deps].sort();
      if (registryDeps.size) {
        item.registryDependencies = [...registryDeps].sort().map((n) => `${baseUrl}/r/${n}.json`);
      }
      return item;
    });
}

export function buildRegistry(opts: Opts): Registry {
  const symbolMap = buildSymbolMap(opts.uiSrc);
  const baseUrl = opts.baseUrl ?? DEFAULT_BASE_URL;

  const uiItems = buildComponentItems(opts.uiSrc, "ui", "registry:ui", "registry:ui", symbolMap, opts.stageDir, baseUrl);
  const blockItems = buildComponentItems(opts.blocksSrc, "blocks", "registry:block", "registry:block", symbolMap, opts.stageDir, baseUrl);

  // utils lib item — shipped verbatim.
  const utilsCode = fs.readFileSync(opts.utilsSrc, "utf8");
  stage(opts.stageDir, "lib/utils.ts", utilsCode);
  const utilsItem: RegistryItem = {
    name: "utils",
    type: "registry:lib",
    dependencies: ["clsx", "tailwind-merge"],
    files: [{ path: "lib/utils.ts", type: "registry:lib", target: "lib/utils.ts" }],
  };

  return {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "manpowerhub",
    homepage: baseUrl,
    items: [utilsItem, ...uiItems, ...blockItems],
    stageDir: opts.stageDir,
  };
}
