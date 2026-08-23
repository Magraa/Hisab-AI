"use client";

import { useState } from "react";
import Link from "next/link";
import { CloudUpload } from "lucide-react";
import { SubPageHeader } from "@/components/layout/SubPageHeader";
import { ThemePicker } from "@/components/theme/ThemePicker";
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
        <div className="mx-5 mb-6 flex items-center justify-between rounded-2xl bg-primary-soft px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface">
              <CloudUpload size={18} className="text-primary" />
            </span>
            <div>
              <p className="font-semibold text-ink">Back up your Hisab</p>
              <p className="text-sm text-muted">Your data lives only on this device. Sign in to keep it safe.</p>
            </div>
          </div>
          <Link
            href="/login"
            className="shrink-0 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white"
          >
            Sign in
          </Link>
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

      <p className="mx-5 mt-4 text-xs text-muted">
        {cloudUser
          ? "Your data is backed up to the cloud and available wherever you sign in."
          : "Your data is stored on this device. Sign in above to back it up and access it anywhere."}
      </p>
    </div>
  );
}
