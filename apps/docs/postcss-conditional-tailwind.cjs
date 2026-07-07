const path = require("node:path");
const tailwindcss = require("tailwindcss");

const tailwind = tailwindcss(path.join(__dirname, "tailwind.config.ts"));

/** Skip Tailwind on Nextra's prebuilt Tailwind v4 CSS (node_modules). */
module.exports = () => ({
  postcssPlugin: "postcss-conditional-tailwind",
  async Once(root, helpers) {
    const from = helpers.result.opts.from ?? "";
    if (from.includes("node_modules")) return;
    // Tailwind v3's PostCSS plugin exposes no `Once` hook — it ships a
    // `plugins` array of legacy `(root, result)` plugins. Run them directly;
    // calling `tailwind.Once` was a silent no-op, so no utilities were emitted.
    for (const plugin of tailwind.plugins) {
      await plugin(root, helpers.result);
    }
  },
});

module.exports.postcss = true;
