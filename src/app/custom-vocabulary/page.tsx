import Link from "next/link";
import { Header } from "@/components/Header";
import { CustomVocabClient } from "@/components/CustomVocabClient";

export default function CustomVocabularyPage() {
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
          Custom vocabulary
        </h1>
        <p className="mb-8 text-sm text-zinc-500">
          Pick the words you want to practice — your selection is saved.
        </p>
        <CustomVocabClient />
      </main>
    </>
  );
}
