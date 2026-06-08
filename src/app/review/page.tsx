import Link from "next/link";
import { Header } from "@/components/Header";
import { WeakVocabReview } from "@/components/WeakVocabReview";

export default function ReviewPage() {
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
          Schwächen wiederholen
        </h1>
        <p className="mb-6 text-sm text-zinc-500">
          Wörter, die du falsch beantwortet hast, erscheinen hier automatisch.
        </p>
        <WeakVocabReview />
      </main>
    </>
  );
}
