import { describe, expect, it } from "vitest";

import {
  normalizeScore,
  scoreToColorClass,
  scoreToTier,
  tierToColorClass,
  type Tier,
} from "@/lib/scoring";

describe("scoreToTier — six-band tier (mirrors leaderboard_store.py / bandForPct)", () => {
  it("maps representative scores to tiers", () => {
    expect(scoreToTier(100)).toBe("EXEMPLARY");
    expect(scoreToTier(85)).toBe("SECURE");
    expect(scoreToTier(60)).toBe("HARDENED");
    expect(scoreToTier(40)).toBe("VULNERABLE");
    expect(scoreToTier(20)).toBe("CRITICAL");
    expect(scoreToTier(5)).toBe("COMPROMISED");
  });

  // Thresholds are inclusive lower bounds (`>=`), exactly like the backend.
  it.each([
    [90, "EXEMPLARY"],
    [89, "SECURE"],
    [70, "SECURE"],
    [69, "HARDENED"],
    [50, "HARDENED"],
    [49, "VULNERABLE"],
    [30, "VULNERABLE"],
    [29, "CRITICAL"],
    [10, "CRITICAL"],
    [9, "COMPROMISED"],
    [0, "COMPROMISED"],
  ] as const)("score %d → %s (boundary)", (score, tier) => {
    expect(scoreToTier(score)).toBe(tier);
  });

  it("handles null/undefined/NaN as 0 → COMPROMISED (leaderboard null→0)", () => {
    expect(scoreToTier(null)).toBe("COMPROMISED");
    expect(scoreToTier(undefined)).toBe("COMPROMISED");
    expect(scoreToTier(Number.NaN)).toBe("COMPROMISED");
  });

  it("out-of-range falls through like the backend (no clamp): >100 → EXEMPLARY, <0 → COMPROMISED", () => {
    expect(scoreToTier(150)).toBe("EXEMPLARY");
    expect(scoreToTier(-5)).toBe("COMPROMISED");
  });
});

describe("normalizeScore — display 0–100 (rings / bars)", () => {
  it("clamps, coerces null→0, and rounds", () => {
    expect(normalizeScore(150)).toBe(100);
    expect(normalizeScore(-5)).toBe(0);
    expect(normalizeScore(null)).toBe(0);
    expect(normalizeScore(undefined)).toBe(0);
    expect(normalizeScore(85.6)).toBe(86);
    expect(normalizeScore(42)).toBe(42);
  });
});

describe("color-class mapping (tier → Task 3.2 tokens; CRITICAL → critical)", () => {
  it("tierToColorClass returns the expected text- token per tier", () => {
    const expected: Record<Tier, string> = {
      EXEMPLARY: "text-primary",
      SECURE: "text-success",
      HARDENED: "text-warning-alt",
      VULNERABLE: "text-warning",
      CRITICAL: "text-critical",
      COMPROMISED: "text-danger",
    };
    for (const [tier, cls] of Object.entries(expected)) {
      expect(tierToColorClass(tier as Tier)).toBe(cls);
    }
  });

  it("supports bg/border prefixes", () => {
    expect(tierToColorClass("SECURE", "bg")).toBe("bg-success");
    expect(tierToColorClass("COMPROMISED", "border")).toBe("border-danger");
  });

  it("scoreToColorClass routes through the tier", () => {
    expect(scoreToColorClass(95)).toBe("text-primary");
    expect(scoreToColorClass(85)).toBe("text-success");
    expect(scoreToColorClass(20)).toBe("text-critical");
    expect(scoreToColorClass(85, "bg")).toBe("bg-success");
  });
});
