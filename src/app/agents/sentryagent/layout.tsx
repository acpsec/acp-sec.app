import type { Metadata, Viewport } from "next";

// Server layout supplies metadata for the static SentryAgent profile page.
// The `other` block re-emits the lama's machine-readable agent meta tags — the
// ACP-SEC scanner reads these, so they are preserved verbatim.
export const metadata: Metadata = {
  title: "SentryAgent — ACP-SEC Agent Profile",
  description:
    "SentryAgent — ERC-8183 reference implementation & ACP-SEC security showcase. Public security disclosure page.",
  openGraph: {
    title: "SentryAgent — ACP-SEC Agent Profile",
    description:
      "ERC-8183 reference implementation with ACP-SEC security best practices. On-chain verified on Base Sepolia.",
    url: "https://acpsec.app/agents/sentryagent",
  },
  other: {
    "agent-name": "SentryAgent",
    "agent-version": "1.0.0",
    "agent-owner": "@acpsecagent",
    "agent-wallet": "0x197C7433d7b500691AD2eCEf4dffc1B01C123dfA",
    "agent-contract": "0x7770ED57E3993d4555951a557cd158a6Fb87A470",
    "security-contact": "security@acpsec.app",
    "erc8183-compliant": "true",
  },
};

export const viewport: Viewport = {
  themeColor: "#0052FF",
};

export default function SentryAgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
