import React, { useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Camera,
  Image as ImageIcon,
  Languages,
  ChevronDown,
  Sparkles,
  RotateCcw,
  Copy,
  Download,
  Search,
  ShieldCheck,
  Zap,
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Menu Photo Translator — Mobile UI (single-file prototype)
 *
 * Notes:
 * - This is a UI-only prototype: OCR + translation are mocked.
 * - Languages supported (8):
 *   English, Mandarin Chinese, Italian, Spanish, Arabic, French, German, Portuguese, Russian
 * - Designed for mobile viewport; includes camera/upload, language picker, results, glossary, history.
 */

const LANGUAGES = [
  { code: "en", name: "English", native: "English" },
  { code: "zh", name: "Mandarin Chinese", native: "中文" },
  { code: "it", name: "Italian", native: "Italiano" },
  { code: "es", name: "Spanish", native: "Español" },
  { code: "ar", name: "Arabic", native: "العربية" },
  { code: "fr", name: "French", native: "Français" },
  { code: "de", name: "German", native: "Deutsch" },
  { code: "pt", name: "Portuguese", native: "Português" },
  { code: "ru", name: "Russian", native: "Русский" },
];

const MOCK_MENU_OCR = `1) Spaghetti alla Carbonara
   - Eggs, pecorino, guanciale, black pepper
2) Insalata Caprese
   - Tomatoes, mozzarella, basil, olive oil
3) Tiramisù
   - Coffee, mascarpone, cocoa

Allergens: dairy, eggs, gluten`;

// --- Calorie estimation helpers (mock logic) ---
function estimateCaloriesFromMenuText(text: string) {
  // Lightweight heuristic demo. Replace with nutrition API or ML model in production.
  const lines = text.split("\n");
  const dishes: Array<{ name: string; calories: number }> = [];

  for (const line of lines) {
    const match = line.match(/\d+\)\s*(.*)/);
    if (match) {
      const name = match[1].trim();
      let calories = 300;

      if (/carbonara/i.test(name)) calories = 650;
      if (/caprese/i.test(name)) calories = 350;
      if (/tiramisu|tiramisù/i.test(name)) calories = 450;

      dishes.push({ name, calories });
    }
  }

  const total = dishes.reduce((sum, d) => sum + d.calories, 0);
  return { dishes, total };
}

function mockTranslate(text: string, to: string) {
  // Lightweight mock that looks realistic but is not a real translation.
  // In a real app, connect OCR -> translation API.
  const prefix = (() => {
    switch (to) {
      case "en":
        return "[English]";
      case "zh":
        return "[中文]";
      case "it":
        return "[Italiano]";
      case "es":
        return "[Español]";
      case "ar":
        return "[العربية]";
      case "fr":
        return "[Français]";
      case "de":
        return "[Deutsch]";
      case "pt":
        return "[Português]";
      case "ru":
        return "[Русский]";
      default:
        return "";
    }
  })();

  // A tiny stylistic tweak for RTL.
  if (to === "ar") {
    const compact = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, 10)
      .join(" • ");
    return `${prefix} ${compact} (محاكاة)`;
  }

  return `${prefix}\n${text}\n\n— translated (mock)`;
}

function formatNow() {
  const d = new Date();
  return d.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function useIsRTL(langCode: string) {
  return langCode === "ar";
}

function Pill({ active, children }: { active?: boolean; children: React.ReactNode }) {
  return (
    <span
      className={
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs transition " +
        (active
          ? "bg-foreground text-background"
          : "bg-muted text-foreground hover:bg-muted/70")
      }
    >
      {children}
    </span>
  );
}

export default function MenuPhotoTranslatorApp() {
  const [tab, setTab] = useState<"translate" | "history" | "glossary" | "settings">("translate");

  const [toLang, setToLang] = useState("en");
  const [detectedLang, setDetectedLang] = useState("it");
  const [autoDetect, setAutoDetect] = useState(true);

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [calorieReport, setCalorieReport] = useState<
    | {
        dishes: Array<{ name: string; calories: number }>;
        total: number;
      }
    | null
  >(null);
  const [busy, setBusy] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [showLangSheet, setShowLangSheet] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const rtl = useIsRTL(toLang);

  const toLangMeta = useMemo(() => LANGUAGES.find((l) => l.code === toLang), [toLang]);
  const detectedMeta = useMemo(
    () => LANGUAGES.find((l) => l.code === detectedLang),
    [detectedLang]
  );

  const [history, setHistory] = useState<
    Array<{
      id: string;
      time: string;
      to: string;
      ocr: string;
      out: string;
      thumb?: string | null;
    }>
  >([]);

  const [glossary, setGlossary] = useState<
    Array<{ term: string; meaning: string; notes?: string; tag?: string }>
  >([
    { term: "guanciale", meaning: "cured pork cheek", notes: "Often used in carbonara", tag: "Italian" },
    { term: "pecorino", meaning: "sheep-milk cheese", notes: "Salty; similar to parmesan", tag: "Cheese" },
    { term: "allergens", meaning: "ingredients that can cause reactions", notes: "Look for dairy/eggs/gluten", tag: "Safety" },
  ]);

  function onPickPhoto(file?: File | null) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
    // Reset outputs when a new photo is chosen.
    setOcrText("");
    setTranslatedText("");
  }

  async function runOcrAndTranslate() {
    if (!photoUrl) {
      // Gentle UX: nudge user to pick a photo.
      setBusy(true);
      await new Promise((r) => setTimeout(r, 450));
      setBusy(false);
      return;
    }

    setBusy(true);
    await new Promise((r) => setTimeout(r, 650));

    // Mock OCR:
    const ocr = MOCK_MENU_OCR;
    setOcrText(ocr);

    // Mock language detection:
    if (autoDetect) {
      // Pretend the menu is Italian.
      setDetectedLang("it");
    }

    await new Promise((r) => setTimeout(r, 550));

    const out = mockTranslate(ocr, toLang);
    const calories = estimateCaloriesFromMenuText(ocr);
    setCalorieReport(calories);
    setTranslatedText(out);

    setHistory((prev) => [
      {
        id: crypto?.randomUUID?.() ?? String(Date.now()),
        time: formatNow(),
        to: toLang,
        ocr,
        out,
        thumb: photoUrl,
      },
      ...prev,
    ]);

    setBusy(false);
  }

  function resetAll() {
    setPhotoUrl(null);
    setOcrText("");
    setTranslatedText("");
    setSearchTerm("");
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // no-op
    }
  }

  function downloadText(text: string, filename: string) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const filteredGlossary = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return glossary;
    return glossary.filter(
      (g) =>
        g.term.toLowerCase().includes(q) ||
        g.meaning.toLowerCase().includes(q) ||
        (g.notes ?? "").toLowerCase().includes(q) ||
        (g.tag ?? "").toLowerCase().includes(q)
    );
  }, [glossary, searchTerm]);

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto max-w-[420px] px-4 pb-28 pt-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-muted">
                <Languages className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-lg font-semibold leading-tight">Menu Photo Translator</div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5" />
                    8 languages
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    On-device UI
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Button
            variant="secondary"
            className="rounded-2xl"
            onClick={() => setShowLangSheet(true)}
            aria-label="Choose target language"
          >
            <span className="max-w-[140px] truncate">{toLangMeta?.native ?? "Language"}</span>
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Translate tab */}
        <AnimatePresence mode="wait">
          {tab === "translate" && (
            <motion.div
              key="translate"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.25 }}
              className="mt-5 space-y-4"
            >
              <Card className="rounded-3xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">1) Capture the menu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      className="h-12 rounded-2xl"
                      onClick={() => inputRef.current?.click()}
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                    <Button
                      variant="secondary"
                      className="h-12 rounded-2xl"
                      onClick={() => inputRef.current?.click()}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Camera
                    </Button>
                  </div>

                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => onPickPhoto(e.target.files?.[0] ?? null)}
                  />

                  <div className="rounded-3xl border bg-muted/40 p-3">
                    {photoUrl ? (
                      <div className="space-y-3">
                        <div className="overflow-hidden rounded-2xl border bg-background">
                          {/* Preview */}
                          <img
                            src={photoUrl}
                            alt="Menu preview"
                            className="h-44 w-full object-cover"
                          />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-xs text-muted-foreground">
                            Tip: crop closer to the text for better OCR
                          </div>
                          <Button variant="ghost" className="rounded-2xl" onClick={resetAll}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid place-items-center gap-2 py-7 text-center">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-background">
                          <Sparkles className="h-5 w-5" />
                        </div>
                        <div className="text-sm font-medium">Add a menu photo to begin</div>
                        <div className="max-w-[260px] text-xs text-muted-foreground">
                          We’ll extract the text and translate it into your chosen language.
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Pill active>
                      <Zap className="h-3.5 w-3.5" />
                      Fast scan
                    </Pill>
                    <Pill active={autoDetect}>
                      <span className="font-medium">Auto-detect</span>
                      <button
                        className="ml-1 rounded-full border bg-background px-2 py-0.5 text-[10px]"
                        onClick={() => setAutoDetect((v) => !v)}
                        aria-label="Toggle auto-detect"
                      >
                        {autoDetect ? "ON" : "OFF"}
                      </button>
                    </Pill>
                    <Pill>
                      <span className="text-muted-foreground">Detected:</span>
                      <span className="font-medium">
                        {autoDetect ? detectedMeta?.native ?? "—" : "Manual"}
                      </span>
                    </Pill>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">2) Translate</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between gap-3 rounded-3xl border bg-muted/30 p-3">
                    <div className="min-w-0">
                      <div className="text-xs text-muted-foreground">Target language</div>
                      <div className="truncate text-sm font-semibold">
                        {toLangMeta?.name} <span className="text-muted-foreground">({toLangMeta?.native})</span>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      className="rounded-2xl"
                      onClick={() => setShowLangSheet(true)}
                    >
                      Change
                    </Button>
                  </div>

                  <Button
                    className="h-12 w-full rounded-2xl"
                    onClick={runOcrAndTranslate}
                    disabled={busy}
                  >
                    <Languages className="mr-2 h-4 w-4" />
                    {busy ? "Working…" : "Scan & Translate"}
                  </Button>

                  <div className="grid gap-3">
                    <div className="rounded-3xl border bg-background p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-xs font-medium text-muted-foreground">Extracted text (OCR)</div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            className="h-8 rounded-xl px-2"
                            onClick={() => copyToClipboard(ocrText)}
                            disabled={!ocrText}
                            aria-label="Copy OCR"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        value={ocrText}
                        placeholder="OCR output will appear here…"
                        className="min-h-[120px] resize-none rounded-2xl"
                        readOnly
                      />
                    </div>

                    <div className="rounded-3xl border bg-background p-3" dir={rtl ? "rtl" : "ltr"}>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-xs font-medium text-muted-foreground">Translation</div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            className="h-8 rounded-xl px-2"
                            onClick={() => copyToClipboard(translatedText)}
                            disabled={!translatedText}
                            aria-label="Copy translation"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            className="h-8 rounded-xl px-2"
                            onClick={() =>
                              downloadText(
                                translatedText || "",
                                `menu-translation-${toLangMeta?.code ?? "txt"}.txt`
                              )
                            }
                            disabled={!translatedText}
                            aria-label="Download translation"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        value={translatedText}
                        placeholder="Translation will appear here…"
                        className="min-h-[160px] resize-none rounded-2xl"
                        readOnly
                      />

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="rounded-full">
                          {autoDetect
                            ? `Detected: ${detectedMeta?.name ?? "—"}`
                            : "Detected: Manual"}
                        </Badge>
                        <Badge variant="secondary" className="rounded-full">
                          To: {toLangMeta?.name}
                        </Badge>
                        <Badge variant="secondary" className="rounded-full">
                          Mode: Photo → OCR → Translate
                        </Badge>
                      </div>

                      {/* Calorie estimation section */}
                      {calorieReport ? (
                        <div className="mt-3 rounded-2xl border bg-amber-50/40 p-3">
                          <div className="text-xs font-medium">Estimated calories</div>
                          <div className="mt-2 space-y-1 text-sm">
                            {calorieReport.dishes.map((d, i) => (
                              <div key={i} className="flex items-center justify-between">
                                <span className="truncate">{d.name}</span>
                                <span className="font-medium">{d.calories} kcal</span>
                              </div>
                            ))}
                            <div className="mt-2 flex items-center justify-between border-t pt-2 text-sm font-semibold">
                              <span>Total</span>
                              <span>{calorieReport.total} kcal</span>
                            </div>
                          </div>
                          <div className="mt-2 text-[10px] text-muted-foreground">
                            Estimates only — actual values vary by portion size and preparation.
                          </div>
                        </div>
                      ) : null}

                      <div className="mt-3 rounded-2xl border bg-muted/30 p-3">
                        <div className="text-xs font-medium">Quick actions</div>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <Button
                            variant="secondary"
                            className="h-11 rounded-2xl"
                            onClick={() => setTab("glossary")}
                            disabled={!translatedText && !ocrText}
                          >
                            <Search className="mr-2 h-4 w-4" />
                            Ingredients
                          </Button>
                          <Button
                            variant="secondary"
                            className="h-11 rounded-2xl"
                            onClick={() => setTab("history")}
                            disabled={history.length === 0}
                          >
                            View history
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Trust & privacy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4" />
                    <div>
                      This prototype keeps images in memory only. In production, add a clear
                      notice about OCR/translation providers and allow users to delete history.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap className="mt-0.5 h-4 w-4" />
                    <div>
                      For best results: avoid glare, keep text flat, and crop close to items.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {tab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.25 }}
              className="mt-5 space-y-4"
            >
              <Card className="rounded-3xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {history.length === 0 ? (
                    <div className="rounded-2xl border bg-muted/30 p-4 text-sm text-muted-foreground">
                      No translations yet. Scan a menu to build your history.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {history.map((h) => {
                        const meta = LANGUAGES.find((l) => l.code === h.to);
                        return (
                          <div
                            key={h.id}
                            className="rounded-3xl border bg-background p-3"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="text-sm font-semibold">
                                  {meta?.name} <span className="text-muted-foreground">({meta?.native})</span>
                                </div>
                                <div className="text-xs text-muted-foreground">{h.time}</div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  className="h-8 rounded-xl px-2"
                                  onClick={() => copyToClipboard(h.out)}
                                  aria-label="Copy from history"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            {h.thumb ? (
                              <div className="mt-3 overflow-hidden rounded-2xl border">
                                <img
                                  src={h.thumb}
                                  alt="History thumbnail"
                                  className="h-28 w-full object-cover"
                                />
                              </div>
                            ) : null}

                            <div className="mt-3 grid gap-2">
                              <div className="rounded-2xl border bg-muted/20 p-3">
                                <div className="text-xs font-medium text-muted-foreground">Translation</div>
                                <div className="mt-1 line-clamp-4 whitespace-pre-wrap text-sm">
                                  {h.out}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="secondary"
                                  className="h-11 flex-1 rounded-2xl"
                                  onClick={() => {
                                    setOcrText(h.ocr);
                                    setTranslatedText(h.out);
                                    setToLang(h.to);
                                    setPhotoUrl(h.thumb ?? null);
                                    setTab("translate");
                                  }}
                                >
                                  Open
                                </Button>
                                <Button
                                  variant="secondary"
                                  className="h-11 rounded-2xl"
                                  onClick={() =>
                                    setHistory((prev) => prev.filter((x) => x.id !== h.id))
                                  }
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <Button
                        variant="ghost"
                        className="w-full rounded-2xl"
                        onClick={() => setHistory([])}
                      >
                        Clear all
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {tab === "glossary" && (
            <motion.div
              key="glossary"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.25 }}
              className="mt-5 space-y-4"
            >
              <Card className="rounded-3xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Ingredients & glossary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="relative w-full">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search terms (e.g., pecorino, allergens)…"
                        className="h-11 rounded-2xl pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {filteredGlossary.map((g, idx) => (
                      <div
                        key={g.term + idx}
                        className="rounded-3xl border bg-background p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-sm font-semibold">{g.term}</div>
                            <div className="text-sm text-muted-foreground">{g.meaning}</div>
                            {g.notes ? (
                              <div className="mt-1 text-xs text-muted-foreground">{g.notes}</div>
                            ) : null}
                          </div>
                          {g.tag ? (
                            <Badge variant="secondary" className="rounded-full">
                              {g.tag}
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                    ))}

                    {filteredGlossary.length === 0 ? (
                      <div className="rounded-2xl border bg-muted/30 p-4 text-sm text-muted-foreground">
                        No matches. Try a different keyword.
                      </div>
                    ) : null}
                  </div>

                  <div className="rounded-3xl border bg-muted/20 p-3">
                    <div className="text-xs font-medium">Add your own term</div>
                    <div className="mt-2 grid gap-2">
                      <Input
                        placeholder="Term"
                        className="h-11 rounded-2xl"
                        onKeyDown={(e) => {
                          if (e.key !== "Enter") return;
                          const term = (e.target as HTMLInputElement).value.trim();
                          if (!term) return;
                          setGlossary((prev) => [
                            { term, meaning: "(add meaning)", notes: "", tag: "Custom" },
                            ...prev,
                          ]);
                          (e.target as HTMLInputElement).value = "";
                        }}
                      />
                      <div className="text-xs text-muted-foreground">
                        Press Enter to add a placeholder. In production, add a form with meaning/notes.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {tab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.25 }}
              className="mt-5 space-y-4"
            >
              <Card className="rounded-3xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-3xl border bg-background p-3">
                    <div className="text-sm font-semibold">Language detection</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Auto-detect menu language before translating.
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm">Auto-detect</div>
                      <Button
                        variant={autoDetect ? "default" : "secondary"}
                        className="rounded-2xl"
                        onClick={() => setAutoDetect((v) => !v)}
                      >
                        {autoDetect ? "Enabled" : "Disabled"}
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-3xl border bg-background p-3">
                    <div className="text-sm font-semibold">History</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Store recent translations on device.
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm">Keep history</div>
                      <Button variant="secondary" className="rounded-2xl" onClick={() => setHistory([])}>
                        Clear
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-3xl border bg-muted/20 p-3 text-xs text-muted-foreground">
                    Production checklist: camera permissions, offline queue, provider disclosure,
                    per-item bounding boxes, RTL layout, accessibility labels.
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <div className="fixed inset-x-0 bottom-0 z-50">
        <div className="mx-auto max-w-[420px] px-4 pb-4">
          <div className="rounded-3xl border bg-background/80 p-2 backdrop-blur">
            <div className="grid grid-cols-4 gap-2">
              <NavButton
                active={tab === "translate"}
                label="Translate"
                onClick={() => setTab("translate")}
                icon={<Languages className="h-4 w-4" />}
              />
              <NavButton
                active={tab === "history"}
                label="History"
                onClick={() => setTab("history")}
                icon={<ImageIcon className="h-4 w-4" />}
              />
              <NavButton
                active={tab === "glossary"}
                label="Glossary"
                onClick={() => setTab("glossary")}
                icon={<Search className="h-4 w-4" />}
              />
              <NavButton
                active={tab === "settings"}
                label="Settings"
                onClick={() => setTab("settings")}
                icon={<ShieldCheck className="h-4 w-4" />}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Language sheet */}
      <AnimatePresence>
        {showLangSheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60]"
            aria-label="Language picker"
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowLangSheet(false)}
            />
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="absolute inset-x-0 bottom-0 mx-auto max-w-[420px] px-4 pb-6"
            >
              <div className="rounded-[28px] border bg-background p-3 shadow-xl">
                <div className="flex items-center justify-between px-2 pb-2">
                  <div className="text-sm font-semibold">Translate to</div>
                  <Button
                    variant="ghost"
                    className="rounded-2xl"
                    onClick={() => setShowLangSheet(false)}
                  >
                    Done
                  </Button>
                </div>

                <div className="grid gap-2 p-2">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      className={
                        "flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left transition " +
                        (l.code === toLang
                          ? "bg-foreground text-background"
                          : "bg-background hover:bg-muted/40")
                      }
                      onClick={() => {
                        setToLang(l.code);
                        setShowLangSheet(false);
                        if (ocrText) setTranslatedText(mockTranslate(ocrText, l.code));
                      }}
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{l.name}</div>
                        <div
                          className={
                            "text-xs " +
                            (l.code === toLang
                              ? "text-background/80"
                              : "text-muted-foreground")
                          }
                        >
                          {l.native}
                        </div>
                      </div>
                      {l.code === toLang ? (
                        <Badge className="rounded-full" variant="secondary">
                          Selected
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Tap</span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="px-2 pt-2 text-xs text-muted-foreground">
                  Includes: English, Mandarin Chinese, Italian, Spanish, Arabic, French, German,
                  Portuguese, Russian
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavButton({
  active,
  label,
  onClick,
  icon,
}: {
  active?: boolean;
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "flex h-12 flex-col items-center justify-center gap-1 rounded-2xl border text-xs transition " +
        (active ? "bg-foreground text-background" : "bg-background hover:bg-muted/40")
      }
      aria-label={label}
    >
      {icon}
      <span className="leading-none">{label}</span>
    </button>
  );
}
*** 1) Add an icon import
@@
 import {
   Camera,
   Image as ImageIcon,
   Languages,
   ChevronDown,
   Sparkles,
   RotateCcw,
   Copy,
   Download,
   Search,
   ShieldCheck,
   Zap,
   Globe,
+  Flame,
 } from "lucide-react";

*** 2) Add helper functions (paste these right AFTER mockTranslate)
@@
 function mockTranslate(text: string, to: string) {
   ...
 }

+/**
+ * Parse OCR text into dishes.
+ * Assumes:
+ * 1) Dish Name
+ *    - ingredients...
+ */
+function parseDishesFromOcr(
+  ocr: string
+): Array<{ index: number; name: string; details?: string }> {
+  const lines = ocr.split("\n");
+  const dishes: Array<{ index: number; name: string; details?: string }> = [];
+  let current: { index: number; name: string; details?: string } | null = null;
+
+  for (const raw of lines) {
+    const line = raw.trim();
+    if (!line) continue;
+    if (/^allergens\s*:/i.test(line)) break;
+
+    const header = line.match(/^(\d+)\)\s*(.+)$/);
+    if (header) {
+      if (current) dishes.push(current);
+      current = { index: Number(header[1]), name: header[2] };
+      continue;
+    }
+
+    const detail = line.match(/^[-•]\s*(.+)$/);
+    if (detail && current) {
+      current.details = current.details
+        ? `${current.details}; ${detail[1]}`
+        : detail[1];
+    }
+  }
+  if (current) dishes.push(current);
+  return dishes;
+}
+
+/**
+ * Lightweight calorie estimator (ranges).
+ * Replace with a nutrition DB in production.
+ */
+function estimateCaloriesForDish(name: string): { min: number; max: number; note: string } {
+  const n = name.toLowerCase();
+  if (n.includes("carbonara")) return { min: 800, max: 1200, note: "pasta + egg/cheese + pork" };
+  if (n.includes("caprese")) return { min: 250, max: 450, note: "mozzarella + olive oil" };
+  if (n.includes("tiram")) return { min: 350, max: 550, note: "dessert slice" };
+
+  if (/(salad|insalata)/.test(n)) return { min: 180, max: 420, note: "varies with dressing" };
+  if (/(soup|zuppa)/.test(n)) return { min: 150, max: 380, note: "broth vs cream" };
+  if (/(pizza|pinsa)/.test(n)) return { min: 650, max: 1100, note: "per personal pizza" };
+  if (/(burger|hamburger)/.test(n)) return { min: 700, max: 1200, note: "includes bun + sauce" };
+  if (/(steak|bistecca)/.test(n)) return { min: 500, max: 900, note: "depends on cut" };
+  if (/(dessert|cake|torte|gelato|ice cream)/.test(n)) return { min: 250, max: 650, note: "portion dependent" };
+  return { min: 300, max: 800, note: "estimate" };
+}

*** 3) Add state for dish calories (right after translatedText state)
@@
   const [ocrText, setOcrText] = useState<string>("");
   const [translatedText, setTranslatedText] = useState<string>("");
+  const [dishCalories, setDishCalories] = useState<
+    Array<{ index: number; name: string; min: number; max: number; note: string }>
+  >([]);
   const [busy, setBusy] = useState(false);

*** 4) Clear calories when picking/resetting
@@
   function onPickPhoto(file?: File | null) {
     ...
     setOcrText("");
     setTranslatedText("");
+    setDishCalories([]);
   }

@@
   function resetAll() {
     setPhotoUrl(null);
     setOcrText("");
     setTranslatedText("");
+    setDishCalories([]);
     setSearchTerm("");
   }

*** 5) Compute calories after OCR in runOcrAndTranslate
@@
     const ocr = MOCK_MENU_OCR;
     setOcrText(ocr);
+
+    const dishes = parseDishesFromOcr(ocr);
+    setDishCalories(
+      dishes.map((d) => {
+        const est = estimateCaloriesForDish(d.name);
+        return { index: d.index, name: d.name, min: est.min, max: est.max, note: est.note };
+      })
+    );

*** 6) Render the calories UI under the Translation textarea (right after the Translation <Textarea />)
@@
   <Textarea
     value={translatedText}
     placeholder="Translation will appear here…"
     className="min-h-[160px] resize-none rounded-2xl"
     readOnly
   />
+
+  <div className="mt-3 rounded-2xl border bg-muted/30 p-3">
+    <div className="flex items-center justify-between">
+      <div className="text-xs font-medium inline-flex items-center gap-2">
+        <Flame className="h-4 w-4" />
+        Estimated calories (per dish)
+      </div>
+      <Badge variant="secondary" className="rounded-full">estimate</Badge>
+    </div>
+
+    <div className="mt-2 space-y-2">
+      {dishCalories.length === 0 ? (
+        <div className="text-xs text-muted-foreground">
+          Scan a menu to see per-dish calorie ranges.
+        </div>
+      ) : (
+        dishCalories.map((d) => (
+          <div key={d.index + d.name} className="rounded-2xl border bg-background p-3">
+            <div className="flex items-start justify-between gap-3">
+              <div className="min-w-0">
+                <div className="truncate text-sm font-semibold">{d.index}) {d.name}</div>
+                <div className="mt-0.5 text-xs text-muted-foreground">{d.note}</div>
+              </div>
+              <div className="shrink-0 text-right">
+                <div className="text-sm font-semibold">{d.min}–{d.max}</div>
+                <div className="text-xs text-muted-foreground">kcal</div>
+              </div>
+            </div>
+          </div>
+        ))
+      )}
+    </div>
+
+    <div className="mt-2 text-[11px] leading-snug text-muted-foreground">
+      Rough estimates — vary by portion size, oil/butter, cheese/sauce, and preparation.
+    </div>
+  </div>
