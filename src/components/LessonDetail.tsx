"use client";

import { useState } from "react";
import type { Lesson } from "@/lib/types";
import { VocabTable } from "./VocabTable";
import { VocabPractice } from "./VocabPractice";

type Tab = "overview" | "vocab" | "practice";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Übersicht" },
  { id: "vocab", label: "Vokabeln" },
  { id: "practice", label: "Üben" },
];

export function LessonDetail({ lesson }: { lesson: Lesson }) {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-red-600 dark:text-red-400">
          Lektion {lesson.id}
        </p>
        <h1 className="font-chinese text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          {lesson.title.zh}
        </h1>
        <p className="mt-1 text-zinc-500">{lesson.title.de}</p>
      </div>

      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-zinc-200 dark:border-zinc-800">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium transition ${
              tab === t.id
                ? "border-b-2 border-red-600 text-red-600"
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="space-y-6">
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
              Lernziele
            </h2>
            <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
              {lesson.objectives.map((obj) => (
                <li key={obj}>{obj}</li>
              ))}
            </ul>
          </section>
          <p className="text-sm text-zinc-500">
            {lesson.vocabulary.length} Vokabeln in dieser Lektion
          </p>
          <button
            type="button"
            onClick={() => setTab("practice")}
            className="w-full rounded-xl bg-red-600 py-3 font-medium text-white hover:bg-red-700"
          >
            Lektion üben →
          </button>
        </div>
      )}

      {tab === "vocab" && <VocabTable items={lesson.vocabulary} />}

      {tab === "practice" && (
        <VocabPractice
          vocabulary={lesson.vocabulary}
          title={`Lektion ${lesson.id}`}
        />
      )}
    </div>
  );
}
