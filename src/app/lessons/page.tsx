import Link from "next/link";
import { Header } from "@/components/Header";
import { LessonCard } from "@/components/LessonCard";
import { getAllLessons } from "@/lib/lessons";

export default function LessonsPage() {
  const lessons = getAllLessons();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl flex-1 px-4 py-8">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-zinc-500 hover:text-red-600"
        >
          ← Back
        </Link>
        <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Lessons
        </h1>
        <p className="mb-8 text-sm text-zinc-500">
          Vocabulary and handwriting practice by lesson
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </main>
    </>
  );
}
