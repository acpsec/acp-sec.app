import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  CriticalBadge,
  GradeBadge,
  PowerBadge,
  SeverityBadge,
  gradeToColorClass,
} from "@/components/b20/badges";

describe("gradeToColorClass", () => {
  it("maps A to the success token", () => {
    expect(gradeToColorClass("A")).toContain("text-success");
  });

  it("maps F to the danger token", () => {
    expect(gradeToColorClass("F")).toContain("text-danger");
  });

  it("maps the mid grades to distinct semantic tokens", () => {
    expect(gradeToColorClass("B")).toContain("text-warning-alt");
    expect(gradeToColorClass("C")).toContain("text-warning");
    expect(gradeToColorClass("D")).toContain("text-critical");
  });

  it("falls back to a neutral token for an unknown/null grade", () => {
    expect(gradeToColorClass(null)).toContain("text-fg-subtle");
    expect(gradeToColorClass("Z")).toContain("text-fg-subtle");
  });

  it("never emits a slate/Geist class", () => {
    for (const g of ["A", "B", "C", "D", "F", "Z"]) {
      expect(gradeToColorClass(g)).not.toMatch(/slate|Geist/);
    }
  });
});

describe("GradeBadge", () => {
  it("renders the grade letter with an accessible label", () => {
    render(<GradeBadge grade="B" />);
    const el = screen.getByLabelText("Grade B");
    expect(el).toHaveTextContent("B");
    expect(el.getAttribute("class")).toContain("text-warning-alt");
  });
});

describe("CriticalBadge", () => {
  it("announces CRITICAL as a status", () => {
    render(<CriticalBadge />);
    const el = screen.getByRole("status");
    expect(el).toHaveTextContent("CRITICAL");
    expect(el.getAttribute("class")).toContain("text-danger");
  });
});

describe("PowerBadge", () => {
  it("shows the risk copy + danger tone when the issuer HAS the power", () => {
    render(<PowerBadge power="freeze" value={true} />);
    const el = screen.getByLabelText("Can freeze your tokens");
    expect(el).toHaveTextContent("Can freeze your tokens");
    expect(el.getAttribute("class")).toContain("text-danger");
  });

  it("shows the safe copy + success tone when the issuer does NOT", () => {
    render(<PowerBadge power="mint" value={false} />);
    const el = screen.getByLabelText("Supply is capped");
    expect(el.getAttribute("class")).toContain("text-success");
  });

  it("shows the unknown copy + neutral tone when undeterminable", () => {
    render(<PowerBadge power="seize" value={null} />);
    const el = screen.getByLabelText("Seize: unknown");
    expect(el.getAttribute("class")).toContain("text-fg-muted");
  });
});

describe("SeverityBadge", () => {
  it("colours CRITICAL/Medium/Low with distinct semantic tokens", () => {
    const { rerender } = render(<SeverityBadge severity="CRITICAL" />);
    expect(screen.getByText("CRITICAL").getAttribute("class")).toContain(
      "text-danger",
    );
    rerender(<SeverityBadge severity="Medium" />);
    expect(screen.getByText("Medium").getAttribute("class")).toContain(
      "text-warning",
    );
    rerender(<SeverityBadge severity="Low" />);
    expect(screen.getByText("Low").getAttribute("class")).toContain(
      "text-fg-muted",
    );
  });

  it("falls back to the Low style for an unknown severity", () => {
    render(<SeverityBadge severity="Bogus" />);
    expect(screen.getByText("Bogus").getAttribute("class")).toContain(
      "text-fg-muted",
    );
  });
});
