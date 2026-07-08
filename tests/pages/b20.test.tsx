import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import B20Page from "@/app/b20/page";
import { B20Providers } from "@/app/b20/providers";
import { useB20Scan } from "@/lib/hooks/useB20";
import { b20ScanResultFixture } from "../fixtures/b20";

vi.mock("@/lib/hooks/useB20", () => ({ useB20Scan: vi.fn() }));
const useB20ScanMock = vi.mocked(useB20Scan);

type ScanState = ReturnType<typeof useB20Scan>;

function mockScan(overrides: Partial<ScanState> = {}) {
  useB20ScanMock.mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
    error: null,
    data: undefined,
    ...overrides,
  } as unknown as ScanState);
}

beforeEach(() => {
  vi.clearAllMocks();
  mockScan();
});

describe("B20Page (7.2c wired)", () => {
  it("renders the heading and the scan form", () => {
    render(<B20Page />);
    expect(
      screen.getByRole("heading", { name: /B20 Trust Score/ }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/token address/i)).toBeInTheDocument();
  });

  it("has no leftover placeholder testids", () => {
    render(<B20Page />);
    expect(
      screen.queryByTestId("b20-scanform-placeholder"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("b20-scanresult-placeholder"),
    ).not.toBeInTheDocument();
  });

  it("does not render results until a scan has data", () => {
    render(<B20Page />);
    expect(screen.queryByTestId("layer-1")).not.toBeInTheDocument();
  });

  it("renders ScanResult once the scan returns data", () => {
    mockScan({ data: b20ScanResultFixture });
    render(<B20Page />);
    expect(screen.getByTestId("layer-1")).toBeInTheDocument();
    expect(screen.getByText("72")).toBeInTheDocument();
  });

  it("wires the form submit to the scan mutation ({address})", async () => {
    const mutate = vi.fn();
    mockScan({ mutate });
    const user = userEvent.setup();
    render(<B20Page />);

    const addr = "0x1111111111111111111111111111111111111111";
    await user.type(screen.getByLabelText(/token address/i), addr);
    await user.click(screen.getByRole("button", { name: /scan/i }));

    expect(mutate).toHaveBeenCalledWith({ address: addr });
  });

  it("does not render any wallet-connect UI (read-only page)", () => {
    render(<B20Page />);
    expect(screen.queryByText(/Connect Wallet/i)).not.toBeInTheDocument();
  });
});

describe("B20Providers", () => {
  it("mounts the WagmiProvider (inside a QueryClient) without crashing", () => {
    const client = new QueryClient();
    render(
      <QueryClientProvider client={client}>
        <B20Providers>
          <div data-testid="b20-child">ok</div>
        </B20Providers>
      </QueryClientProvider>,
    );
    expect(screen.getByTestId("b20-child")).toBeInTheDocument();
  });
});
