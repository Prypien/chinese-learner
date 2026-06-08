"use client";

import { useState } from "react";
import type { VocabItem } from "@/lib/types";
import {
  HandwritingQuiz,
  HANDWRITING_MODE_LABELS,
  type HandwritingMode,
} from "./HandwritingQuiz";

interface VocabPracticeProps {
  vocabulary: VocabItem[];
  title?: string;
}

export function VocabPractice({ vocabulary, title }: VocabPracticeProps) {
  const [mode, setMode] = useState<HandwritingMode>("help");

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {(Object.keys(HANDWRITING_MODE_LABELS) as HandwritingMode[]).map(
          (id) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                mode === id
                  ? "bg-red-600 text-white"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              {HANDWRITING_MODE_LABELS[id]}
            </button>
          )
        )}
      </div>

      {mode === "help" && (
        <p className="mb-4 text-sm text-zinc-500">
          Zeichen und Umriss werden angezeigt.
        </p>
      )}
      {mode === "no-outline" && (
        <p className="mb-4 text-sm text-zinc-500">
          Zeichen sichtbar, aber ohne Umriss-Hilfe.
        </p>
      )}
      {mode === "memory" && (
        <p className="mb-4 text-sm text-zinc-500">
          Nur Pinyin — zeichne die Zeichen aus dem Kopf.
        </p>
      )}

      <HandwritingQuiz
        key={mode}
        vocabulary={vocabulary}
        mode={mode}
        title={title}
      />
    </div>
  );
}
