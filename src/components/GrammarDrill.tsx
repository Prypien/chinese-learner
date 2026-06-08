"use client";

import { useEffect, useState } from "react";
import type { GrammarExercise } from "@/lib/types";
import { recordGrammarResult } from "@/lib/progress";

interface GrammarDrillProps {
  exercises: GrammarExercise[];
  title?: string;
  onComplete?: (score: number, total: number) => void;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function matchesAnswer(input: string, exercise: GrammarExercise): boolean {
  const normalized = input.trim();
  const answers = [
    exercise.correctAnswer,
    ...(exercise.acceptableAnswers ?? []),
  ];
  return answers.some((a) => a.trim() === normalized);
}

export function GrammarDrill({ exercises, title, onComplete }: GrammarDrillProps) {
  const [queue, setQueue] = useState<GrammarExercise[]>([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    message: string;
  } | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setQueue(shuffle(exercises));
    setIndex(0);
    setInput("");
    setFeedback(null);
    setScore(0);
    setFinished(false);
  }, [exercises]);

  const current = queue[index];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!current || feedback) return;

    const correct = matchesAnswer(input, current);
    recordGrammarResult(current.id, correct);

    if (correct) {
      setScore((s) => s + 1);
      setFeedback({ correct: true, message: "Richtig!" });
    } else {
      setFeedback({
        correct: false,
        message: `Falsch. Richtige Antwort: ${current.correctAnswer}`,
      });
    }
  };

  const handleNext = () => {
    if (index + 1 >= queue.length) {
      setFinished(true);
      const finalScore = score + (feedback?.correct ? 0 : 0);
      onComplete?.(finalScore, queue.length);
      return;
    }
    setIndex((i) => i + 1);
    setInput("");
    setFeedback(null);
  };

  if (!exercises.length) {
    return (
      <p className="text-zinc-500">Keine Grammatikübungen verfügbar.</p>
    );
  }

  if (finished) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-900 dark:bg-emerald-950/30">
        <p className="text-2xl font-semibold text-emerald-800 dark:text-emerald-200">
          Grammatik beendet!
        </p>
        <p className="mt-2 text-lg text-emerald-700 dark:text-emerald-300">
          {score} von {queue.length} richtig
        </p>
        {!onComplete && (
          <button
            type="button"
            onClick={() => {
              setQueue(shuffle(exercises));
              setIndex(0);
              setInput("");
              setFeedback(null);
              setScore(0);
              setFinished(false);
            }}
            className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-700"
          >
            Nochmal üben
          </button>
        )}
      </div>
    );
  }

  if (!current) return null;

  const hasSentence =
    current.sentenceBefore || current.sentenceAfter;

  return (
    <div className="mx-auto max-w-xl">
      {title && (
        <h2 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h2>
      )}

      <div className="mb-2 flex items-center justify-between text-sm text-zinc-500">
        <span>
          Übung {index + 1} / {queue.length}
        </span>
        <span>Richtig: {score}</span>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {current.promptDe}
        </p>

        {hasSentence ? (
          <p className="mt-4 text-2xl leading-relaxed text-zinc-900 dark:text-zinc-100">
            {current.sentenceBefore}
            <span className="mx-1 inline-block min-w-[3rem] border-b-2 border-red-400 text-red-600">
              {feedback ? current.correctAnswer : "___"}
            </span>
            {current.sentenceAfter}
          </p>
        ) : (
          <p className="mt-4 text-lg text-zinc-700 dark:text-zinc-300">
            Antwort eingeben:
          </p>
        )}

        {current.hintDe && (
          <p className="mt-2 text-sm text-zinc-400">Tipp: {current.hintDe}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!!feedback}
            autoFocus
            className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-lg outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:border-zinc-700 dark:bg-zinc-800"
            placeholder="Antwort…"
          />

          {!feedback ? (
            <button
              type="submit"
              disabled={!input.trim()}
              className="mt-4 w-full rounded-xl bg-red-600 py-3 font-medium text-white hover:bg-red-700 disabled:opacity-40"
            >
              Prüfen
            </button>
          ) : (
            <div className="mt-4">
              <div
                className={`rounded-xl p-4 ${
                  feedback.correct
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
                    : "bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-200"
                }`}
              >
                {feedback.message}
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="mt-4 w-full rounded-xl bg-zinc-800 py-3 font-medium text-white hover:bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900"
              >
                {index + 1 >= queue.length ? "Ergebnis anzeigen" : "Weiter"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
