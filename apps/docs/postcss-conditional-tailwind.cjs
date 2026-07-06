const path = require("node:path");
const tailwindcss = require("tailwindcss");

const tailwind = tailwindcss(path.join(__dirname, "tailwind.config.ts"));

/** Skip Tailwind on Nextra's prebuilt Tailwind v4 CSS (node_modules). */
module.exports = () => ({
  postcssPlugin: "postcss-conditional-tailwind",
  Once(root, helpers) {
    const from = helpers.result.opts.from ?? "";
    if (from.includes("node_modules")) return;
    return tailwind.Once?.(root, helpers);
  },
});

module.exports.postcss = true;
