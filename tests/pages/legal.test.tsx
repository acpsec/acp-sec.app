import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PrivacyPage from "@/app/privacy/page";
import SecurityPage from "@/app/security/page";
import TermsPage from "@/app/terms/page";

// Legal text is the contract — these sentinel phrases guard against accidental
// edits. Normalize whitespace so JSX line-wrapping / inline <strong> don't
// affect matching.
function norm(el: HTMLElement): string {
  return (el.textContent ?? "").replace(/\s+/g, " ").trim();
}

describe("Privacy page", () => {
  it("renders the H1 verbatim", () => {
    const { container } = render(<PrivacyPage />);
    expect(norm(container.querySelector("h1")!)).toBe("ACP-SEC Privacy Policy");
  });

  it("preserves sentinel legal text", () => {
    const t = norm(render(<PrivacyPage />).container);
    expect(t).toContain("Scan results stay in your browser.");
    expect(t).toContain(
      "No third-party analytics (no Google Analytics, no Mixpanel, no Meta Pixel)",
    );
    expect(t).toContain(
      "Wallet addresses are pseudonymous — we do not attempt to link them to real-world identities",
    );
  });

  it("has the contact + changelog links", () => {
    const { container } = render(<PrivacyPage />);
    expect(
      container.querySelector('a[href="mailto:security@acpsec.app"]'),
    ).toBeTruthy();
    expect(
      container.querySelector('a[href="https://github.com/acpsecagent/acp-sec"]'),
    ).toBeTruthy();
  });
});

describe("Terms page", () => {
  it("renders the H1 verbatim", () => {
    const { container } = render(<TermsPage />);
    expect(norm(container.querySelector("h1")!)).toBe("ACP-SEC Terms of Service");
  });

  it("preserves sentinel legal text incl. the MIT license", () => {
    const t = norm(render(<TermsPage />).container);
    expect(t).toContain("Copyright (c) 2026 ACP-SEC Contributors");
    expect(t).toContain(
      'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND',
    );
    expect(t).toContain(
      "Attempting to manipulate leaderboard rankings through fraudulent means",
    );
  });

  it("has the contact link", () => {
    const { container } = render(<TermsPage />);
    expect(
      container.querySelector('a[href="mailto:security@acpsec.app"]'),
    ).toBeTruthy();
  });
});

describe("Security page", () => {
  it("renders the H1 verbatim", () => {
    const { container } = render(<SecurityPage />);
    expect(norm(container.querySelector("h1")!)).toBe(
      "ACP-SEC Security Disclosure",
    );
  });

  it("preserves sentinel disclosure text", () => {
    const t = norm(render(<SecurityPage />).container);
    expect(t).toContain("acknowledging your report within 48 hours");
    expect(t).toContain("No reports yet — be the first!");
    expect(t).toContain(
      "There are no mainnet funds at risk in the current deployment.",
    );
  });

  it("has the security contact, GitHub issues, and basescan links", () => {
    const { container } = render(<SecurityPage />);
    expect(
      container.querySelector('a[href="mailto:security@acpsec.app"]'),
    ).toBeTruthy();
    expect(
      container.querySelector(
        'a[href="https://github.com/acpsecagent/acp-sec/issues"]',
      ),
    ).toBeTruthy();
    expect(
      container.querySelector(
        'a[href="https://sepolia.basescan.org/address/0x7770ED57E3993d4555951a557cd158a6Fb87A470"]',
      ),
    ).toBeTruthy();
  });
});
