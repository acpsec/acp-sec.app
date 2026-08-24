import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RoleHolderChips } from "@/components/b20/RoleHolderChips";
import type { B20Evidence } from "@/lib/api/types";
import { b20WithEvidenceFixture } from "../../fixtures/b20";

const emptyEvidence: B20Evidence = {
  as_of_block: null,
  roles: {},
  announcements: [],
  state: {},
};

const discrepancyEvidence: B20Evidence = {
  ...emptyEvidence,
  roles: {
    "0x0000000000000000000000000000000000000000000000000000000000000000": [
      {
        role: "DEFAULT_ADMIN",
        address: "0xdead000000000000000000000000000000000001",
        grant: {
          kind: "event",
          tx_hash: "0xdead000000000000000000000000000000000000000000000000000000000001",
          block_number: 20000000,
          log_index: 0,
        },
        revoke: null,
        has_role: {
          kind: "state",
          block_number: 20000001,
          raw_value: "false",
          confirmed: false,
        },
        discrepancy: true,
      },
    ],
  },
};

describe("RoleHolderChips", () => {
  it("renders nothing when evidence is null", () => {
    const { container } = render(<RoleHolderChips evidence={null} chainId={84532} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when evidence.roles is empty", () => {
    const { container } = render(
      <RoleHolderChips evidence={emptyEvidence} chainId={84532} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders the section with data-testid when roles are present", () => {
    render(
      <RoleHolderChips evidence={b20WithEvidenceFixture.evidence!} chainId={84532} />,
    );
    expect(screen.getByTestId("role-chips")).toBeInTheDocument();
  });

  it("renders a row for each role holder with its human name", () => {
    render(
      <RoleHolderChips evidence={b20WithEvidenceFixture.evidence!} chainId={84532} />,
    );
    expect(screen.getByText("DEFAULT_ADMIN")).toBeInTheDocument();
    expect(screen.getByText("MINT")).toBeInTheDocument();
    expect(screen.getByText("BURN")).toBeInTheDocument();
  });

  it("renders a truncated address linking to sepolia basescan for chain 84532", () => {
    render(
      <RoleHolderChips evidence={b20WithEvidenceFixture.evidence!} chainId={84532} />,
    );
    // DEFAULT_ADMIN address 0x38467be00970af18076fd08f6b4cf38ba91572b1 → 0x38467b…72b1
    const addrLink = screen.getByRole("link", { name: /0x38467b…72b1/i });
    expect(addrLink).toBeInTheDocument();
    expect(addrLink.getAttribute("href")).toBe(
      "https://sepolia.basescan.org/address/0x38467be00970af18076fd08f6b4cf38ba91572b1",
    );
  });

  it("renders a truncated address linking to mainnet basescan for chain 8453", () => {
    render(
      <RoleHolderChips evidence={b20WithEvidenceFixture.evidence!} chainId={8453} />,
    );
    const addrLink = screen.getByRole("link", { name: /0x38467b…72b1/i });
    expect(addrLink.getAttribute("href")).toBe(
      "https://basescan.org/address/0x38467be00970af18076fd08f6b4cf38ba91572b1",
    );
  });

  it("renders a grant tx link", () => {
    render(
      <RoleHolderChips evidence={b20WithEvidenceFixture.evidence!} chainId={84532} />,
    );
    const txLinks = screen
      .getAllByRole("link")
      .filter((l) => l.getAttribute("href")?.includes("/tx/"));
    expect(txLinks.length).toBeGreaterThan(0);
    expect(txLinks[0]!.getAttribute("href")).toMatch(
      /sepolia\.basescan\.org\/tx\//,
    );
  });

  it("shows confirmed badge when has_role.confirmed is true", () => {
    render(
      <RoleHolderChips evidence={b20WithEvidenceFixture.evidence!} chainId={84532} />,
    );
    // All three holders in the fixture have confirmed: true
    const badges = screen.getAllByText(/confirmed @ block/i);
    expect(badges.length).toBeGreaterThan(0);
  });

  it("shows discrepancy warning when discrepancy is true", () => {
    render(
      <RoleHolderChips evidence={discrepancyEvidence} chainId={84532} />,
    );
    expect(screen.getByText(/discrepancy/i)).toBeInTheDocument();
  });
});
