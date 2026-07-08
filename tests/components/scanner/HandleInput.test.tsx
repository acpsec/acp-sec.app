import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { HandleInput } from "@/components/scanner/HandleInput";
import { useScannerStore } from "@/lib/stores/scannerStore";

beforeEach(() => useScannerStore.getState().reset());

describe("HandleInput", () => {
  it("renders the lama label, placeholder and hint verbatim", () => {
    render(<HandleInput />);
    expect(screen.getByLabelText("X Username")).toBeInTheDocument();
    // NB: the rendered attribute keeps the lama's verbatim double spaces;
    // getByPlaceholderText normalises whitespace, so we query the collapsed form.
    expect(
      screen.getByPlaceholderText("@agentname or agentname"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Example: @bankrbot, @virtuals_io, @aixbt_agent"),
    ).toBeInTheDocument();
  });

  it("is a controlled input bound to the store", () => {
    render(<HandleInput />);
    const input = screen.getByLabelText("X Username");
    fireEvent.change(input, { target: { value: "@aixbt_agent" } });
    expect(useScannerStore.getState().handle).toBe("@aixbt_agent");
  });

  it("disables the Look up button when the handle is empty", () => {
    render(<HandleInput />);
    expect(screen.getByRole("button", { name: "Look up →" })).toBeDisabled();
  });

  it("enables the Look up button once a handle is entered", () => {
    useScannerStore.getState().setHandle("@x");
    render(<HandleInput />);
    expect(screen.getByRole("button", { name: "Look up →" })).toBeEnabled();
  });

  it("calls onLookup when the button is clicked", () => {
    const onLookup = vi.fn();
    useScannerStore.getState().setHandle("@x");
    render(<HandleInput onLookup={onLookup} />);
    fireEvent.click(screen.getByRole("button", { name: "Look up →" }));
    expect(onLookup).toHaveBeenCalledOnce();
  });

  it("shows the loading label and disables the button while looking up", () => {
    useScannerStore.getState().setHandle("@x");
    render(<HandleInput loading />);
    expect(
      screen.getByRole("button", { name: "⏳ Looking up…" }),
    ).toBeDisabled();
  });
});
