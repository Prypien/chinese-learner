import { getAllVocabulary } from "./lessons";
import { normalizePinyin } from "./pinyin";
import type { VocabItem } from "@/lib/types";

export type VocabWithLesson = VocabItem & { lessonId: number };

function normalizeForSearch(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:'"]/g, "")
    .replace(/\s+/g, " ");
}

/** German-friendly: ß→ss, umlauts → ae/oe/ue for fuzzy matching */
function normalizeGerman(text: string): string {
  return normalizeForSearch(text)
    .replace(/ß/g, "ss")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue");
}

function textMatchesGermanQuery(text: string, query: string): boolean {
  const q = normalizeGerman(query);
  if (!q) return false;

  const parts = text.split("/").map((p) => normalizeGerman(p));

  if (q.length <= 3) {
    return parts.some((part) => {
      if (part === q) return true;
      return part.split(" ").some((word) => word === q);
    });
  }

  return parts.some((part) => {
    if (part.includes(q)) return true;
    const qWords = q.split(" ").filter(Boolean);
    return qWords.length > 1 && qWords.every((word) => part.includes(word));
  });
}

function germanMatchesQuery(german: string, query: string): boolean {
  return (
    textMatchesGermanQuery(german, query) ||
    textMatchesGermanQuery(normalizeForSearch(german), query)
  );
}

function searchTermsMatch(item: VocabItem, query: string): boolean {
  if (!item.searchTerms?.length) return false;
  return item.searchTerms.some((term) => textMatchesGermanQuery(term, query));
}

function pinyinMatchesQuery(pinyin: string, query: string): boolean {
  const normalizedPinyin = normalizePinyin(pinyin, false);
  const normalizedQuery = normalizePinyin(query, false);

  if (!normalizedQuery) return false;

  const querySyllables = normalizedQuery.split(" ").filter(Boolean);
  const pinyinSyllables = normalizedPinyin.split(" ").filter(Boolean);

  if (normalizedQuery.length <= 3) {
    return (
      pinyinSyllables.some((s) => s === normalizedQuery) ||
      querySyllables.some((qs) => pinyinSyllables.some((s) => s === qs))
    );
  }

  if (normalizedPinyin.includes(normalizedQuery)) return true;

  const pinyinCompact = normalizedPinyin.replace(/\s/g, "");
  const queryCompact = normalizedQuery.replace(/\s/g, "");
  if (pinyinCompact.includes(queryCompact)) return true;

  if (querySyllables.length > 1) {
    return querySyllables.every((syllable, i) =>
      pinyinSyllables[i]?.startsWith(syllable)
    );
  }

  return pinyinSyllables.some((syllable) =>
    syllable.startsWith(querySyllables[0] ?? "")
  );
}

/** e.g. "tai le" matches "tài hǎo le" */
function pinyinLooseMatch(pinyin: string, query: string): boolean {
  const querySyllables = normalizePinyin(query, false).split(" ").filter(Boolean);
  if (querySyllables.length < 2) return false;

  const pinyinSyllables = normalizePinyin(pinyin, false).split(" ").filter(Boolean);
  let qi = 0;
  for (const syllable of pinyinSyllables) {
    if (syllable.startsWith(querySyllables[qi] ?? "")) {
      qi++;
      if (qi >= querySyllables.length) return true;
    }
  }
  return false;
}

export function searchVocabulary(query: string): VocabWithLesson[] {
  const q = query.trim();
  if (!q) return [];

  return getAllVocabulary().filter((item) => {
    if (germanMatchesQuery(item.german, q)) return true;
    if (searchTermsMatch(item, q)) return true;
    if (pinyinMatchesQuery(item.pinyin, q)) return true;
    if (pinyinLooseMatch(item.pinyin, q)) return true;
    if (item.traditional.includes(q)) return true;
    return false;
  });
}

function matchScore(item: VocabWithLesson, query: string): number {
  const qDe = normalizeGerman(query);
  const qPy = normalizePinyin(query, false);
  const itemDe = normalizeGerman(item.german);
  const itemPy = normalizePinyin(item.pinyin, false);

  if (itemDe === qDe || itemPy === qPy) return 0;
  if (item.searchTerms?.some((t) => normalizeGerman(t) === qDe)) return 0;
  if (itemDe.startsWith(qDe) || itemPy.startsWith(qPy)) return 1;
  if (germanMatchesQuery(item.german, query) || searchTermsMatch(item, query))
    return 2;
  if (pinyinMatchesQuery(item.pinyin, query) || pinyinLooseMatch(item.pinyin, query))
    return 3;
  return 4;
}

export function sortSearchResults(
  results: VocabWithLesson[],
  query: string
): VocabWithLesson[] {
  return [...results].sort((a, b) => {
    const scoreDiff = matchScore(a, query) - matchScore(b, query);
    if (scoreDiff !== 0) return scoreDiff;
    return a.german.localeCompare(b.german, "de");
  });
}

export function getMatchType(
  item: VocabWithLesson,
  query: string
): "de" | "pinyin" | "zh" | null {
  const q = query.trim();
  if (!q) return null;
  if (germanMatchesQuery(item.german, q) || searchTermsMatch(item, q))
    return "de";
  if (pinyinMatchesQuery(item.pinyin, q) || pinyinLooseMatch(item.pinyin, q))
    return "pinyin";
  if (item.traditional.includes(q)) return "zh";
  return null;
}
