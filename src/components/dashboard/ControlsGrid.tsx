import type { ScanControl } from "@/lib/api/types";

import { ControlCard } from "./ControlCard";

/**
 * The per-control breakdown of a loaded score — one expandable card per control.
 * Mirrors the HTML lama "Security Controls · Click any card to expand" grid.
 * View-only (no editing); the cards read from the loaded scoreData.controls.
 */
export function ControlsGrid({ controls }: { controls: ScanControl[] }) {
  if (controls.length === 0) return null;

  return (
    <section className="mt-6">
      <h2 className="text-title font-semibold text-fg">
        Security Controls{" "}
        <span className="text-caption font-normal text-fg-subtle">
          ({controls.length}) · Click any card to expand
        </span>
      </h2>
      <div className="mt-3 space-y-2">
        {controls.map((c) => (
          <ControlCard key={c.ctrl} control={c} />
        ))}
      </div>
    </section>
  );
}
