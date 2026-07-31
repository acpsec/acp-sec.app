import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import B20Page from "@/app/b20/page";
import { B20Providers } from "@/app/b20/providers";
import { scanB20 } from "@/lib/api/b20";
import { b20ErrorMessage } from "@/components/b20/ScanForm";
import type { B20ErrorCode } from "@/lib/api/types";
import { b20ApiError, b20ScanResultFixture } from "../fixtures/b20";

// Mock ONLY the fetcher — useB20Scan, the QueryClient and Wagmi are all real,
// so this exercises the true wiring across page → form → hook → result. Keep the
// module's other exports real (e.g. B20_DEFAULT_CHAIN_ID, used by ScanForm).
vi.mock("@/lib/api/b20", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/api/b20")>()),
  scanB20: vi.fn(),
}));
const scanB20Mock = vi.mocked(scanB20);

const ADDR = "0x1111111111111111111111111111111111111111";

/** Mount the real page in the real provider stack (QueryClient → Wagmi). */
function renderPage() {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <B20Providers>
        <B20Page />
      </B20Providers>
    </QueryClientProvider>,
  );
}

async function submit(address: string) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/token address/i), address);
  await user.click(screen.getByRole("button", { name: /scan/i }));
  return user;
}

beforeEach(() => vi.clearAllMocks());

describe("b20 scan flow", () => {
  it("starts with the form and no result or error", () => {
    renderPage();
    expect(screen.getByLabelText(/token address/i)).toBeInTheDocument();
    expect(screen.queryByTestId("layer-1")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("valid submit → pending → renders all three layers on success", async () => {
    // Deferred resolve so the pending phase is observable.
    let resolve!: (v: typeof b20ScanResultFixture) => void;
    scanB20Mock.mockReturnValue(
      new Promise((r) => {
        resolve = r;
      }),
    );

    renderPage();
    const user = await submit(ADDR);
    // RQ v5 passes a mutation context as a 2nd arg; assert the variables only.
    expect(scanB20Mock.mock.calls[0]![0]).toEqual({ address: ADDR, chain_id: 84532 });

    // Pending: submit disabled with the scanning label.
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /scanning/i })).toBeDisabled(),
    );

    resolve(b20ScanResultFixture);

    // Layer 1 renders inline; expand the two collapsibles for layers 2 + 3.
    await waitFor(() => expect(screen.getByTestId("layer-1")).toBeInTheDocument());
    expect(screen.getByText(String(b20ScanResultFixture.trust_score))).toBeInTheDocument();
    expect(screen.getByLabelText(`Grade ${b20ScanResultFixture.grade}`)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Dimension Breakdown/ }));
    await user.click(screen.getByRole("button", { name: /View Raw JSON/ }));
    expect(screen.getByTestId("layer-2")).toBeInTheDocument();
    expect(screen.getByTestId("layer-3")).toBeInTheDocument();
  });

  it("invalid submit is blocked client-side — scanB20 is never called", async () => {
    renderPage();
    await submit("0x123"); // too short — fails the 0x-40-hex gate
    expect(scanB20Mock).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.queryByTestId("layer-1")).not.toBeInTheDocument();
  });

  it.each<B20ErrorCode>([
    "invalid_address",
    "unsupported_chain",
    "not_b20",
    "rpc_unreachable",
  ])("surfaces the mapped human copy for %s", async (code) => {
    const err = b20ApiError(code);
    scanB20Mock.mockRejectedValue(err);

    renderPage();
    await submit(ADDR);

    const alert = await screen.findByRole("alert");
    // The alert must carry the mapping's copy — proving error → page → ScanForm
    // → b20ErrorMessage wiring — not the raw code.
    expect(within(alert).queryByText(code)).not.toBeInTheDocument();
    expect(alert).toHaveTextContent(b20ErrorMessage(err));
    expect(screen.queryByTestId("layer-1")).not.toBeInTheDocument();
  });
});
