"use client";

import type { VocabItem } from "@/lib/types";

interface VocabTableProps {
  items: (VocabItem & { lessonId?: number })[];
  selectedIds?: Set<string>;
  onToggle?: (id: string) => void;
  showLesson?: boolean;
}

export function VocabTable({
  items,
  selectedIds,
  onToggle,
  showLesson = false,
}: VocabTableProps) {
  const selectable = Boolean(onToggle);

  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-50 dark:bg-zinc-900">
          <tr>
            {selectable && <th className="w-10 px-4 py-3" />}
            {showLesson && (
              <th className="px-4 py-3 font-medium">Lesson</th>
            )}
            <th className="px-4 py-3 font-medium">Traditional</th>
            <th className="px-4 py-3 font-medium">Pinyin</th>
            <th className="px-4 py-3 font-medium">English</th>
          </tr>
        </thead>
        <tbody>
          {items.map((v) => (
            <tr
              key={v.id}
              className={`border-t border-zinc-100 dark:border-zinc-800 ${
                selectable && selectedIds?.has(v.id)
                  ? "bg-red-50 dark:bg-red-950/20"
                  : ""
              }`}
            >
              {selectable && (
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds?.has(v.id) ?? false}
                    onChange={() => onToggle?.(v.id)}
                    className="h-4 w-4 rounded border-zinc-300"
                  />
                </td>
              )}
              {showLesson && (
                <td className="px-4 py-3 text-zinc-500">L{v.lessonId}</td>
              )}
              <td className="font-chinese px-4 py-3 text-xl">{v.traditional}</td>
              <td className="px-4 py-3 text-zinc-500">{v.pinyin}</td>
              <td className="px-4 py-3">{v.german}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
