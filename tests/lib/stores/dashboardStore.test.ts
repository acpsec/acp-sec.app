import { beforeEach, describe, expect, it } from "vitest";

import type { ScoreData } from "@/lib/api/types";
import { useDashboardStore } from "@/lib/stores/dashboardStore";

const state = () => useDashboardStore.getState();

const SAMPLE: ScoreData = {
  agent_name: "X",
  band: "SECURE",
  verdict: "",
  final_score: 80,
  controls: [],
};

beforeEach(() => state().reset());

describe("dashboardStore", () => {
  it("has the correct initial state", () => {
    expect(state().scoreData).toBeNull();
    expect(state().source).toBeNull();
    expect(state().cachedAt).toBeNull();
  });

  it("setScoreData updates scoreData", () => {
    state().setScoreData(SAMPLE);
    expect(state().scoreData).toBe(SAMPLE);
  });

  it("setSource updates source + cachedAt", () => {
    state().setSource("handoff", 123456);
    expect(state().source).toBe("handoff");
    expect(state().cachedAt).toBe(123456);
  });

  it("accepts the 'upload' source (Load Report)", () => {
    state().setSource("upload");
    expect(state().source).toBe("upload");
  });

  it("setSource defaults cachedAt to null", () => {
    state().setSource("session");
    expect(state().source).toBe("session");
    expect(state().cachedAt).toBeNull();
  });

  it("reset clears everything", () => {
    state().setScoreData(SAMPLE);
    state().setSource("session");
    state().reset();
    expect(state().scoreData).toBeNull();
    expect(state().source).toBeNull();
  });
});
