import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { LessonDetail } from "@/components/LessonDetail";
import { getAllLessons, getLesson } from "@/lib/lessons";

export function generateStaticParams() {
  return getAllLessons().map((lesson) => ({
    id: String(lesson.id),
  }));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lessonId = Number(id);
  const lesson = getLesson(lessonId);

  if (!lesson) notFound();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl flex-1 px-4 py-8">
        <Link
          href="/lektionen"
          className="mb-6 inline-block text-sm text-zinc-500 hover:text-red-600"
        >
          ← Lektionen
        </Link>
        <LessonDetail lesson={lesson} />
      </main>
    </>
  );
}
