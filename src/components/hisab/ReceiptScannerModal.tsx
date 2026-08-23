"use client";

import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Upload,
  X,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Key,
  RotateCcw,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useHisab, type AddTransactionInput } from "@/lib/store";
import { formatRupees } from "@/lib/format";
import { triggerHaptic } from "@/lib/haptics";
import type { ExtractedEntry, ScanReceiptResponse } from "@/app/api/scan-receipt/route";

interface EditableEntry extends ExtractedEntry {
  id: string;
  selected: boolean;
}

const QUICK_CHIPS = [
  "Paid via Cash",
  "Paid via UPI",
  "All outgoing (expenses)",
  "All incoming (money received)",
  "Multiple items",
];

const LOCAL_KEY_STORAGE = "hisab_gemini_api_key";

export function ReceiptScannerModal({
  open,
  onClose,
  pinnedEntityName,
}: {
  open: boolean;
  onClose: () => void;
  pinnedEntityName?: string;
}) {
  const { entities, categories, addTransactionsBulk } = useHisab();

  // State
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>("image/jpeg");
  const [additionalInfo, setAdditionalInfo] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const [step, setStep] = useState<"capture" | "processing" | "review">("capture");
  const [processingMessageIndex, setProcessingMessageIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [extractedEntries, setExtractedEntries] = useState<EditableEntry[]>([]);
  const [scanSummary, setScanSummary] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Load API key from local storage on mount
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem(LOCAL_KEY_STORAGE);
      if (savedKey) setApiKey(savedKey);
    } catch {
      // ignore
    }
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return;
    triggerHaptic("light");
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Reset when closing
  function handleClose() {
    triggerHaptic("light");
    onClose();
    setTimeout(() => {
      setImagePreview(null);
      setAdditionalInfo("");
      setStep("capture");
      setErrorMsg(null);
      setExtractedEntries([]);
    }, 300);
  }

  // File selection
  function handleFileSelected(file: File) {
    if (!file) return;
    triggerHaptic("light");
    setImageMime(file.type || "image/jpeg");
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  }

  // Processing message timer
  useEffect(() => {
    if (step !== "processing") return;
    const messages = [
      "Reading bill & handwritten text...",
      "Extracting multiple entries...",
      "Matching people & categories...",
      "Calculating totals...",
    ];
    const interval = setInterval(() => {
      setProcessingMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [step]);

  // Trigger AI OCR
  async function runScan() {
    if (!imagePreview) return;
    triggerHaptic("medium");
    setStep("processing");
    setErrorMsg(null);

    // Save key if changed
    if (apiKey.trim()) {
      try {
        localStorage.setItem(LOCAL_KEY_STORAGE, apiKey.trim());
      } catch {
        // ignore
      }
    }

    try {
      const existingEntityNames = entities.map((e) => e.name);
      const res = await fetch("/api/scan-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: imagePreview,
          mimeType: imageMime,
          additionalInfo: additionalInfo.trim() || undefined,
          pinnedEntityName: pinnedEntityName || undefined,
          existingEntities: existingEntityNames,
          apiKey: apiKey.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "NO_API_KEY") {
          setShowKeyInput(true);
          throw new Error("Please enter your free Google Gemini API key below to scan receipts.");
        }
        throw new Error(data.message || "Failed to scan receipt.");
      }

      const scanRes = data as ScanReceiptResponse;
      setScanSummary(scanRes.summary || scanRes.vendorOrPerson || "Receipt Entries");

      const entries: EditableEntry[] = (scanRes.entries || []).map((e, index) => ({
        ...e,
        id: `extracted-${Date.now()}-${index}`,
        selected: true,
        personName: pinnedEntityName || e.personName || null,
        direction: e.direction || "outgoing",
        categoryId: e.categoryId || "other",
      }));

      if (entries.length === 0) {
        // Create one fallback entry with total amount if provided
        entries.push({
          id: `extracted-${Date.now()}-0`,
          amount: scanRes.totalAmount || 0,
          description: scanRes.vendorOrPerson || "Receipt expense",
          personName: pinnedEntityName || null,
          categoryId: "other",
          direction: "outgoing",
          date: new Date().toISOString().slice(0, 10),
          confidence: 0.8,
          selected: true,
        });
      }

      setExtractedEntries(entries);
      setStep("review");
      triggerHaptic("success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err : new Error(String(err));
      setErrorMsg(msg.message);
      setStep("capture");
      triggerHaptic("warning");
    }
  }

  // Save reviewed entries to Hisab store
  function handleCommitAll() {
    const selected = extractedEntries.filter((e) => e.selected && e.amount > 0);
    if (selected.length === 0) return;

    triggerHaptic("success");

    const inputs: AddTransactionInput[] = selected.map((e) => ({
      amount: e.amount,
      description: e.description || e.personName || "Expense",
      entityName: e.personName || undefined,
      categoryId: e.personName ? undefined : e.categoryId || "other",
      direction: e.direction,
      source: "receipt",
      rawInput: `Receipt: ${e.description} (₹${e.amount})`,
    }));

    addTransactionsBulk(inputs);
    handleClose();
  }

  // Entry table modifiers
  function updateEntry(id: string, patch: Partial<EditableEntry>) {
    setExtractedEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function toggleSelect(id: string) {
    triggerHaptic("light");
    setExtractedEntries((prev) => prev.map((e) => (e.id === id ? { ...e, selected: !e.selected } : e)));
  }

  function deleteEntry(id: string) {
    triggerHaptic("light");
    setExtractedEntries((prev) => prev.filter((e) => e.id !== id));
  }

  function addEmptyEntry() {
    triggerHaptic("light");
    setExtractedEntries((prev) => [
      ...prev,
      {
        id: `extracted-${Date.now()}-${prev.length}`,
        amount: 0,
        description: "",
        personName: pinnedEntityName || null,
        categoryId: "other",
        direction: "outgoing",
        confidence: 1.0,
        selected: true,
      },
    ]);
  }

  const selectedCount = extractedEntries.filter((e) => e.selected).length;
  const selectedTotal = extractedEntries
    .filter((e) => e.selected)
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const processingMessages = [
    "Reading bill & handwritten text...",
    "Extracting multiple entries...",
    "Matching people & categories...",
    "Calculating totals...",
  ];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            onClick={handleClose}
          />

          {/* Modal Card */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="relative z-10 flex max-h-[90vh] w-full max-w-[440px] flex-col overflow-hidden rounded-t-3xl bg-surface shadow-2xl"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
              <div>
                <h3 className="text-base font-semibold text-ink">
                  {step === "review" ? "Review Extracted Entries" : "Scan Receipt & Khata"}
                </h3>
                <p className="text-xs text-muted">
                  {step === "review"
                    ? scanSummary
                    : pinnedEntityName
                    ? `Recording for ${pinnedEntityName}`
                    : "Bills, slips, or handwritten pages"}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-subtle hover:bg-canvas active:scale-95"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {/* ERROR NOTICE */}
              {errorMsg && (
                <div className="flex items-start gap-2.5 rounded-xl bg-rose-soft/80 p-3 text-xs text-rose">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold">Notice</p>
                    <p>{errorMsg}</p>
                  </div>
                </div>
              )}

              {/* STEP 1: CAPTURE & CONTEXT */}
              {step === "capture" && (
                <div className="space-y-4">
                  {/* Image Picker / Preview */}
                  {!imagePreview ? (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/40 bg-primary-soft/30 p-6 text-center transition-colors active:scale-98 hover:border-primary"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-sm">
                          <Camera size={22} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-ink">Take Photo</p>
                          <p className="text-[11px] text-muted">Camera</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-canvas p-6 text-center transition-colors active:scale-98 hover:border-primary/50"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-ink shadow-xs border border-border">
                          <Upload size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-ink">Upload Image</p>
                          <p className="text-[11px] text-muted">Gallery / File</p>
                        </div>
                      </button>

                      <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleFileSelected(e.target.files[0]);
                        }}
                      />
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleFileSelected(e.target.files[0]);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="relative overflow-hidden rounded-2xl border border-border bg-canvas">
                      <img
                        src={imagePreview}
                        alt="Receipt preview"
                        className="h-48 w-full object-contain bg-black/5"
                      />
                      <button
                        type="button"
                        onClick={() => setImagePreview(null)}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs active:scale-90"
                      >
                        <RotateCcw size={14} />
                      </button>
                    </div>
                  )}

                  {/* Additional Context Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted uppercase tracking-wide">
                      Additional Notes / Guidance (Optional)
                    </label>
                    <textarea
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      placeholder="e.g. 'All entries are for Suresh', 'Paid via UPI', 'Exclude 2nd item'..."
                      rows={2}
                      className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-subtle focus:border-primary focus:outline-none"
                    />

                    {/* Quick suggestion chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {QUICK_CHIPS.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => {
                            triggerHaptic("light");
                            setAdditionalInfo((prev) => (prev ? `${prev}, ${chip}` : chip));
                          }}
                          className="rounded-full border border-border bg-canvas px-2.5 py-1 text-[11px] font-medium text-muted hover:border-primary hover:text-primary active:scale-95"
                        >
                          + {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* API Key section (if needed or requested) */}
                  <div className="border-t border-border pt-3">
                    <button
                      type="button"
                      onClick={() => setShowKeyInput((v) => !v)}
                      className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                    >
                      <Key size={13} />
                      {showKeyInput ? "Hide Gemini API Key" : "Free Gemini API Key Settings"}
                    </button>

                    {showKeyInput && (
                      <div className="mt-2 rounded-xl bg-canvas p-3 text-xs space-y-2 border border-border">
                        <div className="flex items-start gap-2 text-muted">
                          <Info size={14} className="mt-0.5 shrink-0 text-primary" />
                          <p>
                            Get a 100% free API key from{" "}
                            <a
                              href="https://aistudio.google.com/app/apikey"
                              target="_blank"
                              rel="noreferrer"
                              className="font-semibold text-primary underline"
                            >
                              Google AI Studio
                            </a>{" "}
                            (1,500 free scans/day).
                          </p>
                        </div>
                        <input
                          type="password"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="Paste AI Studio API Key (AIzaSy...)"
                          className="w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-ink placeholder:text-subtle focus:border-primary focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: SCANNING / PROCESSING */}
              {step === "processing" && (
                <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                  <div className="relative flex h-16 w-16 items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                      className="absolute inset-0 rounded-full bg-primary/20"
                    />
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-md">
                      <Sparkles size={22} className="animate-pulse" />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-semibold text-ink">Analyzing Image</h4>
                    <p className="mt-1 text-xs text-muted">
                      {processingMessages[processingMessageIndex]}
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 3: MULTI-ENTRY REVIEW */}
              {step === "review" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>
                      Found <strong className="text-ink">{extractedEntries.length}</strong> items
                    </span>
                    <button
                      type="button"
                      onClick={addEmptyEntry}
                      className="flex items-center gap-1 font-semibold text-primary hover:underline"
                    >
                      <Plus size={13} /> Add item
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {extractedEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className={`rounded-2xl border p-3 transition-colors ${
                          entry.selected
                            ? "border-primary/50 bg-surface shadow-xs"
                            : "border-border bg-canvas/60 opacity-60"
                        }`}
                      >
                        {/* Row 1: Checkbox, Description, Amount */}
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => toggleSelect(entry.id)}
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                              entry.selected
                                ? "border-primary bg-primary text-white"
                                : "border-border bg-canvas"
                            }`}
                          >
                            {entry.selected && <Check size={13} strokeWidth={3} />}
                          </button>

                          <input
                            type="text"
                            value={entry.description}
                            onChange={(e) => updateEntry(entry.id, { description: e.target.value })}
                            placeholder="Description / item"
                            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-ink placeholder:text-subtle focus:outline-none"
                          />

                          <div className="flex items-center gap-1">
                            <span className="text-xs font-semibold text-muted">₹</span>
                            <input
                              type="number"
                              value={entry.amount || ""}
                              onChange={(e) =>
                                updateEntry(entry.id, { amount: parseFloat(e.target.value) || 0 })
                              }
                              placeholder="0"
                              className="w-20 rounded-lg border border-border bg-canvas px-2 py-1 text-right text-sm font-bold text-ink focus:border-primary focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Row 2: Tag Person / Category & Direction */}
                        <div className="mt-2.5 flex items-center justify-between border-t border-border/60 pt-2 text-xs">
                          {/* Direction toggle */}
                          <button
                            type="button"
                            onClick={() =>
                              updateEntry(entry.id, {
                                direction: entry.direction === "outgoing" ? "incoming" : "outgoing",
                              })
                            }
                            className={`flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${
                              entry.direction === "incoming"
                                ? "bg-mint-soft text-mint"
                                : "bg-rose-soft text-rose"
                            }`}
                          >
                            {entry.direction === "incoming" ? (
                              <>
                                <ArrowDownLeft size={12} strokeWidth={2.5} /> You got
                              </>
                            ) : (
                              <>
                                <ArrowUpRight size={12} strokeWidth={2.5} /> You gave
                              </>
                            )}
                          </button>

                          {/* Person / Category Selector */}
                          <div className="flex items-center gap-2">
                            <select
                              value={entry.personName || entry.categoryId || "other"}
                              onChange={(e) => {
                                const val = e.target.value;
                                const isPerson = entities.some((ent) => ent.name === val);
                                if (isPerson) {
                                  updateEntry(entry.id, { personName: val, categoryId: undefined });
                                } else {
                                  updateEntry(entry.id, { personName: null, categoryId: val });
                                }
                              }}
                              className="rounded-lg border border-border bg-canvas px-2 py-1 text-xs text-ink focus:outline-none"
                            >
                              <optgroup label="Categories">
                                {categories.map((c) => (
                                  <option key={c.id} value={c.id}>
                                    {c.icon} {c.label}
                                  </option>
                                ))}
                              </optgroup>
                              {entities.length > 0 && (
                                <optgroup label="People / Accounts">
                                  {entities.map((ent) => (
                                    <option key={ent.id} value={ent.name}>
                                      👤 {ent.name}
                                    </option>
                                  ))}
                                </optgroup>
                              )}
                            </select>

                            <button
                              type="button"
                              onClick={() => deleteEntry(entry.id)}
                              className="text-subtle hover:text-rose"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions Footer */}
            <div className="border-t border-border bg-surface px-5 py-3.5">
              {step === "capture" && (
                <button
                  type="button"
                  disabled={!imagePreview}
                  onClick={runScan}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-sm disabled:opacity-50 active:scale-98"
                >
                  <Sparkles size={16} />
                  Understand & Extract Entries →
                </button>
              )}

              {step === "review" && (
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("capture")}
                    className="rounded-xl border border-border px-3.5 py-2.5 text-xs font-semibold text-ink active:bg-canvas"
                  >
                    Rescan
                  </button>
                  <button
                    type="button"
                    disabled={selectedCount === 0}
                    onClick={handleCommitAll}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-50 active:scale-98"
                  >
                    Add {selectedCount} {selectedCount === 1 ? "entry" : "entries"} (
                    {formatRupees(selectedTotal)}) →
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
