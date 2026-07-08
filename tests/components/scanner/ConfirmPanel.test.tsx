import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ConfirmPanel } from "@/components/scanner/ConfirmPanel";
import type { ScannerLookupResponse } from "@/lib/api/types";
import { useScannerStore } from "@/lib/stores/scannerStore";

const LOOKUP: ScannerLookupResponse = {
  ok: true,
  data: {
    username: "aixbt_agent",
    display_name: "aixbt",
    bio: "an onchain agent",
    website: "https://aixbt.tech",
    avatar_url: "",
    source: "nitter",
  },
};

beforeEach(() => useScannerStore.getState().reset());

function renderPanel(scanning = false) {
  const onScan = vi.fn();
  const onBack = vi.fn();
  useScannerStore.getState().beginConfirm(LOOKUP);
  render(<ConfirmPanel onScan={onScan} onBack={onBack} scanning={scanning} />);
  return { onScan, onBack };
}

describe("ConfirmPanel", () => {
  it("renders the scraped profile preview", () => {
    renderPanel();
    expect(screen.getByText("aixbt")).toBeInTheDocument();
    expect(screen.getByText("@aixbt_agent")).toBeInTheDocument();
    expect(screen.getByText("an onchain agent")).toBeInTheDocument();
  });

  it("seeds and edits the agent name into the store", () => {
    renderPanel();
    const input = screen.getByLabelText("Agent Name") as HTMLInputElement;
    expect(input.value).toBe("aixbt");
    fireEvent.change(input, { target: { value: "Custom Name" } });
    expect(useScannerStore.getState().agentName).toBe("Custom Name");
  });

  it("edits the URL into the store", () => {
    renderPanel();
    const input = screen.getByLabelText("Website URL to Scan");
    fireEvent.change(input, { target: { value: "https://x.io/docs" } });
    expect(useScannerStore.getState().url).toBe("https://x.io/docs");
  });

  it("shows the root/exact control only when the URL has a sub-path", () => {
    renderPanel();
    // seeded URL "https://aixbt.tech" has no sub-path → control hidden
    expect(
      screen.queryByRole("radio", { name: /Root domain/ }),
    ).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Website URL to Scan"), {
      target: { value: "https://aixbt.tech/docs" },
    });
    expect(
      screen.getByRole("radio", { name: /Root domain/ }),
    ).toBeInTheDocument();
  });

  it("fires onScan and onBack", () => {
    const { onScan, onBack } = renderPanel();
    fireEvent.click(screen.getByRole("button", { name: "🔬 Scan Agent" }));
    fireEvent.click(screen.getByRole("button", { name: "← Change username" }));
    expect(onScan).toHaveBeenCalledOnce();
    expect(onBack).toHaveBeenCalledOnce();
  });

  it("shows the blocking progress + disables Scan while scanning", () => {
    renderPanel(true);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "⏳ Scanning…" })).toBeDisabled();
  });
});
