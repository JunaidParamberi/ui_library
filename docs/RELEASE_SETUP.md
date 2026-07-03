# One-time release setup

1. Push repo to https://github.com/junaidparamberi/manpowerhub-ui (public).
2. Settings → Pages → Source: "GitHub Actions".
3. Create npm automation token (npmjs.com → Access Tokens → Automation).
4. Repo → Settings → Secrets and variables → Actions → add secret NPM_TOKEN.
5. Ensure the `manpowerhub` org exists on npm (npmjs.com → Add Organization → free) so `@manpowerhub/*` can publish.
6. Push to `main` → Changesets opens a "Version Packages" PR; merging it publishes to npm and deploys Storybook to Pages.
