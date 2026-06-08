"use client";

import { useState } from "react";
import Link from "next/link";
import type { Lesson } from "@/lib/types";
import { DialogueReader } from "./DialogueReader";
import { GrammarDrill } from "./GrammarDrill";
import { HandwritingQuiz } from "./HandwritingQuiz";
import { VocabQuiz, DIRECTION_LABELS } from "./VocabQuiz";
import type { QuizDirection } from "@/lib/types";

type Tab = "overview" | "vocab" | "grammar" | "dialogues" | "practice";
type PracticeMode = "write" | "type";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Übersicht" },
  { id: "vocab", label: "Vokabeln" },
  { id: "grammar", label: "Grammatik" },
  { id: "dialogues", label: "Dialoge" },
  { id: "practice", label: "Üben" },
];

const QUIZ_DIRECTIONS: QuizDirection[] = [
  "de-to-zh",
  "de-to-pinyin",
  "pinyin-to-zh",
  "zh-to-de",
];

export function LessonDetail({ lesson }: { lesson: Lesson }) {
  const [tab, setTab] = useState<Tab>("overview");
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("write");
  const [quizDirection, setQuizDirection] = useState<QuizDirection>("de-to-zh");
  const [requireTones, setRequireTones] = useState(false);

  const allGrammarExercises = lesson.grammar.flatMap((g) => g.exercises);

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-red-600 dark:text-red-400">
          Lektion {lesson.id}
        </p>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
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
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setPracticeMode("write");
                setTab("practice");
              }}
              className="rounded-xl bg-red-600 p-4 text-center font-medium text-white hover:bg-red-700"
            >
              Zeichen schreiben
            </Link>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setPracticeMode("type");
                setTab("practice");
              }}
              className="rounded-xl border border-zinc-300 p-4 text-center font-medium text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Vokabeln tippen
            </Link>
          </div>
        </div>
      )}

      {tab === "vocab" && (
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 font-medium">繁體字</th>
                <th className="px-4 py-3 font-medium">Pinyin</th>
                <th className="px-4 py-3 font-medium">Deutsch</th>
              </tr>
            </thead>
            <tbody>
              {lesson.vocabulary.map((v) => (
                <tr
                  key={v.id}
                  className="border-t border-zinc-100 dark:border-zinc-800"
                >
                  <td className="px-4 py-3 text-xl">{v.traditional}</td>
                  <td className="px-4 py-3 text-zinc-500">{v.pinyin}</td>
                  <td className="px-4 py-3">{v.german}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "grammar" && (
        <div className="space-y-8">
          {lesson.grammar.map((g) => (
            <section
              key={g.id}
              className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h3 className="text-lg font-semibold">{g.title.zh}</h3>
              <p className="text-sm text-zinc-500">{g.title.de}</p>
              <p className="mt-2 rounded-lg bg-zinc-50 px-3 py-2 font-mono text-sm dark:bg-zinc-800">
                {g.pattern}
              </p>
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                {g.explanationDe}
              </p>
              <div className="mt-4 space-y-2">
                {g.examples.map((ex, i) => (
                  <div key={i} className="text-sm">
                    <p className="text-lg text-zinc-900 dark:text-zinc-100">
                      {ex.zh}
                    </p>
                    <p className="text-zinc-500">{ex.pinyin}</p>
                    <p className="italic text-zinc-600 dark:text-zinc-400">
                      {ex.de}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
          <GrammarDrill exercises={allGrammarExercises} title="Grammatik üben" />
        </div>
      )}

      {tab === "dialogues" && (
        <DialogueReader dialogues={lesson.dialogues} />
      )}

      {tab === "practice" && (
        <div>
          <div className="mb-6 flex gap-2">
            <button
              type="button"
              onClick={() => setPracticeMode("write")}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                practiceMode === "write"
                  ? "bg-red-600 text-white"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              ✍️ Schreiben (Maus)
            </button>
            <button
              type="button"
              onClick={() => setPracticeMode("type")}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                practiceMode === "type"
                  ? "bg-red-600 text-white"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              ⌨️ Tippen
            </button>
          </div>

          {practiceMode === "write" ? (
            <HandwritingQuiz vocabulary={lesson.vocabulary} />
          ) : (
            <>
              <div className="mb-6 flex flex-wrap gap-2">
                {QUIZ_DIRECTIONS.map((dir) => (
                  <button
                    key={dir}
                    type="button"
                    onClick={() => setQuizDirection(dir)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                      quizDirection === dir
                        ? "bg-red-600 text-white"
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}
                  >
                    {DIRECTION_LABELS[dir]}
                  </button>
                ))}
              </div>
              <label className="mb-6 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={requireTones}
                  onChange={(e) => setRequireTones(e.target.checked)}
                />
                Pinyin mit Tönen verlangen
              </label>
              <VocabQuiz
                vocabulary={lesson.vocabulary}
                direction={quizDirection}
                requireTones={requireTones}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
