"use client";

import Link from "next/link";
import type { Lesson } from "@/lib/types";
import { getLessonVocabProgress } from "@/lib/progress";
import { useEffect, useState } from "react";

interface LessonCardProps {
  lesson: Lesson;
}

function LessonProgressClient({ lesson }: { lesson: Lesson }) {
  const [mastered, setMastered] = useState(0);
  const total = lesson.vocabulary.length;

  useEffect(() => {
    const update = () => {
      const ids = lesson.vocabulary.map((v) => v.id);
      setMastered(getLessonVocabProgress(ids).mastered);
    };
    update();
    const interval = setInterval(update, 1500);
    return () => clearInterval(interval);
  }, [lesson]);

  const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;

  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-zinc-500">
        <span>
          L{lesson.id}: {mastered}/{total} Vokabeln
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-full rounded-full bg-red-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function LessonCard({ lesson }: LessonCardProps) {
  return (
    <Link
      href={`/lesson/${lesson.id}`}
      className="group block rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-red-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-red-800"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-red-600 dark:text-red-400">
            Lektion {lesson.id}
          </p>
          <h3 className="font-chinese mt-1 text-2xl font-semibold text-zinc-900 group-hover:text-red-700 dark:text-zinc-100 dark:group-hover:text-red-400">
            {lesson.title.zh}
          </h3>
          <p className="mt-1 text-sm text-zinc-500">{lesson.title.de}</p>
        </div>
        <span className="text-3xl text-zinc-200 group-hover:text-red-200 dark:text-zinc-700">
          →
        </span>
      </div>
      <div className="mt-4">
        <LessonProgressClient lesson={lesson} />
      </div>
      <p className="mt-3 text-xs text-zinc-400">
        {lesson.vocabulary.length} Vokabeln
      </p>
    </Link>
  );
}
