import type { Metadata } from "next";

// Server layout supplies metadata for the client leaderboard page.
export const metadata: Metadata = {
  title: "Agent Security Leaderboard — ACP-SEC",
  description: "Live ranking of AI agents by ACP-SEC score.",
};

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
