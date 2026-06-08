"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllVocabulary } from "@/lib/lessons";
import {
  loadCustomVocabIds,
  saveCustomVocabIds,
  toggleCustomVocabId,
} from "@/lib/custom-vocab";
import { VocabTable } from "./VocabTable";
import { VocabPractice } from "./VocabPractice";

type View = "pick" | "practice";

export function CustomVocabClient() {
  const allVocab = useMemo(() => getAllVocabulary(), []);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [view, setView] = useState<View>("pick");
  const [lessonFilter, setLessonFilter] = useState<number | "all">("all");

  useEffect(() => {
    setSelectedIds(new Set(loadCustomVocabIds()));
  }, []);

  const filtered =
    lessonFilter === "all"
      ? allVocab
      : allVocab.filter((v) => v.lessonId === lessonFilter);

  const selectedVocab = allVocab.filter((v) => selectedIds.has(v.id));

  const handleToggle = (id: string) => {
    const next = toggleCustomVocabId(id);
    setSelectedIds(new Set(next));
  };

  const handleSelectAll = () => {
    const ids = filtered.map((v) => v.id);
    const merged = new Set([...selectedIds, ...ids]);
    saveCustomVocabIds([...merged]);
    setSelectedIds(merged);
  };

  const handleClear = () => {
    saveCustomVocabIds([]);
    setSelectedIds(new Set());
  };

  if (view === "practice") {
    return (
      <div>
        <button
          type="button"
          onClick={() => setView("pick")}
          className="mb-6 text-sm text-zinc-500 hover:text-red-600"
        >
          ← Auswahl ändern
        </button>
        <VocabPractice
          vocabulary={selectedVocab}
          title={`Eigene Vokabeln (${selectedVocab.length})`}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-500">
          {selectedIds.size} Wörter ausgewählt
        </p>
        <div className="flex flex-wrap gap-2">
          <select
            value={lessonFilter}
            onChange={(e) =>
              setLessonFilter(
                e.target.value === "all" ? "all" : Number(e.target.value)
              )
            }
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800"
          >
            <option value="all">Alle Lektionen</option>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                Lektion {n}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleSelectAll}
            className="rounded-lg bg-zinc-100 px-3 py-1.5 text-sm dark:bg-zinc-800"
          >
            Alle sichtbaren wählen
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:text-red-600"
          >
            Leeren
          </button>
        </div>
      </div>

      <VocabTable
        items={filtered}
        selectedIds={selectedIds}
        onToggle={handleToggle}
        showLesson
      />

      <button
        type="button"
        disabled={selectedIds.size === 0}
        onClick={() => setView("practice")}
        className="mt-8 w-full rounded-xl bg-red-600 py-3 font-medium text-white hover:bg-red-700 disabled:opacity-40"
      >
        {selectedIds.size > 0
          ? `${selectedIds.size} Wörter üben →`
          : "Wörter auswählen"}
      </button>
    </div>
  );
}
