import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  B20_ADDRESS_RE,
  ScanForm,
  b20ErrorMessage,
} from "@/components/b20/ScanForm";
import { ApiError } from "@/lib/api/errors";

const VALID = "0x1111111111111111111111111111111111111111";

describe("B20_ADDRESS_RE", () => {
  it("accepts a 0x + 40-hex address (matches the backend regex)", () => {
    expect(B20_ADDRESS_RE.test(VALID)).toBe(true);
    expect(B20_ADDRESS_RE.test("0xABCDEF0123456789abcdef0123456789ABCDEF01")).toBe(
      true,
    );
  });

  it("rejects short, long, and non-hex inputs", () => {
    expect(B20_ADDRESS_RE.test("0x123")).toBe(false);
    expect(B20_ADDRESS_RE.test(VALID + "00")).toBe(false);
    expect(B20_ADDRESS_RE.test("0xZZ11111111111111111111111111111111111111")).toBe(
      false,
    );
    expect(B20_ADDRESS_RE.test("")).toBe(false);
  });
});

describe("b20ErrorMessage", () => {
  it("maps each B20ErrorCode to human-readable copy", () => {
    const codes = [
      "invalid_address",
      "unsupported_chain",
      "not_b20",
      "rpc_unreachable",
    ] as const;
    for (const code of codes) {
      const msg = b20ErrorMessage(
        new ApiError(400, { error: code, detail: "x" }, code),
      );
      expect(msg).toBeTruthy();
      expect(msg).not.toBe(code); // not the raw code
    }
    expect(
      b20ErrorMessage(new ApiError(400, { error: "not_b20", detail: "" }, "not_b20")),
    ).toMatch(/B20 token/i);
  });

  it("has a network-specific message for status 0", () => {
    expect(b20ErrorMessage(new ApiError(0, null, "Network error"))).toMatch(
      /connection|reach/i,
    );
  });

  it("falls back for a non-ApiError / unknown error", () => {
    expect(b20ErrorMessage(new Error("boom"))).toMatch(/failed|try again/i);
  });
});

describe("ScanForm", () => {
  it("calls onScan with the address for a valid submit", async () => {
    const onScan = vi.fn();
    const user = userEvent.setup();
    render(<ScanForm onScan={onScan} />);

    await user.type(screen.getByLabelText(/token address/i), VALID);
    await user.click(screen.getByRole("button", { name: /scan/i }));

    expect(onScan).toHaveBeenCalledOnce();
    expect(onScan).toHaveBeenCalledWith(VALID);
  });

  it("never calls onScan for malformed input, and shows a validation message", async () => {
    const onScan = vi.fn();
    const user = userEvent.setup();
    render(<ScanForm onScan={onScan} />);

    await user.type(screen.getByLabelText(/token address/i), "0x123");
    await user.click(screen.getByRole("button", { name: /scan/i }));

    expect(onScan).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("disables the submit and shows a pending label while scanning", () => {
    render(<ScanForm onScan={vi.fn()} pending />);
    const btn = screen.getByRole("button", { name: /scanning/i });
    expect(btn).toBeDisabled();
  });

  it("surfaces the typed error code as human-readable copy", () => {
    render(
      <ScanForm
        onScan={vi.fn()}
        error={new ApiError(400, { error: "not_b20", detail: "" }, "not_b20")}
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(/B20 token/i);
  });
});
