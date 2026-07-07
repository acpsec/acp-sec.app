import { describe, expect, it, vi } from "vitest";

import { fetchApi } from "@/lib/api/client";
import { scannerBulk, scannerLookup, scannerScan } from "@/lib/api/scanner";

vi.mock("@/lib/api/client", () => ({ fetchApi: vi.fn() }));
const fetchApiMock = vi.mocked(fetchApi);

describe("scannerLookup", () => {
  it("POSTs {username} to /api/scanner/lookup", async () => {
    fetchApiMock.mockResolvedValue({ ok: true, data: {} });
    await scannerLookup("@agentx");
    expect(fetchApiMock).toHaveBeenCalledWith("/api/scanner/lookup", {
      method: "POST",
      body: JSON.stringify({ username: "@agentx" }),
    });
  });

  it("propagates errors", async () => {
    fetchApiMock.mockRejectedValue(new Error("boom"));
    await expect(scannerLookup("x")).rejects.toThrow("boom");
  });
});

describe("scannerScan", () => {
  it("POSTs the scan payload to /api/scanner/scan", async () => {
    fetchApiMock.mockResolvedValue({ ok: true, data: {} });
    const payload = { url: "https://x.example", scan_mode: "root" as const };
    await scannerScan(payload);
    expect(fetchApiMock).toHaveBeenCalledWith("/api/scanner/scan", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  });
});

describe("scannerBulk", () => {
  it("POSTs {usernames} to /api/scanner/bulk", async () => {
    fetchApiMock.mockResolvedValue({ ok: true, count: 0, results: [] });
    await scannerBulk({ usernames: ["a", "b"], scan_mode: "root" });
    expect(fetchApiMock).toHaveBeenCalledWith("/api/scanner/bulk", {
      method: "POST",
      body: JSON.stringify({ usernames: ["a", "b"], scan_mode: "root" }),
    });
  });
});
