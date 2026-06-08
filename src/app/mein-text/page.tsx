import Link from "next/link";
import { Header } from "@/components/Header";
import { JenIntroPractice } from "@/components/JenIntroPractice";

export default function MeinTextPage() {
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
          Mein Text · 我的介紹
        </h1>
        <p className="mb-8 text-sm text-zinc-500">
          Übe alle Zeichen aus deiner persönlichen Vorstellung — aus dem Heft
          vom 07.06.2026.
        </p>
        <JenIntroPractice />
      </main>
    </>
  );
}
