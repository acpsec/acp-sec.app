import type { ScanControl } from "@/lib/api/types";

/** A dimension bucket: its controls plus aggregate score/max/percentage. */
export interface DimensionGroup {
  dim: string;
  name: string;
  controls: ScanControl[];
  score: number;
  max: number;
  pct: number;
}

/**
 * Group scan controls by dimension, preserving first-seen order — mirrors the
 * lama's buildRadar / _renderAccordion grouping. `pct` is `sum(score)/sum(max)`.
 */
export function groupByDimension(controls: ScanControl[]): DimensionGroup[] {
  const order: string[] = [];
  const map = new Map<string, DimensionGroup>();

  for (const c of controls) {
    let g = map.get(c.dimension);
    if (!g) {
      g = {
        dim: c.dimension,
        name: c.dimension_name || c.dimension,
        controls: [],
        score: 0,
        max: 0,
        pct: 0,
      };
      map.set(c.dimension, g);
      order.push(c.dimension);
    }
    g.controls.push(c);
    g.score += c.score;
    g.max += c.max;
  }

  const groups = order.map((k) => map.get(k)!);
  for (const g of groups) g.pct = g.max > 0 ? (g.score / g.max) * 100 : 0;
  return groups;
}

/** Lama's 3-way bar colour (per-dimension/-check health, NOT the tier scheme). */
export function barColorClass(pct: number): string {
  if (pct === 0) return "bg-danger";
  if (pct < 50) return "bg-warning";
  return "bg-success";
}
