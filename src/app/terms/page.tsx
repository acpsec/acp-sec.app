import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — ACP-SEC",
  description:
    "ACP-SEC Terms of Service — open source, MIT license, no warranty, scan results are heuristic estimates.",
};

const MIT_LICENSE = `MIT License

Copyright (c) 2026 ACP-SEC Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.`;

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-section">
      <h1 className="text-heading font-extrabold tracking-tight">
        <span className="bg-gradient-to-br from-primary to-success bg-clip-text text-transparent">
          ACP-SEC
        </span>{" "}
        Terms of Service
      </h1>
      <p className="mt-1 text-caption text-fg-subtle">
        Last updated: June 2026 · Effective immediately
      </p>

      <div className="my-4 rounded-lg border border-border border-l-[3px] border-l-warning-alt bg-surface p-4 text-caption text-fg-muted">
        <strong className="text-warning-alt">Important:</strong> ACP-SEC scan
        results are <strong>heuristic estimates</strong>, not definitive security
        audits. They should not be used as the sole basis for financial or legal
        decisions.
      </div>

      <h2 className="mt-8 text-title font-semibold text-fg">
        1. Open Source License
      </h2>
      <p className="mt-2 text-body text-fg-muted">
        ACP-SEC is open source software released under the MIT License:
      </p>
      <pre className="my-4 overflow-x-auto whitespace-pre-wrap rounded-lg border border-border bg-surface p-4 font-mono text-caption leading-relaxed text-fg-muted">
        {MIT_LICENSE}
      </pre>

      <h2 className="mt-8 text-title font-semibold text-fg">2. No Warranty</h2>
      <p className="mt-2 text-body text-fg-muted">
        The ACP-SEC service is provided &quot;as is&quot; without warranty of any
        kind, express or implied. We make no guarantees about:
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-body text-fg-muted">
        <li>The accuracy, completeness, or reliability of scan results</li>
        <li>Uptime or availability of the service</li>
        <li>The security of any agent assessed by our scanner</li>
        <li>Fitness for any particular purpose</li>
      </ul>

      <h2 className="mt-8 text-title font-semibold text-fg">
        3. Scan Results Are Heuristic Estimates
      </h2>
      <p className="mt-2 text-body text-fg-muted">
        ACP-SEC security scans are automated heuristic analyses of publicly
        available information. They are:
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-body text-fg-muted">
        <li>
          <strong>Not</strong> formal security audits conducted by certified
          professionals
        </li>
        <li>
          <strong>Not</strong> guarantees of security or insecurity
        </li>
        <li>Based on observable signals from public websites and documentation</li>
        <li>Subject to false positives and false negatives</li>
        <li>
          Intended as a starting point for security assessment, not a final
          verdict
        </li>
      </ul>

      <h2 className="mt-8 text-title font-semibold text-fg">
        4. Not Financial or Legal Advice
      </h2>
      <p className="mt-2 text-body text-fg-muted">
        Nothing on ACP-SEC constitutes financial, investment, or legal advice.
        Security scores and leaderboard rankings should not be used to:
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-body text-fg-muted">
        <li>Make investment decisions in tokens or protocols</li>
        <li>Determine legal compliance or regulatory status</li>
        <li>Replace professional security audits for production systems</li>
      </ul>

      <h2 className="mt-8 text-title font-semibold text-fg">
        5. Use at Your Own Risk
      </h2>
      <p className="mt-2 text-body text-fg-muted">
        By using ACP-SEC, you agree that:
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-body text-fg-muted">
        <li>You use the service at your own risk</li>
        <li>
          You will not rely solely on ACP-SEC scores for security-critical
          decisions
        </li>
        <li>
          You will not use ACP-SEC to scan systems you do not own or have
          permission to scan
        </li>
        <li>You will not attempt to abuse or overload the service</li>
      </ul>

      <h2 className="mt-8 text-title font-semibold text-fg">6. Acceptable Use</h2>
      <p className="mt-2 text-body text-fg-muted">
        ACP-SEC is designed for legitimate security research and agent
        assessment. Prohibited uses include:
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-body text-fg-muted">
        <li>Automated bulk scanning without permission</li>
        <li>Using the scanner as a reconnaissance tool for malicious purposes</li>
        <li>
          Attempting to manipulate leaderboard rankings through fraudulent means
        </li>
      </ul>

      <h2 className="mt-8 text-title font-semibold text-fg">
        7. Changes to These Terms
      </h2>
      <p className="mt-2 text-body text-fg-muted">
        We may update these terms as the service evolves. Continued use of
        ACP-SEC after changes constitutes acceptance of the revised terms.
      </p>

      <h2 className="mt-8 text-title font-semibold text-fg">8. Contact</h2>
      <p className="mt-2 text-body text-fg-muted">
        Questions about these terms:{" "}
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
