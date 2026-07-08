# Registry smoke test

End-to-end proof that a consumer can install a `@manpowerhub/ui` block via the
`shadcn` CLI, pointed at our generated registry JSON.

Use a scratch path **outside** this monorepo for the consumer app (anywhere
under your OS temp dir works, e.g. `/tmp/reg-smoke` or a scratchpad dir) —
never scaffold it inside the workspace, it will pollute pnpm's workspace
resolution.

1. Generate the registry and serve it locally:

   Each item's `registryDependencies` are emitted as full URLs into OUR
   registry (e.g. `https://ui.manpowerhub.com/r/card.json`) rather than bare
   names, because the `shadcn` CLI resolves bare names against the *default*
   shadcn/ui registry (ui.shadcn.com) — not ours — which would silently swap
   in shadcn's `card` (missing `CardBody`) instead of our own. When smoke
   testing locally, override the base URL so those deps point at the local
   server instead of production:

   ```bash
   REGISTRY_BASE_URL=http://localhost:5055 pnpm --filter @manpowerhub/docs gen:registry
   npx serve apps/docs/public -l 5055   # serves /r/*.json at http://localhost:5055/r/
   ```

   Verify it's up:

   ```bash
   curl -s http://localhost:5055/r/pricing-table.json | head -c 200
   ```

2. Scaffold a scratch consumer (adjust `<SCRATCH_DIR>` to your temp path):

   ```bash
   npx --yes create-next-app@latest <SCRATCH_DIR> \
     --ts --tailwind --app --eslint --no-src-dir --use-pnpm \
     --import-alias "@/*" --yes
   cd <SCRATCH_DIR>
   npx shadcn@latest init -d
   ```

3. Add a block from the locally served registry:

   ```bash
   npx shadcn@latest add http://localhost:5055/r/pricing-table.json
   ```

   Expect: `pricing-table.tsx` + `card.tsx` + `button.tsx` + `badge.tsx` +
   `lib/utils.ts` written under the consumer's `components/ui` (or configured
   aliases), and `radix-ui`/`class-variance-authority`/`lucide-react`
   dependencies installed (per `pricing-table`'s `registryDependencies`:
   card, button, badge, utils).

4. Typecheck the consumer app:

   ```bash
   pnpm exec tsc --noEmit
   ```

   Expect: no *import* or *module-resolution* errors on the files added in
   step 3. Errors about missing token/theme CSS classes (e.g. Tailwind
   classes that reference `@manpowerhub/tokens` CSS vars) are **expected and
   acceptable** here — the consumer hasn't installed the tokens package/CSS
   in this smoke test, only the component code. Only treat the run as a
   failure if `tsc` reports it cannot resolve a module/import for one of the
   newly added files.

5. Clean up:

   ```bash
   # stop the `serve` process (Ctrl-C or `kill <pid>`)
   rm -rf <SCRATCH_DIR>
   ```

## Last executed run

See `.superpowers/sdd/task-7-report.md` in this repo for the captured output
(or blocker) of the most recent execution of this procedure.
