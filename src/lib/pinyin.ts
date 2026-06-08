const TONE_MAP: Record<string, string> = {
  ā: "a",
  á: "a",
  ǎ: "a",
  à: "a",
  ē: "e",
  é: "e",
  ě: "e",
  è: "e",
  ī: "i",
  í: "i",
  ǐ: "i",
  ì: "i",
  ō: "o",
  ó: "o",
  ǒ: "o",
  ò: "o",
  ū: "u",
  ú: "u",
  ǔ: "u",
  ù: "u",
  ǖ: "v",
  ǘ: "v",
  ǚ: "v",
  ǜ: "v",
  ü: "v",
};

export function stripTones(input: string): string {
  return input
    .split("")
    .map((char) => TONE_MAP[char] ?? char.toLowerCase())
    .join("");
}

export function normalizePinyin(input: string, requireTones = false): string {
  let value = input.trim().toLowerCase();
  value = value.replace(/ü/g, "v");
  value = value.replace(/\s+/g, " ");
  if (!requireTones) {
    value = stripTones(value);
  }
  return value;
}

export function pinyinMatches(
  input: string,
  expected: string,
  requireTones = false
): boolean {
  const normalizedInput = normalizePinyin(input, requireTones);
  const normalizedExpected = normalizePinyin(expected, requireTones);
  const inputNoSpaces = normalizedInput.replace(/\s/g, "");
  const expectedNoSpaces = normalizedExpected.replace(/\s/g, "");

  if (inputNoSpaces === expectedNoSpaces) return true;
  if (normalizedInput === normalizedExpected) return true;

  const inputSyllables = normalizedInput.split(" ").filter(Boolean);
  const expectedSyllables = normalizedExpected.split(" ").filter(Boolean);
  if (
    inputSyllables.length === expectedSyllables.length &&
    inputSyllables.every((s, i) => s === expectedSyllables[i])
  ) {
    return true;
  }

  return false;
}

export function germanMatches(input: string, expected: string): boolean {
  const normalize = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .replace(/[.,!?;:'"]/g, "")
      .replace(/\s+/g, " ");
  const a = normalize(input);
  const b = normalize(expected);
  if (a === b) return true;
  if (b.includes("/")) {
    return b.split("/").some((part) => normalize(part) === a);
  }
  return false;
}

export function chineseMatches(input: string, expected: string): boolean {
  return input.trim().replace(/\s/g, "") === expected.trim().replace(/\s/g, "");
}
