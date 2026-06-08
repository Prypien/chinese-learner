import Link from "next/link";
import { Header } from "@/components/Header";

const SECTIONS = [
  {
    href: "/lessons",
    title: "Lessons",
    subtitle: "L1–L4 · overview & practice by lesson",
    emoji: "📖",
    primary: true,
  },
  {
    href: "/vocabulary",
    title: "Vocabulary",
    subtitle: "All words · filter & handwriting practice",
    emoji: "词",
    primary: false,
  },
  {
    href: "/jens-text",
    title: "Jen's Text",
    subtitle: "Your introduction · exam vocabulary",
    emoji: "📝",
    primary: false,
    highlight: true,
  },
  {
    href: "/custom-vocabulary",
    title: "Custom Vocabulary",
    subtitle: "Pick words · build your own list",
    emoji: "✓",
    primary: false,
  },
] as const;

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl flex-1 px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            當代中文課程
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Handwriting practice · Lessons 1–4
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {SECTIONS.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className={`flex flex-col rounded-2xl p-6 transition ${
                section.primary
                  ? "bg-red-600 text-white shadow-lg hover:bg-red-700"
                  : "highlight" in section && section.highlight
                    ? "border-2 border-emerald-200 bg-emerald-50 hover:border-emerald-400 dark:border-emerald-900 dark:bg-emerald-950/20"
                    : "border border-zinc-200 bg-white hover:border-red-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-red-800"
              }`}
            >
              <span className="text-2xl">{section.emoji}</span>
              <p
                className={`mt-3 text-lg font-semibold ${
                  section.primary
                    ? "text-white"
                    : "highlight" in section && section.highlight
                      ? "text-emerald-800 dark:text-emerald-200"
                      : "text-zinc-900 dark:text-zinc-100"
                }`}
              >
                {section.title}
              </p>
              <p
                className={`mt-1 text-sm ${
                  section.primary
                    ? "text-red-100"
                    : "highlight" in section && section.highlight
                      ? "text-emerald-700/80 dark:text-emerald-300/80"
                      : "text-zinc-500"
                }`}
              >
                {section.subtitle}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
