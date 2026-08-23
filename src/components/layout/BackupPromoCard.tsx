import Link from "next/link";
import { CloudUpload } from "lucide-react";

export function BackupPromoCard() {
  return (
    <div className="mx-5 flex items-center justify-between rounded-2xl bg-primary-soft px-5 py-4">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface">
          <CloudUpload size={18} className="text-primary" />
        </span>
        <div>
          <p className="font-semibold text-ink">Back up your Hisab</p>
          <p className="text-sm text-muted">Your data lives only on this device. Sign in to keep it safe.</p>
        </div>
      </div>
      <Link href="/login" className="shrink-0 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white">
        Sign in
      </Link>
    </div>
  );
}
