import type { VocabItem } from "@/lib/types";
import { splitCharacters } from "@/lib/characters";

/** Pinyin hint for one character within a vocab item. */
export function getCharPinyin(item: VocabItem, charIndex: number): string {
  const chars = splitCharacters(item.traditional);
  const syllables = item.pinyin.trim().split(/\s+/).filter(Boolean);

  if (syllables.length === chars.length) {
    return syllables[charIndex] ?? item.pinyin;
  }

  if (chars.length === 1) {
    return item.pinyin;
  }

  return item.pinyin;
}
