"use client";

import { getLessonVocabProgress, loadProgress } from "@/lib/progress";
import type { Lesson } from "@/lib/types";

interface ProgressBarProps {
  mastered: number;
  total: number;
  label?: string;
}

export function ProgressBar({ mastered, total, label }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;

  return (
    <div>
      {label && (
        <div className="mb-1 flex justify-between text-xs text-zinc-500">
          <span>{label}</span>
          <span>
            {mastered}/{total} ({pct}%)
          </span>
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-full rounded-full bg-red-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function LessonProgressBar({ lesson }: { lesson: Lesson }) {
  const vocabIds = lesson.vocabulary.map((v) => v.id);
  const { mastered, total } = getLessonVocabProgress(vocabIds);

  return (
    <ProgressBar
      mastered={mastered}
      total={total}
      label={`L${lesson.id}: ${mastered}/${total} Vokabeln`}
    />
  );
}

export function useProgressRefresh() {
  return loadProgress();
}
