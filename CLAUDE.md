# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # start dev server at localhost:5173
pnpm build      # tsc -b && vite build
pnpm lint       # eslint . (TypeScript + React Hooks + React Refresh rules)
pnpm preview    # preview the production build
```

No test runner is configured.

## Architecture

This is a **component library showcase** — a single-page React 19 app that both defines and demos all UI components. There is no separate package/library output; everything lives in `src/`.

### Design system (`src/index.css`)

All styling is done via **CSS custom properties** with the `--ui-*` prefix. No Tailwind utility classes are used on components — Tailwind v4 is imported for resets and the `@theme` block only (fonts). Key token groups:

- **Colors**: `--ui-bg`, `--ui-surface`, `--ui-elevated`, `--ui-accent`, `--ui-green`, `--ui-danger`, `--ui-warning`, `--ui-success`, `--ui-info`
- **Typography**: Montserrat (body), Lora (display/headings), JetBrains Mono (code) — loaded from Google Fonts
- **Radii**: `--ui-radius-xs/sm/md/lg/xl/full`
- **Z-index stack**: `--ui-z-dropdown: 500` → `--ui-z-modal: 400` → `--ui-z-overlay: 300` → `--ui-z-notification: 600`
- **Dark mode**: automatic via `@media (prefers-color-scheme: dark)` + manual via `[data-theme="dark"]` on `<html>`. Light forced via `[data-theme="light"]`.

### Component conventions (`src/components/`)

Every component follows the same pattern:
1. Export named types (`ComponentProps`, variant/size unions)
2. Use `React.forwardRef` for DOM components that accept a `ref`
3. Build class names by concatenating `ui-*` CSS class strings — no inline styles except for dynamic values
4. Inline SVG icons (no icon library dependency)
5. Re-export everything through `src/components/index.ts`

### Provider-based components

Two components require a context provider wrapping the tree:
- `<NotificationProvider>` + `useNotification()` — toast stack, top-right, stackable, supports `duration: 0` for persistent
- `<SnackbarProvider>` + `useSnackbar()` — single bottom snackbar, not stackable, uses `createPortal`

Both providers are composed in `App.tsx`:
```tsx
<SnackbarProvider>
  <NotificationProvider>
    ...
  </NotificationProvider>
</SnackbarProvider>
```

### Input validation system (`src/components/Input.tsx`)

- `validate` prop accepts a `InputValidateType` string or `InputValidateRule[]` array
- Built-in types: `email | url | phone | number | integer | alphanumeric | username | creditcard | postalcode | ip`
- Rule types also include `min | max | minLength | maxLength | pattern`
- `autoIcon` (default `true`) auto-detects start icon from `type`, `validate`, and regex on `name`/`label` strings via `resolveAutoIcon()`
- `showStatusIcon` shows ✓/✗ in the end slot after blur

### Known CSS gotchas

- **Dropdowns inside dialogs**: `.ui-dialog` must stay `overflow: visible` (not `hidden`) or the dropdown gets clipped. The `--ui-z-dropdown: 500` is higher than `--ui-z-modal: 400` to allow dropdowns to escape modal stacking contexts.
- **Input icons hidden**: `.ui-input-icon` needs `z-index: 2` because the `<input>` element (which follows the icon span in DOM order) has `background: var(--ui-bg)` and paints over the absolutely-positioned icon.

### Scroll reveal

`useScrollReveal()` (in `App.tsx`) returns a `useRef<HTMLElement>` and uses `IntersectionObserver` to add the `.visible` class on first intersection. The `Section` helper component applies `className="ui-reveal"` and wires this ref automatically — all sections animate on scroll.

### Table skeleton

Skeleton row widths are deterministic: `widths[(rowIndex * 3 + colIndex) % widths.length]` where `widths = [75, 90, 55, 80, 65, 70, 85, 60]`. This avoids layout shifts from `Math.random()` on re-render.
