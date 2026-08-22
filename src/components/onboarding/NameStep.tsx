"use client";

import { useState } from "react";
import { Store, User, Lightbulb, X } from "lucide-react";
import { onboarding as theme } from "./theme";
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
        <span
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: theme.primarySoft }}
        >
          {isBusiness ? (
            <Store size={26} style={{ color: theme.primary }} />
          ) : (
            <User size={26} style={{ color: theme.primary }} />
          )}
        </span>

        <div
          className="mt-6 inline-flex rounded-full p-1"
          style={{ backgroundColor: "#F1EDE1" }}
        >
          {(["business", "individual"] as AccountKind[]).map((kind) => (
            <button
              key={kind}
              type="button"
              onClick={() => onChangeAccountKind(kind)}
              className="rounded-full px-5 py-2 text-sm font-semibold transition-colors"
              style={
                accountKind === kind
                  ? { backgroundColor: theme.primary, color: "#fff" }
                  : { color: theme.muted }
              }
            >
              {kind === "business" ? "Business" : "Individual"}
            </button>
          ))}
        </div>

        <h1 className="mt-6 text-[26px] font-bold leading-snug" style={{ color: theme.ink }}>
          {isBusiness ? <>What do you call your business?</> : <>What should we call you?</>}
        </h1>
        <p className="mt-2 text-sm" style={{ color: theme.muted }}>
          This will be used across Hisab.
        </p>
      </div>

      <div className="mt-8">
        <label
          className="block rounded-2xl border-2 px-4 pb-3 pt-2"
          style={{ borderColor: touched && !canContinue ? "#D97706" : theme.primary }}
        >
          <span className="text-xs font-semibold" style={{ color: theme.primary }}>
            {isBusiness ? "Business name" : "Your name"}
          </span>
          <span className="flex items-center gap-2">
            <input
              autoFocus
              value={name}
              onChange={(e) => onChangeName(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder={isBusiness ? "Sharma Traders" : "Mayank Agrawal"}
              className="min-w-0 flex-1 bg-transparent text-lg outline-none"
              style={{ color: theme.ink }}
            />
            {name && (
              <button
                type="button"
                onClick={() => onChangeName("")}
                aria-label="Clear"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: theme.primarySoft, color: theme.primary }}
              >
                <X size={13} />
              </button>
            )}
          </span>
        </label>

        <div
          className="mt-5 flex items-start gap-3 rounded-2xl px-4 py-3.5"
          style={{ backgroundColor: theme.primarySoft }}
        >
          <Lightbulb size={18} style={{ color: theme.primary }} className="mt-0.5 shrink-0" />
          <p className="text-sm" style={{ color: theme.ink }}>
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
          className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-semibold text-white disabled:opacity-50"
          style={{ backgroundColor: theme.primary, opacity: canContinue ? 1 : 0.5 }}
        >
          Continue <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}
