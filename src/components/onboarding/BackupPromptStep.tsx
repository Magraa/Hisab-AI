"use client";

import { CloudUpload } from "lucide-react";

export function BackupPromptStep({
  onSignUp,
  onLogIn,
  onSkip,
}: {
  onSignUp: () => void;
  onLogIn: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft">
          <CloudUpload size={26} className="text-primary" />
        </span>
        <h1 className="mt-6 text-[26px] font-bold leading-snug text-ink">Keep your Hisab safe.</h1>
        <p className="mt-2 max-w-xs text-sm text-muted">
          Sign in and your data will be backed up to the cloud, safe even if you lose this device.
        </p>
      </div>

      <div className="mt-auto pt-8">
        <button
          type="button"
          onClick={onSignUp}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-semibold text-white"
        >
          Create account <span aria-hidden>→</span>
        </button>
        <button
          type="button"
          onClick={onLogIn}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-border py-4 text-base font-semibold text-ink"
        >
          Log in
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="mt-3 w-full py-2 text-center text-sm font-medium text-muted"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
