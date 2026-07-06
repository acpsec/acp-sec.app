import { describe, expect, it } from "vitest";

import { ApiError } from "@/lib/api/errors";

describe("ApiError", () => {
  it("exposes status + body", () => {
    const body = { ok: false as const, error: "nope", detail: 42 };
    const err = new ApiError(422, body);
    expect(err.status).toBe(422);
    expect(err.body).toBe(body);
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("ApiError");
  });

  it("message falls back through override → body.error → HTTP status", () => {
    expect(new ApiError(400, { ok: false, error: "bad input" }).message).toBe(
      "bad input",
    );
    expect(new ApiError(500, null).message).toBe("HTTP 500");
    expect(
      new ApiError(400, { ok: false, error: "ignored" }, "override").message,
    ).toBe("override");
  });
});
