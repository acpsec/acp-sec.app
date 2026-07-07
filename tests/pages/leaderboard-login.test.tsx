import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/lib/api/errors";
import { useLeaderboardAuth } from "@/lib/hooks/useLeaderboardAuth";
import LeaderboardLoginPage from "@/app/leaderboard/login/page";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("@/lib/hooks/useLeaderboardAuth", () => ({
  useLeaderboardAuth: vi.fn(),
}));
const useLeaderboardAuthMock = vi.mocked(useLeaderboardAuth);

type MutateFn = ReturnType<typeof useLeaderboardAuth>["mutate"];

function setupHook(over: { isPending?: boolean; mutate?: MutateFn } = {}) {
  const mutate = over.mutate ?? (vi.fn() as unknown as MutateFn);
  useLeaderboardAuthMock.mockReturnValue({
    mutate,
    isPending: over.isPending ?? false,
  } as ReturnType<typeof useLeaderboardAuth>);
  return { mutate };
}

beforeEach(() => {
  push.mockClear();
  useLeaderboardAuthMock.mockReset();
});

describe("Leaderboard login page", () => {
  it("renders the form with lama's exact microcopy", () => {
    setupHook();
    render(<LeaderboardLoginPage />);
    expect(
      screen.getByRole("heading", { name: "Leaderboard Access" }),
    ).toBeInTheDocument();
    expect(screen.getByText("This leaderboard is restricted.")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Access Leaderboard" }),
    ).toBeInTheDocument();
  });

  it("blocks empty submit with a guard message and does not call the mutation", async () => {
    const { mutate } = setupHook();
    render(<LeaderboardLoginPage />);
    await userEvent.click(screen.getByRole("button", { name: "Access Leaderboard" }));
    expect(screen.getByText("Please enter a password.")).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  it("submits the typed password to the mutation", async () => {
    const { mutate } = setupHook();
    render(<LeaderboardLoginPage />);
    await userEvent.type(screen.getByPlaceholderText("Enter password"), "s3cret");
    await userEvent.click(screen.getByRole("button", { name: "Access Leaderboard" }));
    expect(vi.mocked(mutate).mock.calls[0]?.[0]).toBe("s3cret");
  });

  it("shows the loading label + disables the button while pending", () => {
    setupHook({ isPending: true });
    render(<LeaderboardLoginPage />);
    const btn = screen.getByRole("button", { name: "Verifying…" });
    expect(btn).toBeDisabled();
  });

  it("shows the inline 401 error and clears the password", async () => {
    const mutate = vi.fn((_pw, opts) =>
      opts?.onError?.(new ApiError(401, { ok: false, error: "Incorrect password" })),
    ) as unknown as MutateFn;
    setupHook({ mutate });
    render(<LeaderboardLoginPage />);
    const input = screen.getByPlaceholderText<HTMLInputElement>("Enter password");
    await userEvent.type(input, "wrong");
    await userEvent.click(screen.getByRole("button", { name: "Access Leaderboard" }));

    expect(
      screen.getByText("Incorrect password. Please try again."),
    ).toBeInTheDocument();
    expect(input.value).toBe("");
    expect(push).not.toHaveBeenCalled();
  });

  it("redirects to /leaderboard on success", async () => {
    const mutate = vi.fn((_pw, opts) =>
      opts?.onSuccess?.({ ok: true }, _pw, undefined),
    ) as unknown as MutateFn;
    setupHook({ mutate });
    render(<LeaderboardLoginPage />);
    await userEvent.type(screen.getByPlaceholderText("Enter password"), "test");
    await userEvent.click(screen.getByRole("button", { name: "Access Leaderboard" }));
    expect(push).toHaveBeenCalledWith("/leaderboard");
  });
});
