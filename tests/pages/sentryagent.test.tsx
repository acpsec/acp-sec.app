import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SentryAgentPage from "@/app/agents/sentryagent/page";

const CONTRACT = "0x7770ED57E3993d4555951a557cd158a6Fb87A470";
const WALLET = "0x197C7433d7b500691AD2eCEf4dffc1B01C123dfA";

const SECTIONS = [
  "Agent Identity",
  "On-chain Identity",
  "ERC-8183 Compliance",
  "Hook Security Patterns",
  "Context Security",
  "Injection Protection",
  "Privacy Policy",
  "Output Security",
  "Security Disclosure",
  "Governance",
  "Links & Resources",
];

// One distinctive sentinel phrase per section — guards against content drift
// (Group 4 legal-pages pattern applied to technical docs).
const SENTINELS = [
  "Smart Contract Agent",
  "View verified source ↗",
  "Budget locked in escrow",
  "Commitment Immutability",
  "Job-scoped isolation",
  "No natural language processing",
  "Pseudonymous — on-chain addresses are public but not linked to real-world identity by this contract",
  "On-chain state is append-only and consensus-verified",
  "N/A — on-chain agent",
  "✗ Immutable contract",
  "Scan any agent for security issues",
];

describe("SentryAgentPage", () => {
  it("renders the hero heading", () => {
    render(<SentryAgentPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "SentryAgent" }),
    ).toBeInTheDocument();
  });

  it("renders all 11 section headings", () => {
    render(<SentryAgentPage />);
    for (const name of SECTIONS) {
      expect(
        screen.getByRole("heading", { level: 2, name }),
      ).toBeInTheDocument();
    }
  });

  it("preserves a sentinel phrase from each section verbatim", () => {
    render(<SentryAgentPage />);
    for (const phrase of SENTINELS) {
      // Some phrases (e.g. "Smart Contract Agent") legitimately appear twice.
      expect(
        screen.getAllByText(phrase, { exact: false }).length,
      ).toBeGreaterThan(0);
    }
  });

  it("shows the contract and wallet addresses (raw, no truncation)", () => {
    render(<SentryAgentPage />);
    expect(screen.getByText(CONTRACT)).toBeInTheDocument();
    expect(screen.getByText(WALLET)).toBeInTheDocument();
  });

  it("links the verified source to Basescan Sepolia", () => {
    render(<SentryAgentPage />);
    expect(
      screen.getByRole("link", { name: "View verified source ↗" }),
    ).toHaveAttribute(
      "href",
      `https://sepolia.basescan.org/address/${CONTRACT}#code`,
    );
  });

  it("keeps the 'Try It Live' cross-link to the (future) playground route", () => {
    render(<SentryAgentPage />);
    expect(
      screen.getByRole("link", { name: "Try It Live →" }),
    ).toHaveAttribute("href", "/agents/sentryagent/playground");
  });

  it("preserves the @ariessa_xyz hook-pattern attribution", () => {
    render(<SentryAgentPage />);
    expect(
      screen.getByText(/FundTransferHook\.recoverTokens/),
    ).toBeInTheDocument();
  });
});
