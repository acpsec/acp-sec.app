import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { HeaderActions } from "@/components/dashboard/HeaderActions";

function renderActions(over: Partial<Parameters<typeof HeaderActions>[0]> = {}) {
  const onLoadReport = vi.fn();
  const onRefresh = vi.fn();
  const onExport = vi.fn();
  render(
    <HeaderActions
      onLoadReport={onLoadReport}
      onRefresh={onRefresh}
      onExport={onExport}
      {...over}
    />,
  );
  return { onLoadReport, onRefresh, onExport };
}

describe("HeaderActions", () => {
  it("renders the three lama buttons with verbatim labels", () => {
    renderActions();
    expect(screen.getByRole("button", { name: "📁 Load Report" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "🔄 Refresh" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "📥 Export" })).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("fires each handler on click", () => {
    const { onLoadReport, onRefresh, onExport } = renderActions();
    fireEvent.click(screen.getByRole("button", { name: "📁 Load Report" }));
    fireEvent.click(screen.getByRole("button", { name: "🔄 Refresh" }));
    fireEvent.click(screen.getByRole("button", { name: "📥 Export" }));
    expect(onLoadReport).toHaveBeenCalledOnce();
    expect(onRefresh).toHaveBeenCalledOnce();
    expect(onExport).toHaveBeenCalledOnce();
  });

  it("shows the loading label + disables Refresh while refreshing", () => {
    renderActions({ refreshing: true });
    expect(screen.getByRole("button", { name: "⏳ Loading…" })).toBeDisabled();
  });

  it("disables Export when there is no score to export", () => {
    renderActions({ exportDisabled: true });
    expect(screen.getByRole("button", { name: "📥 Export" })).toBeDisabled();
  });
});
