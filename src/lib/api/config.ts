/**
 * API client configuration, read from NEXT_PUBLIC_* env vars (inlined by Next
 * at build time). See .env.local.example.
 */

// Base URL of the FastAPI backend. Falls back to the local-dev port so builds
// and tests work without a .env.local. Production MUST set NEXT_PUBLIC_API_URL
// (it is baked in at build time — a missing value silently uses the fallback).
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001";

if (
  process.env.NODE_ENV !== "production" &&
  !process.env.NEXT_PUBLIC_API_URL &&
  typeof console !== "undefined"
) {
  // Dev-only nudge; never throws (throwing here would break the build/tests).
  console.warn(
    "[api] NEXT_PUBLIC_API_URL not set — falling back to http://localhost:8001",
  );
}

// Scanner/onchain auth token. Undefined unless the backend has SCANNER_TOKEN
// and the frontend is configured with a matching NEXT_PUBLIC_SCANNER_TOKEN.
export const SCANNER_TOKEN: string | undefined =
  process.env.NEXT_PUBLIC_SCANNER_TOKEN;
