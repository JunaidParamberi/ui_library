import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { withCompilerOptions } from "react-docgen-typescript";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(here, "..", "..", "..");
const OUT = path.join(here, "..", "src", "generated", "props.generated.json");

const SOURCES = [
  path.join(ROOT, "packages", "ui", "src", "components"),
  path.join(ROOT, "packages", "blocks", "src", "components"),
];

export function normalizeProps(component) {
  return Object.values(component.props ?? {}).map((p) => ({
    name: p.name,
    type: p.type?.name ?? "unknown",
    defaultValue: p.defaultValue ? p.defaultValue.value : null,
    required: Boolean(p.required),
    description: p.description ?? "",
  }));
}

function collectTsx(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collectTsx(full));
    else if (
      entry.name.endsWith(".tsx") &&
      !entry.name.endsWith(".stories.tsx") &&
      !entry.name.endsWith(".test.tsx")
    ) {
      out.push(full);
    }
  }
  return out;
}

function main() {
  const parser = withCompilerOptions(
    { esModuleInterop: true, jsx: 4 /* react-jsx */ },
    {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) =>
        !(prop.parent && /node_modules/.test(prop.parent.fileName)),
    },
  );

  const files = SOURCES.flatMap((d) => (fs.existsSync(d) ? collectTsx(d) : []));
  const result = {};
  for (const comp of parser.parse(files)) {
    if (!comp.displayName) continue;
    result[comp.displayName] = normalizeProps(comp);
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(result, null, 2) + "\n");
  console.log(`gen-props: wrote ${Object.keys(result).length} components`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (err) {
    console.error("gen-props failed:", err);
    process.exit(1);
  }
}
