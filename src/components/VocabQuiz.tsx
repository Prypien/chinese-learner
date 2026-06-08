"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { QuizDirection, VocabItem } from "@/lib/types";
import {
  chineseMatches,
  germanMatches,
  pinyinMatches,
} from "@/lib/pinyin";
import { recordVocabResult } from "@/lib/progress";

const DIRECTION_LABELS: Record<QuizDirection, string> = {
  "de-to-zh": "Deutsch → 繁體字",
  "de-to-pinyin": "Deutsch → Pinyin",
  "pinyin-to-zh": "Pinyin → 繁體字",
  "zh-to-de": "繁體字 → Deutsch",
};

interface VocabQuizProps {
  vocabulary: VocabItem[];
  direction: QuizDirection;
  title?: string;
  requireTones?: boolean;
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

export function VocabQuiz({
  vocabulary,
  direction,
  title,
  requireTones = false,
  onComplete,
}: VocabQuizProps) {
  const [queue, setQueue] = useState<VocabItem[]>([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    message: string;
  } | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setQueue(shuffle(vocabulary));
    setIndex(0);
    setInput("");
    setFeedback(null);
    setScore(0);
    setFinished(false);
  }, [vocabulary, direction]);

  const current = queue[index];

  const prompt = useMemo(() => {
    if (!current) return "";
    switch (direction) {
      case "de-to-zh":
      case "de-to-pinyin":
        return current.german;
      case "pinyin-to-zh":
        return current.pinyin;
      case "zh-to-de":
        return current.traditional;
    }
  }, [current, direction]);

  const checkAnswer = useCallback(
    (value: string): boolean => {
      if (!current) return false;
      switch (direction) {
        case "de-to-zh":
          return chineseMatches(value, current.traditional);
        case "de-to-pinyin":
          return pinyinMatches(value, current.pinyin, requireTones);
        case "pinyin-to-zh":
          return chineseMatches(value, current.traditional);
        case "zh-to-de":
          return germanMatches(value, current.german);
      }
    },
    [current, direction, requireTones]
  );

  const expectedAnswer = useMemo(() => {
    if (!current) return "";
    switch (direction) {
      case "de-to-zh":
      case "pinyin-to-zh":
        return current.traditional;
      case "de-to-pinyin":
        return current.pinyin;
      case "zh-to-de":
        return current.german;
    }
  }, [current, direction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!current || feedback) return;

    const correct = checkAnswer(input);
    recordVocabResult(current.id, correct);

    if (correct) {
      setScore((s) => s + 1);
      setFeedback({ correct: true, message: "Richtig!" });
    } else {
      setFeedback({
        correct: false,
        message: `Falsch. Richtige Antwort: ${expectedAnswer}`,
      });
    }
  };

  const handleNext = () => {
    if (index + 1 >= queue.length) {
      const finalScore = score;
      setFinished(true);
      onComplete?.(finalScore, queue.length);
      return;
    }
    setIndex((i) => i + 1);
    setInput("");
    setFeedback(null);
  };

  if (!vocabulary.length) {
    return (
      <p className="text-zinc-500">Keine Vokabeln für dieses Quiz verfügbar.</p>
    );
  }

  if (finished) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-900 dark:bg-emerald-950/30">
        <p className="text-2xl font-semibold text-emerald-800 dark:text-emerald-200">
          Quiz beendet!
        </p>
        <p className="mt-2 text-lg text-emerald-700 dark:text-emerald-300">
          {score} von {queue.length} richtig
        </p>
        {!onComplete && (
          <button
            type="button"
            onClick={() => {
              setQueue(shuffle(vocabulary));
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

  return (
    <div className="mx-auto max-w-xl">
      {title && (
        <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h2>
      )}
      <p className="mb-6 text-sm text-zinc-500">{DIRECTION_LABELS[direction]}</p>

      <div className="mb-2 flex items-center justify-between text-sm text-zinc-500">
        <span>
          Frage {index + 1} / {queue.length}
        </span>
        <span>Richtig: {score}</span>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="mb-2 text-sm uppercase tracking-wide text-zinc-400">
          Frage
        </p>
        <p
          className={`font-chinese mb-2 font-medium text-zinc-900 dark:text-zinc-100 ${
            direction === "zh-to-de" || direction === "de-to-zh"
              ? "text-4xl leading-relaxed"
              : "text-2xl"
          }`}
        >
          {prompt}
        </p>

        <form onSubmit={handleSubmit} className="mt-8">
          <label className="mb-2 block text-sm text-zinc-500">Deine Antwort</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!!feedback}
            autoFocus
            className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-lg outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-red-600 dark:focus:ring-red-900/30"
            placeholder={
              direction === "de-to-zh" || direction === "pinyin-to-zh"
                ? "繁體字 eingeben…"
                : direction === "de-to-pinyin"
                  ? "Pinyin eingeben…"
                  : "Deutsch eingeben…"
            }
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
                {!feedback.correct && (
                  <p className="mt-2 text-sm opacity-80">
                    {current.traditional} · {current.pinyin} · {current.german}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="mt-4 w-full rounded-xl bg-zinc-800 py-3 font-medium text-white hover:bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
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

export { DIRECTION_LABELS };
