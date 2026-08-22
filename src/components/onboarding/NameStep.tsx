"use client";

import { useState } from "react";
import { Store, User, Lightbulb, X } from "lucide-react";
import type { AccountKind } from "@/lib/types";

export function NameStep({
  accountKind,
  name,
  onChangeAccountKind,
  onChangeName,
  onContinue,
}: {
  accountKind: AccountKind;
  name: string;
  onChangeAccountKind: (kind: AccountKind) => void;
  onChangeName: (name: string) => void;
  onContinue: () => void;
}) {
  const isBusiness = accountKind === "business";
  const [touched, setTouched] = useState(false);
  const canContinue = name.trim().length > 0;

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col items-center pt-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft">
          {isBusiness ? <Store size={26} className="text-primary" /> : <User size={26} className="text-primary" />}
        </span>

        <div className="mt-6 inline-flex rounded-full bg-canvas p-1">
          {(["business", "individual"] as AccountKind[]).map((kind) => (
            <button
              key={kind}
              type="button"
              onClick={() => onChangeAccountKind(kind)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                accountKind === kind ? "bg-primary text-white" : "text-muted"
              }`}
            >
              {kind === "business" ? "Business" : "Individual"}
            </button>
          ))}
        </div>

        <h1 className="mt-6 text-[26px] font-bold leading-snug text-ink">
          {isBusiness ? <>What do you call your business?</> : <>What should we call you?</>}
        </h1>
        <p className="mt-2 text-sm text-muted">This will be used across Hisab.</p>
      </div>

      <div className="mt-8">
        <label
          className={`block rounded-2xl border-2 px-4 pb-3 pt-2 ${
            touched && !canContinue ? "border-amber" : "border-primary"
          }`}
        >
          <span className="text-xs font-semibold text-primary">{isBusiness ? "Business name" : "Your name"}</span>
          <span className="flex items-center gap-2">
            <input
              autoFocus
              value={name}
              onChange={(e) => onChangeName(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder={isBusiness ? "Sharma Traders" : "Mayank Agrawal"}
              className="min-w-0 flex-1 bg-transparent text-lg text-ink outline-none"
            />
            {name && (
              <button
                type="button"
                onClick={() => onChangeName("")}
                aria-label="Clear"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary"
              >
                <X size={13} />
              </button>
            )}
          </span>
        </label>

        <div className="mt-5 flex items-start gap-3 rounded-2xl bg-primary-soft px-4 py-3.5">
          <Lightbulb size={18} className="mt-0.5 shrink-0 text-primary" />
          <p className="text-sm text-ink">
            You can change this later from {isBusiness ? "Business settings" : "Settings"}.
          </p>
        </div>
      </div>

      <div className="mt-auto pt-8">
        <button
          type="button"
          onClick={() => {
            setTouched(true);
            if (canContinue) onContinue();
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-semibold text-white"
          style={{ opacity: canContinue ? 1 : 0.5 }}
        >
          Continue <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}
