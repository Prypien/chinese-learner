"use client";

import { useEffect, useMemo, useState } from "react";
import type { QuizDirection } from "@/lib/types";
import {
  getAllComprehensionQuestions,
  getAllGrammarExercises,
  getAllVocabulary,
} from "@/lib/lessons";
import { VocabQuiz } from "./VocabQuiz";
import { HandwritingQuiz } from "./HandwritingQuiz";
import { GrammarDrill } from "./GrammarDrill";
import { germanMatches } from "@/lib/pinyin";

type ExamPhase = "config" | "vocab" | "grammar" | "comprehension" | "results";

interface ExamConfig {
  vocabCount: number;
  grammarCount: number;
  comprehensionCount: number;
  vocabMode: "write" | "type";
  direction: QuizDirection;
  requireTones: boolean;
}

interface ExamResult {
  vocabScore: number;
  vocabTotal: number;
  grammarScore: number;
  grammarTotal: number;
  comprehensionScore: number;
  comprehensionTotal: number;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function ComprehensionExam({
  count,
  onComplete,
}: {
  count: number;
  onComplete: (score: number, total: number) => void;
}) {
  const questions = useMemo(
    () => shuffle(getAllComprehensionQuestions()).slice(0, count),
    [count]
  );
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    message: string;
  } | null>(null);

  const current = questions[index];

  useEffect(() => {
    if (!questions.length) onComplete(0, 0);
  }, [questions.length, onComplete]);

  const checkAnswer = (value: string): boolean => {
    if (!current) return false;
    if (current.answerType === "yesno") {
      return value.trim().toLowerCase() === current.correctAnswer.toLowerCase();
    }
    const acceptable = [
      current.correctAnswer,
      ...(current.acceptableAnswers ?? []),
    ];
    return acceptable.some(
      (a) => germanMatches(value, a) || value.trim() === a
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!current || feedback) return;
    const correct = checkAnswer(input);
    if (correct) setScore((s) => s + 1);
    setFeedback({
      correct,
      message: correct
        ? "Richtig!"
        : `Falsch. Richtige Antwort: ${current.correctAnswer}`,
    });
  };

  const handleNext = () => {
    if (index + 1 >= questions.length) {
      onComplete(score, questions.length);
      return;
    }
    setIndex((i) => i + 1);
    setInput("");
    setFeedback(null);
  };

  if (!questions.length) {
    return (
      <p className="text-center text-zinc-500">Keine Verständnisfragen verfügbar.</p>
    );
  }

  if (!current) return null;

  return (
    <div className="mx-auto max-w-xl">
      <h2 className="mb-4 text-xl font-semibold">Prüfung — Teil 3: Verständnis</h2>
      <p className="mb-2 text-sm text-zinc-500">
        Frage {index + 1} / {questions.length}
      </p>
      <p className="mb-1 text-xs text-zinc-400">{current.dialogueTitle}</p>
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-lg text-zinc-900 dark:text-zinc-100">
          {current.questionDe}
        </p>
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!!feedback}
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800"
            placeholder={current.answerType === "yesno" ? "ja / nein" : "Antwort…"}
          />
          {!feedback ? (
            <button
              type="submit"
              disabled={!input.trim()}
              className="mt-4 w-full rounded-xl bg-red-600 py-3 text-white disabled:opacity-40"
            >
              Prüfen
            </button>
          ) : (
            <div>
              <p
                className={`rounded-xl p-3 text-sm ${
                  feedback.correct
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40"
                    : "bg-red-50 text-red-800 dark:bg-red-950/40"
                }`}
              >
                {feedback.message}
              </p>
              <button
                type="button"
                onClick={handleNext}
                className="mt-4 w-full rounded-xl bg-zinc-800 py-3 text-white dark:bg-zinc-100 dark:text-zinc-900"
              >
                {index + 1 >= questions.length ? "Ergebnis anzeigen" : "Weiter"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export function ExamMode() {
  const [phase, setPhase] = useState<ExamPhase>("config");
  const [examKey, setExamKey] = useState(0);
  const [config, setConfig] = useState<ExamConfig>({
    vocabCount: 20,
    grammarCount: 5,
    comprehensionCount: 3,
    vocabMode: "write",
    direction: "de-to-zh",
    requireTones: false,
  });
  const [result, setResult] = useState<ExamResult>({
    vocabScore: 0,
    vocabTotal: 0,
    grammarScore: 0,
    grammarTotal: 0,
    comprehensionScore: 0,
    comprehensionTotal: 0,
  });

  const vocabPool = useMemo(
    () => shuffle(getAllVocabulary()).slice(0, config.vocabCount),
    [config.vocabCount, examKey]
  );

  const grammarPool = useMemo(
    () => shuffle(getAllGrammarExercises()).slice(0, config.grammarCount),
    [config.grammarCount, examKey]
  );

  const totalScore =
    result.vocabScore + result.grammarScore + result.comprehensionScore;
  const totalQuestions =
    result.vocabTotal + result.grammarTotal + result.comprehensionTotal;

  const startExam = () => {
    setResult({
      vocabScore: 0,
      vocabTotal: 0,
      grammarScore: 0,
      grammarTotal: 0,
      comprehensionScore: 0,
      comprehensionTotal: 0,
    });
    setExamKey((k) => k + 1);
    setPhase("vocab");
  };

  if (phase === "config") {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-xl font-semibold">Prüfungsmodus konfigurieren</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Gemischter Test über Lektionen 1–4
        </p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Vokabeln
            </span>
            <input
              type="number"
              min={5}
              max={50}
              value={config.vocabCount}
              onChange={(e) =>
                setConfig((c) => ({
                  ...c,
                  vocabCount: Number(e.target.value),
                }))
              }
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
            />
          </label>

          <label className="block">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Grammatikübungen
            </span>
            <input
              type="number"
              min={0}
              max={20}
              value={config.grammarCount}
              onChange={(e) =>
                setConfig((c) => ({
                  ...c,
                  grammarCount: Number(e.target.value),
                }))
              }
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
            />
          </label>

          <label className="block">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Verständnisfragen
            </span>
            <input
              type="number"
              min={0}
              max={12}
              value={config.comprehensionCount}
              onChange={(e) =>
                setConfig((c) => ({
                  ...c,
                  comprehensionCount: Number(e.target.value),
                }))
              }
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
            />
          </label>

          <label className="block">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Vokabel-Modus
            </span>
            <select
              value={config.vocabMode}
              onChange={(e) =>
                setConfig((c) => ({
                  ...c,
                  vocabMode: e.target.value as "write" | "type",
                }))
              }
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
            >
              <option value="write">Schreiben (Maus) — empfohlen</option>
              <option value="type">Tippen (Tastatur)</option>
            </select>
          </label>

          {config.vocabMode === "type" && (
            <>
              <label className="block">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  Vokabel-Richtung
                </span>
                <select
                  value={config.direction}
                  onChange={(e) =>
                    setConfig((c) => ({
                      ...c,
                      direction: e.target.value as QuizDirection,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <option value="de-to-zh">Deutsch → 繁體字</option>
                  <option value="de-to-pinyin">Deutsch → Pinyin</option>
                  <option value="pinyin-to-zh">Pinyin → 繁體字</option>
                  <option value="zh-to-de">繁體字 → Deutsch</option>
                </select>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.requireTones}
                  onChange={(e) =>
                    setConfig((c) => ({ ...c, requireTones: e.target.checked }))
                  }
                />
                <span className="text-sm">Pinyin mit Tönen verlangen</span>
              </label>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={startExam}
          className="mt-8 w-full rounded-xl bg-red-600 py-3 font-medium text-white hover:bg-red-700"
        >
          Prüfung starten
        </button>
      </div>
    );
  }

  if (phase === "vocab") {
    if (config.vocabMode === "write") {
      return (
        <HandwritingQuiz
          key={`vocab-${examKey}`}
          vocabulary={vocabPool}
          title="Prüfung — Teil 1: Zeichen schreiben"
          onComplete={(score, total) => {
            setResult((r) => ({ ...r, vocabScore: score, vocabTotal: total }));
            if (config.grammarCount > 0) setPhase("grammar");
            else if (config.comprehensionCount > 0) setPhase("comprehension");
            else setPhase("results");
          }}
        />
      );
    }

    return (
      <VocabQuiz
        key={`vocab-${examKey}`}
        vocabulary={vocabPool}
        direction={config.direction}
        requireTones={config.requireTones}
        title="Prüfung — Teil 1: Vokabeln"
        onComplete={(score, total) => {
          setResult((r) => ({ ...r, vocabScore: score, vocabTotal: total }));
          if (config.grammarCount > 0) setPhase("grammar");
          else if (config.comprehensionCount > 0) setPhase("comprehension");
          else setPhase("results");
        }}
      />
    );
  }

  if (phase === "grammar") {
    return (
      <GrammarDrill
        key={`grammar-${examKey}`}
        exercises={grammarPool}
        title="Prüfung — Teil 2: Grammatik"
        onComplete={(score, total) => {
          setResult((r) => ({
            ...r,
            grammarScore: score,
            grammarTotal: total,
          }));
          if (config.comprehensionCount > 0) setPhase("comprehension");
          else setPhase("results");
        }}
      />
    );
  }

  if (phase === "comprehension") {
    return (
      <ComprehensionExam
        key={`comp-${examKey}`}
        count={config.comprehensionCount}
        onComplete={(score, total) => {
          setResult((r) => ({
            ...r,
            comprehensionScore: score,
            comprehensionTotal: total,
          }));
          setPhase("results");
        }}
      />
    );
  }

  const percentage =
    totalQuestions > 0
      ? Math.round((totalScore / totalQuestions) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Prüfung abgeschlossen
      </h2>
      <p className="mt-4 text-5xl font-bold text-red-600">{percentage}%</p>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        {totalScore} von {totalQuestions} richtig
      </p>

      <div className="mt-6 space-y-2 text-left text-sm">
        {result.vocabTotal > 0 && (
          <p>
            Vokabeln: {result.vocabScore}/{result.vocabTotal}
          </p>
        )}
        {result.grammarTotal > 0 && (
          <p>
            Grammatik: {result.grammarScore}/{result.grammarTotal}
          </p>
        )}
        {result.comprehensionTotal > 0 && (
          <p>
            Verständnis: {result.comprehensionScore}/
            {result.comprehensionTotal}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => setPhase("config")}
        className="mt-8 rounded-xl bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700"
      >
        Neue Prüfung
      </button>
    </div>
  );
}
