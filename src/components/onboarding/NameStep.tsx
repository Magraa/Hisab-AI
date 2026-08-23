"use client";

import { useState } from "react";
import { Store, User, Lightbulb, X, Sparkles } from "lucide-react";
import type { AccountKind } from "@/lib/types";

export function NameStep({
  accountKind,
  businessName,
  userName,
  onChangeAccountKind,
  onChangeBusinessName,
  onChangeUserName,
  onContinue,
}: {
  accountKind: AccountKind;
  businessName: string;
  userName: string;
  onChangeAccountKind: (kind: AccountKind) => void;
  onChangeBusinessName: (name: string) => void;
  onChangeUserName: (userName: string) => void;
  onContinue: () => void;
}) {
  const isBusiness = accountKind === "business";
  const [touched, setTouched] = useState(false);

  const canContinue = isBusiness
    ? businessName.trim().length > 0 && userName.trim().length > 0
    : userName.trim().length > 0;

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
          {isBusiness ? <>Tell us about your business</> : <>What should we call you?</>}
        </h1>
        <p className="mt-2 text-sm text-muted">This will be used across your Hisab.</p>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {isBusiness && (
          <label
            className={`block rounded-2xl border-2 px-4 pb-3 pt-2 ${
              touched && businessName.trim().length === 0 ? "border-amber" : "border-primary"
            }`}
          >
            <span className="text-xs font-semibold text-primary">Business name</span>
            <span className="flex items-center gap-2">
              <input
                autoFocus
                value={businessName}
                onChange={(e) => onChangeBusinessName(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="Sharma Traders"
                className="min-w-0 flex-1 bg-transparent text-lg text-ink outline-none"
              />
              {businessName && (
                <button
                  type="button"
                  onClick={() => onChangeBusinessName("")}
                  aria-label="Clear business name"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary"
                >
                  <X size={13} />
                </button>
              )}
            </span>
          </label>
        )}

        <label
          className={`block rounded-2xl border-2 px-4 pb-3 pt-2 ${
            touched && userName.trim().length === 0 ? "border-amber" : "border-primary"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-primary">Your name</span>
            <span className="flex items-center gap-1 text-[11px] font-medium text-muted">
              <Sparkles size={11} className="text-primary" /> Alias prefilled
            </span>
          </div>
          <span className="flex items-center gap-2">
            <input
              autoFocus={!isBusiness}
              value={userName}
              onChange={(e) => onChangeUserName(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="BudgetMafia"
              className="min-w-0 flex-1 bg-transparent text-lg text-ink outline-none"
            />
            {userName && (
              <button
                type="button"
                onClick={() => onChangeUserName("")}
                aria-label="Clear user name"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary"
              >
                <X size={13} />
              </button>
            )}
          </span>
        </label>

        <div className="mt-1 flex items-start gap-3 rounded-2xl bg-primary-soft px-4 py-3.5">
          <Lightbulb size={18} className="mt-0.5 shrink-0 text-primary" />
          <p className="text-sm text-ink">
            You can change your name or business details anytime from {isBusiness ? "Business settings" : "Settings"}.
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
