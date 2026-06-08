export interface LocalizedText {
  zh: string;
  pinyin: string;
  de: string;
}

export interface DialogueLine {
  speaker: string;
  zh: string;
  pinyin: string;
  de: string;
}

export interface Dialogue {
  id: string;
  title: LocalizedText;
  lines: DialogueLine[];
  comprehensionQuestions: ComprehensionQuestion[];
}

export interface ComprehensionQuestion {
  id: string;
  questionDe: string;
  answerType: "yesno" | "text";
  correctAnswer: string;
  acceptableAnswers?: string[];
}

export interface VocabItem {
  id: string;
  traditional: string;
  pinyin: string;
  german: string;
  pos?: string;
  /** Extra search keywords (German phrases, alternate spellings) */
  searchTerms?: string[];
}

export interface GrammarExample {
  zh: string;
  pinyin: string;
  de: string;
}

export interface GrammarExercise {
  id: string;
  type: "fill-blank" | "yes-no-pattern";
  promptDe: string;
  sentenceBefore: string;
  sentenceAfter: string;
  correctAnswer: string;
  acceptableAnswers?: string[];
  hintDe?: string;
}

export interface GrammarPoint {
  id: string;
  title: { zh: string; de: string };
  pattern: string;
  explanationDe: string;
  examples: GrammarExample[];
  exercises: GrammarExercise[];
}

export interface Lesson {
  id: 1 | 2 | 3 | 4;
  title: LocalizedText;
  objectives: string[];
  dialogues: Dialogue[];
  vocabulary: VocabItem[];
  grammar: GrammarPoint[];
}

export type QuizDirection =
  | "de-to-zh"
  | "de-to-pinyin"
  | "pinyin-to-zh"
  | "zh-to-de";

export interface ProgressStats {
  masteredVocab: Record<string, boolean>;
  weakVocab: Record<string, number>;
  grammarCompleted: Record<string, boolean>;
  lastStudied?: string;
}
