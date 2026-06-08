import Link from "next/link";
import { Header } from "@/components/Header";
import { LessonCard } from "@/components/LessonCard";
import { HomeProgress } from "@/components/WeakVocabReview";
import { getAllLessons } from "@/lib/lessons";

export default function HomePage() {
  const lessons = getAllLessons();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl flex-1 px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            當代中文課程
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Lektionen 1–4 · Traditionelles Chinesisch · Klausurvorbereitung
          </p>
        </div>

        <HomeProgress lessons={lessons} />

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/schreiben"
            className="flex items-center justify-between rounded-2xl bg-red-600 p-6 text-white shadow-lg transition hover:bg-red-700"
          >
            <div>
              <p className="text-lg font-semibold">Zeichen schreiben</p>
              <p className="text-sm text-red-100">
                Mit der Maus zeichnen — Klausur-Modus
              </p>
            </div>
            <span className="text-2xl">✍️</span>
          </Link>
          <Link
            href="/mein-text"
            className="flex items-center justify-between rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6 transition hover:border-emerald-400 dark:border-emerald-900 dark:bg-emerald-950/20"
          >
            <div>
              <p className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
                Mein Text
              </p>
              <p className="text-sm text-emerald-700/80 dark:text-emerald-300/80">
                Deine Vorstellung · alle Zeichen zeichnen
              </p>
            </div>
            <span className="text-2xl">📝</span>
          </Link>
          <Link
            href="/vorstellung"
            className="flex items-center justify-between rounded-2xl border-2 border-red-200 bg-red-50 p-6 transition hover:border-red-400 dark:border-red-900 dark:bg-red-950/20 sm:col-span-2"
          >
            <div>
              <p className="text-lg font-semibold text-red-800 dark:text-red-200">
                Self-Introduction
              </p>
              <p className="text-sm text-red-700/80 dark:text-red-300/80">
                Vorstellung schreiben · 自我介紹
              </p>
            </div>
            <span className="text-2xl">🙋</span>
          </Link>
        </div>

        <Link
          href="/exam"
          className="mb-8 flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-red-300 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
              Prüfungsmodus
            </p>
            <p className="text-sm text-zinc-500">Gemischter Test · L1–L4</p>
          </div>
          <span className="text-xl text-zinc-300">→</span>
        </Link>

        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Lektionen
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </main>
    </>
  );
}
