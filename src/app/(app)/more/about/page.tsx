import { SubPageHeader } from "@/components/layout/SubPageHeader";

export default function AboutPage() {
  return (
    <div className="pb-8">
      <SubPageHeader title="About Hisab" subtitle="Version 0.1.0" />

      <div className="mx-5 rounded-2xl border border-border bg-surface p-5 text-center">
        <p className="text-2xl font-semibold text-ink">HISAB</p>
        <p className="mt-1 text-sm text-muted">Your business. Your Hisab.</p>
        <p className="mt-4 text-sm text-ink">Just write what you spent. Hisab understands.</p>
      </div>
    </div>
  );
}
