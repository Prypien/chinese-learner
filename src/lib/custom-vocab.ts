const STORAGE_KEY = "chinese-learner-custom-vocab";

export function loadCustomVocabIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function saveCustomVocabIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function toggleCustomVocabId(id: string): string[] {
  const current = loadCustomVocabIds();
  const next = current.includes(id)
    ? current.filter((x) => x !== id)
    : [...current, id];
  saveCustomVocabIds(next);
  return next;
}
