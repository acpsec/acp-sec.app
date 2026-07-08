import type { Metadata } from "next";

// Server layout supplies metadata for the client scanner page.
export const metadata: Metadata = {
  title: "Agent Scanner — ACP-SEC",
  description:
    "Scan any AI agent's security posture — heuristic ACP-SEC analysis. Free, open source.",
};

export default function ScannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
