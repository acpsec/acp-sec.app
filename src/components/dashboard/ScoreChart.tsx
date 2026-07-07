"use client";

import {
  Chart as ChartJS,
  Filler,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from "chart.js";
import { Radar } from "react-chartjs-2";

import type { ScanControl } from "@/lib/api/types";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

/**
 * Radar chart of per-control score % — mirrors the HTML lama's buildChart
 * (type radar, one dataset "Control Score %", radial scale 0–100 step 25, brand
 * blue, hidden legend). Dark-only (no theme-toggle rebuild).
 */
export function ScoreChart({ controls }: { controls: ScanControl[] }) {
  if (controls.length === 0) return null;

  const labels = controls.map((c) => c.ctrl);
  const values = controls.map((c) =>
    c.max > 0 ? Math.round((c.score / c.max) * 100) : 0,
  );

  return (
    <section className="mt-6">
      <h2 className="text-title font-semibold text-fg">
        Control Score Distribution
      </h2>
      <div className="mt-3 h-[360px] rounded-lg border border-border bg-surface p-4">
        <Radar
          data={{
            labels,
            datasets: [
              {
                label: "Control Score %",
                data: values,
                borderColor: "rgba(0,82,255,1)",
                backgroundColor: "rgba(0,82,255,0.12)",
                borderWidth: 2,
                pointBackgroundColor: "rgba(0,82,255,1)",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              r: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  stepSize: 25,
                  color: "#6B6E75",
                  backdropColor: "transparent",
                  font: { size: 11 },
                },
                grid: { color: "#2A2B2E" },
                angleLines: { color: "#2A2B2E" },
                pointLabels: { color: "#A1A5AB", font: { size: 11 } },
              },
            },
          }}
        />
      </div>
    </section>
  );
}
