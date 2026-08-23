"use client";

import { useState } from "react";
import { CloudUpload } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";

export function BackupPromptSheet({
  open,
  onClose,
  onGoogleSignIn,
  onSignUp,
  onLogIn,
  onSkip,
}: {
  open: boolean;
  onClose: () => void;
  onGoogleSignIn?: () => Promise<void> | void;
  onSignUp: () => void;
  onLogIn: () => void;
  onSkip: () => void;
}) {
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleGoogle() {
    if (!onGoogleSignIn) return;
    setGoogleLoading(true);
    try {
      await onGoogleSignIn();
    } finally {
      // In case oauth redirect doesn't happen immediately or errors
      setTimeout(() => setGoogleLoading(false), 2000);
    }
  }

  return (
    <Sheet open={open} onClose={onClose}>
      <div className="flex flex-col items-center pt-2 pb-2 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft">
          <CloudUpload size={28} className="text-primary" />
        </span>
        <h2 className="mt-4 text-2xl font-bold leading-snug text-ink">Keep your Hisab safe.</h2>
        <p className="mt-2 max-w-xs text-sm text-muted">
          Sign in and your data will be backed up to the cloud, safe even if you lose this device.
        </p>

        <div className="mt-6 w-full space-y-3">
          {/* Sign in with Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-surface py-3.5 text-base font-semibold text-ink shadow-xs transition-all hover:bg-canvas active:scale-[0.99] cursor-pointer disabled:opacity-60"
          >
            <GoogleLogo />
            {googleLoading ? "Redirecting…" : "Sign in with Google"}
          </button>

          {/* Create account & Log in on the same line */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onSignUp}
              className="flex items-center justify-center rounded-2xl bg-primary py-3.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-primary-hover active:scale-[0.99] cursor-pointer"
            >
              Create account
            </button>
            <button
              type="button"
              onClick={onLogIn}
              className="flex items-center justify-center rounded-2xl border border-border bg-surface py-3.5 text-sm font-semibold text-ink transition-all hover:bg-canvas active:scale-[0.99] cursor-pointer"
            >
              Log in
            </button>
          </div>

          {/* Skip */}
          <button
            type="button"
            onClick={onSkip}
            className="w-full pt-1 pb-1 text-center text-sm font-medium text-muted hover:text-ink transition-colors cursor-pointer"
          >
            Skip for now
          </button>
        </div>
      </div>
    </Sheet>
  );
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.03l3-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .95 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58Z"
      />
    </svg>
  );
}

// Kept for backwards compatibility
export const BackupPromptStep = BackupPromptSheet;


