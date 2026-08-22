"use client";

import { useState } from "react";
import { SubPageHeader } from "@/components/layout/SubPageHeader";
import { ThemePicker } from "@/components/theme/ThemePicker";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="pb-8">
      <SubPageHeader title="Settings" subtitle="Language, notifications, privacy" />

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
