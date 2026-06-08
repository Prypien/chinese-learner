import type { ProgressStats } from "@/lib/types";

const STORAGE_KEY = "chinese-learner-progress";

const DEFAULT_STATS: ProgressStats = {
  masteredVocab: {},
  weakVocab: {},
  grammarCompleted: {},
};

export function loadProgress(): ProgressStats {
  if (typeof window === "undefined") return { ...DEFAULT_STATS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATS };
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STATS };
  }
}

export function saveProgress(stats: ProgressStats): void {
  if (typeof window === "undefined") return;
  stats.lastStudied = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function recordVocabResult(
  vocabId: string,
  correct: boolean
): ProgressStats {
  const stats = loadProgress();
  if (correct) {
    stats.masteredVocab[vocabId] = true;
    stats.weakVocab[vocabId] = Math.max(0, (stats.weakVocab[vocabId] ?? 0) - 1);
    if (stats.weakVocab[vocabId] === 0) delete stats.weakVocab[vocabId];
  } else {
    stats.weakVocab[vocabId] = (stats.weakVocab[vocabId] ?? 0) + 1;
    delete stats.masteredVocab[vocabId];
  }
  saveProgress(stats);
  return stats;
}

export function getLessonVocabProgress(
  vocabIds: string[]
): { mastered: number; total: number } {
  const stats = loadProgress();
  const mastered = vocabIds.filter((id) => stats.masteredVocab[id]).length;
  return { mastered, total: vocabIds.length };
}
