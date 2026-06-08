"use client";

import { useEffect, useState } from "react";
import {
  buildSelfIntroFromForm,
  COUNTRIES,
  DEFAULT_FORM,
  draftFromChineseText,
  EXAMPLE_GERMAN,
  loadSelfIntro,
  saveSelfIntro,
  translateGermanToChinese,
  type SelfIntroDraft,
  type SelfIntroForm,
} from "@/lib/self-intro";
import { TextHandwriting } from "./TextHandwriting";

type Step = "compose" | "preview" | "practice" | "exam";
type ComposeMode = "assistant" | "german" | "chinese";

export function SelfIntroFlow() {
  const [step, setStep] = useState<Step>("compose");
  const [composeMode, setComposeMode] = useState<ComposeMode>("assistant");
  const [form, setForm] = useState<SelfIntroForm>(DEFAULT_FORM);
  const [germanText, setGermanText] = useState("");
  const [chineseText, setChineseText] = useState("");
  const [draft, setDraft] = useState<SelfIntroDraft | null>(null);
  const [translating, setTranslating] = useState(false);
  const [translateError, setTranslateError] = useState<string | null>(null);

  useEffect(() => {
    const saved = loadSelfIntro();
    if (saved?.chinese) {
      setDraft(saved);
      setChineseText(saved.chinese);
      setGermanText(saved.german);
    }
  }, []);

  const handleAssistantBuild = () => {
    const built = buildSelfIntroFromForm(form);
    setDraft(built);
    setChineseText(built.chinese);
    setGermanText(built.german);
    saveSelfIntro(built);
    setStep("preview");
  };

  const handleGermanTranslate = async () => {
    if (!germanText.trim()) return;
    setTranslating(true);
    setTranslateError(null);
    try {
      const translated = await translateGermanToChinese(germanText.trim());
      const built = draftFromChineseText(translated, germanText.trim());
      setDraft(built);
      setChineseText(translated);
      saveSelfIntro(built);
      setStep("preview");
    } catch {
      setTranslateError(
        "Automatische Übersetzung fehlgeschlagen. Nutze den Assistenten oder gib den Chinesischen Text direkt ein."
      );
    } finally {
      setTranslating(false);
    }
  };

  const handleChineseDirect = () => {
    if (!chineseText.trim()) return;
    const built = draftFromChineseText(
      chineseText.trim(),
      germanText.trim(),
      draft?.pinyin ?? ""
    );
    setDraft(built);
    saveSelfIntro(built);
    setStep("preview");
  };

  const handleSavePreview = () => {
    const built = draftFromChineseText(
      chineseText.trim(),
      germanText.trim(),
      draft?.pinyin ?? ""
    );
    setDraft(built);
    saveSelfIntro(built);
  };

  return (
    <div>
      <div className="mb-8 flex gap-2 overflow-x-auto">
        {(
          [
            ["compose", "1. Erstellen"],
            ["preview", "2. Anpassen"],
            ["practice", "3. Schreiben"],
            ["exam", "4. Aus dem Kopf"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              if (id !== "compose" && !chineseText.trim()) return;
              if (id === "preview") handleSavePreview();
              setStep(id);
            }}
            disabled={id !== "compose" && !chineseText.trim()}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ${
              step === id
                ? "bg-red-600 text-white"
                : "bg-zinc-100 text-zinc-600 disabled:opacity-40 dark:bg-zinc-800 dark:text-zinc-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {step === "compose" && (
        <div className="space-y-6">
          <div className="flex gap-2">
            {(
              [
                ["assistant", "Assistent"],
                ["german", "Deutsch → 中文"],
                ["chinese", "中文 direkt"],
              ] as const
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setComposeMode(mode)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  composeMode === mode
                    ? "bg-red-600 text-white"
                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {composeMode === "assistant" && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="mb-4 text-sm text-zinc-500">
                Baue deine Vorstellung aus Lektion-1-Mustern (繁體字, prüfungssicher).
              </p>
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm text-zinc-600">Name (中文)</span>
                  <input
                    value={form.nameZh}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, nameZh: e.target.value }))
                    }
                    placeholder="z.B. 王開文"
                    className="font-chinese mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-lg dark:border-zinc-700 dark:bg-zinc-800"
                  />
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.useFamilyName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, useFamilyName: e.target.checked }))
                    }
                  />
                  Auch Familienname (我姓…)
                </label>
                {form.useFamilyName && (
                  <input
                    value={form.familyNameZh}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, familyNameZh: e.target.value }))
                    }
                    placeholder="z.B. 王"
                    className="font-chinese w-full rounded-lg border border-zinc-300 px-3 py-2 text-lg dark:border-zinc-700 dark:bg-zinc-800"
                  />
                )}

                <label className="block">
                  <span className="text-sm text-zinc-600">Herkunft</span>
                  <select
                    value={form.countryKey}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, countryKey: e.target.value }))
                    }
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.de} ({c.demonym})
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm text-zinc-600">Getränk</span>
                  <select
                    value={form.drink}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        drink: e.target.value as SelfIntroForm["drink"],
                      }))
                    }
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                  >
                    <option value="tea">喜歡喝茶</option>
                    <option value="coffee">喜歡喝咖啡</option>
                    <option value="none">— weglassen —</option>
                  </select>
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.studyChinese}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        studyChinese: e.target.checked,
                      }))
                    }
                  />
                  我來臺灣學中文。
                </label>
              </div>
              <button
                type="button"
                onClick={handleAssistantBuild}
                disabled={!form.nameZh.trim()}
                className="mt-6 w-full rounded-xl bg-red-600 py-3 font-medium text-white hover:bg-red-700 disabled:opacity-40"
              >
                Vorstellung erstellen →
              </button>
            </div>
          )}

          {composeMode === "german" && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="mb-4 text-sm text-zinc-500">
                Schreibe deine Vorstellung auf Deutsch — sie wird ins Chinesische
                übersetzt. Bitte danach die 繁體字 prüfen und anpassen.
              </p>
              <textarea
                value={germanText}
                onChange={(e) => setGermanText(e.target.value)}
                rows={6}
                placeholder={EXAMPLE_GERMAN}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
              />
              {translateError && (
                <p className="mt-2 text-sm text-red-600">{translateError}</p>
              )}
              <button
                type="button"
                onClick={handleGermanTranslate}
                disabled={!germanText.trim() || translating}
                className="mt-4 w-full rounded-xl bg-red-600 py-3 font-medium text-white hover:bg-red-700 disabled:opacity-40"
              >
                {translating ? "Übersetze…" : "Ins Chinesische übersetzen →"}
              </button>
            </div>
          )}

          {composeMode === "chinese" && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="mb-4 text-sm text-zinc-500">
                Füge deinen fertigen chinesischen Text ein (繁體字).
              </p>
              <label className="mb-4 block">
                <span className="text-sm text-zinc-600">Deutsch (optional, als Hilfe)</span>
                <textarea
                  value={germanText}
                  onChange={(e) => setGermanText(e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                />
              </label>
              <textarea
                value={chineseText}
                onChange={(e) => setChineseText(e.target.value)}
                rows={6}
                placeholder="你好！我叫…"
                className="font-chinese w-full rounded-lg border border-zinc-300 px-3 py-2 text-lg dark:border-zinc-700 dark:bg-zinc-800"
              />
              <button
                type="button"
                onClick={handleChineseDirect}
                disabled={!chineseText.trim()}
                className="mt-4 w-full rounded-xl bg-red-600 py-3 font-medium text-white hover:bg-red-700 disabled:opacity-40"
              >
                Speichern & weiter →
              </button>
            </div>
          )}
        </div>
      )}

      {step === "preview" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="font-semibold">Deine Vorstellung</h3>
            {draft?.lines && draft.lines.length > 0 && (
              <div className="mt-4 space-y-3">
                {draft.lines.map((line, i) => (
                  <div key={i} className="border-l-2 border-red-200 pl-3">
                    <p className="font-chinese text-xl">{line.zh}</p>
                    {line.pinyin && (
                      <p className="text-sm text-zinc-500">{line.pinyin}</p>
                    )}
                    <p className="text-sm italic text-zinc-600">{line.de}</p>
                  </div>
                ))}
              </div>
            )}

            <label className="mt-6 block">
              <span className="text-sm font-medium text-zinc-600">
                Chinesischer Text (bearbeiten)
              </span>
              <textarea
                value={chineseText}
                onChange={(e) => setChineseText(e.target.value)}
                rows={5}
                className="font-chinese mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2 text-lg dark:border-zinc-700 dark:bg-zinc-800"
              />
            </label>
            <label className="mt-4 block">
              <span className="text-sm text-zinc-600">Deutsch (Referenz)</span>
              <textarea
                value={germanText}
                onChange={(e) => setGermanText(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
              />
            </label>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  handleSavePreview();
                  setStep("practice");
                }}
                className="flex-1 rounded-xl bg-red-600 py-3 font-medium text-white hover:bg-red-700"
              >
                Schreiben üben →
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "practice" && (
        <div>
          {germanText && (
            <div className="mb-6 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
              <p className="text-xs uppercase text-zinc-400">Deutsch</p>
              <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                {germanText}
              </p>
            </div>
          )}
          <TextHandwriting
            text={chineseText}
            title="Vorstellung schreiben (mit Hilfe)"
          />
          <button
            type="button"
            onClick={() => setStep("exam")}
            className="mt-8 w-full rounded-xl border border-red-300 py-3 font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/30"
          >
            Bereit? Aus dem Kopf schreiben →
          </button>
        </div>
      )}

      {step === "exam" && (
        <div>
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
            <p className="font-medium text-amber-900 dark:text-amber-200">
              Prüfungsmodus: Aus dem Kopf
            </p>
            <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
              Nur die deutsche Bedeutung als Hilfe — kein Umriss. Schreibe jedes
              Zeichen aus dem Gedächtnis, wie in der Klausur.
            </p>
          </div>
          {germanText && (
            <div className="mb-6 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
              <p className="text-xs uppercase text-zinc-400">Was du sagen willst</p>
              <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                {germanText}
              </p>
            </div>
          )}
          <ExamHandwriting text={chineseText} />
        </div>
      )}
    </div>
  );
}

function ExamHandwriting({ text }: { text: string }) {
  const [hideHints, setHideHints] = useState(true);

  return (
    <div>
      <label className="mb-4 flex items-center gap-2 text-sm text-zinc-600">
        <input
          type="checkbox"
          checked={!hideHints}
          onChange={(e) => setHideHints(!e.target.checked)}
        />
        Chinesischen Text anzeigen (Spickzettel)
      </label>
      {!hideHints && (
        <p className="font-chinese mb-4 text-center text-xl text-zinc-400">
          {text}
        </p>
      )}
      <TextHandwriting
        text={text}
        title="Klausur-Simulation"
        showOutline={false}
        showProgressText={!hideHints}
      />
    </div>
  );
}
