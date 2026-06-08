import type { LocalizedText, VocabItem } from "../../content/schema";
import jensTextData from "../../content/jens-text.json";

export type JensTextLine = LocalizedText;

export type JensText = {
  title: LocalizedText;
  lines: JensTextLine[];
  vocabulary: VocabItem[];
};

const jensText = jensTextData as JensText;

export function getJensText(): JensText {
  return jensText;
}

export function getJensTextVocabulary(): VocabItem[] {
  return jensText.vocabulary;
}

/** All unique CJK characters used in Jen's introduction text. */
export function getJensTextUniqueCharacters(): string[] {
  const text = jensText.lines.map((l) => l.zh).join("");
  const seen = new Set<string>();
  const result: string[] = [];
  for (const c of text) {
    if (/[\u4e00-\u9fff]/.test(c) && !seen.has(c)) {
      seen.add(c);
      result.push(c);
    }
  }
  return result;
}
