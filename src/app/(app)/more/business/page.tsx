"use client";

import { useState } from "react";
import { useHisab } from "@/lib/store";
import { SubPageHeader } from "@/components/layout/SubPageHeader";
import type { AccountKind } from "@/lib/types";

const BUSINESS_TYPES = ["Retail", "Manufacturing", "Food & Beverages", "Trading", "Services", "Other"];
const CURRENCIES = [{ value: "INR", label: "₹ INR" }];

export default function BusinessSettingsPage() {
  const { business, updateBusiness } = useHisab();
  const [accountKind, setAccountKind] = useState<AccountKind>(business.accountKind);
  const [name, setName] = useState(business.name);
  const [type, setType] = useState(business.type);
  const [saved, setSaved] = useState(false);

  const isIndividual = accountKind === "individual";

  function save() {
    updateBusiness({
      name: name.trim() || business.name,
      type: isIndividual ? "Individual" : type,
      currency: "INR",
      accountKind,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="pb-8">
      <SubPageHeader title={isIndividual ? "Your Details" : "Business"} />

      <div className="mx-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">Account type</span>
          <div className="inline-flex rounded-full border border-border bg-surface p-1">
            {(["business", "individual"] as AccountKind[]).map((kind) => (
              <button
                key={kind}
                onClick={() => setAccountKind(kind)}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold ${
                  accountKind === kind ? "bg-primary text-white" : "text-muted"
                }`}
              >
                {kind === "business" ? "Business" : "Individual"}
              </button>
            ))}
          </div>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">
            {isIndividual ? "Your name" : "Business name"}
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-border bg-surface px-4 py-3 text-[15px] text-ink outline-none focus:border-primary"
          />
        </label>

        {!isIndividual && (
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">Business type</span>
            <div className="grid grid-cols-2 gap-2">
              {BUSINESS_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`rounded-xl border py-3 text-sm font-medium ${
                    type === t ? "border-primary bg-primary-soft text-primary" : "border-border bg-surface text-ink"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">Currency</span>
          <select
            defaultValue="INR"
            disabled
            className="rounded-xl border border-border bg-surface px-4 py-3 text-[15px] text-ink opacity-70 outline-none"
          >
            {CURRENCIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <button onClick={save} className="mt-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white">
          {saved ? "Saved ✓" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
