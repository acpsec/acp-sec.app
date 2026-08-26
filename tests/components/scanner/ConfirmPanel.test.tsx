import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ConfirmPanel } from "@/components/scanner/ConfirmPanel";
import type { ScannerLookupResponse, ScannerProfile } from "@/lib/api/types";
import { useScannerStore } from "@/lib/stores/scannerStore";

const LOOKUP: ScannerLookupResponse = {
  ok: true,
  data: {
    username: "aixbt_agent",
    display_name: "aixbt",
    bio: "an onchain agent",
    website: "https://aixbt.tech",
    avatar_url: "",
    source: "nitter",
  },
};

beforeEach(() => useScannerStore.getState().reset());

function renderPanel(scanning = false) {
  const onScan = vi.fn();
  const onBack = vi.fn();
  useScannerStore.getState().beginConfirm(LOOKUP);
  render(<ConfirmPanel onScan={onScan} onBack={onBack} scanning={scanning} />);
  return { onScan, onBack };
}

describe("ConfirmPanel", () => {
  it("renders the scraped profile preview", () => {
    renderPanel();
    expect(screen.getByText("aixbt")).toBeInTheDocument();
    expect(screen.getByText("@aixbt_agent")).toBeInTheDocument();
    expect(screen.getByText("an onchain agent")).toBeInTheDocument();
  });

  it("seeds and edits the agent name into the store", () => {
    renderPanel();
    const input = screen.getByLabelText("Agent Name") as HTMLInputElement;
    expect(input.value).toBe("aixbt");
    fireEvent.change(input, { target: { value: "Custom Name" } });
    expect(useScannerStore.getState().agentName).toBe("Custom Name");
  });

  it("edits the URL into the store", () => {
    renderPanel();
    const input = screen.getByLabelText("Website URL to Scan");
    fireEvent.change(input, { target: { value: "https://x.io/docs" } });
    expect(useScannerStore.getState().url).toBe("https://x.io/docs");
  });

  it("shows the root/exact control only when the URL has a sub-path", () => {
    renderPanel();
    // seeded URL "https://aixbt.tech" has no sub-path → control hidden
    expect(
      screen.queryByRole("radio", { name: /Root domain/ }),
    ).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Website URL to Scan"), {
      target: { value: "https://aixbt.tech/docs" },
    });
    expect(
      screen.getByRole("radio", { name: /Root domain/ }),
    ).toBeInTheDocument();
  });

  it("fires onScan and onBack", () => {
    const { onScan, onBack } = renderPanel();
    fireEvent.click(screen.getByRole("button", { name: "🔬 Scan Agent" }));
    fireEvent.click(screen.getByRole("button", { name: "← Change username" }));
    expect(onScan).toHaveBeenCalledOnce();
    expect(onBack).toHaveBeenCalledOnce();
  });

  it("shows the blocking progress + disables Scan while scanning", () => {
    renderPanel(true);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "⏳ Scanning…" })).toBeDisabled();
  });
});

// ---------------------------------------------------------------------------
// Avatar rendering
// ---------------------------------------------------------------------------
// Rule: absence-of-avatar must NEVER render a generic robot icon.
// When no avatar is available (avatar_display_url null, or avatar_url empty),
// show a distinct "avatar-unavailable" placeholder + optional reason text.
// When a URL is present, render <img> exactly as before (both-shapes guard).
// ---------------------------------------------------------------------------

function lookup(profile: ScannerProfile): ScannerLookupResponse {
  return { ok: true, data: profile };
}

function renderAvatar(profile: ScannerProfile) {
  useScannerStore.getState().reset();
  useScannerStore.getState().beginConfirm(lookup(profile));
  render(
    <ConfirmPanel onScan={vi.fn()} onBack={vi.fn()} scanning={false} />,
  );
}

// @grok live example: Nitter down, avatar_display_url null, reason surfaced
const GROK: ScannerProfile = {
  username: "grok",
  display_name: "Grok",
  bio: "AI assistant by xAI",
  website: "",
  avatar_url: "",
  avatar_display_url: null,
  avatar_source_reason:
    "Nitter unavailable and unavatar returned no image",
  source: "failed",
  error: "Could not reach any Nitter instance.",
};

// Normal scan — Nitter succeeded, avatar URL present in both fields
const WITH_AVATAR: ScannerProfile = {
  username: "aixbt_agent",
  display_name: "aixbt",
  bio: "an onchain agent",
  website: "https://aixbt.tech",
  avatar_url: "https://nitter.poast.org/pic/profile_images/aixbt.jpg",
  avatar_display_url: "https://nitter.poast.org/pic/profile_images/aixbt.jpg",
  source: "nitter",
};

// Old backend shape — avatar_display_url absent, avatar_url populated
const OLD_WITH_AVATAR: ScannerProfile = {
  username: "agentx",
  display_name: "Agent X",
  bio: "",
  website: "",
  avatar_url: "https://pbs.twimg.com/profile_images/agentx.jpg",
  source: "nitter",
};

// Old backend shape — avatar_display_url absent, avatar_url empty (Nitter failed)
const OLD_NO_AVATAR: ScannerProfile = {
  username: "agenty",
  display_name: "Agent Y",
  bio: "",
  website: "",
  avatar_url: "",
  source: "failed",
  error: "Could not reach any Nitter instance.",
};

// @grok live example: Nitter down, unavatar fallback SUCCEEDED — url resolves, reason present
const UNAVATAR_FALLBACK_SUCCEEDED: ScannerProfile = {
  username: "grok",
  display_name: "Grok",
  bio: "AI assistant by xAI",
  website: "",
  avatar_url: "",
  avatar_display_url: "https://unavatar.io/twitter/grok",
  avatar_source_reason: "Nitter unavailable, used unavatar",
  source: "unavatar",
};

describe("avatar rendering", () => {
  it("shows avatar-unavailable placeholder when avatar_display_url is null", () => {
    renderAvatar(GROK);
    expect(screen.getByTestId("avatar-unavailable")).toBeInTheDocument();
  });

  it("never renders the robot icon when avatar is unavailable", () => {
    renderAvatar(GROK);
    expect(screen.queryByText("🤖")).not.toBeInTheDocument();
  });

  it("shows avatar_source_reason beneath the placeholder", () => {
    renderAvatar(GROK);
    expect(screen.getByTestId("avatar-reason")).toHaveTextContent(
      "Nitter unavailable and unavatar returned no image",
    );
  });

  it("renders <img> with correct src when avatar_display_url is a URL", () => {
    renderAvatar(WITH_AVATAR);
    const img = screen.getByRole("img", { name: /avatar/i });
    expect(img).toHaveAttribute(
      "src",
      "https://nitter.poast.org/pic/profile_images/aixbt.jpg",
    );
  });

  it("does not show avatar-unavailable when avatar is present", () => {
    renderAvatar(WITH_AVATAR);
    expect(screen.queryByTestId("avatar-unavailable")).not.toBeInTheDocument();
  });

  it("old shape: renders <img> from avatar_url when avatar_display_url is absent", () => {
    renderAvatar(OLD_WITH_AVATAR);
    const img = screen.getByRole("img", { name: /avatar/i });
    expect(img).toHaveAttribute(
      "src",
      "https://pbs.twimg.com/profile_images/agentx.jpg",
    );
  });

  it("old shape: shows placeholder (not robot) when avatar_url is empty", () => {
    renderAvatar(OLD_NO_AVATAR);
    expect(screen.getByTestId("avatar-unavailable")).toBeInTheDocument();
    expect(screen.queryByText("🤖")).not.toBeInTheDocument();
  });

  it("does not render avatar-reason when avatar_source_reason is absent", () => {
    renderAvatar(OLD_NO_AVATAR);
    expect(screen.queryByTestId("avatar-reason")).not.toBeInTheDocument();
  });

  it("renders <img> with correct src when unavatar fallback resolved a URL", () => {
    renderAvatar(UNAVATAR_FALLBACK_SUCCEEDED);
    const img = screen.getByRole("img", { name: /avatar/i });
    expect(img).toHaveAttribute("src", "https://unavatar.io/twitter/grok");
  });

  it("does not show avatar-reason when avatar loaded via fallback (url resolved, reason present)", () => {
    renderAvatar(UNAVATAR_FALLBACK_SUCCEEDED);
    expect(screen.queryByTestId("avatar-reason")).not.toBeInTheDocument();
  });
});
