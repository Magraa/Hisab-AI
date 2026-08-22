import { Check } from "lucide-react";
import { SubPageHeader } from "@/components/layout/SubPageHeader";

const PERKS = [
  "Unlimited entries",
  "Advanced insights",
  "Receipt scanning",
  "AI search",
  "Export",
  "Multiple businesses",
];

export default function SubscriptionPage() {
  return (
    <div className="pb-8">
      <SubPageHeader title="Hisab Pro" subtitle="More power for your business" />

      <div className="mx-5 rounded-2xl border border-border bg-surface p-5">
        <ul className="flex flex-col gap-3">
          {PERKS.map((p) => (
            <li key={p} className="flex items-center gap-2 text-sm text-ink">
              <Check size={16} className="text-mint" /> {p}
            </li>
          ))}
        </ul>

        <div className="mt-5 border-t border-border pt-4 text-center">
          <p className="text-2xl font-semibold text-ink">Coming soon</p>
          <p className="mt-1 text-sm text-muted">Pricing and plans are still being finalized.</p>
        </div>
      </div>
    </div>
  );
}
