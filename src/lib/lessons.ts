import type { Lesson } from "../../content/schema";
import lesson01 from "../../content/book1/lesson-01.json";
import lesson02 from "../../content/book1/lesson-02.json";
import lesson03 from "../../content/book1/lesson-03.json";
import lesson04 from "../../content/book1/lesson-04.json";

const lessons: Lesson[] = [
  lesson01 as Lesson,
  lesson02 as Lesson,
  lesson03 as Lesson,
  lesson04 as Lesson,
];

export function getAllLessons(): Lesson[] {
  return lessons;
}

export function getLesson(id: number): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}

export function getAllVocabulary() {
  return lessons.flatMap((l) =>
    l.vocabulary.map((v) => ({ ...v, lessonId: l.id }))
  );
}

export function getAllGrammarExercises() {
  return lessons.flatMap((l) =>
    l.grammar.flatMap((g) =>
      g.exercises.map((e) => ({
        ...e,
        lessonId: l.id,
        grammarTitle: g.title.de,
      }))
    )
  );
}

export function getAllComprehensionQuestions() {
  return lessons.flatMap((l) =>
    l.dialogues.flatMap((d) =>
      d.comprehensionQuestions.map((q) => ({
        ...q,
        lessonId: l.id,
        dialogueTitle: d.title.de,
      }))
    )
  );
}

export function getVocabById(id: string) {
  return getAllVocabulary().find((v) => v.id === id);
}
