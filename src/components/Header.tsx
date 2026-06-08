import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link href="/" className="group flex items-center gap-2">
          <span className="text-2xl font-bold text-red-600">中</span>
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Chinese Learner
            </p>
            <p className="text-xs text-zinc-500">當代中文課程 · L1–L4</p>
          </div>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/suche"
            className="rounded-lg px-3 py-1.5 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Suche
          </Link>
          <Link
            href="/schreiben"
            className="hidden rounded-lg px-3 py-1.5 font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 sm:inline-block"
          >
            Schreiben
          </Link>
          <Link
            href="/vorstellung"
            className="hidden rounded-lg px-3 py-1.5 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 sm:inline-block"
          >
            Vorstellung
          </Link>
          <Link
            href="/exam"
            className="rounded-lg bg-red-600 px-3 py-1.5 font-medium text-white hover:bg-red-700"
          >
            Prüfung
          </Link>
          <Link
            href="/review"
            className="rounded-lg px-3 py-1.5 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Schwächen
          </Link>
        </nav>
      </div>
    </header>
  );
}
