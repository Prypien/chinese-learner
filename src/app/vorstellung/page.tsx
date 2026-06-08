import Link from "next/link";
import { Header } from "@/components/Header";
import { SelfIntroFlow } from "@/components/SelfIntroFlow";

export default function VorstellungPage() {
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
          Self-Introduction · 自我介紹
        </h1>
        <p className="mb-8 text-sm text-zinc-500">
          Erstelle deine Vorstellung, übersetze sie ins Chinesische und übe,
          alle Zeichen aus dem Kopf zu schreiben — wie in der Klausur.
        </p>
        <SelfIntroFlow />
      </main>
    </>
  );
}
