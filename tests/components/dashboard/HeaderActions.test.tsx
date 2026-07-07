import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HeaderActions } from "@/components/dashboard/HeaderActions";

describe("HeaderActions", () => {
  it("renders exactly the three lama buttons with verbatim labels", () => {
    render(<HeaderActions />);
    expect(
      screen.getByRole("button", { name: "📁 Load Report" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "🔄 Refresh" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "📥 Export" })).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("buttons are clickable stubs (no crash)", () => {
    render(<HeaderActions />);
    fireEvent.click(screen.getByRole("button", { name: "🔄 Refresh" }));
    fireEvent.click(screen.getByRole("button", { name: "📥 Export" }));
  });
});
