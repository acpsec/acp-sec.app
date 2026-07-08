import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { OnchainStatus } from "@/components/scanner/OnchainStatus";

describe("OnchainStatus", () => {
  it("shows the ACP Registered badge when registered === true", () => {
    render(<OnchainStatus registered={true} />);
    expect(screen.getByText("ACP Registered")).toBeInTheDocument();
  });

  it("renders nothing when registered === false", () => {
    const { container } = render(<OnchainStatus registered={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when registered === null (inconclusive)", () => {
    const { container } = render(<OnchainStatus registered={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when registered is undefined", () => {
    const { container } = render(<OnchainStatus registered={undefined} />);
    expect(container).toBeEmptyDOMElement();
  });
});
