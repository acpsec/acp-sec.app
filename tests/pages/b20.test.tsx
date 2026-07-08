import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import B20Page from "@/app/b20/page";
import { B20Providers } from "@/app/b20/providers";

describe("B20Page (7.2a shell)", () => {
  it("renders the page heading + description", () => {
    render(<B20Page />);
    expect(
      screen.getByRole("heading", { name: /B20 Trust Score/ }),
    ).toBeInTheDocument();
  });

  it("shows the ScanForm + ScanResult placeholders (7.2c)", () => {
    render(<B20Page />);
    expect(
      screen.getByTestId("b20-scanform-placeholder"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("b20-scanresult-placeholder"),
    ).toBeInTheDocument();
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
