"use client";

import { useHisab } from "@/lib/store";
import { SubPageHeader } from "@/components/layout/SubPageHeader";
import type { PaymentMethod } from "@/lib/types";

const METHODS: Array<{ value: PaymentMethod; label: string }> = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "bank", label: "Bank transfer" },
  { value: "card", label: "Card" },
  { value: "credit", label: "Credit" },
  { value: "other", label: "Other" },
];

export default function PaymentMethodsPage() {
  const { enabledPaymentMethods, togglePaymentMethod } = useHisab();

  return (
    <div className="pb-8">
      <SubPageHeader title="Payment methods" subtitle="Choose what you track" />

      <div className="mx-5 overflow-hidden rounded-2xl border border-border bg-surface">
        {METHODS.map((m, i) => {
          const enabled = enabledPaymentMethods.includes(m.value);
          return (
            <button
              key={m.value}
              onClick={() => togglePaymentMethod(m.value)}
              className={`flex w-full items-center justify-between px-4 py-3.5 text-left ${
                i === METHODS.length - 1 ? "" : "border-b border-border"
              }`}
            >
              <span className="text-[15px] font-medium text-ink">{m.label}</span>
              <span
                className={`flex h-6 w-11 items-center rounded-full px-0.5 transition-colors ${
                  enabled ? "justify-end bg-primary" : "justify-start bg-border"
                }`}
              >
                <span className="h-5 w-5 rounded-full bg-white shadow" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
