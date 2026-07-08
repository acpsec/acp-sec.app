import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { UrlNormalizationControl } from "@/components/scanner/UrlNormalizationControl";
import { useScannerStore } from "@/lib/stores/scannerStore";

beforeEach(() => useScannerStore.getState().reset());

describe("UrlNormalizationControl", () => {
  it("renders both lama radio options verbatim", () => {
    render(<UrlNormalizationControl />);
    expect(screen.getByRole("radio", { name: /Root domain/ })).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /Exact URL you entered/ }),
    ).toBeInTheDocument();
    expect(screen.getByText("(recommended)")).toBeInTheDocument();
  });

  it("defaults to root (matches HTML lama default + backend default)", () => {
    render(<UrlNormalizationControl />);
    expect(screen.getByRole("radio", { name: /Root domain/ })).toBeChecked();
    expect(
      screen.getByRole("radio", { name: /Exact URL you entered/ }),
    ).not.toBeChecked();
  });

  it("selecting 'exact' updates the store", () => {
    render(<UrlNormalizationControl />);
    fireEvent.click(screen.getByRole("radio", { name: /Exact URL you entered/ }));
    expect(useScannerStore.getState().scanMode).toBe("exact");
  });

  it("reflects the store value when it changes", () => {
    useScannerStore.getState().setScanMode("exact");
    render(<UrlNormalizationControl />);
    expect(
      screen.getByRole("radio", { name: /Exact URL you entered/ }),
    ).toBeChecked();
  });
});
