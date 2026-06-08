"use client";

import { useState } from "react";
import {
  getJensText,
  getJensTextUniqueCharacters,
  type JensTextLine,
} from "@/lib/jens-text";
import { VocabTable } from "./VocabTable";
import { VocabPractice } from "./VocabPractice";

type View = "overview" | "practice";

export function JensTextClient() {
  const data = getJensText();
  const uniqueChars = getJensTextUniqueCharacters();
  const [view, setView] = useState<View>("overview");

  if (view === "practice") {
    return (
      <div>
        <button
          type="button"
          onClick={() => setView("overview")}
          className="mb-6 text-sm text-zinc-500 hover:text-red-600"
        >
          ← Back to overview
        </button>
        <VocabPractice
          vocabulary={data.vocabulary}
          title="Jen's text · vocabulary"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="font-chinese text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          {data.title.zh}
        </h2>
        <p className="text-sm text-zinc-500">{data.title.de}</p>
        <div className="mt-4 space-y-3">
          {data.lines.map((line, i) => (
            <IntroLine key={i} line={line} />
          ))}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-zinc-500">
          {data.vocabulary.length} words · {uniqueChars.length} unique
          characters
        </p>
        <button
          type="button"
          onClick={() => setView("practice")}
          className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700"
        >
          Practice →
        </button>
      </div>

      <div className="mb-6 flex flex-wrap justify-center gap-1 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
        {uniqueChars.map((c) => (
          <span key={c} className="font-chinese text-xl text-zinc-600">
            {c}
          </span>
        ))}
      </div>

      <VocabTable items={data.vocabulary} />
    </div>
  );
}

function IntroLine({ line }: { line: JensTextLine }) {
  return (
    <div className="border-l-2 border-emerald-200 pl-3 dark:border-emerald-900">
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
