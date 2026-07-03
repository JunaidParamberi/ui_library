# @manpowerhub/ui

Themeable, customizable React component library (TypeScript · Tailwind · shadcn/ui).

## Install
```bash
npm install @manpowerhub/ui @manpowerhub/tokens
npm install -D tailwindcss tailwindcss-animate
```

## Setup
```ts
// tailwind.config.ts
import preset from "@manpowerhub/tokens/preset";
export default { presets: [preset], content: ["./src/**/*.{ts,tsx}", "./node_modules/@manpowerhub/ui/dist/**/*.js"] };
```
```ts
// app entry
import "@manpowerhub/tokens/globals.css";
```

## Use
```tsx
import { Button } from "@manpowerhub/ui";
<Button variant="outline">Hello</Button>
```

## Customize
1. **Tokens** — override CSS vars in your own globals: `:root { --primary: 240 80% 55%; }`
2. **Per instance** — `<Button className="rounded-full" />` (your classes win via tailwind-merge)
3. **Structural** — `<Button asChild><Link href="/x">Go</Link></Button>`

## Docs
Live Storybook: https://junaidparamberi.github.io/manpowerhub-ui
