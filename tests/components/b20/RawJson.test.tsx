import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RawJson } from "@/components/b20/RawJson";
import { b20ScanResultFixture } from "../../fixtures/b20";

describe("RawJson", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("is collapsed by default (no JSON payload shown)", () => {
    render(<RawJson result={b20ScanResultFixture} />);
    expect(screen.queryByTestId("layer-3")).not.toBeInTheDocument();
  });

  it("expands to show the full pretty-printed payload", async () => {
    const user = userEvent.setup();
    render(<RawJson result={b20ScanResultFixture} />);
    await user.click(screen.getByRole("button", { name: /View Raw JSON/ }));
    const pre = screen.getByTestId("layer-3");
    expect(pre).toHaveTextContent(b20ScanResultFixture.token);
    expect(pre).toHaveTextContent("issuer_authority");
  });

  it("copies the JSON to the clipboard when Copy is clicked", async () => {
    // userEvent.setup() installs a clipboard stub on navigator; spy on it (the
    // property is getter-only, so it can't be reassigned).
    const user = userEvent.setup();
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);

    render(<RawJson result={b20ScanResultFixture} />);
    await user.click(screen.getByRole("button", { name: /View Raw JSON/ }));
    await user.click(screen.getByRole("button", { name: "Copy" }));

    expect(writeText).toHaveBeenCalledOnce();
    expect(writeText).toHaveBeenCalledWith(
      JSON.stringify(b20ScanResultFixture, null, 2),
    );
  });
});
