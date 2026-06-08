"use client";

import { useCallback, useEffect, useState } from "react";
import type { VocabItem } from "@/lib/types";
import { splitCharacters } from "@/lib/characters";
import { getCharPinyin } from "@/lib/pinyin-split";
import { recordVocabResult } from "@/lib/progress";
import { CharacterWriter } from "./CharacterWriter";

export type HandwritingMode = "help" | "no-outline" | "memory";

export const HANDWRITING_MODE_LABELS: Record<HandwritingMode, string> = {
  help: "With help",
  "no-outline": "No outline",
  memory: "From memory",
};

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

interface HandwritingQuizProps {
  vocabulary: VocabItem[];
  mode: HandwritingMode;
  title?: string;
  onComplete?: (score: number, total: number) => void;
}

export function HandwritingQuiz({
  vocabulary,
  mode,
  title,
  onComplete,
}: HandwritingQuizProps) {
  const showOutline = mode === "help";
  const showCharacter = mode !== "memory";

  const [queue, setQueue] = useState<VocabItem[]>([]);
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [charLoadError, setCharLoadError] = useState(false);

  useEffect(() => {
    setQueue(shuffle(vocabulary));
    setIndex(0);
    setCharIndex(0);
    setScore(0);
    setFinished(false);
    setCharLoadError(false);
  }, [vocabulary, mode]);

  const current = queue[index];
  const characters = current ? splitCharacters(current.traditional) : [];
  const currentChar = characters[charIndex];

  const advanceWord = useCallback(() => {
    if (!current) return;
    recordVocabResult(current.id, true);

    setScore((prev) => {
      const newScore = prev + 1;
      if (index + 1 >= queue.length) {
        setFinished(true);
        queueMicrotask(() => onComplete?.(newScore, queue.length));
      }
      return newScore;
    });

    if (index + 1 < queue.length) {
      setIndex((i) => i + 1);
      setCharIndex(0);
      setCharLoadError(false);
    }
  }, [current, index, queue.length, onComplete]);

  const handleCharComplete = useCallback(() => {
    if (charIndex + 1 >= characters.length) {
      advanceWord();
    } else {
      setCharIndex((i) => i + 1);
      setCharLoadError(false);
    }
  }, [advanceWord, charIndex, characters.length]);

  const handleSkipChar = () => {
    if (!current) return;
    recordVocabResult(current.id, false);
    if (index + 1 >= queue.length) {
      setFinished(true);
      onComplete?.(score, queue.length);
      return;
    }
    setIndex((i) => i + 1);
    setCharIndex(0);
    setCharLoadError(false);
  };

  const handleReveal = () => {
    if (!current) return;
    setCharLoadError(false);
    setCharIndex(characters.length);
  };

  if (!vocabulary.length) {
    return <p className="text-zinc-500">No vocabulary selected.</p>;
  }

  if (finished) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-900 dark:bg-emerald-950/30">
        <p className="text-2xl font-semibold text-emerald-800 dark:text-emerald-200">
          Done!
        </p>
        <p className="mt-2 text-lg text-emerald-700 dark:text-emerald-300">
          {score} of {queue.length} words
        </p>
        {!onComplete && (
          <button
            type="button"
            onClick={() => {
              setQueue(shuffle(vocabulary));
              setIndex(0);
              setCharIndex(0);
              setScore(0);
              setFinished(false);
            }}
            className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-700"
          >
            Practice again
          </button>
        )}
      </div>
    );
  }

  if (!current || !currentChar) return null;

  const allCharsDone = charIndex >= characters.length;
  const charHint = showCharacter
    ? currentChar
    : getCharPinyin(current, charIndex);

  return (
    <div className="mx-auto max-w-xl">
      {title && (
        <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h2>
      )}

      <div className="mb-2 flex items-center justify-between text-sm text-zinc-500">
        <span>
          Word {index + 1} / {queue.length}
          {characters.length > 1 && (
            <>
              {" "}
              · Character {Math.min(charIndex + 1, characters.length)} /{" "}
              {characters.length}
            </>
          )}
        </span>
        <span>Correct: {score}</span>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm uppercase tracking-wide text-zinc-400">English</p>
        <p className="mt-1 text-2xl font-medium text-zinc-900 dark:text-zinc-100">
          {current.german}
        </p>
        {mode === "memory" && (
          <p className="mt-1 text-lg text-zinc-500">{current.pinyin}</p>
        )}

        <div className="mt-6 flex flex-col items-center">
          {!allCharsDone && !charLoadError && (
            <>
              <p className="mb-2 text-sm text-zinc-400">
                Draw:{" "}
                {showCharacter ? (
                  <span className="font-chinese text-2xl text-red-600">
                    {charHint}
                  </span>
                ) : (
                  <span className="text-2xl font-medium text-red-600">
                    {charHint}
                  </span>
                )}
              </p>
              <div className="rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
                <CharacterWriter
                  key={`${current.id}-${charIndex}-${showOutline}-${mode}`}
                  character={currentChar}
                  showOutline={showOutline}
                  onComplete={handleCharComplete}
                  onError={() => setCharLoadError(true)}
                />
              </div>
            </>
          )}

          {allCharsDone && (
            <div className="py-8 text-center">
              <p className="font-chinese text-5xl text-emerald-600">
                {current.traditional}
              </p>
              <p className="mt-1 text-zinc-500">{current.pinyin}</p>
              <button
                type="button"
                onClick={advanceWord}
                className="mt-4 rounded-xl bg-red-600 px-8 py-3 font-medium text-white hover:bg-red-700"
              >
                Continue
              </button>
            </div>
          )}

          {charLoadError && (
            <div className="py-6 text-center">
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Stroke data for &ldquo;{currentChar}&rdquo; is not available.
              </p>
              <div className="mt-4 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleSkipChar}
                  className="rounded-lg border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-600"
                >
                  Skip
                </button>
                <button
                  type="button"
                  onClick={handleReveal}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white"
                >
                  Show answer
                </button>
              </div>
            </div>
          )}
        </div>

        {characters.length > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            {characters.map((c, i) => (
              <span
                key={i}
                className={`flex h-10 min-w-10 items-center justify-center rounded-lg px-1 text-sm ${
                  i < charIndex
                    ? "bg-emerald-100 font-chinese text-xl text-emerald-700 dark:bg-emerald-900/40"
                    : i === charIndex
                      ? "bg-red-100 text-red-700 ring-2 ring-red-400 dark:bg-red-900/40"
                      : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"
                }`}
              >
                {i < charIndex
                  ? c
                  : i === charIndex
                    ? showCharacter
                      ? "?"
                      : getCharPinyin(current, i)
                    : "·"}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <button
            type="button"
            onClick={handleSkipChar}
            className="text-sm text-zinc-400 hover:text-zinc-600"
          >
            Skip word
          </button>
        </div>
      </div>
    </div>
  );
}
