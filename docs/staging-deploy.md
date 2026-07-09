# Staging deploy — Vercel (`staging.acpsec.app`)

> **Names and purposes only — never values.** Secret-ish values are entered by
> Fadhlan directly in Vercel (Project → Settings → Environment Variables).

## Origin strategy: split origin (Gate 8.0a = B)

Frontend on Vercel (`staging.acpsec.app`), FastAPI backend on Railway
(`api-staging.acpsec.app`). The browser calls the backend cross-origin with
credentialed fetches + `X-Scanner-Token`; the backend allows the origin via CORS
and issues `SameSite=None; Secure` cookies.

**No `vercel.json` and no `next.config` rewrites are needed.** Rewrites would only
be required for Option A (single-origin proxy), which was not chosen. Vercel
auto-detects the Next.js framework, build (`next build`), and output — nothing to
pin. If a `vercel.json` is ever added, it must **not** introduce `/api/*`
rewrites (that would silently convert us to Option A).

## Required Vercel environment variables

`NEXT_PUBLIC_*` vars are **inlined into the client bundle at build time** — set
them before the build, and treat them as publicly visible.

| Variable | Purpose | Staging value shape | Required? |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the FastAPI backend. Baked in at build time; a missing value silently falls back to `http://localhost:8001`. | the backend origin, e.g. `https://api-staging.acpsec.app` | yes |
| `NEXT_PUBLIC_SCANNER_TOKEN` | Sent as `X-Scanner-Token` on `/api/scanner/*` and `/api/onchain/*` calls. **Must equal** the backend's `SCANNER_TOKEN`. | matches backend `SCANNER_TOKEN` | yes, for gated flows |

**Note on `NEXT_PUBLIC_SCANNER_TOKEN`:** because `NEXT_PUBLIC_*` is inlined into
the client bundle, this token is publicly visible in the shipped JS. That is the
existing design's accepted trade-off — it gates a low-privilege SSRF surface, not
a real secret. Do not place a high-value secret in any `NEXT_PUBLIC_*` var.

## Deploy checklist (executed in Group 8.4, after the Vercel project is linked)

1. Confirm `vercel whoami` + project link (Fadhlan).
2. Set `NEXT_PUBLIC_API_URL` = backend origin and `NEXT_PUBLIC_SCANNER_TOKEN`
   (matches backend) for the staging environment.
3. Deploy; verify the preview URL renders `/`, `/b20`, `/scanner`,
   `/leaderboard`, `/agents/sentryagent`, and the legal pages
   (`/privacy`, `/terms`, `/security`).
4. Attach the `staging.acpsec.app` domain (Group 8.5) and verify TLS.

Backend env inventory (Railway side) lives in the acp-sec repo:
`docs/staging-env-inventory.md`.
