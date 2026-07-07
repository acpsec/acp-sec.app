import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createRef } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LoadReportDropzone } from "@/components/dashboard/LoadReportDropzone";
import { useCreateScore } from "@/lib/hooks/useScoreMutation";
import type { ScoreData } from "@/lib/api/types";
import { useDashboardStore } from "@/lib/stores/dashboardStore";

vi.mock("@/lib/hooks/useScoreMutation", () => ({ useCreateScore: vi.fn() }));
const useCreateScoreMock = vi.mocked(useCreateScore);

type MutateFn = ReturnType<typeof useCreateScore>["mutate"];

function setupMutation(mutate: MutateFn) {
  useCreateScoreMock.mockReturnValue({
    mutate,
    isPending: false,
  } as ReturnType<typeof useCreateScore>);
}

const NORMALIZED: ScoreData = {
  agent_name: "Uploaded",
  band: "SECURE",
  verdict: "",
  final_score: 80,
  score_pct: 80,
  controls: [],
};

function jsonFile(obj: unknown) {
  return new File([JSON.stringify(obj)], "report.json", {
    type: "application/json",
  });
}

beforeEach(() => {
  useDashboardStore.getState().reset();
  useCreateScoreMock.mockReset();
});

describe("LoadReportDropzone", () => {
  it("renders the drop zone with a browse control", () => {
    setupMutation(vi.fn() as unknown as MutateFn);
    render(<LoadReportDropzone inputRef={createRef<HTMLInputElement>()} />);
    expect(screen.getByText(/Drag & drop/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /browse/i })).toBeInTheDocument();
  });

  it("posts the parsed JSON via the mutation and, on success, stores it as source 'upload'", async () => {
    const mutate = vi.fn((_payload, opts) =>
      opts?.onSuccess?.({ ok: true, data: NORMALIZED }, _payload, undefined),
    ) as unknown as MutateFn;
    setupMutation(mutate);

    const ref = createRef<HTMLInputElement>();
    render(<LoadReportDropzone inputRef={ref} />);
    fireEvent.change(ref.current!, {
      target: { files: [jsonFile({ dimensions: [] })] },
    });

    await waitFor(() =>
      expect(vi.mocked(mutate).mock.calls[0]?.[0]).toEqual({ dimensions: [] }),
    );
    expect(useDashboardStore.getState().scoreData).toEqual(NORMALIZED);
    expect(useDashboardStore.getState().source).toBe("upload");
  });

  it("shows an inline error for invalid JSON and does NOT call the mutation", async () => {
    const mutate = vi.fn() as unknown as MutateFn;
    setupMutation(mutate);

    const ref = createRef<HTMLInputElement>();
    render(<LoadReportDropzone inputRef={ref} />);
    const badFile = new File(["{not json"], "bad.json", { type: "application/json" });
    fireEvent.change(ref.current!, { target: { files: [badFile] } });

    await waitFor(() =>
      expect(screen.getByText("Invalid JSON file")).toBeInTheDocument(),
    );
    expect(mutate).not.toHaveBeenCalled();
  });

  it("handles a drag-drop the same way as a file select", async () => {
    const mutate = vi.fn((_payload, opts) =>
      opts?.onSuccess?.({ ok: true, data: NORMALIZED }, _payload, undefined),
    ) as unknown as MutateFn;
    setupMutation(mutate);

    render(<LoadReportDropzone inputRef={createRef<HTMLInputElement>()} />);
    const zone = screen.getByTestId("dropzone");
    fireEvent.drop(zone, { dataTransfer: { files: [jsonFile({ controls: [] })] } });

    await waitFor(() =>
      expect(vi.mocked(mutate).mock.calls[0]?.[0]).toEqual({ controls: [] }),
    );
  });
});
