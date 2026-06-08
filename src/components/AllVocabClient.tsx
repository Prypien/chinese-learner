"use client";

import { useMemo, useState } from "react";
import { getAllVocabulary } from "@/lib/lessons";
import { VocabTable } from "./VocabTable";
import { VocabPractice } from "./VocabPractice";

type View = "list" | "practice";

export function AllVocabClient() {
  const allVocab = useMemo(() => getAllVocabulary(), []);
  const [view, setView] = useState<View>("list");
  const [lessonFilter, setLessonFilter] = useState<number | "all">("all");

  const filtered =
    lessonFilter === "all"
      ? allVocab
      : allVocab.filter((v) => v.lessonId === lessonFilter);

  if (view === "practice") {
    return (
      <div>
        <button
          type="button"
          onClick={() => setView("list")}
          className="mb-6 text-sm text-zinc-500 hover:text-red-600"
        >
          ← Back to list
        </button>
        <VocabPractice
          vocabulary={filtered}
          title={
            lessonFilter === "all"
              ? "All vocabulary"
              : `Lesson ${lessonFilter}`
          }
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-500">{filtered.length} words</p>
        <select
          value={lessonFilter}
          onChange={(e) =>
            setLessonFilter(
              e.target.value === "all" ? "all" : Number(e.target.value)
            )
          }
          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800"
        >
          <option value="all">All lessons</option>
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>
              Lesson {n}
            </option>
          ))}
        </select>
      </div>

      <VocabTable items={filtered} showLesson />

      <button
        type="button"
        onClick={() => setView("practice")}
        className="mt-8 w-full rounded-xl bg-red-600 py-3 font-medium text-white hover:bg-red-700"
      >
        Practice {filtered.length} words →
      </button>
    </div>
  );
}
