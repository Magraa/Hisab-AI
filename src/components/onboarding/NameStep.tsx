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
    <div className="flex min-h-0 flex-1 flex-col justify-between overflow-hidden">
      <div className="flex flex-col items-center pt-[clamp(0.5rem,2vh,1.25rem)] text-center shrink-0">
        <span className="flex h-[clamp(2.75rem,6.5vh,3.5rem)] w-[clamp(2.75rem,6.5vh,3.5rem)] items-center justify-center rounded-full bg-primary-soft shadow-xs">
          {isBusiness ? (
            <Store size={22} className="text-primary" />
          ) : (
            <User size={22} className="text-primary" />
          )}
        </span>

        <div className="mt-[clamp(0.5rem,1.8vh,1rem)] inline-flex rounded-full bg-canvas p-1 border border-border">
          {(["business", "individual"] as AccountKind[]).map((kind) => (
            <button
              key={kind}
              type="button"
              onClick={() => onChangeAccountKind(kind)}
              className={`rounded-full px-[clamp(0.75rem,3vw,1.1rem)] py-[clamp(0.3rem,1vh,0.45rem)] text-[clamp(0.75rem,1.6vh,0.85rem)] font-semibold transition-colors cursor-pointer ${
                accountKind === kind ? "bg-primary text-white shadow-xs" : "text-muted"
              }`}
            >
              {kind === "business" ? "Business" : "Individual"}
            </button>
          ))}
        </div>

        <h1 className="mt-[clamp(0.5rem,1.8vh,1rem)] text-[clamp(1.2rem,3vh,1.5rem)] font-bold leading-snug text-ink">
          {isBusiness ? "Tell us about your business" : "What should we call you?"}
        </h1>
        <p className="mt-[clamp(0.15rem,0.5vh,0.35rem)] text-[clamp(0.75rem,1.6vh,0.85rem)] text-muted">
          This will be used across your Hisab.
        </p>
      </div>

      <div className="my-auto flex flex-col gap-[clamp(0.5rem,1.8vh,0.875rem)] py-[clamp(0.25rem,1vh,0.75rem)]">
        {isBusiness && (
          <label
            className={`block rounded-2xl border-2 px-[clamp(0.75rem,3vw,1rem)] py-[clamp(0.4rem,1.2vh,0.65rem)] bg-surface shadow-2xs ${
              touched && businessName.trim().length === 0 ? "border-amber" : "border-primary"
            }`}
          >
            <span className="text-[clamp(0.68rem,1.4vh,0.75rem)] font-semibold text-primary uppercase tracking-wide">
              Business name
            </span>
            <span className="flex items-center gap-2 mt-0.5">
              <input
                autoFocus
                value={businessName}
                onChange={(e) => onChangeBusinessName(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="Sharma Traders"
                className="min-w-0 flex-1 bg-transparent text-[clamp(0.95rem,2.2vh,1.1rem)] font-medium text-ink outline-none"
              />
              {businessName && (
                <button
                  type="button"
                  onClick={() => onChangeBusinessName("")}
                  aria-label="Clear business name"
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary"
                >
                  <X size={11} />
                </button>
              )}
            </span>
          </label>
        )}

        <label
          className={`block rounded-2xl border-2 px-[clamp(0.75rem,3vw,1rem)] py-[clamp(0.4rem,1.2vh,0.65rem)] bg-surface shadow-2xs ${
            touched && userName.trim().length === 0 ? "border-amber" : "border-primary"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[clamp(0.68rem,1.4vh,0.75rem)] font-semibold text-primary uppercase tracking-wide">
              Your name
            </span>
            <span className="flex items-center gap-1 text-[clamp(0.62rem,1.3vh,0.7rem)] font-medium text-muted">
              <Sparkles size={10} className="text-primary" /> Alias prefilled
            </span>
          </div>
          <span className="flex items-center gap-2 mt-0.5">
            <input
              autoFocus={!isBusiness}
              value={userName}
              onChange={(e) => onChangeUserName(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="BudgetMafia"
              className="min-w-0 flex-1 bg-transparent text-[clamp(0.95rem,2.2vh,1.1rem)] font-medium text-ink outline-none"
            />
            {userName && (
              <button
                type="button"
                onClick={() => onChangeUserName("")}
                aria-label="Clear user name"
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary"
              >
                <X size={11} />
              </button>
            )}
          </span>
        </label>

        <div className="flex items-start gap-2.5 rounded-2xl bg-primary-soft px-[clamp(0.75rem,3vw,1rem)] py-[clamp(0.5rem,1.3vh,0.75rem)]">
          <Lightbulb size={16} className="mt-0.5 shrink-0 text-primary" />
          <p className="text-[clamp(0.72rem,1.5vh,0.82rem)] text-ink leading-snug">
            You can change your name or business details anytime from {isBusiness ? "Business settings" : "Settings"}.
          </p>
        </div>
      </div>

      <div className="shrink-0 pt-[clamp(0.5rem,1.5vh,1rem)]">
        <button
          type="button"
          onClick={() => {
            setTouched(true);
            if (canContinue) onContinue();
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-[clamp(0.75rem,2vh,1rem)] text-[clamp(0.95rem,2vh,1.05rem)] font-semibold text-white shadow-md hover:bg-primary-hover active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
          disabled={!canContinue}
        >
          Continue <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}
