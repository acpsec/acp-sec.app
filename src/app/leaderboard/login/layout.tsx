import type { Metadata } from "next";

// Overrides the parent leaderboard layout's title for the login route.
export const metadata: Metadata = {
  title: "ACP-SEC — Leaderboard Access",
  description: "Restricted leaderboard access.",
};

export default function LeaderboardLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
