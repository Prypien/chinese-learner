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
        <nav className="flex items-center gap-1 text-sm sm:gap-2">
          <Link
            href="/lektionen"
            className="rounded-lg px-3 py-1.5 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Lektionen
          </Link>
          <Link
            href="/vokabeln"
            className="rounded-lg px-3 py-1.5 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Vokabeln
          </Link>
          <Link
            href="/eigene-vokabeln"
            className="rounded-lg bg-red-600 px-3 py-1.5 font-medium text-white hover:bg-red-700"
          >
            Eigene
          </Link>
        </nav>
      </div>
    </header>
  );
}
