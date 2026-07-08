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
import { groupByDimension } from "@/lib/scanner/dimensions";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

/**
 * Per-dimension score radar — mirrors the lama's buildRadar (labels = dimension
 * keys, one dataset of per-dimension score %, radial scale 0–100 step 25, brand
 * blue, hidden legend). Dark palette (matches the dashboard's ScoreChart).
 */
export function DimensionsRadar({ controls }: { controls: ScanControl[] }) {
  const groups = groupByDimension(controls);
  if (groups.length === 0) return null;

  const labels = groups.map((g) => g.dim);
  const values = groups.map((g) => Math.round(g.pct));

  return (
    <div className="h-[260px]">
      <Radar
        data={{
          labels,
          datasets: [
            {
              label: "Score %",
              data: values,
              borderColor: "rgba(0,82,255,1)",
              backgroundColor: "rgba(0,82,255,0.15)",
              borderWidth: 2,
              pointBackgroundColor: "rgba(0,82,255,1)",
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7,
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
                color: "#A8A5A0",
                backdropColor: "transparent",
                font: { size: 11 },
              },
              grid: { color: "rgba(255,255,255,.08)" },
              angleLines: { color: "rgba(255,255,255,.08)" },
              pointLabels: { color: "#E8E6DC", font: { size: 12, weight: 600 } },
            },
          },
        }}
      />
    </div>
  );
}
