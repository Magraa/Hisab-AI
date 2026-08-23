"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { SubPageHeader } from "@/components/layout/SubPageHeader";
import { ThemePicker } from "@/components/theme/ThemePicker";
import { BackupPromoCard } from "@/components/layout/BackupPromoCard";
import { InstallSettingsRow } from "@/components/pwa/InstallPrompt";
import { createClient } from "@/lib/supabase/client";
import { useHisab } from "@/lib/store";
import { triggerHaptic } from "@/lib/haptics";

const PARSING_MODES = [
  { value: "local" as const, label: "Local only" },
  { value: "auto" as const, label: "Smart Auto" },
  { value: "ai" as const, label: "Always AI" },
];

export default function SettingsPage() {
  const {
    cloudUser,
    geminiApiKey,
    setGeminiApiKey,
    dailyScansRemaining,
    parsingMode,
    setParsingMode,
    dailyTextParsesRemaining,
  } = useHisab();
  const [notifications, setNotifications] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  // AI Key state
  const [inputKey, setInputKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    if (geminiApiKey) {
      setInputKey(geminiApiKey);
    }
  }, [geminiApiKey]);

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setSigningOut(false);
  }

  async function handleTestAndSaveKey() {
    if (!inputKey.trim()) {
      triggerHaptic("warning");
      setTestResult({ type: "error", message: "Please paste a Gemini API key first." });
      return;
    }

    setTesting(true);
    setTestResult(null);
    triggerHaptic("medium");

    try {
      const res = await fetch("/api/scan-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "test_key",
          apiKey: inputKey.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to validate key.");
      }

      setGeminiApiKey(inputKey.trim());
      setTestResult({
        type: "success",
        message: "Key verified! Unlimited receipt scanning is now active.",
      });
      triggerHaptic("success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Validation failed";
      setTestResult({ type: "error", message: msg });
      triggerHaptic("warning");
    } finally {
      setTesting(false);
    }
  }

  function handleRemoveKey() {
    triggerHaptic("light");
    setGeminiApiKey(null);
    setInputKey("");
    setTestResult(null);
  }

  return (
    <div className="pb-8">
      <SubPageHeader title="Settings" subtitle="Language, AI scanner, themes & cloud" />

      {cloudUser ? (
        <>
          <p className="mx-5 mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Account</p>
          <div className="mx-5 mb-6 overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="min-w-0">
                <p className="truncate text-[15px] font-medium text-ink">{cloudUser.email}</p>
                <p className="text-xs text-muted">Signed in · synced to the cloud</p>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="shrink-0 rounded-full bg-canvas px-4 py-2 text-sm font-semibold text-ink disabled:opacity-60"
              >
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="mb-6">
          <BackupPromoCard />
        </div>
      )}

      {/* AI RECEIPT SCANNER SECTION */}
      <div className="mx-5 mb-6">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">AI Receipt & Khata Scanner</p>
          {geminiApiKey ? (
            <span className="flex items-center gap-1 rounded-full bg-mint-soft px-2 py-0.5 text-[11px] font-semibold text-mint">
              <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse" />
              Custom Key Active
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary">
              <Zap size={11} /> Free Tier ({dailyScansRemaining} left today)
            </span>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4 space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Sparkles size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-ink">Google Gemini AI Engine</p>
              <p className="text-xs text-muted">
                {geminiApiKey
                  ? "Powered by your personal Google AI key — used for both receipt scanning and AI text parsing, with 1,500 free daily requests each."
                  : "This key powers both receipt scanning (3 free scans/day) and AI text parsing below. Add your own free key to unlock 1,500 free requests/day for each."}
              </p>
            </div>
          </div>

          {/* Key Input Field */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted">Gemini API Key</label>
            <div className="relative flex items-center">
              <input
                type={showKey ? "text" : "password"}
                value={inputKey}
                onChange={(e) => {
                  setInputKey(e.target.value);
                  setTestResult(null);
                }}
                placeholder="Paste AI Studio Key (AIzaSy...)"
                className="w-full rounded-xl border border-border bg-canvas px-3 py-2.5 pr-10 text-xs font-mono text-ink placeholder:text-subtle focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                aria-label={showKey ? "Hide key" : "Show key"}
                className="absolute right-2.5 flex h-6 w-6 items-center justify-center text-muted hover:text-ink"
              >
                {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Test / Save Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleTestAndSaveKey}
              disabled={testing || !inputKey.trim()}
              className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-semibold text-white shadow-xs disabled:opacity-50 active:scale-98"
            >
              {testing ? "Testing key..." : geminiApiKey === inputKey.trim() ? "Key Saved & Active" : "Test & Save Key"}
            </button>

            {geminiApiKey && (
              <button
                type="button"
                onClick={handleRemoveKey}
                className="rounded-xl border border-border bg-canvas px-3 py-2.5 text-xs font-semibold text-rose hover:bg-rose-soft/30 active:scale-98"
              >
                Remove
              </button>
            )}
          </div>

          {/* Test Status Messages */}
          {testResult && (
            <div
              className={`flex items-start gap-2 rounded-xl p-3 text-xs ${
                testResult.type === "success" ? "bg-mint-soft text-mint" : "bg-rose-soft text-rose"
              }`}
            >
              {testResult.type === "success" ? (
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
              ) : (
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
              )}
              <p className="font-medium">{testResult.message}</p>
            </div>
          )}

          {/* Free Setup Guide Accordion */}
          <div className="border-t border-border pt-3">
            <button
              type="button"
              onClick={() => setShowGuide((v) => !v)}
              className="flex w-full items-center justify-between text-xs font-medium text-primary hover:underline"
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} />
                How to get a 100% free Gemini API key
              </span>
              {showGuide ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showGuide && (
              <div className="mt-2.5 space-y-2 rounded-xl bg-canvas p-3 text-xs text-muted">
                <ol className="list-decimal pl-4 space-y-1.5">
                  <li>
                    Visit{" "}
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-0.5 font-semibold text-primary underline"
                    >
                      Google AI Studio <ExternalLink size={11} />
                    </a>{" "}
                    and sign in with any Google account.
                  </li>
                  <li>Click <strong>&ldquo;Create API key&rdquo;</strong> (no credit card or billing required).</li>
                  <li>Copy the key and paste it in the box above, then tap <strong>&ldquo;Test & Save Key&rdquo;</strong>.</li>
                </ol>
                <p className="text-[11px] text-subtle pt-1">
                  ✓ Free tier provides 1,500 scans/day, which is more than enough for daily shop expenses and khata slips.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TEXT & VOICE PARSING SECTION */}
      <div className="mx-5 mb-6">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Text & Voice Parsing</p>
          {geminiApiKey ? (
            <span className="flex items-center gap-1 rounded-full bg-mint-soft px-2 py-0.5 text-[11px] font-semibold text-mint">
              <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse" />
              Custom Key Active
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary">
              <Zap size={11} /> Free Tier ({dailyTextParsesRemaining} left today)
            </span>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4 space-y-3">
          <p className="text-xs text-muted">
            Choose how typed/voice entries like &ldquo;chicken tikka masala 200&rdquo; get understood.
            AI parsing shares your Gemini key from the scanner above but has its own daily free-tier limit.
          </p>

          <div className="flex rounded-xl border border-border bg-canvas p-1">
            {PARSING_MODES.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => {
                  triggerHaptic("light");
                  setParsingMode(m.value);
                }}
                className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                  parsingMode === m.value ? "bg-primary text-white shadow-xs" : "text-muted hover:text-ink"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <p className="text-[11px] text-subtle">
            {parsingMode === "local" &&
              "Fastest, fully offline, never contacts Google. Default."}
            {parsingMode === "auto" &&
              "Uses the fast local guesser first; only asks AI when it's unsure — best of both."}
            {parsingMode === "ai" &&
              "Every entry is classified by Gemini AI for maximum accuracy on unusual items."}
          </p>
        </div>
      </div>

      <p className="mx-5 mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Theme</p>
      <div className="mx-5 mb-6">
        <ThemePicker />
      </div>

      <div className="mx-5 overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
          <div>
            <p className="text-[15px] font-medium text-ink">Language</p>
            <p className="text-xs text-muted">English</p>
          </div>
        </div>
        <button
          onClick={() => setNotifications((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3.5 text-left"
        >
          <div>
            <p className="text-[15px] font-medium text-ink">Notifications</p>
            <p className="text-xs text-muted">Daily reminders to record expenses</p>
          </div>
          <span
            className={`flex h-6 w-11 items-center rounded-full px-0.5 transition-colors ${
              notifications ? "justify-end bg-primary" : "justify-start bg-border"
            }`}
          >
            <span className="h-5 w-5 rounded-full bg-white shadow" />
          </span>
        </button>
        <InstallSettingsRow />
      </div>

      <p className="mx-5 mt-4 text-xs text-muted">
        {cloudUser
          ? "Your data and settings are backed up to the cloud and available wherever you sign in."
          : "Your data and settings are stored locally on this device. Sign in above to back them up to the cloud."}
      </p>
    </div>
  );
}
