import type { Metadata } from "next";

import { DashboardView } from "@/components/dashboard/DashboardView";

export const metadata: Metadata = {
  title: "ACP-SEC Dashboard — Agent Commerce Security Audit",
  description: "Live ACP-SEC Trust Score dashboard for AI agent security.",
};

// Server component supplies metadata; the interactive dashboard is a client
// component (useScore/useControls + Zustand + localStorage handoff).
export default function Home() {
  return <DashboardView />;
}
