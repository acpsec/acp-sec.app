"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";

import { ApiError } from "@/lib/api/errors";
import { useLeaderboardAuth } from "@/lib/hooks/useLeaderboardAuth";

export default function LeaderboardLoginPage() {
  const router = useRouter();
  const auth = useLeaderboardAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!password) {
      setError("Please enter a password.");
      return;
    }
    setError("");
    auth.mutate(password, {
      onSuccess: () => router.push("/leaderboard"),
      onError: (err) => {
        if (err instanceof ApiError && err.status === 401) {
          setError("Incorrect password. Please try again.");
          setPassword(""); // lama clears + refocuses only on a wrong password
          inputRef.current?.focus();
        } else if (err instanceof ApiError && err.status === 0) {
          setError("Network error — check your connection and try again.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      },
    });
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-section">
      <div className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-border bg-surface p-8">
        <span className="mb-6 text-title font-bold text-primary">ACP-SEC</span>

        <h1 className="text-title font-bold tracking-tight">Leaderboard Access</h1>
        <p className="mt-1 mb-7 text-caption text-fg-muted">
          This leaderboard is restricted.
        </p>

        <form onSubmit={onSubmit} className="flex w-full flex-col gap-3.5">
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoComplete="current-password"
            autoFocus
            className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-body text-fg outline-none placeholder:text-fg-subtle focus:border-primary"
          />
          <button
            type="submit"
            disabled={auth.isPending}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-body font-semibold text-fg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {auth.isPending ? "Verifying…" : "Access Leaderboard"}
          </button>
          {error && (
            <div
              role="alert"
              className="rounded-md border border-danger/30 bg-danger/[0.12] px-3 py-2 text-center text-caption text-danger-alt"
            >
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
