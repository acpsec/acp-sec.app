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
| `critical` | `text-critical` … | `#FF6B00` | Score tier CRITICAL (red-orange) — from `BAND_COLORS` (Task 3.3) |

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

Font family:

| Token | Utility | Value |
|-------|---------|-------|
| `--font-sans` | `font-sans` | `var(--font-inter), system-ui, sans-serif` |

Type scale (Task 3.3) — consolidated from the inconsistent HTML lama sizes into
ONE semantic scale. **Every rem value below actually appears in the v1 HTML —
nothing invented.** Font **weight** stays on Tailwind defaults
(`font-medium`/`font-semibold`/`font-bold`) — no weight tokens.

| Token | Utility | Size / line-height | Use |
|-------|---------|--------------------|-----|
| `display` | `text-display` | `3rem` / 1.1 | Page hero |
| `heading` | `text-heading` | `1.8rem` / 1.2 | `h1` within a page |
| `title` | `text-title` | `1.2rem` / 1.3 | `h2`, card title |
| `body` | `text-body` | `1rem` / 1.5 | Paragraphs |
| `caption` | `text-caption` | `0.85rem` / 1.4 | Small text, labels |
| `micro` | `text-micro` | `0.75rem` / 1.4 | Badges, tags |

## Spacing (semantic composites)

ADD-ONLY named spacings on top of Tailwind's default numeric scale (`p-4` etc.
still work). Values match the dominant HTML lama paddings. Generate `p-page`,
`px-section`, `gap-card`, etc.

| Token | Utility | Value | Use |
|-------|---------|-------|-----|
| `page` | `p-page` … | `2rem` | Page-level padding |
| `section` | `py-section` … | `3rem` | Between major sections |
| `card` | `p-card` … | `1.5rem` | Inside cards / panels |

## Score → Tier → Color

**Six-band tier scheme** — the single source of truth is `src/lib/scoring.ts`,
locked to the backend: `acpsec_api/leaderboard_store.py` `LEADERBOARD_BANDS` /
`tier_for_score`, identical to `dashboard/acp-sec-dashboard.html` `bandForPct` +
`BAND_COLORS`. **There are no A–F letter grades in the system.**

| Score (≥) | Tier | Color token | Hex |
|-----------|------|-------------|-----|
| 90 | `EXEMPLARY` | `primary` | `#0052FF` |
| 70 | `SECURE` | `success` | `#00C087` |
| 50 | `HARDENED` | `warning-alt` | `#F0C000` |
| 30 | `VULNERABLE` | `warning` | `#F5A623` |
| 10 | `CRITICAL` | `critical` | `#FF6B00` |
| 0 | `COMPROMISED` | `danger` | `#FF4444` |

Usage: `scoreToTier(85) → 'SECURE'`; `scoreToColorClass(85) → 'text-success'`;
`tierToColorClass('CRITICAL', 'bg') → 'bg-critical'`. Edge cases:
`null`/`undefined`/`NaN` → `0` → `COMPROMISED` (mirrors the leaderboard's
null→0); out-of-range falls through (`>100` → `EXEMPLARY`, `<0` → `COMPROMISED`);
`normalizeScore` clamps 0–100 + rounds for rings/bars.

> **Flagged inconsistency (not reconciled here):** the separate
> `dashboard/monitor_dashboard.html` `scoreColor()` uses a *different* 4-tier
> color scheme (≥90 green, ≥70 blue, ≥50 orange, else red) that swaps the top
> two colors vs the canonical scheme above. Out of scope for Groups 4–6; noted
> for whoever ports the monitor UI. There is also a distinct **5-band verdict**
> scheme in `acpsec_api/scoring.py` (for the `verdict` string), deliberately
> separate from the tier scheme.

## Usage rules

- Prefer semantic tokens (`bg-surface`, `text-fg-muted`) over descriptive or
  default palette classes.
- Trust Score coloring goes through `src/lib/scoring.ts` (see the tier table
  above) — never hardcode a tier→color mapping in components.
- Opacity modifiers work on tokens (e.g. `bg-success/15` for a soft badge fill).
- `*-alt` variants are reserved for the monitoring UI; default to the base token.
