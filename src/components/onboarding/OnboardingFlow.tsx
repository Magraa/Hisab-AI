"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useHisab } from "@/lib/store";
import type { AccountKind } from "@/lib/types";
import { WelcomeStep } from "./WelcomeStep";
import { NameStep } from "./NameStep";
import { TypeStep } from "./TypeStep";
import { RecordStep } from "./RecordStep";
import { FirstExpenseStep } from "./FirstExpenseStep";
import { OnboardingShell } from "./OnboardingShell";

type Stage = "welcome" | "name" | "type" | "record" | "first";

export function OnboardingFlow() {
  const router = useRouter();
  const { completeOnboarding } = useHisab();

  const [stage, setStage] = useState<Stage>("welcome");
  const [accountKind, setAccountKind] = useState<AccountKind>("business");
  const [name, setName] = useState("");
  const [businessType, setBusinessType] = useState("Retail");

  const isBusiness = accountKind === "business";
  const totalSteps = isBusiness ? 4 : 3;

  const stepNumber: Record<Exclude<Stage, "welcome">, number> = {
    name: 1,
    type: 2,
    record: isBusiness ? 3 : 2,
    first: isBusiness ? 4 : 3,
  };

  function finish() {
    completeOnboarding({
      name: name.trim() || (isBusiness ? "My Business" : "My Hisab"),
      type: isBusiness ? businessType : "Individual",
      accountKind,
    });
    router.push("/");
  }

  if (stage === "welcome") {
    return <WelcomeStep onGetStarted={() => setStage("name")} />;
  }

  if (stage === "name") {
    return (
      <OnboardingShell step={stepNumber.name} totalSteps={totalSteps} onBack={() => setStage("welcome")}>
        <NameStep
          accountKind={accountKind}
          name={name}
          onChangeAccountKind={setAccountKind}
          onChangeName={setName}
          onContinue={() => setStage(isBusiness ? "type" : "record")}
        />
      </OnboardingShell>
    );
  }

  if (stage === "type") {
    return (
      <OnboardingShell step={stepNumber.type} totalSteps={totalSteps} onBack={() => setStage("name")}>
        <TypeStep value={businessType} onChange={setBusinessType} onContinue={() => setStage("record")} />
      </OnboardingShell>
    );
  }

  if (stage === "record") {
    return (
      <OnboardingShell
        step={stepNumber.record}
        totalSteps={totalSteps}
        onBack={() => setStage(isBusiness ? "type" : "name")}
      >
        <RecordStep onContinue={() => setStage("first")} />
      </OnboardingShell>
    );
  }

  return (
    <OnboardingShell step={stepNumber.first} totalSteps={totalSteps} onBack={() => setStage("record")}>
      <FirstExpenseStep onFinish={finish} />
    </OnboardingShell>
  );
}
