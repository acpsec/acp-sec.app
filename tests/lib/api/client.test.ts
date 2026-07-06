import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { fetchApi } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";

// Fixed config so tests don't depend on env. SCANNER_TOKEN is set here so we can
// verify the token is attached ONLY to scanner/onchain paths.
vi.mock("@/lib/api/config", () => ({
  API_BASE_URL: "http://api.test",
  SCANNER_TOKEN: "sekret",
}));

type MockOpts = { status?: number; json?: unknown; contentType?: string };

function mockResponse({
  status = 200,
  json = {},
  contentType = "application/json",
}: MockOpts): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: `Status ${status}`,
    headers: { get: (k: string) => (k.toLowerCase() === "content-type" ? contentType : null) },
    json: async () => json,
  } as unknown as Response;
}

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

/** Read the RequestInit passed to fetch on the Nth call. */
function initOf(call = 0): RequestInit {
  return fetchMock.mock.calls[call]![1] as RequestInit;
}
function headerOf(name: string, call = 0): string | null {
  return (initOf(call).headers as Headers).get(name);
}

describe("fetchApi", () => {
  it("returns parsed JSON on 2xx and hits API_BASE_URL + path", async () => {
    fetchMock.mockResolvedValue(mockResponse({ json: { ok: true, service: "x" } }));
    const data = await fetchApi<{ ok: boolean; service: string }>("/api/health");
    expect(data).toEqual({ ok: true, service: "x" });
    expect(fetchMock.mock.calls[0]![0]).toBe("http://api.test/api/health");
  });

  it("always sends credentials: 'include'", async () => {
    fetchMock.mockResolvedValue(mockResponse({ json: {} }));
    await fetchApi("/api/health");
    expect(initOf().credentials).toBe("include");
  });

  it("throws ApiError with status + parsed body on 4xx", async () => {
    fetchMock.mockResolvedValue(
      mockResponse({ status: 422, json: { ok: false, error: "'wallet' is required" } }),
    );
    await expect(fetchApi("/api/onchain/check")).rejects.toMatchObject({
      name: "ApiError",
      status: 422,
      message: "'wallet' is required",
      body: { ok: false, error: "'wallet' is required" },
    });
  });

  it("throws ApiError on 5xx", async () => {
    fetchMock.mockResolvedValue(
      mockResponse({ status: 500, json: { ok: false, error: "boom" } }),
    );
    await expect(fetchApi("/api/score")).rejects.toBeInstanceOf(ApiError);
    await expect(fetchApi("/api/score")).rejects.toMatchObject({ status: 500 });
  });

  it("non-JSON error → ApiError with null body + statusText message", async () => {
    fetchMock.mockResolvedValue(
      mockResponse({ status: 503, json: undefined, contentType: "text/plain" }),
    );
    await expect(fetchApi("/api/health")).rejects.toMatchObject({
      status: 503,
      body: null,
      message: "Status 503",
    });
  });

  it("network failure → ApiError with status 0", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(fetchApi("/api/health")).rejects.toMatchObject({
      name: "ApiError",
      status: 0,
      message: "Network error",
    });
  });

  it("adds X-Scanner-Token for /api/scanner/* and /api/onchain/*", async () => {
    fetchMock.mockResolvedValue(mockResponse({ json: {} }));
    await fetchApi("/api/scanner/lookup", { method: "POST", body: "{}" });
    expect(headerOf("X-Scanner-Token")).toBe("sekret");

    fetchMock.mockClear();
    fetchMock.mockResolvedValue(mockResponse({ json: {} }));
    await fetchApi("/api/onchain/check", { method: "POST", body: "{}" });
    expect(headerOf("X-Scanner-Token")).toBe("sekret");
  });

  it("does NOT add X-Scanner-Token for other paths (even when token is set)", async () => {
    fetchMock.mockResolvedValue(mockResponse({ json: {} }));
    await fetchApi("/api/health");
    expect(headerOf("X-Scanner-Token")).toBeNull();

    fetchMock.mockClear();
    fetchMock.mockResolvedValue(mockResponse({ json: {} }));
    await fetchApi("/api/leaderboard");
    expect(headerOf("X-Scanner-Token")).toBeNull();
  });

  it("sets Content-Type: application/json when a body is present", async () => {
    fetchMock.mockResolvedValue(mockResponse({ json: {} }));
    await fetchApi("/api/score", { method: "POST", body: JSON.stringify({ a: 1 }) });
    expect(headerOf("Content-Type")).toBe("application/json");
  });

  it("does not set Content-Type on a bodyless GET", async () => {
    fetchMock.mockResolvedValue(mockResponse({ json: {} }));
    await fetchApi("/api/health");
    expect(headerOf("Content-Type")).toBeNull();
  });
});
