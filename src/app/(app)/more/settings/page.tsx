"use client";

import { useState } from "react";
import { SubPageHeader } from "@/components/layout/SubPageHeader";
import { ThemePicker } from "@/components/theme/ThemePicker";
import { BackupPromoCard } from "@/components/layout/BackupPromoCard";
import { createClient } from "@/lib/supabase/client";
import { useHisab } from "@/lib/store";

export default function SettingsPage() {
  const { cloudUser } = useHisab();
  const [notifications, setNotifications] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setSigningOut(false);
  }

  return (
    <div className="pb-8">
      <SubPageHeader title="Settings" subtitle="Language, notifications, privacy" />

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
      </div>

      <p className="mx-5 mb-2 text-xs font-semibold uppercase tracking-wide text-muted">AI Receipt Scanner</p>
      <div className="mx-5 mb-6 overflow-hidden rounded-2xl border border-border bg-surface p-4 space-y-3">
        <div>
          <p className="text-[15px] font-medium text-ink">Google Gemini API Key</p>
          <p className="text-xs text-muted">
            Used for OCR scanning of bills and handwritten khata slips. Free 1,500 scans/day from{" "}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-primary font-semibold underline"
            >
              Google AI Studio
            </a>
            .
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="password"
            defaultValue={typeof window !== "undefined" ? localStorage.getItem("hisab_gemini_api_key") || "" : ""}
            placeholder="Paste your free API Key (AIzaSy...)"
            onChange={(e) => {
              try {
                if (e.target.value.trim()) {
                  localStorage.setItem("hisab_gemini_api_key", e.target.value.trim());
                } else {
                  localStorage.removeItem("hisab_gemini_api_key");
                }
              } catch {
                // ignore
              }
            }}
            className="flex-1 rounded-xl border border-border bg-canvas px-3 py-2 text-xs text-ink placeholder:text-subtle focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <p className="mx-5 mt-4 text-xs text-muted">
        {cloudUser
          ? "Your data is backed up to the cloud and available wherever you sign in."
          : "Your data is stored on this device. Sign in above to back it up and access it anywhere."}
      </p>
    </div>
  );
}
