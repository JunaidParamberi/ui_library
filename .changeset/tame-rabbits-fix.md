---
"@manpowerhub/blocks": patch
---

Fix DataTableToolbar filter selects missing an accessible name (axe `button-name` violation) by adding `aria-label={filter.placeholder}` to each filter's SelectTrigger.
