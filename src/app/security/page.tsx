import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security Disclosure — ACP-SEC",
  description:
    "ACP-SEC responsible disclosure policy — contact security@acpsec.app for vulnerability reports. 48-hour response time.",
};

export default function SecurityPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-section">
      <h1 className="text-heading font-extrabold tracking-tight">
        <span className="bg-gradient-to-br from-primary to-success bg-clip-text text-transparent">
          ACP-SEC
        </span>{" "}
        Security Disclosure
      </h1>
      <p className="mt-1 text-caption text-fg-subtle">
        Responsible disclosure policy · Updated June 2026
      </p>

      <div className="my-4 rounded-lg border border-border border-l-[3px] border-l-primary bg-surface p-4 text-caption text-fg-muted">
        We take security seriously. If you discover a vulnerability in ACP-SEC,
        please report it responsibly. We commit to acknowledging your report
        within <strong className="text-success">48 hours</strong>.
      </div>

      <h2 className="mt-8 text-title font-semibold text-fg">
        Report a Vulnerability
      </h2>

      <div className="my-4 flex items-center gap-4 rounded-[10px] border border-border bg-surface px-5 py-4">
        <div className="shrink-0 text-2xl">✉️</div>
        <div>
          <div className="text-micro font-semibold uppercase tracking-wide text-fg-subtle">
            Security Contact
          </div>
          <div className="mt-0.5 text-caption font-semibold">
            <a
              href="mailto:security@acpsec.app"
              className="text-success hover:underline"
            >
              security@acpsec.app
            </a>
          </div>
        </div>
      </div>

      <div className="my-4 flex items-center gap-4 rounded-[10px] border border-border bg-surface px-5 py-4">
        <div className="shrink-0 text-2xl">🐛</div>
        <div>
          <div className="text-micro font-semibold uppercase tracking-wide text-fg-subtle">
            GitHub Issues (non-sensitive)
          </div>
          <div className="mt-0.5 text-caption font-semibold">
            <a
              href="https://github.com/acpsecagent/acp-sec/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-success hover:underline"
            >
              github.com/acpsecagent/acp-sec/issues
            </a>
          </div>
        </div>
      </div>

      <h2 className="mt-8 text-title font-semibold text-fg">Response Times</h2>
      <div className="my-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface px-4 py-3">
          <div className="text-micro font-semibold uppercase tracking-wide text-fg-subtle">
            Initial acknowledgment
          </div>
          <div className="mt-0.5 text-caption font-bold text-success">48 hours</div>
        </div>
        <div className="rounded-lg border border-border bg-surface px-4 py-3">
          <div className="text-micro font-semibold uppercase tracking-wide text-fg-subtle">
            Triage &amp; assessment
          </div>
          <div className="mt-0.5 text-caption font-bold text-success">7 days</div>
        </div>
        <div className="rounded-lg border border-border bg-surface px-4 py-3">
          <div className="text-micro font-semibold uppercase tracking-wide text-fg-subtle">
            Fix timeline (critical)
          </div>
          <div className="mt-0.5 text-caption font-bold text-warning">14 days</div>
        </div>
        <div className="rounded-lg border border-border bg-surface px-4 py-3">
          <div className="text-micro font-semibold uppercase tracking-wide text-fg-subtle">
            Public disclosure
          </div>
          <div className="mt-0.5 text-caption font-bold text-fg-muted">After fix</div>
        </div>
      </div>

      <h2 className="mt-8 text-title font-semibold text-fg">Scope</h2>
      <p className="mt-2 text-body text-fg-muted">
        In scope for responsible disclosure:
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-body text-fg-muted">
        <li>acpsec.app web application and API</li>
        <li>ACP-SEC scanner and scoring logic</li>
        <li>
          SentryAgent smart contract (
          <a
            href="https://sepolia.basescan.org/address/0x7770ED57E3993d4555951a557cd158a6Fb87A470"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Base Sepolia
          </a>
          )
        </li>
        <li>Authentication and session handling</li>
        <li>Server-side request forgery (SSRF) via scanner endpoints</li>
      </ul>
      <p className="mt-2 text-body text-fg-muted">Out of scope:</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-body text-fg-muted">
        <li>Social engineering attacks</li>
        <li>Denial of service (DoS) attacks</li>
        <li>Issues in third-party services we depend on</li>
        <li>Self-XSS or issues that require physical access</li>
      </ul>

      <h2 className="mt-8 text-title font-semibold text-fg">Bug Bounty</h2>
      <div className="my-4 rounded-lg border border-warning/20 bg-warning/[0.06] px-4 py-3 text-caption text-warning">
        <strong>No formal bug bounty program at this time.</strong> We are
        transparent about this. We cannot offer monetary rewards currently, but we
        will publicly acknowledge all valid reports and credit researchers by name
        (or pseudonym) on this page.
      </div>

      <h2 className="mt-8 text-title font-semibold text-fg">
        Responsible Disclosure Guidelines
      </h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-body text-fg-muted">
        <li>
          Do not publicly disclose the vulnerability before we have had a
          reasonable opportunity to fix it
        </li>
        <li>
          Do not access, modify, or delete data that does not belong to you
        </li>
        <li>
          Do not perform actions that could harm other users or degrade service
          availability
        </li>
        <li>Provide sufficient information to reproduce the issue</li>
      </ul>

      <h2 className="mt-8 text-title font-semibold text-fg">
        Acknowledged Researchers
      </h2>
      <p className="mt-2 text-body text-fg-muted">
        We gratefully acknowledge the following security researchers who have
        contributed to making ACP-SEC more secure:
      </p>
      <table className="my-4 w-full border-collapse text-caption">
        <thead>
          <tr>
            <th className="border-b border-border px-3 py-2 text-left text-micro font-bold uppercase tracking-wide text-fg-subtle">
              Researcher
            </th>
            <th className="border-b border-border px-3 py-2 text-left text-micro font-bold uppercase tracking-wide text-fg-subtle">
              Finding
            </th>
            <th className="border-b border-border px-3 py-2 text-left text-micro font-bold uppercase tracking-wide text-fg-subtle">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              colSpan={3}
              className="px-3 py-2 text-center italic text-fg-subtle"
            >
              No reports yet — be the first!
            </td>
          </tr>
        </tbody>
      </table>

      <h2 className="mt-8 text-title font-semibold text-fg">Our Commitments</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-body text-fg-muted">
        <li>We will acknowledge your report within 48 hours</li>
        <li>We will keep you informed of our progress</li>
        <li>We will credit you in this page (with your permission)</li>
        <li>
          We will not take legal action against researchers acting in good faith
        </li>
        <li>
          We will be transparent about our security posture and limitations
        </li>
      </ul>

      <div className="mt-8 rounded-lg border border-border border-l-[3px] border-l-warning bg-surface p-4 text-caption text-fg-muted">
        ACP-SEC is a <strong>testnet</strong> project. The SentryAgent contract is
        deployed on Base Sepolia (testnet) only. There are no mainnet funds at
        risk in the current deployment.
      </div>
    </article>
  );
}
