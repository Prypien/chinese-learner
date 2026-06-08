"use client";

import { useEffect, useState } from "react";
import { getAllLessons, getVocabById } from "@/lib/lessons";
import { getWeakVocabIds, loadProgress } from "@/lib/progress";
import { HandwritingQuiz } from "./HandwritingQuiz";
import { VocabQuiz } from "./VocabQuiz";
import type { QuizDirection } from "@/lib/types";

type VocabWithLesson = NonNullable<ReturnType<typeof getVocabById>>;
type ReviewMode = "write" | "type";

export function WeakVocabReview() {
  const [weakVocab, setWeakVocab] = useState<VocabWithLesson[]>([]);
  const [mode, setMode] = useState<ReviewMode>("write");
  const [direction, setDirection] = useState<QuizDirection>("de-to-zh");

  useEffect(() => {
    const ids = getWeakVocabIds();
    const items = ids
      .map((id) => getVocabById(id))
      .filter((v): v is NonNullable<ReturnType<typeof getVocabById>> => !!v);
    setWeakVocab(items);
  }, []);

  const refresh = () => {
    loadProgress();
    const ids = getWeakVocabIds();
    const items = ids
      .map((id) => getVocabById(id))
      .filter((v): v is NonNullable<ReturnType<typeof getVocabById>> => !!v);
    setWeakVocab(items);
  };

  if (weakVocab.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
          Keine Schwächen gespeichert
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          Falsche Antworten im Vokabel-Quiz werden hier automatisch gesammelt.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-zinc-500">
        {weakVocab.length} Wörter zum Wiederholen
      </p>
      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("write")}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            mode === "write"
              ? "bg-red-600 text-white"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800"
          }`}
        >
          Schreiben
        </button>
        <button
          type="button"
          onClick={() => setMode("type")}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            mode === "type"
              ? "bg-red-600 text-white"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800"
          }`}
        >
          Tippen
        </button>
      </div>
      {mode === "type" && (
        <div className="mb-6 flex flex-wrap gap-2">
          {(
            [
              ["de-to-zh", "DE → 繁體字"],
              ["de-to-pinyin", "DE → Pinyin"],
              ["pinyin-to-zh", "Pinyin → 繁體字"],
              ["zh-to-de", "繁體字 → DE"],
            ] as const
          ).map(([dir, label]) => (
            <button
              key={dir}
              type="button"
              onClick={() => setDirection(dir)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                direction === dir
                  ? "bg-red-600 text-white"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      {mode === "write" ? (
        <HandwritingQuiz
          key={`write-${weakVocab.length}`}
          vocabulary={weakVocab}
          title="Schwächen schreiben"
          onComplete={refresh}
        />
      ) : (
        <VocabQuiz
          key={`${direction}-${weakVocab.length}`}
          vocabulary={weakVocab}
          direction={direction}
          title="Schwächen wiederholen"
          onComplete={refresh}
        />
      )}
    </div>
  );
}

export function HomeProgress({ lessons }: { lessons: ReturnType<typeof getAllLessons> }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(interval);
  }, []);

  const totalVocab = lessons.reduce((s, l) => s + l.vocabulary.length, 0);
  const stats = loadProgress();
  const mastered = Object.keys(stats.masteredVocab).length;

  return (
    <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
        Dein Fortschritt
      </h2>
      <p className="mt-1 text-sm text-zinc-500">
        {mastered} von {totalVocab} Vokabeln gemeistert
      </p>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-full rounded-full bg-red-500 transition-all"
          style={{
            width: `${totalVocab > 0 ? Math.round((mastered / totalVocab) * 100) : 0}%`,
          }}
        />
      </div>
    </div>
  );
}
