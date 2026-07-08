import type { Metadata } from "next";

import { B20Providers } from "./providers";

export const metadata: Metadata = {
  title: "B20 Token Scanner — ACP-SEC",
  description: "Read-only Trust Score scanner for B20 native tokens on Base.",
};

export default function B20Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <B20Providers>{children}</B20Providers>;
}
