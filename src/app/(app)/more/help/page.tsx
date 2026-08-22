import { SubPageHeader } from "@/components/layout/SubPageHeader";

const FAQS = [
  {
    q: "How does Hisab understand what I type?",
    a: 'Hisab looks for an amount, a known category word (like "diesel" or "chai"), or the name of someone you\'ve mentioned before, and fills in the rest automatically.',
  },
  {
    q: "What if Hisab gets it wrong?",
    a: "Tap any entry to edit the amount, category, or payment method — or delete it entirely.",
  },
  {
    q: "Is my data backed up?",
    a: "Right now your Hisab is saved on this device only. Cloud backup is planned for a future update.",
  },
];

export default function HelpPage() {
  return (
    <div className="pb-8">
      <SubPageHeader title="Help & Support" subtitle="Get help, contact us" />

      <div className="mx-5 flex flex-col gap-3">
        {FAQS.map((f) => (
          <div key={f.q} className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-[15px] font-medium text-ink">{f.q}</p>
            <p className="mt-1 text-sm text-muted">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
