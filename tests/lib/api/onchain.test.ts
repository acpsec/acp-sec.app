import { describe, expect, it, vi } from "vitest";

import { fetchApi } from "@/lib/api/client";
import { onchainCheck } from "@/lib/api/onchain";

vi.mock("@/lib/api/client", () => ({ fetchApi: vi.fn() }));
const fetchApiMock = vi.mocked(fetchApi);

describe("onchainCheck", () => {
  it("POSTs {wallet} to /api/onchain/check", async () => {
    fetchApiMock.mockResolvedValue({ ok: true, data: { registered: false } });
    await onchainCheck("0xabc");
    expect(fetchApiMock).toHaveBeenCalledWith("/api/onchain/check", {
      method: "POST",
      body: JSON.stringify({ wallet: "0xabc" }),
    });
  });

  it("propagates errors", async () => {
    fetchApiMock.mockRejectedValue(new Error("boom"));
    await expect(onchainCheck("0xabc")).rejects.toThrow("boom");
  });
});
