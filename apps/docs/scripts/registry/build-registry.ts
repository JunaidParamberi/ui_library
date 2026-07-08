import fs from "node:fs";
import path from "node:path";
import { buildSymbolMap } from "./symbol-map";
import { rewriteImports } from "./rewrite-imports";
import { scanNpmDeps } from "./scan-deps";

type ItemType = "registry:ui" | "registry:block" | "registry:lib";
type FileType = "registry:ui" | "registry:component" | "registry:block" | "registry:lib";
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
  fileType: FileType, symbolMap: Map<string, string>, stageDir: string, baseUrl: string,
): RegistryItem[] {
  const componentsDir = path.join(baseDir, "components");
  return fs.readdirSync(componentsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const name = d.name;
      const dir = path.join(componentsDir, name);
      const deps = new Set<string>();
      const registryDeps = new Set<string>();
      const files = fs.readdirSync(dir).filter(isShipped).map((file) => {
        const raw = fs.readFileSync(path.join(dir, file), "utf8");
        const { code, registryDeps: rd } = rewriteImports(raw, symbolMap, group === "blocks" ? "block" : "ui");
        scanNpmDeps(code).forEach((x) => deps.add(x));
        rd.forEach((x) => registryDeps.add(x));
        const relPath = `${group}/${name}/${file}`;
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
    homepage: DEFAULT_BASE_URL,
    items: [utilsItem, ...uiItems, ...blockItems],
    stageDir: opts.stageDir,
  };
}
