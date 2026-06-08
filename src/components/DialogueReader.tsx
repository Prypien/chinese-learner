"use client";

import { useState } from "react";
import type { Dialogue, ComprehensionQuestion } from "@/lib/types";
import { germanMatches } from "@/lib/pinyin";

type DisplayMode = "zh" | "pinyin" | "de";

interface DialogueReaderProps {
  dialogues: Dialogue[];
}

function ComprehensionQuiz({ questions }: { questions: ComprehensionQuestion[] }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const score = questions.filter((q) => {
    const answer = answers[q.id]?.trim() ?? "";
    if (q.answerType === "yesno") {
      return answer.toLowerCase() === q.correctAnswer.toLowerCase();
    }
    const acceptable = [q.correctAnswer, ...(q.acceptableAnswers ?? [])];
    return acceptable.some((a) => germanMatches(answer, a) || answer === a);
  }).length;

  return (
    <div className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-700">
      <h4 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-100">
        Verständnisfragen
      </h4>
      <div className="space-y-4">
        {questions.map((q) => {
          const answer = answers[q.id]?.trim() ?? "";
          let isCorrect = false;
          if (checked) {
            if (q.answerType === "yesno") {
              isCorrect =
                answer.toLowerCase() === q.correctAnswer.toLowerCase();
            } else {
              const acceptable = [
                q.correctAnswer,
                ...(q.acceptableAnswers ?? []),
              ];
              isCorrect =
                acceptable.some(
                  (a) => germanMatches(answer, a) || answer === a
                ) ?? false;
            }
          }

          return (
            <div key={q.id} className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                {q.questionDe}
              </p>
              <input
                type="text"
                value={answers[q.id] ?? ""}
                onChange={(e) =>
                  setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                }
                disabled={checked}
                placeholder={q.answerType === "yesno" ? "ja / nein" : "Antwort…"}
                className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900"
              />
              {checked && (
                <p
                  className={`mt-2 text-sm ${
                    isCorrect
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {isCorrect
                    ? "Richtig!"
                    : `Richtige Antwort: ${q.correctAnswer}`}
                </p>
              )}
            </div>
          );
        })}
      </div>
      {!checked ? (
        <button
          type="button"
          onClick={() => setChecked(true)}
          className="mt-4 rounded-xl bg-red-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-red-700"
        >
          Antworten prüfen
        </button>
      ) : (
        <p className="mt-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Ergebnis: {score} / {questions.length}
        </p>
      )}
    </div>
  );
}

export function DialogueReader({ dialogues }: DialogueReaderProps) {
  const [mode, setMode] = useState<DisplayMode>("zh");
  const [activeDialogue, setActiveDialogue] = useState(0);

  const dialogue = dialogues[activeDialogue];
  if (!dialogue) return null;

  return (
    <div>
      {dialogues.length > 1 && (
        <div className="mb-4 flex gap-2">
          {dialogues.map((d, i) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setActiveDialogue(i)}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                i === activeDialogue
                  ? "bg-red-600 text-white"
                  : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              }`}
            >
              {d.title.de}
            </button>
          ))}
        </div>
      )}

      <div className="mb-4 flex gap-2">
        {(
          [
            ["zh", "Zeichen"],
            ["pinyin", "+ Pinyin"],
            ["de", "+ Deutsch"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
              mode === value
                ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-1 text-lg font-semibold">{dialogue.title.zh}</h3>
        <p className="mb-6 text-sm text-zinc-500">{dialogue.title.de}</p>

        <div className="space-y-4">
          {dialogue.lines.map((line, i) => (
            <div key={i} className="border-l-2 border-red-200 pl-4 dark:border-red-900">
              <p className="text-xs font-medium text-red-600 dark:text-red-400">
                {line.speaker}
              </p>
              <p className="mt-1 text-xl leading-relaxed text-zinc-900 dark:text-zinc-100">
                {line.zh}
              </p>
              {(mode === "pinyin" || mode === "de") && (
                <p className="mt-1 text-sm text-zinc-500">{line.pinyin}</p>
              )}
              {mode === "de" && (
                <p className="mt-1 text-sm italic text-zinc-600 dark:text-zinc-400">
                  {line.de}
                </p>
              )}
            </div>
          ))}
        </div>

        <ComprehensionQuiz questions={dialogue.comprehensionQuestions} />
      </div>
    </div>
  );
}
