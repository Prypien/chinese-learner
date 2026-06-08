"use client";

import { useCallback, useEffect, useState } from "react";
import type { VocabItem } from "@/lib/types";
import { splitCharacters } from "@/lib/characters";
import { recordVocabResult } from "@/lib/progress";
import { CharacterWriter } from "./CharacterWriter";

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
  title?: string;
  onComplete?: (score: number, total: number) => void;
}

export function HandwritingQuiz({
  vocabulary,
  title,
  onComplete,
}: HandwritingQuizProps) {
  const [queue, setQueue] = useState<VocabItem[]>([]);
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [showOutline, setShowOutline] = useState(true);
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
  }, [vocabulary]);

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
    return (
      <p className="text-zinc-500">Keine Vokabeln für Schreibübung verfügbar.</p>
    );
  }

  if (finished) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-900 dark:bg-emerald-950/30">
        <p className="text-2xl font-semibold text-emerald-800 dark:text-emerald-200">
          Schreibübung beendet!
        </p>
        <p className="mt-2 text-lg text-emerald-700 dark:text-emerald-300">
          {score} von {queue.length} richtig gezeichnet
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
            Nochmal üben
          </button>
        )}
      </div>
    );
  }

  if (!current || !currentChar) return null;

  const allCharsDone = charIndex >= characters.length;

  return (
    <div className="mx-auto max-w-xl">
      {title && (
        <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h2>
      )}
      <p className="mb-6 text-sm text-zinc-500">
        Zeichne die Zeichen mit der Maus (oder dem Finger). Erst wenn alle Striche
        stimmen, geht es weiter.
      </p>

      <div className="mb-2 flex items-center justify-between text-sm text-zinc-500">
        <span>
          Wort {index + 1} / {queue.length}
          {characters.length > 1 && (
            <> · Zeichen {Math.min(charIndex + 1, characters.length)} / {characters.length}</>
          )}
        </span>
        <span>Richtig: {score}</span>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm uppercase tracking-wide text-zinc-400">Aufgabe</p>
        <p className="mt-1 text-2xl font-medium text-zinc-900 dark:text-zinc-100">
          {current.german}
        </p>
        <p className="mt-1 text-lg text-zinc-500">{current.pinyin}</p>

        <div className="mt-6 flex flex-col items-center">
          {!allCharsDone && !charLoadError && (
            <>
              <p className="font-chinese mb-2 text-sm text-zinc-400">
                Zeichne:{" "}
                <span className="text-2xl text-red-600">{currentChar}</span>
              </p>
              <div className="rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
                <CharacterWriter
                  key={`${current.id}-${charIndex}-${showOutline}`}
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
              <p className="mt-3 text-emerald-700 dark:text-emerald-300">
                Gut gemacht!
              </p>
              <button
                type="button"
                onClick={advanceWord}
                className="mt-4 rounded-xl bg-red-600 px-8 py-3 font-medium text-white hover:bg-red-700"
              >
                Weiter
              </button>
            </div>
          )}

          {charLoadError && (
            <div className="py-6 text-center">
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Strichdaten für „{currentChar}“ nicht verfügbar.
              </p>
              <div className="mt-4 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleSkipChar}
                  className="rounded-lg border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-600"
                >
                  Überspringen
                </button>
                <button
                  type="button"
                  onClick={handleReveal}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white"
                >
                  Lösung zeigen
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
                className={`font-chinese flex h-10 w-10 items-center justify-center rounded-lg text-xl ${
                  i < charIndex
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40"
                    : i === charIndex
                      ? "bg-red-100 text-red-700 ring-2 ring-red-400 dark:bg-red-900/40"
                      : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"
                }`}
              >
                {i < charIndex ? c : i === charIndex ? "?" : "·"}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <input
              type="checkbox"
              checked={showOutline}
              onChange={(e) => setShowOutline(e.target.checked)}
            />
            Umriss als Hilfe anzeigen
          </label>
          <button
            type="button"
            onClick={handleSkipChar}
            className="text-sm text-zinc-400 hover:text-zinc-600"
          >
            Wort überspringen
          </button>
        </div>

        <p className="mt-2 text-center text-xs text-zinc-400">
          Tipp: Nach 3 Fehlversuchen wird der nächste Strich hervorgehoben.
        </p>
      </div>
    </div>
  );
}
