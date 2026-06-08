"use client";

import { useCallback, useState } from "react";
import {
  CharacterWriter,
  extractWritableCharacters,
} from "./CharacterWriter";

interface TextHandwritingProps {
  text: string;
  /** Override character sequence (e.g. unique-only drill). */
  characters?: string[];
  title?: string;
  showOutline?: boolean;
  showProgressText?: boolean;
  onComplete?: () => void;
}

export function TextHandwriting({
  text,
  characters: charactersOverride,
  title,
  showOutline: showOutlineDefault = true,
  showProgressText = true,
  onComplete,
}: TextHandwritingProps) {
  const characters =
    charactersOverride ?? extractWritableCharacters(text);
  const [charIndex, setCharIndex] = useState(0);
  const [showOutline, setShowOutline] = useState(showOutlineDefault);
  const [charLoadError, setCharLoadError] = useState(false);
  const [finished, setFinished] = useState(false);

  const currentChar = characters[charIndex];

  const advance = useCallback(() => {
    if (charIndex + 1 >= characters.length) {
      setFinished(true);
      onComplete?.();
      return;
    }
    setCharIndex((i) => i + 1);
    setCharLoadError(false);
  }, [charIndex, characters.length, onComplete]);

  const handleSkip = () => {
    if (charIndex + 1 >= characters.length) {
      setFinished(true);
      onComplete?.();
      return;
    }
    setCharIndex((i) => i + 1);
    setCharLoadError(false);
  };

  if (!characters.length) {
    return (
      <p className="text-zinc-500">
        Kein chinesischer Text zum Schreiben — bitte zuerst eine Vorstellung
        erstellen.
      </p>
    );
  }

  if (finished) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-900 dark:bg-emerald-950/30">
        <p className="text-2xl font-semibold text-emerald-800 dark:text-emerald-200">
          Geschafft!
        </p>
        <p className="font-chinese mt-4 text-3xl leading-relaxed text-zinc-800 dark:text-zinc-200">
          {text}
        </p>
        <p className="mt-4 text-sm text-emerald-700 dark:text-emerald-300">
          Du hast alle {characters.length} Zeichen gezeichnet.
        </p>
        <button
          type="button"
          onClick={() => {
            setCharIndex(0);
            setFinished(false);
            setCharLoadError(false);
          }}
          className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-700"
        >
          Nochmal schreiben
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      {title && (
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h2>
      )}

      <div className="mb-2 flex justify-between text-sm text-zinc-500">
        <span>
          Zeichen {charIndex + 1} / {characters.length}
        </span>
      </div>

      {showProgressText && (
        <div className="mb-4 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
          <p className="font-chinese text-center text-2xl leading-loose text-zinc-400">
            {characters.map((c, i) => (
              <span
                key={i}
                className={
                  i < charIndex
                    ? "text-emerald-600 dark:text-emerald-400"
                    : i === charIndex
                      ? "text-red-600 underline decoration-2"
                      : ""
                }
              >
                {c}
              </span>
            ))}
          </p>
        </div>
      )}

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        {!charLoadError && currentChar && (
          <>
            <p className="mb-2 text-center text-sm text-zinc-500">
              Zeichne:{" "}
              <span className="font-chinese text-3xl text-red-600">
                {currentChar}
              </span>
            </p>
            <div className="rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
              <CharacterWriter
                key={`${charIndex}-${showOutline}`}
                character={currentChar}
                showOutline={showOutline}
                onComplete={advance}
                onError={() => setCharLoadError(true)}
              />
            </div>
          </>
        )}

        {charLoadError && (
          <div className="py-6 text-center">
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Strichdaten für „{currentChar}“ nicht verfügbar.
            </p>
            <button
              type="button"
              onClick={handleSkip}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white"
            >
              Weiter
            </button>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
          {showOutlineDefault && (
            <label className="flex items-center gap-2 text-sm text-zinc-600">
              <input
                type="checkbox"
                checked={showOutline}
                onChange={(e) => setShowOutline(e.target.checked)}
              />
              Umriss anzeigen
            </label>
          )}
          {!showOutlineDefault && <span />}
          <button
            type="button"
            onClick={handleSkip}
            className="text-sm text-zinc-400 hover:text-zinc-600"
          >
            Zeichen überspringen
          </button>
        </div>
      </div>
    </div>
  );
}
