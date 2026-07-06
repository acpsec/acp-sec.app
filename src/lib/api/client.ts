import { API_BASE_URL, SCANNER_TOKEN } from "./config";
import { ApiError } from "./errors";
import type { ApiErrorBody } from "./types";

// Endpoints gated by the SSRF scanner token. The token is attached ONLY to
// these path prefixes — never to every request.
const SCANNER_TOKEN_PREFIXES = ["/api/scanner/", "/api/onchain/"] as const;

function needsScannerToken(path: string): boolean {
  return SCANNER_TOKEN_PREFIXES.some((prefix) => path.startsWith(prefix));
}

function isJsonResponse(resp: Response): boolean {
  return (resp.headers.get("content-type") ?? "")
    .toLowerCase()
    .includes("application/json");
}

/**
 * Generic typed fetcher for the acpsec_api backend.
 *
 * - Prefixes `path` with API_BASE_URL.
 * - Sends `credentials: "include"` always (lb_session cookie flow).
 * - Sets `Content-Type: application/json` when a body is present.
 * - Adds `X-Scanner-Token` only for /api/scanner/* and /api/onchain/* (when the
 *   token is configured).
 * - 2xx → parsed JSON as `T` (or `undefined` for empty/non-JSON success).
 * - non-2xx → throws `ApiError(status, body)`.
 * - network failure → throws `ApiError(0, null, "Network error")`.
 */
export async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);

  if (init?.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (SCANNER_TOKEN && needsScannerToken(path)) {
    headers.set("X-Scanner-Token", SCANNER_TOKEN);
  }

  let resp: Response;
  try {
    resp = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
      credentials: "include",
    });
  } catch {
    // No HTTP response — DNS/CORS/offline. status 0 distinguishes it.
    throw new ApiError(0, null, "Network error");
  }

  if (!resp.ok) {
    let body: ApiErrorBody | null = null;
    if (isJsonResponse(resp)) {
      try {
        body = (await resp.json()) as ApiErrorBody;
      } catch {
        body = null;
      }
    }
    throw new ApiError(resp.status, body, body?.error ?? resp.statusText);
  }

  // Successful but bodyless/non-JSON (e.g. 204): nothing to parse.
  if (!isJsonResponse(resp)) {
    return undefined as T;
  }
  return (await resp.json()) as T;
}
