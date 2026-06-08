"use client";

import { useMemo, useState } from "react";
import { getMatchType, searchVocabulary, sortSearchResults } from "@/lib/search";
import type { VocabItem } from "@/lib/types";
import { HandwritingQuiz } from "./HandwritingQuiz";

type VocabWithLesson = VocabItem & { lessonId: number };

export function VocabSearch() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<VocabWithLesson | null>(null);

  const results = useMemo(() => {
    const found = searchVocabulary(query);
    return sortSearchResults(found, query);
  }, [query]);

  if (selected) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setSelected(null)}
          className="mb-6 text-sm text-zinc-500 hover:text-red-600"
        >
          ← Zurück zur Suche
        </button>
        <div className="mb-4 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
          <p className="text-sm text-zinc-500">{selected.german}</p>
          <p className="font-chinese mt-1 text-2xl">{selected.traditional}</p>
          <p className="text-sm text-zinc-400">{selected.pinyin}</p>
          <p className="mt-1 text-xs text-zinc-400">Lektion {selected.lessonId}</p>
        </div>
        <HandwritingQuiz
          key={selected.id}
          vocabulary={[selected]}
          title="Zeichen zeichnen"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Deutsch oder Pinyin… z.B. tee, ni hao, xihuan"
          autoFocus
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 pl-10 text-lg outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-red-600 dark:focus:ring-red-900/30"
        />
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
          🔍
        </span>
      </div>

      {query.trim() && (
        <p className="mt-3 text-sm text-zinc-500">
          {results.length === 0
            ? "Keine Treffer — andere Schreibweise probieren?"
            : `${results.length} ${results.length === 1 ? "Treffer" : "Treffer"}`}
        </p>
      )}

      {!query.trim() && (
        <p className="mt-3 text-sm text-zinc-400">
          Suche auf Deutsch oder Pinyin (mit oder ohne Töne) — z.B.{" "}
          <span className="text-zinc-500">tee</span>,{" "}
          <span className="text-zinc-500">nǐ hǎo</span>,{" "}
          <span className="text-zinc-500">nihao</span>
        </p>
      )}

      <ul className="mt-4 space-y-2">
        {results.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => setSelected(item)}
              className="flex w-full items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-4 text-left transition hover:border-red-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-red-800"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-zinc-900 dark:text-zinc-100">
                  {item.german}
                </p>
                <p className="text-sm text-zinc-500">{item.pinyin}</p>
                {query.trim() && (
                  <p className="mt-0.5 text-xs text-red-500/80">
                    {getMatchType(item, query) === "pinyin"
                      ? "Treffer: Pinyin"
                      : getMatchType(item, query) === "de"
                        ? "Treffer: Deutsch"
                        : getMatchType(item, query) === "zh"
                          ? "Treffer: Zeichen"
                          : null}
                  </p>
                )}
              </div>
              <p className="font-chinese shrink-0 text-3xl text-red-600">
                {item.traditional}
              </p>
              <span className="shrink-0 text-xs text-zinc-400">
                L{item.lessonId}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
