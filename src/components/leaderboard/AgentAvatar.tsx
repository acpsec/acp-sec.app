"use client";

import { useState } from "react";

/**
 * Agent avatar via unavatar.io (X/Twitter handle), with a 🤖 fallback on error
 * or missing handle. Mirrors the HTML lama's _avatarHtml behaviour.
 */
export function AgentAvatar({ handle }: { handle: string | null | undefined }) {
  const clean = (handle ?? "").replace(/^@/, "").trim();
  const [errored, setErrored] = useState(false);

  if (!clean || errored) {
    return (
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-hover text-sm">
        🤖
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- external avatar service, not a static asset
    <img
      src={`https://unavatar.io/twitter/${encodeURIComponent(clean)}?fallback=false`}
      alt=""
      className="size-8 shrink-0 rounded-full object-cover"
      onError={() => setErrored(true)}
    />
  );
}
