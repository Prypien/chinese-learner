"use client";

import { useEffect, useRef, useState } from "react";
import HanziWriter from "hanzi-writer";

export interface CharacterWriterProps {
  character: string;
  showOutline: boolean;
  onComplete: () => void;
  onError: () => void;
  size?: number;
}

function useWriterSize(defaultSize: number) {
  const [size, setSize] = useState(defaultSize);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 480) setSize(Math.min(w - 48, 320));
      else if (w < 900) setSize(300);
      else setSize(defaultSize);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [defaultSize]);

  return size;
}

export function CharacterWriter({
  character,
  showOutline,
  onComplete,
  onError,
  size: defaultSize = 260,
}: CharacterWriterProps) {
  const size = useWriterSize(defaultSize);
  const containerRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  const onErrorRef = useRef(onError);

  onCompleteRef.current = onComplete;
  onErrorRef.current = onError;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.innerHTML = "";

    const writer = HanziWriter.create(el, character, {
      width: size,
      height: size,
      padding: 16,
      showCharacter: false,
      showOutline,
      strokeColor: "#71717a",
      outlineColor: "#e4e4e7",
      drawingColor: "#dc2626",
      drawingWidth: 22,
      highlightColor: "#dc2626",
      onLoadCharDataError: () => onErrorRef.current(),
    });

    writer.quiz({
      showHintAfterMisses: 3,
      highlightOnComplete: true,
      showOutline,
      onComplete: () => onCompleteRef.current(),
    });

    return () => {
      writer.cancelQuiz();
      el.innerHTML = "";
    };
  }, [character, showOutline, size]);

  return (
    <div
      ref={containerRef}
      className="touch-none select-none [-webkit-touch-callout:none] [&_svg]:mx-auto"
      aria-label={`Zeichne ${character}`}
    />
  );
}

/** Extract CJK characters for handwriting practice (skip punctuation). */
export function extractWritableCharacters(text: string): string[] {
  return [...text].filter((c) => /[\u4e00-\u9fff]/.test(c));
}

/** Unique CJK characters in order of first appearance. */
export function extractUniqueWritableCharacters(text: string): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const c of text) {
    if (/[\u4e00-\u9fff]/.test(c) && !seen.has(c)) {
      seen.add(c);
      result.push(c);
    }
  }
  return result;
}
