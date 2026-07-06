import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "postcss-import": {
      resolve(id) {
        if (id === "@manpowerhub/tokens/globals.css") {
          return path.join(rootDir, "../../packages/tokens/src/globals.css");
        }
        return id;
      },
    },
    "./postcss-conditional-tailwind.cjs": {},
    autoprefixer: {},
  },
};

export default config;
