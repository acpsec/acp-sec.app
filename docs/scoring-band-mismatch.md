# Scoring band mismatch — resolution

## Background

The backend carries **two distinct band schemes** (see the acp-sec repo,
`docs/api-parity-matrix.md` and the Task 3.3 audit):

- `acpsec_api/scoring.py` — a **5-band verdict** (`SECURE`/`HARDENED`/
  `VULNERABLE`/`CRITICAL`/`COMPROMISED` at 90/70/50/30/0), used for a score
  object's `verdict` string.
- `acpsec_api/leaderboard_store.py` — a **6-band tier** (`EXEMPLARY`/`SECURE`/
  `HARDENED`/`VULNERABLE`/`CRITICAL`/`COMPROMISED` at 90/70/50/30/10/0), stored
  as each agent's `tier` field. The HTML lama leaderboard displays this tier.

There are **no A–F letter grades anywhere** in the backend or the HTML lama.

## Frontend resolution (Task 3.3, confirmed with the user)

`src/lib/scoring.ts` is the single, tested source of truth. It implements the
**6-band tier** scheme (`scoreToTier` / `tierToColorClass`), matching
`leaderboard_store.py` and the lama's `bandForPct` exactly — including the
`critical` `#FF6B00` color token. A–F grades were explicitly **not** adopted.

## Leaderboard page (Task 5.2)

The leaderboard resolves the display as follows:

- The tier is **computed from `agent.score`** via `scoreToTier()` — the single
  source — and rendered by `components/leaderboard/TierBadge.tsx`.
- The backend's raw `agent.tier` field is **ignored** (it is `null` for unscored
  reference entries like SentryAgent, and is legacy). "Deriving, not trusting"
  is what "omit the legacy tier field" means here.
- A `null`/`undefined` score renders as a neutral `—` (unscored), **not** the
  misleading `COMPROMISED` tier — so null-score seeded data renders cleanly.

This closes the **frontend** side of the mismatch: display is consistent and
derived from one tested function.

## Deferred: backend tier unification

The backend API still returns the legacy `tier` field (unchanged, for Flask
parity). Unifying the backend's two band schemes is a **post-migration cleanup
task** and is intentionally out of scope for the frontend port. Backend is
UNTOUCHED by Task 5.2.
