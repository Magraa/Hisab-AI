"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Camera, Square, ArrowDownLeft, ArrowUpRight, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useHisab } from "@/lib/store";
import { parseInput } from "@/lib/parser";
import { getCategory } from "@/lib/categories";
import { formatRupees } from "@/lib/format";
import { triggerHaptic } from "@/lib/haptics";
import { ReceiptScannerModal } from "./ReceiptScannerModal";

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike extends ArrayLike<SpeechRecognitionAlternativeLike> {
  isFinal: boolean;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type PendingParse = ReturnType<typeof parseInput>;

export function HisabInput({
  pinnedEntityName,
  onAdded,
  placeholder = "What did you spend?",
}: {
  pinnedEntityName?: string;
  onAdded?: () => void;
  placeholder?: string;
}) {
  const { entities, categories, addTransaction, resolveEntityByName } = useHisab();
  const [text, setText] = useState("");
  const [stage, setStage] = useState<"idle" | "confirm" | "success" | "error">("idle");
  const [pending, setPending] = useState<PendingParse | null>(null);
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [successLabel, setSuccessLabel] = useState("");
  const [successIncoming, setSuccessIncoming] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    setVoiceSupported(Boolean(Ctor));
  }, []);

  function runParse(raw: string, source: "manual" | "voice") {
    if (!raw.trim()) return;
    const effectiveText = pinnedEntityName ? `${pinnedEntityName} ${raw}` : raw;
    const result = parseInput(effectiveText, entities, categories);

    if (result.amount === null) {
      setPending(result);
      setStage("error");
      triggerHaptic("warning");
      return;
    }

    if (result.confidence >= 0.85 || pinnedEntityName) {
      commit(result, raw, source);
      return;
    }

    setPending(result);
    setStage("confirm");
    triggerHaptic("medium");
  }

  function commit(result: PendingParse, raw: string, source: "manual" | "voice") {
    const entityName = pinnedEntityName ?? result.entityName;
    const existing = entityName ? resolveEntityByName(entityName) : undefined;

    addTransaction({
      amount: result.amount ?? 0,
      description: entityName ?? result.description,
      categoryId: entityName ? undefined : result.categoryId,
      entityName,
      direction: result.direction,
      source,
      rawInput: raw,
    });

    const label = entityName ?? getCategory(categories, result.categoryId).label;
    setSuccessLabel(`${formatRupees(result.amount ?? 0)} · ${entityName ? (existing ? label : `${label} (new)`) : label}`);
    setSuccessIncoming(Boolean(entityName) && result.direction === "incoming");
    setStage("success");
    triggerHaptic("success");
    setText("");
    setPending(null);
    onAdded?.();

    setTimeout(() => setStage("idle"), 1400);
  }

  function handleSubmit() {
    runParse(text, "manual");
  }

  function dismiss() {
    triggerHaptic("light");
    setStage("idle");
    setPending(null);
    setText("");
  }

  function toggleVoice() {
    if (!voiceSupported) return;
    triggerHaptic("medium");
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) return;
    const recognition = new Ctor();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const chunk = result[0]?.transcript ?? "";
        if (result.isFinal) finalTranscript += chunk;
        else interimTranscript += chunk;
      }

      const live = `${finalTranscript} ${interimTranscript}`.trim();
      setText(live);

      if (finalTranscript.trim()) {
        runParse(finalTranscript.trim(), "voice");
      }
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 450, damping: 32 }}
      className="relative overflow-hidden rounded-2xl border-2 border-primary/70 bg-surface px-4 pt-3.5 pb-2 shadow-sm"
    >
      <AnimatePresence mode="wait">
        {stage === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className="flex items-center gap-3 py-2.5"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                successIncoming ? "bg-mint-soft" : "bg-rose-soft"
              }`}
              aria-label={successIncoming ? "Money in" : "Money out"}
            >
              {successIncoming ? (
                <ArrowDownLeft size={17} strokeWidth={2.5} className="text-mint" />
              ) : (
                <ArrowUpRight size={17} strokeWidth={2.5} className="text-rose" />
              )}
            </motion.span>
            <span className="text-[15px] font-semibold text-ink">✓ Added &nbsp;{successLabel}</span>
          </motion.div>
        ) : stage === "confirm" && pending ? (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-3 py-1.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-muted">I think this is:</p>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic("light");
                    const currentDir = pending.direction ?? "outgoing";
                    const nextDir = currentDir === "incoming" ? "outgoing" : "incoming";
                    setPending((p) => (p ? { ...p, direction: nextDir } : null));
                  }}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border transition-all cursor-pointer ${
                    (pending.direction ?? "outgoing") === "incoming"
                      ? "bg-mint-soft text-mint border-mint/40 hover:bg-mint-soft/80"
                      : "bg-rose-soft text-rose border-rose/40 hover:bg-rose-soft/80"
                  }`}
                  title="Click to switch Diya / Liya"
                >
                  {(pending.direction ?? "outgoing") === "incoming" ? "Liya (Got)" : "Diya (Gave)"}
                  <span className="text-[11px] opacity-70">⇄</span>
                </button>
              </div>
              <motion.button
                whileTap={{ scale: 0.85 }}
                type="button"
                onClick={dismiss}
                aria-label="Dismiss"
                className="flex h-6 w-6 items-center justify-center rounded-full text-subtle hover:bg-canvas"
              >
                <X size={15} />
              </motion.button>
            </div>
            {(() => {
              const isEntityEntry = Boolean(pinnedEntityName ?? pending.entityName);
              const direction = pending.direction ?? "outgoing";
              const isIncoming = direction === "incoming";
              return (
                <div className="flex items-center gap-2.5">
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    type="button"
                    onClick={() => {
                      triggerHaptic("light");
                      const nextDir = isIncoming ? "outgoing" : "incoming";
                      setPending((p) => (p ? { ...p, direction: nextDir } : null));
                    }}
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all cursor-pointer ${
                      isIncoming
                        ? "bg-mint-soft border-mint/40 text-mint hover:scale-105 active:scale-95 shadow-xs"
                        : "bg-rose-soft border-rose/40 text-rose hover:scale-105 active:scale-95 shadow-xs"
                    }`}
                    title={`Click to switch to ${isIncoming ? "Diya (You gave)" : "Liya (You got)"}`}
                    aria-label={`Direction: ${isIncoming ? "Liya (Money in)" : "Diya (Money out)"}. Click to switch.`}
                  >
                    {isIncoming ? (
                      <ArrowDownLeft size={19} strokeWidth={2.5} />
                    ) : (
                      <ArrowUpRight size={19} strokeWidth={2.5} />
                    )}
                  </motion.button>

                  <div className="flex flex-1 items-center gap-2 min-w-0">
                    <div className="relative flex items-center rounded-xl bg-canvas px-2.5 py-1.5 border border-border/80 focus-within:border-primary focus-within:bg-surface focus-within:ring-2 focus-within:ring-primary/20 transition-all shrink-0">
                      <span className="text-base font-semibold text-muted mr-1">₹</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        value={pending.amount ?? ""}
                        onChange={(e) => {
                          const val = e.target.value === "" ? null : parseFloat(e.target.value);
                          setPending((p) => (p ? { ...p, amount: val } : null));
                        }}
                        placeholder="0"
                        className="w-20 bg-transparent text-lg font-bold text-ink outline-none"
                      />
                    </div>

                    <div className="relative flex flex-1 items-center rounded-xl bg-canvas px-3 py-1.5 border border-border/80 focus-within:border-primary focus-within:bg-surface focus-within:ring-2 focus-within:ring-primary/20 transition-all min-w-0">
                      <input
                        type="text"
                        value={pinnedEntityName ?? pending.entityName ?? pending.description ?? ""}
                        disabled={Boolean(pinnedEntityName)}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPending((p) => (p ? { ...p, entityName: val, description: val } : null));
                        }}
                        list="quick-entity-suggestions"
                        placeholder="Person or category"
                        className="w-full bg-transparent text-sm font-semibold text-ink outline-none placeholder:text-subtle truncate"
                      />
                      <datalist id="quick-entity-suggestions">
                        {entities.map((e) => (
                          <option key={e.id} value={e.name} />
                        ))}
                        {categories.map((c) => (
                          <option key={c.id} value={c.label} />
                        ))}
                      </datalist>
                    </div>
                  </div>
                </div>
              );
            })()}
            <div className="flex gap-2 pt-1">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  triggerHaptic("light");
                  setStage("idle");
                }}
                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-ink active:bg-canvas"
              >
                Re-type
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => commit(pending, text, "manual")}
                className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white shadow-sm"
              >
                Yes, add
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <div className="flex items-center gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
                placeholder={placeholder}
                className="min-w-0 flex-1 bg-transparent text-[17px] text-ink placeholder:text-subtle outline-none"
              />
              <div className="relative">
                {listening && (
                  <motion.div
                    animate={{ scale: [1, 1.45, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                    className="absolute -inset-1.5 rounded-full bg-rose/30 pointer-events-none"
                  />
                )}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={toggleVoice}
                  aria-label={listening ? "Stop listening" : "Voice input"}
                  className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                    listening ? "bg-rose text-white shadow-md shadow-rose/20" : "bg-primary-soft text-primary"
                  } ${voiceSupported ? "" : "opacity-40"}`}
                  disabled={!voiceSupported}
                >
                  {listening ? <Square size={16} /> : <Mic size={18} />}
                </motion.button>
              </div>
            </div>

            <AnimatePresence>
              {stage === "error" && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 text-xs text-rose"
                >
                  Couldn&rsquo;t find an amount. Try &ldquo;500 diesel&rdquo; or &ldquo;Ramesh 500&rdquo;.
                </motion.p>
              )}
            </AnimatePresence>

            <div className="mt-2 flex items-center gap-4 border-t border-border pt-2 text-sm font-medium text-primary">
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => {
                  triggerHaptic("light");
                  setScannerOpen(true);
                }}
                className="flex items-center gap-1.5"
              >
                <Camera size={16} />
                Scan receipt
              </motion.button>
              {text.trim().length > 0 && (
                <motion.button
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileTap={{ scale: 0.92 }}
                  type="button"
                  onClick={handleSubmit}
                  className="ml-auto font-semibold text-primary"
                >
                  Add →
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ReceiptScannerModal
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        pinnedEntityName={pinnedEntityName}
      />
    </motion.div>
  );
}
