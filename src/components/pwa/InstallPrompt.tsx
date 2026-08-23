"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, CheckCircle2, Share } from "lucide-react";
import { usePwaInstall } from "@/lib/pwa";

export function InstallPwaBanner() {
  const { canPrompt, isInstalled, isBannerDismissed, dismissBanner, promptInstall } = usePwaInstall();

  if (isInstalled || isBannerDismissed || !canPrompt) {
    return null;
  }

  return (
    <div className="mx-5 mb-4 flex items-center justify-between rounded-2xl border border-primary/20 bg-primary-soft p-3.5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-primary/20 bg-surface p-1 shadow-xs">
          <Image
            src="/Assets/Logo.png"
            alt="Hisab Logo"
            width={38}
            height={38}
            className="h-full w-full object-contain"
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">Install Hisab App</p>
          <p className="text-xs text-muted">Use offline and on your home screen</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => promptInstall()}
          className="rounded-xl bg-primary px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-transform active:scale-95 hover:bg-primary-dark"
        >
          Install
        </button>
        <button
          type="button"
          onClick={dismissBanner}
          aria-label="Dismiss banner"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-xs text-muted hover:bg-black/5 hover:text-ink"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function InstallSettingsRow() {
  const { canPrompt, isInstalled, isIOS, promptInstall } = usePwaInstall();
  const [showIosGuide, setShowIosGuide] = useState(false);

  if (isInstalled) {
    return (
      <div className="flex items-center justify-between border-t border-border px-4 py-3.5">
        <div>
          <p className="text-[15px] font-medium text-ink">Install App</p>
          <p className="text-xs text-muted">App is installed on this device</p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
          <CheckCircle2 size={14} /> Installed
        </span>
      </div>
    );
  }

  return (
    <div className="border-t border-border">
      <div className="flex items-center justify-between px-4 py-3.5">
        <div>
          <p className="text-[15px] font-medium text-ink">Install App</p>
          <p className="text-xs text-muted">Use offline &amp; add to home screen</p>
        </div>
        {canPrompt ? (
          <button
            type="button"
            onClick={() => promptInstall()}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-transform active:scale-95 hover:bg-primary-dark"
          >
            <Download size={14} />
            Install
          </button>
        ) : isIOS ? (
          <button
            type="button"
            onClick={() => setShowIosGuide((v) => !v)}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-transform active:scale-95 hover:bg-primary-dark"
          >
            <Share size={14} />
            Install
          </button>
        ) : (
          <button
            type="button"
            onClick={() => promptInstall()}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-transform active:scale-95 hover:bg-primary-dark"
          >
            <Download size={14} />
            Install
          </button>
        )}
      </div>

      {showIosGuide && (
        <div className="mx-4 mb-3.5 rounded-xl bg-canvas p-3 text-xs text-muted">
          <p className="font-semibold text-ink mb-1">To install on iOS Safari:</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Tap the <strong>Share</strong> icon (square with arrow) at the bottom of Safari.</li>
            <li>Scroll down and select <strong>&ldquo;Add to Home Screen&rdquo;</strong>.</li>
          </ol>
        </div>
      )}
    </div>
  );
}
