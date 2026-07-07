"use client";

import { useState, type RefObject } from "react";

import { ApiError } from "@/lib/api/errors";
import type { ScoreCreateRequest } from "@/lib/api/types";
import { useCreateScore } from "@/lib/hooks/useScoreMutation";
import { useDashboardStore } from "@/lib/stores/dashboardStore";

/**
 * Load Report: upload a JSON report (file picker or drag-drop). The raw JSON is
 * POSTed to /api/score so the backend NORMALIZES it into the score wire format
 * (mirrors the HTML lama), then displayed as source 'upload'.
 *
 * NOTE: the lama also has a client-side offline-fallback normalizer; that
 * duplicates backend Python logic, so it is intentionally NOT ported — an
 * upload while the server is unreachable surfaces an inline error instead.
 *
 * `inputRef` is shared so the header's "Load Report" button can open the same
 * file dialog.
 */
export function LoadReportDropzone({
  inputRef,
}: {
  inputRef: RefObject<HTMLInputElement | null>;
}) {
  const createScore = useCreateScore();
  const setScoreData = useDashboardStore((s) => s.setScoreData);
  const setSource = useDashboardStore((s) => s.setSource);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  function handleFile(file: File) {
    setError("");
    const reader = new FileReader();
    reader.onerror = () => setError("Could not read file");
    reader.onload = () => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(String(reader.result));
      } catch {
        setError("Invalid JSON file");
        return;
      }
      createScore.mutate(parsed as ScoreCreateRequest, {
        onSuccess: (resp) => {
          setScoreData(resp.data);
          setSource("upload");
        },
        onError: (err) => {
          setError(
            err instanceof ApiError
              ? (err.body?.error ?? err.message)
              : "Upload failed",
          );
        },
      });
    };
    reader.readAsText(file);
  }

  return (
    <div className="mt-6">
      <input
        ref={inputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = ""; // allow re-selecting the same file
        }}
      />

      <div
        data-testid="dropzone"
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        className={`rounded-lg border border-dashed px-4 py-6 text-center text-caption text-fg-muted transition-colors ${
          dragging ? "border-primary bg-surface" : "border-border"
        }`}
      >
        <p>
          Drag &amp; drop your{" "}
          <code className="rounded bg-bg px-1">acpsec check</code> output here,
          or{" "}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="font-semibold text-primary hover:underline"
          >
            browse
          </button>
        </p>
        {createScore.isPending && (
          <p className="mt-2 text-micro text-fg-subtle">Uploading…</p>
        )}
        {error && (
          <p role="alert" className="mt-2 text-micro text-danger">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
