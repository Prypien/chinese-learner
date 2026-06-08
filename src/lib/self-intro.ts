export interface SelfIntroLine {
  zh: string;
  pinyin: string;
  de: string;
}

export interface SelfIntroDraft {
  german: string;
  chinese: string;
  pinyin: string;
  lines: SelfIntroLine[];
  updatedAt: string;
}

export interface SelfIntroForm {
  nameZh: string;
  useFamilyName: boolean;
  familyNameZh: string;
  countryKey: string;
  drink: "tea" | "coffee" | "none";
  studyChinese: boolean;
  extraDe: string;
}

export const COUNTRIES: { key: string; zh: string; de: string; demonym: string }[] = [
  { key: "taiwan", zh: "臺灣", de: "Taiwan", demonym: "臺灣人" },
  { key: "germany", zh: "德國", de: "Deutschland", demonym: "德國人" },
  { key: "usa", zh: "美國", de: "USA", demonym: "美國人" },
  { key: "japan", zh: "日本", de: "Japan", demonym: "日本人" },
  { key: "vietnam", zh: "越南", de: "Vietnam", demonym: "越南人" },
  { key: "china", zh: "中國", de: "China", demonym: "中國人" },
];

const STORAGE_KEY = "chinese-learner-self-intro";

export function buildSelfIntroFromForm(form: SelfIntroForm): SelfIntroDraft {
  const country = COUNTRIES.find((c) => c.key === form.countryKey) ?? COUNTRIES[1];
  const lines: SelfIntroLine[] = [
    { zh: "你好！", pinyin: "Nǐ hǎo!", de: "Hallo!" },
  ];

  if (form.nameZh.trim()) {
    lines.push({
      zh: `我叫${form.nameZh.trim()}。`,
      pinyin: `Wǒ jiào ${form.nameZh.trim()}.`,
      de: `Ich heiße ${form.nameZh.trim()}.`,
    });
  }

  if (form.useFamilyName && form.familyNameZh.trim()) {
    lines.push({
      zh: `我姓${form.familyNameZh.trim()}。`,
      pinyin: `Wǒ xìng ${form.familyNameZh.trim()}.`,
      de: `Mein Familienname ist ${form.familyNameZh.trim()}.`,
    });
  }

  lines.push({
    zh: `我是${country.demonym}。`,
    pinyin: `Wǒ shì ${country.zh} rén.`,
    de: `Ich bin ${country.de === "USA" ? "Amerikaner/in" : country.de === "Deutschland" ? "Deutsche/r" : country.de === "Taiwan" ? "Taiwanesin/Taiwanese" : `aus ${country.de}`}.`,
  });

  if (form.drink === "tea") {
    lines.push({
      zh: "我喜歡喝茶。",
      pinyin: "Wǒ xǐhuān hē chá.",
      de: "Ich trinke gerne Tee.",
    });
  } else if (form.drink === "coffee") {
    lines.push({
      zh: "我喜歡喝咖啡。",
      pinyin: "Wǒ xǐhuān hē kāfēi.",
      de: "Ich trinke gerne Kaffee.",
    });
  }

  if (form.studyChinese) {
    lines.push({
      zh: "我來臺灣學中文。",
      pinyin: "Wǒ lái Táiwān xué Zhōngwén.",
      de: "Ich komme nach Taiwan, um Chinesisch zu lernen.",
    });
  }

  if (form.extraDe.trim()) {
    lines.push({
      zh: "",
      pinyin: "",
      de: form.extraDe.trim(),
    });
  }

  const chinese = lines.map((l) => l.zh).filter(Boolean).join("");
  const pinyin = lines.map((l) => l.pinyin).filter(Boolean).join(" ");
  const german = lines.map((l) => l.de).join(" ");

  return {
    german,
    chinese,
    pinyin,
    lines: lines.filter((l) => l.zh),
    updatedAt: new Date().toISOString(),
  };
}

export async function translateGermanToChinese(text: string): Promise<string> {
  const res = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=de|zh-TW`
  );
  if (!res.ok) throw new Error("Übersetzung fehlgeschlagen");
  const data = (await res.json()) as {
    responseData?: { translatedText?: string };
  };
  const translated = data.responseData?.translatedText?.trim();
  if (!translated) throw new Error("Keine Übersetzung erhalten");
  return translated;
}

export function saveSelfIntro(draft: SelfIntroDraft): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function loadSelfIntro(): SelfIntroDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SelfIntroDraft;
  } catch {
    return null;
  }
}

export function draftFromChineseText(
  chinese: string,
  german = "",
  pinyin = ""
): SelfIntroDraft {
  const sentences = chinese
    .split(/(?<=[。！？])/)
    .map((s) => s.trim())
    .filter(Boolean);

  const lines: SelfIntroLine[] = sentences.map((zh) => ({
    zh,
    pinyin: "",
    de: "",
  }));

  return {
    german,
    chinese: sentences.join(""),
    pinyin,
    lines,
    updatedAt: new Date().toISOString(),
  };
}

export const DEFAULT_FORM: SelfIntroForm = {
  nameZh: "",
  useFamilyName: false,
  familyNameZh: "",
  countryKey: "germany",
  drink: "tea",
  studyChinese: true,
  extraDe: "",
};

export const EXAMPLE_GERMAN = `Hallo! Ich heiße Maria. Ich bin Deutsche. Ich trinke gerne Tee. Ich lerne Chinesisch in Taiwan.`;

export const EXAMPLE_CHINESE =
  "你好！我叫Maria。我是德國人。我喜歡喝茶。我來臺灣學中文。";
