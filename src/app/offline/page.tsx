"use client";

import Link from "next/link";
import Image from "next/image";
import { WifiOff, RefreshCw, ArrowLeft } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen w-full max-w-md flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-soft text-primary shadow-inner">
        <WifiOff size={40} />
      </div>

      <div className="mb-2 flex items-center justify-center gap-2">
        <Image
          src="/icons/icon-192x192.png"
          alt="Hisab Logo"
          width={28}
          height={28}
          className="rounded-lg"
        />
        <h1 className="text-2xl font-bold tracking-tight text-ink">You are Offline</h1>
      </div>

      <p className="mb-8 max-w-xs text-sm text-muted">
        It looks like you don&rsquo;t have an active internet connection. Check your network and try again.
      </p>

      <div className="flex w-full flex-col gap-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary font-medium text-white shadow-sm transition-transform active:scale-[0.98]"
        >
          <RefreshCw size={18} />
          <span>Retry Connection</span>
        </button>

        <Link
          href="/"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-surface font-medium text-ink transition-colors hover:bg-canvas active:bg-primary-soft/40"
        >
          <ArrowLeft size={18} />
          <span>Go to Home</span>
        </Link>
      </div>
    </div>
  );
}
