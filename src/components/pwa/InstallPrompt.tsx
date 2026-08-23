"use client";

import { useEffect, useState } from "react";
import { DownloadCloud, Smartphone, CheckCircle } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function InstallPwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if standalone (already installed)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  if (isInstalled || dismissed) {
    return null;
  }

  // If deferredPrompt is available (Android / Chrome / Desktop PWA)
  if (deferredPrompt) {
    return (
      <div className="mx-5 mb-4 flex items-center justify-between rounded-2xl border border-primary/20 bg-primary-soft p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
            <Smartphone size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Install Hisab App</p>
            <p className="text-xs text-muted">Use offline and on your home screen</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={async () => {
              if (deferredPrompt) {
                await deferredPrompt.prompt();
                const choice = await deferredPrompt.userChoice;
                if (choice.outcome === "accepted") {
                  setDeferredPrompt(null);
                }
              }
            }}
            className="rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm active:scale-95"
          >
            Install
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-xs text-muted hover:text-ink px-1"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return null;
}
