"use client";

import { AlertTriangle, X } from "lucide-react";
import { useHisab } from "@/lib/store";

export function CloudErrorBanner() {
  const { cloudError, dismissCloudError } = useHisab();
  if (!cloudError) return null;

  return (
    <div className="mx-5 mt-3 flex items-start gap-2.5 rounded-2xl bg-rose-soft px-4 py-3 text-sm text-ink">
      <AlertTriangle size={16} className="mt-0.5 shrink-0 text-rose" />
      <p className="flex-1">{cloudError}</p>
      <button onClick={dismissCloudError} aria-label="Dismiss" className="shrink-0 text-muted">
        <X size={14} />
      </button>
    </div>
  );
}
