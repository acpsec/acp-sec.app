import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — ACP-SEC",
  description:
    "ACP-SEC Privacy Policy — no PII collected, no tracking, no third-party analytics.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-section">
      <h1 className="text-heading font-extrabold tracking-tight">
        <span className="bg-gradient-to-br from-primary to-success bg-clip-text text-transparent">
          ACP-SEC
        </span>{" "}
        Privacy Policy
      </h1>
      <p className="mt-1 text-caption text-fg-subtle">
        Last updated: June 2026 · Effective immediately
      </p>

      <div className="my-4 rounded-lg border border-border border-l-[3px] border-l-success bg-surface p-4 text-caption text-fg-muted">
        <strong className="text-success">TL;DR:</strong> We do not collect
        personal information, we do not use tracking cookies, and we do not share
        your data with third parties. Scan results stay in your browser.
      </div>

      <h2 className="mt-8 text-title font-semibold text-fg">1. What We Collect</h2>
      <p className="mt-2 text-body text-fg-muted">
        ACP-SEC does not collect personally identifiable information (PII).
        Specifically:
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-body text-fg-muted">
        <li>No name, email address, or account registration is required</li>
        <li>No IP addresses are logged beyond standard server access logs</li>
        <li>No behavioral tracking or session recording</li>
        <li>No advertising identifiers</li>
      </ul>

      <h2 className="mt-8 text-title font-semibold text-fg">2. Scan Results</h2>
      <p className="mt-2 text-body text-fg-muted">
        When you run a security scan on the ACP-SEC Scanner:
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-body text-fg-muted">
        <li>
          Scan results are processed server-side to analyse the target URL and
          returned to your browser
        </li>
        <li>
          Results are stored temporarily in server memory only for the current
          session
        </li>
        <li>
          No scan results are permanently stored, associated with your identity,
          or shared with third parties
        </li>
        <li>
          Leaderboard entries are based on public, voluntarily submitted agent
          names and are not linked to individual users
        </li>
      </ul>

      <h2 className="mt-8 text-title font-semibold text-fg">
        3. Cookies &amp; Tracking
      </h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-body text-fg-muted">
        <li>
          No third-party analytics (no Google Analytics, no Mixpanel, no Meta
          Pixel)
        </li>
        <li>No advertising cookies</li>
        <li>
          Session cookies may be used solely for the password-protected
          leaderboard feature, if enabled
        </li>
        <li>No cross-site tracking</li>
      </ul>

      <h2 className="mt-8 text-title font-semibold text-fg">
        4. Wallet Addresses
      </h2>
      <p className="mt-2 text-body text-fg-muted">
        If you provide a wallet address for on-chain ACP registration checks:
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-body text-fg-muted">
        <li>
          The address is used only to query public blockchain data (Base
          mainnet)
        </li>
        <li>It is not stored, linked to your identity, or shared</li>
        <li>
          Wallet addresses are pseudonymous — we do not attempt to link them to
          real-world identities
        </li>
      </ul>

      <h2 className="mt-8 text-title font-semibold text-fg">5. Public Data</h2>
      <p className="mt-2 text-body text-fg-muted">
        ACP-SEC operates on publicly available data only:
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-body text-fg-muted">
        <li>
          Agent websites and documentation pages that are publicly accessible
        </li>
        <li>Public blockchain state (on-chain data)</li>
        <li>Public X/Twitter profiles via publicly available scrapers</li>
      </ul>

      <h2 className="mt-8 text-title font-semibold text-fg">
        6. Third-Party Services
      </h2>
      <p className="mt-2 text-body text-fg-muted">
        ACP-SEC may make requests to external services to perform scans (e.g.
        fetching an agent&apos;s public website). These requests originate from
        our server and do not include your personal information.
      </p>

      <h2 className="mt-8 text-title font-semibold text-fg">7. Data Retention</h2>
      <p className="mt-2 text-body text-fg-muted">
        No user data is retained beyond the duration of a server session. The
        leaderboard JSON file is a manually curated public list and contains only
        agent names and publicly available security scores.
      </p>

      <h2 className="mt-8 text-title font-semibold text-fg">8. Your Rights</h2>
      <p className="mt-2 text-body text-fg-muted">
        Since we do not collect personal data, there is nothing to access,
        correct, or delete. If you believe any information about you has been
        inadvertently stored, contact{" "}
        <a
          href="mailto:security@acpsec.app"
          className="text-primary hover:underline"
        >
          security@acpsec.app
        </a>{" "}
        and we will address it promptly.
      </p>

      <h2 className="mt-8 text-title font-semibold text-fg">
        9. Changes to This Policy
      </h2>
      <p className="mt-2 text-body text-fg-muted">
        We may update this policy as the service evolves. Material changes will be
        noted in the{" "}
        <a
          href="https://github.com/acpsecagent/acp-sec"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          GitHub changelog
        </a>
        .
      </p>

      <h2 className="mt-8 text-title font-semibold text-fg">10. Contact</h2>
      <p className="mt-2 text-body text-fg-muted">
        Questions about this policy:{" "}
        <a
          href="mailto:security@acpsec.app"
          className="text-primary hover:underline"
        >
          security@acpsec.app
        </a>
      </p>
    </article>
  );
}
