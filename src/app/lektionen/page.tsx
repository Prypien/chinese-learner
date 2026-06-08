import Link from "next/link";
import { Header } from "@/components/Header";
import { LessonCard } from "@/components/LessonCard";
import { getAllLessons } from "@/lib/lessons";

export default function LektionenPage() {
  const lessons = getAllLessons();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl flex-1 px-4 py-8">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-zinc-500 hover:text-red-600"
        >
          ← Zurück
        </Link>
        <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Lektionen
        </h1>
        <p className="mb-8 text-sm text-zinc-500">
          Vokabeln und Schreibübungen pro Lektion
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
