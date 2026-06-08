"use client";

import { useState } from "react";
import {
  extractUniqueWritableCharacters,
  extractWritableCharacters,
} from "./CharacterWriter";
import { TextHandwriting } from "./TextHandwriting";
import {
  JEN_INTRO_LINES,
  JEN_INTRO_TEXT,
  type IntroLine,
} from "@/lib/jen-intro";

type PracticeMode = "unique" | "text" | "exam";

export function JenIntroPractice() {
  const [mode, setMode] = useState<PracticeMode>("unique");

  const allInText = extractWritableCharacters(JEN_INTRO_TEXT);
  const uniqueChars = extractUniqueWritableCharacters(JEN_INTRO_TEXT);

  return (
    <div>
      <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
          Dein Text
        </h2>
        <div className="mt-4 space-y-3">
          {JEN_INTRO_LINES.map((line, i) => (
            <IntroLineDisplay key={i} line={line} />
          ))}
        </div>
        <p className="mt-4 text-sm text-zinc-500">
          {uniqueChars.length} verschiedene Zeichen · {allInText.length} insgesamt
          im Text
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {(
          [
            ["unique", `Alle Zeichen (${uniqueChars.length})`],
            ["text", "Im Text (Reihenfolge)"],
            ["exam", "Aus dem Kopf"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              mode === id
                ? "bg-red-600 text-white"
                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "unique" && (
        <div>
          <p className="mb-4 text-sm text-zinc-500">
            Zeichne jedes Zeichen, das in deiner Vorstellung vorkommt — jedes
            nur einmal.
          </p>
          <div className="mb-6 flex flex-wrap justify-center gap-1 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
            {uniqueChars.map((c) => (
              <span key={c} className="font-chinese text-xl text-zinc-600">
                {c}
              </span>
            ))}
          </div>
          <TextHandwriting
            text={JEN_INTRO_TEXT}
            characters={uniqueChars}
            title="Alle Zeichen aus deinem Text"
          />
        </div>
      )}

      {mode === "text" && (
        <div>
          <p className="mb-4 text-sm text-zinc-500">
            Schreibe den ganzen Text Zeichen für Zeichen — wie in deinem Heft.
          </p>
          <TextHandwriting
            text={JEN_INTRO_TEXT}
            title="Vorstellung in Reihenfolge"
          />
        </div>
      )}

      {mode === "exam" && (
        <div>
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
            <p className="font-medium text-amber-900 dark:text-amber-200">
              Klausur-Simulation
            </p>
            <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
              Kein Umriss, kein chinesischer Text — nur die deutsche Bedeutung
              oben als Hilfe.
            </p>
          </div>
          <TextHandwriting
            text={JEN_INTRO_TEXT}
            title="Aus dem Kopf schreiben"
            showOutline={false}
            showProgressText={false}
          />
        </div>
      )}
    </div>
  );
}

function IntroLineDisplay({ line }: { line: IntroLine }) {
  return (
    <div className="border-l-2 border-red-200 pl-3 dark:border-red-900">
      <p className="font-chinese text-xl text-zinc-900 dark:text-zinc-100">
        {line.zh}
      </p>
      <p className="text-sm text-zinc-500">{line.pinyin}</p>
      <p className="text-sm italic text-zinc-600 dark:text-zinc-400">
        {line.de}
      </p>
    </div>
  );
}
