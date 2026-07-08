import { ApiError } from "@/lib/api/errors";
import type { B20ErrorCode, B20ScanResult } from "@/lib/api/types";

/**
 * A realistic `B20ScanResult` fixture, faithful to the live engine
 * (`acpsec_api/b20/`): the five real dimension keys and their 0–1 fractional
 * weights (issuer_authority 0.30, supply_integrity 0.25, transfer_policy 0.20,
 * variant_config 0.15, origin_transparency 0.10 — see b20/constants.py). Shared
 * by the client test and every b20 component test so there is ONE source of truth
 * for the wire shape.
 */
export const b20ScanResultFixture: B20ScanResult = {
  token: "0x1111111111111111111111111111111111111111",
  chain_id: 84532,
  variant: "ASSET",
  name: "Example B20",
  symbol: "EXM",
  decimals: 18,
  currency_code: null,
  trust_score: 72,
  raw_score: 78,
  grade: "B",
  rated: true,
  multiplier: 1.0,
  unrated_dimensions: [],
  is_critical: false,
  critical_reasons: [],
  dimensions: {
    issuer_authority: {
      score: 60,
      weight: 0.3,
      findings: [{ severity: "High", detail: "Admin can pause transfers." }],
    },
    supply_integrity: {
      score: 85,
      weight: 0.25,
      findings: [],
    },
    transfer_policy: {
      score: 40,
      weight: 0.2,
      findings: [
        { severity: "CRITICAL", detail: "Issuer can freeze holder balances." },
      ],
    },
    variant_config: {
      score: 90,
      weight: 0.15,
      findings: [],
    },
    origin_transparency: {
      score: 55,
      weight: 0.1,
      findings: [
        { severity: "Medium", detail: "Issuer entity not publicly verified." },
        { severity: "Low", detail: "No public documentation link found." },
      ],
    },
  },
  issuer_powers: {
    can_freeze: false,
    can_seize: null,
    can_pause: true,
    can_mint_unbounded: false,
    supply_cap: "1000000",
    admin_addresses: ["0x2222222222222222222222222222222222222222"],
    admin_is_multisig: true,
    mint_role_holders: [],
    pause_role_holders: ["0x2222222222222222222222222222222222222222"],
  },
  deployed_via_factory: null,
  scanner_version: "0.1.0",
  scanned_at: "2026-07-08T00:00:00Z",
};

/** HTTP status the backend pairs with each error code (b20-endpoint-schema.md). */
const B20_ERROR_STATUS: Record<B20ErrorCode, number> = {
  invalid_address: 400,
  unsupported_chain: 400,
  not_b20: 400,
  rpc_unreachable: 503,
};

/**
 * An `ApiError` shaped exactly like a failed `POST /api/b20/scan` — a bare
 * `{error, detail}` body with the code on `.body.error`. One factory keeps the
 * error fixtures DRY across the flow test (never construct these inline).
 */
export function b20ApiError(code: B20ErrorCode): ApiError {
  return new ApiError(
    B20_ERROR_STATUS[code],
    { error: code, detail: `${code} (fixture detail)` },
    code,
  );
}
