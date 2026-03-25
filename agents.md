# agents.md

Agent guidance for working in this React component library showcase.

## Before touching any file

1. Read `CLAUDE.md` for architecture overview, token names, and known CSS gotchas.
2. Read the target file(s) before editing — never write blind.
3. For CSS changes: read `src/index.css` around the relevant section; tokens are defined once in `:root` and mirrored in the dark mode blocks (`@media (prefers-color-scheme: dark)` AND `[data-theme="dark"]`). Changes to light-mode tokens must be replicated in both dark blocks.

---

## Adding a new component

**Files to touch (in order):**

1. `src/components/NewComponent.tsx` — create the component
2. `src/index.css` — add `.ui-newcomponent-*` CSS classes
3. `src/components/index.ts` — barrel export
4. `src/App.tsx` — add to `NAV_SECTIONS` array + add a `<Section>` block in the main content

**Component file template:**
```tsx
import React from 'react';

export interface NewComponentProps { /* ... */ }

export const NewComponent: React.FC<NewComponentProps> = (props) => {
  return <div className="ui-newcomponent">...</div>;
};

NewComponent.displayName = 'NewComponent';
```

Rules:
- Use `React.forwardRef` if the component wraps a DOM element that callers may need to ref.
- All visual styling via `ui-*` CSS classes. Only use inline `style` for values that are computed at runtime (dynamic colors, dimensions, etc.).
- Inline SVG icons only — no icon library.
- For components that need global state/portal (e.g. overlays, toasts): use Context + Provider pattern. Wrap in `App.tsx` similarly to `SnackbarProvider` > `NotificationProvider`.

---

## Adding a demo section to App.tsx

**Checklist:**
- Add the section name to `NAV_SECTIONS` (line ~87) — this drives the sidebar nav.
- Add the `<Section id="Name" title="Display Title">` block in the main content area, in the same order as `NAV_SECTIONS`.
- The `Section` helper component automatically applies `ui-reveal` scroll animation — no extra wiring needed.
- If the demo needs local state, add it alongside the other `useState` declarations in `App()` (lines ~338–363).
- If the demo needs a hook that requires a Provider, verify the Provider is already wrapping `App`'s return. Current providers: `SnackbarProvider` (outer) → `NotificationProvider` (inner).

---

## Modifying design tokens

The design system has **three locations** that must stay in sync for every color/shadow token:

| Location | Purpose |
|---|---|
| `:root { }` | Light mode defaults |
| `@media (prefers-color-scheme: dark) :root:not([data-theme="light"])` | Auto dark mode |
| `[data-theme="dark"] { }` | Manual dark mode override |

Adding a new token: add it to all three blocks. Changing an existing token value: change it in all three.

Radius, spacing, z-index, and transition tokens only live in `:root` — no dark mode override needed.

---

## Z-index reference

```
--ui-z-notification: 600   ← NotificationProvider stack (top)
--ui-z-dropdown:     500   ← Select / AutocompleteSelect dropdowns
--ui-z-modal:        400   ← Dialog backdrop + panel
--ui-z-overlay:      300   ← BottomSheet, general overlays
```

When adding a new floating element, pick a z-index relative to this stack. If a dropdown must escape a modal, it needs to be > `--ui-z-modal`. The dialog uses `overflow: visible` specifically to allow dropdowns to break out of its stacking context.

---

## CSS class naming convention

Pattern: `ui-[component]-[element]--[modifier]`

Examples: `.ui-btn`, `.ui-btn-primary`, `.ui-btn-sm`, `.ui-input-icon`, `.ui-stepper-body`, `.ui-tab-item--active`

Modifier suffix `--` is optional if the variant is simple (e.g. `.ui-btn-primary` not `.ui-btn--primary`). Follow the pattern already used for the component family you're editing.

---

## Dark mode checklist for new components

Every new component must work in dark mode without extra code — if it only uses `--ui-*` tokens it will adapt automatically. Things to verify:

- No hardcoded hex colors or `rgba()` in component CSS (use tokens).
- Background colors use `--ui-bg`, `--ui-surface`, or `--ui-elevated`.
- Text uses `--ui-text`, `--ui-text-dim`, or `--ui-text-placeholder`.
- Borders use `--ui-border` or semantic variants (`--ui-border-focus`, `--ui-border-error`, etc.).
- Shadows use `--ui-shadow-*` tokens (dark mode overrides them to be darker).

---

## Scroll reveal animation

The `Section` helper in `App.tsx` already wires `useScrollReveal()` — sections animate in automatically. To apply the same effect to individual cards or items inside a section:

```tsx
const ref = useScrollReveal();
<div ref={ref as React.RefObject<HTMLDivElement>} className="ui-reveal ui-reveal-d2">
  ...
</div>
```

Stagger delay classes: `ui-reveal-d1` (60ms) through `ui-reveal-d5` (300ms).

---

## Scope of each file

| File | Responsibility |
|---|---|
| `src/index.css` | All design tokens + all component CSS. Single source of truth for styling. |
| `src/components/*.tsx` | One component per file. Logic + JSX only, no styles. |
| `src/components/index.ts` | Re-exports everything. Always update when adding a component. |
| `src/App.tsx` | Showcase only. Contains demo state, demo helpers, and `Section`/`SubSection` layout helpers. Not part of the "library". |
| `src/main.tsx` | Entry point. Mounts `<App />` with `StrictMode`. |
