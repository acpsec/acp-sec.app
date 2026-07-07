import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createScore, createScoreManual, deleteScore } from "@/lib/api/score";
import {
  useCreateScore,
  useCreateScoreManual,
  useDeleteScore,
} from "@/lib/hooks/useScoreMutation";

vi.mock("@/lib/api/score", () => ({
  createScore: vi.fn(),
  createScoreManual: vi.fn(),
  deleteScore: vi.fn(),
}));
const createScoreMock = vi.mocked(createScore);
const createScoreManualMock = vi.mocked(createScoreManual);
const deleteScoreMock = vi.mocked(deleteScore);

function setup() {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  const invalidateSpy = vi
    .spyOn(client, "invalidateQueries")
    .mockResolvedValue(undefined);
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { wrapper, invalidateSpy };
}

beforeEach(() => vi.clearAllMocks());

describe("useCreateScore", () => {
  it("mutates then invalidates ['score']", async () => {
    createScoreMock.mockResolvedValue({ ok: true, data: {} });
    const { wrapper, invalidateSpy } = setup();
    const { result } = renderHook(() => useCreateScore(), { wrapper });

    result.current.mutate({ agent_name: "X" });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // RQ v5 passes (variables, context) to a bare mutationFn — check the first arg.
    expect(createScoreMock.mock.calls[0]?.[0]).toEqual({ agent_name: "X" });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["score"] });
  });
});

describe("useCreateScoreManual", () => {
  it("mutates then invalidates ['score']", async () => {
    createScoreManualMock.mockResolvedValue({ ok: true, data: {} });
    const { wrapper, invalidateSpy } = setup();
    const { result } = renderHook(() => useCreateScoreManual(), { wrapper });

    result.current.mutate({ controls: [{ ctrl: "AUTH-01" }] });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["score"] });
  });
});

describe("useDeleteScore", () => {
  it("mutates then invalidates ['score']", async () => {
    deleteScoreMock.mockResolvedValue({ ok: true });
    const { wrapper, invalidateSpy } = setup();
    const { result } = renderHook(() => useDeleteScore(), { wrapper });

    result.current.mutate();
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["score"] });
  });
});
