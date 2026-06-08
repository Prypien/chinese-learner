"use client";

import { HandwritingQuiz } from "./HandwritingQuiz";
import type { VocabItem } from "@/lib/types";

interface SchreibenClientProps {
  vocabulary: (VocabItem & { lessonId: number })[];
}

export function SchreibenClient({ vocabulary }: SchreibenClientProps) {
  return <HandwritingQuiz vocabulary={vocabulary} />;
}
