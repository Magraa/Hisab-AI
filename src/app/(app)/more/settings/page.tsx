"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { SubPageHeader } from "@/components/layout/SubPageHeader";
import { ThemePicker } from "@/components/theme/ThemePicker";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setSigningOut(false);
    router.refresh();
  }

  return (
    <div className="pb-8">
      <SubPageHeader title="Settings" subtitle="Language, notifications, privacy" />

      <p className="mx-5 mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Account</p>
      <div className="mx-5 mb-6 overflow-hidden rounded-2xl border border-border bg-surface">
        {user ? (
          <div className="flex items-center justify-between px-4 py-3.5">
            <div>
              <p className="text-[15px] font-medium text-ink">{user.email}</p>
              <p className="text-xs text-muted">Signed in</p>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="rounded-full bg-canvas px-4 py-2 text-sm font-semibold text-ink disabled:opacity-60"
            >
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        ) : (
          <Link href="/login" className="flex items-center justify-between px-4 py-3.5">
            <div>
              <p className="text-[15px] font-medium text-ink">Not signed in</p>
              <p className="text-xs text-muted">Log in or create an account</p>
            </div>
            <span className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">Log in</span>
          </Link>
        )}
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
      </div>

      <p className="mx-5 mt-4 text-xs text-muted">
        Your data is stored on this device. Cloud sync and account recovery are coming in a future update.
      </p>
    </div>
  );
}
