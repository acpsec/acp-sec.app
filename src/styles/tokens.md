# Design tokens — acpsec.app

**Source of truth for design decisions.** Components reference these semantic
tokens (never raw hex, never Tailwind default palette colors like `blue-500`).

- **Preserved from acpsec.app v1 HTML** per the Phase 0 audit — hex values are
  exact, not re-derived.
- **Dark theme only.** No light mode, no `dark:` variants, no theme toggle.
- **Font:** Inter via `next/font/google` (Coinbase Sans, the v1 typeface, is not
  publicly available). Wired in `src/app/layout.tsx`.

## Where they live (Tailwind v4)

Tailwind v4 is CSS-first: tokens are declared in the `@theme` block of
[`src/app/globals.css`](../app/globals.css), not a `tailwind.config.ts`. Each
`--color-<name>` auto-generates the `bg-<name>`, `text-<name>`, and
`border-<name>` utilities. The guardrail test `tests/lib/tokens.test.ts` asserts
this registry stays intact.

## Colors

### Brand

| Token | Utility | Hex | Purpose |
|-------|---------|-----|---------|
| `primary` | `bg-primary` / `text-primary` | `#0052FF` | Coinbase blue — CTAs, links, brand accent |
| `success` | `text-success` … | `#00C087` | Positive states, high Trust Score grades |
| `warning` | `text-warning` … | `#F5A623` | Medium scores, caution |
| `warning-alt` | `text-warning-alt` … | `#F0C000` | Secondary warn — monitor UI |
| `danger` | `text-danger` … | `#FF4444` | Destructive, critical grades, errors |
| `danger-alt` | `text-danger-alt` … | `#FF6B6B` | Secondary danger |
| `purple` | `text-purple` … | `#A78BFA` | Rare accent — use sparingly |

### Neutrals (dark surfaces)

| Token | Utility | Hex | Purpose |
|-------|---------|-----|---------|
| `bg` | `bg-bg` | `#0A0B0D` | Main background, near-black |
| `surface` | `bg-surface` | `#1C1D1F` | Elevated cards, sections |
| `surface-hover` | `bg-surface-hover` | `#26272A` | Hover state for surfaces |
| `border` | `border-border` | `#2A2B2E` | Subtle dividers |

### Foregrounds

| Token | Utility | Hex | Purpose |
|-------|---------|-----|---------|
| `fg` | `text-fg` | `#FFFFFF` | Primary text on dark |
| `fg-muted` | `text-fg-muted` | `#A1A5AB` | ~70% grey, secondary text |
| `fg-subtle` | `text-fg-subtle` | `#6B6E75` | ~50% grey, tertiary text, hints |

## Typography

| Token | Utility | Value |
|-------|---------|-------|
| `--font-sans` | `font-sans` | `var(--font-inter), system-ui, sans-serif` |

## Usage rules

- Prefer semantic tokens (`bg-surface`, `text-fg-muted`) over descriptive or
  default palette classes.
- Grade → color mapping (Trust Score bands): SECURE → `success`,
  HARDENED → `success`, VULNERABLE → `warning`, CRITICAL/COMPROMISED → `danger`.
- Opacity modifiers work on tokens (e.g. `bg-success/15` for a soft badge fill).
- `*-alt` variants are reserved for the monitoring UI; default to the base token.
