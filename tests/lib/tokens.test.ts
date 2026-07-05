import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

// Guardrail against accidental token deletion/mutation in future refactors.
// Tailwind v4 is CSS-first, so the design-token registry lives in the @theme
// block of src/app/globals.css (not a JS tailwind.config). We parse that file
// and assert every semantic color keeps its exact hex (preserved from
// acpsec.app v1 per the Phase 0 audit). See src/styles/tokens.md.
// Vitest runs with cwd = project root (where vitest.config.ts lives).
const cssPath = resolve(process.cwd(), "src/app/globals.css");
const css = readFileSync(cssPath, "utf8");

const EXPECTED_COLORS: Record<string, string> = {
  primary: "#0052FF",
  success: "#00C087",
  warning: "#F5A623",
  "warning-alt": "#F0C000",
  danger: "#FF4444",
  "danger-alt": "#FF6B6B",
  purple: "#A78BFA",
  bg: "#0A0B0D",
  surface: "#1C1D1F",
  "surface-hover": "#26272A",
  border: "#2A2B2E",
  fg: "#FFFFFF",
  "fg-muted": "#A1A5AB",
  "fg-subtle": "#6B6E75",
};

describe("design tokens (@theme in globals.css)", () => {
  for (const [name, hex] of Object.entries(EXPECTED_COLORS)) {
    it(`--color-${name} === ${hex}`, () => {
      // `\s*:` anchors the name so e.g. --color-warning doesn't match
      // --color-warning-alt. Case-insensitive: hex casing is not significant.
      const re = new RegExp(`--color-${name}\\s*:\\s*${hex}\\s*;`, "i");
      expect(css).toMatch(re);
    });
  }

  it("exposes exactly the expected number of --color- tokens", () => {
    const count = (css.match(/--color-[a-z-]+\s*:/gi) ?? []).length;
    expect(count).toBe(Object.keys(EXPECTED_COLORS).length);
  });

  it("font-sans token chains through the Inter CSS variable", () => {
    expect(css).toMatch(/--font-sans\s*:\s*var\(--font-inter\)/);
  });
});
