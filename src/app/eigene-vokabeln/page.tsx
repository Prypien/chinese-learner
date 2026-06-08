import Link from "next/link";
import { Header } from "@/components/Header";
import { CustomVocabClient } from "@/components/CustomVocabClient";

export default function EigeneVokabelnPage() {
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
          Eigene Vokabeln
        </h1>
        <p className="mb-8 text-sm text-zinc-500">
          Wähle die Wörter aus, die du üben willst — deine Auswahl wird
          gespeichert.
        </p>
        <CustomVocabClient />
      </main>
    </>
  );
}
