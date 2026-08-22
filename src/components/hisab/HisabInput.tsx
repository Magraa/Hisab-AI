"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Camera, Square, ArrowDownLeft, ArrowUpRight, X } from "lucide-react";
import { useHisab } from "@/lib/store";
import { parseInput } from "@/lib/parser";
import { getCategory } from "@/lib/categories";
import { formatRupees } from "@/lib/format";

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
  const { entities, addTransaction, resolveEntityByName } = useHisab();
  const [text, setText] = useState("");
  const [stage, setStage] = useState<"idle" | "confirm" | "success" | "error">("idle");
  const [pending, setPending] = useState<PendingParse | null>(null);
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [successLabel, setSuccessLabel] = useState("");
  const [successIncoming, setSuccessIncoming] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [receiptNote, setReceiptNote] = useState(false);

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
    const result = parseInput(effectiveText, entities);

    if (result.amount === null) {
      setPending(result);
      setStage("error");
      return;
    }

    if (result.confidence >= 0.85 || pinnedEntityName) {
      commit(result, raw, source);
      return;
    }

    setPending(result);
    setStage("confirm");
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

    const label = entityName ?? getCategory(result.categoryId).label;
    setSuccessLabel(`${formatRupees(result.amount ?? 0)} · ${entityName ? (existing ? label : `${label} (new)`) : label}`);
    setSuccessIncoming(Boolean(entityName) && result.direction === "incoming");
    setStage("success");
    setText("");
    setPending(null);
    onAdded?.();

    setTimeout(() => setStage("idle"), 1400);
  }

  function handleSubmit() {
    runParse(text, "manual");
  }

  function dismiss() {
    setStage("idle");
    setPending(null);
    setText("");
  }

  function toggleVoice() {
    if (!voiceSupported) return;
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
      // Show every word as it's recognized (live captions), then commit once
      // the browser marks a result final.
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
    <div className="rounded-2xl border-2 border-primary/70 bg-surface px-4 pt-3.5 pb-2 shadow-sm">
      {stage === "success" ? (
        <div className="flex items-center gap-3 py-2.5">
          <span
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
          </span>
          <span className="text-[15px] font-medium text-ink">✓ Added &nbsp;{successLabel}</span>
        </div>
      ) : stage === "confirm" && pending ? (
        <div className="flex flex-col gap-3 py-1.5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">I think this is:</p>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss"
              className="flex h-6 w-6 items-center justify-center rounded-full text-subtle"
            >
              <X size={15} />
            </button>
          </div>
          {(() => {
            const isEntityEntry = Boolean(pinnedEntityName ?? pending.entityName);
            const isIncoming = isEntityEntry && pending.direction === "incoming";
            return (
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    isIncoming ? "bg-mint-soft" : "bg-rose-soft"
                  }`}
                  aria-label={isIncoming ? "Money in" : "Money out"}
                >
                  {isIncoming ? (
                    <ArrowDownLeft size={17} strokeWidth={2.5} className="text-mint" />
                  ) : (
                    <ArrowUpRight size={17} strokeWidth={2.5} className="text-rose" />
                  )}
                </span>
                <p className="flex items-baseline gap-2 text-xl font-semibold text-ink">
                  <span>{formatRupees(pending.amount ?? 0)}</span>
                  <span className="text-base font-medium text-muted">
                    {pinnedEntityName ?? pending.entityName ?? getCategory(pending.categoryId).label}
                  </span>
                </p>
              </div>
            );
          })()}
          <div className="flex gap-2">
            <button
              onClick={() => setStage("idle")}
              className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-ink"
            >
              Edit
            </button>
            <button
              onClick={() => commit(pending, text, "manual")}
              className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white"
            >
              Yes, add
            </button>
          </div>
        </div>
      ) : (
        <>
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
            <button
              type="button"
              onClick={toggleVoice}
              aria-label={listening ? "Stop listening" : "Voice input"}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                listening ? "bg-rose text-white" : "bg-primary-soft text-primary"
              } ${voiceSupported ? "" : "opacity-40"}`}
              disabled={!voiceSupported}
            >
              {listening ? <Square size={16} /> : <Mic size={18} />}
            </button>
          </div>

          {stage === "error" && (
            <p className="mt-2 text-xs text-rose">
              Couldn&rsquo;t find an amount. Try &ldquo;500 diesel&rdquo; or &ldquo;Ramesh 500&rdquo;.
            </p>
          )}

          {receiptNote && (
            <p className="mt-2 text-xs text-muted">
              Got the photo. Automatic reading needs AI setup — add the amount here for now.
            </p>
          )}

          <div className="mt-2 flex items-center gap-4 border-t border-border pt-2 text-sm font-medium text-primary">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5"
            >
              <Camera size={16} />
              Scan receipt
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={() => setReceiptNote(true)}
            />
            {text.trim().length > 0 && (
              <button type="button" onClick={handleSubmit} className="ml-auto text-primary">
                Add →
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
