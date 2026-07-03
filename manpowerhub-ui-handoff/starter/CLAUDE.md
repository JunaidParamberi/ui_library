# ManpowerHub UI — binding rules

- Build on @manpowerhub/ui + @manpowerhub/tokens. Don't hand-roll components that exist.
- Styling comes from tokens (Tailwind semantic classes: bg-background, text-foreground,
  border-border, bg-primary, text-muted-foreground, ...). Never hardcode hex colors.
- shadcn/ui primitives live in packages/ui/src/ui; our styled components wrap them.
- Every component: TS props exported, forwardRef, cva variants, className merged via cn().
- Every async surface: loading (skeleton/spinner), empty, and error states.
- Works in light AND dark (.dark on <html>). Test both.
- Keyboard + screen-reader accessible; visible focus rings. axe must pass.
- New/changed components need a *.stories.tsx covering all variants + states.
- Full spec: docs/ui-handoff/. Reference prototype: docs/ui-handoff/reference/.
