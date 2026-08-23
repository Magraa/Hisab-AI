"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useHisab } from "@/lib/store";
import { getRandomCreativeName } from "@/lib/creativeNames";
import type { AccountKind } from "@/lib/types";
import { WelcomeStep } from "./WelcomeStep";
import { NameStep } from "./NameStep";
import { TypeStep } from "./TypeStep";
import { RecordStep } from "./RecordStep";
import { FirstExpenseStep } from "./FirstExpenseStep";
import { BackupPromptStep } from "./BackupPromptStep";
import { OnboardingShell } from "./OnboardingShell";

type Stage = "welcome" | "name" | "type" | "record" | "first" | "backup";

export function OnboardingFlow() {
  const router = useRouter();
  const { completeOnboarding } = useHisab();

  const [stage, setStage] = useState<Stage>("welcome");
  const [accountKind, setAccountKind] = useState<AccountKind>("business");
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [businessType, setBusinessType] = useState("Retail");

  useEffect(() => {
    setUserName(getRandomCreativeName());
  }, []);

  const isBusiness = accountKind === "business";
  const totalSteps = isBusiness ? 4 : 3;

  const stepNumber: Record<Exclude<Stage, "welcome">, number> = {
    name: 1,
    type: 2,
    record: isBusiness ? 3 : 2,
    first: isBusiness ? 4 : 3,
    backup: isBusiness ? 4 : 3,
  };

  function saveProfile() {
    const cleanUserName = userName.trim() || getRandomCreativeName();
    const cleanBusinessName = name.trim() || (isBusiness ? "My Business" : cleanUserName);
    completeOnboarding({
      name: isBusiness ? cleanBusinessName : cleanUserName,
      userName: cleanUserName,
      type: isBusiness ? businessType : "Individual",
      accountKind,
    });
  }

  function finishLocally() {
    saveProfile();
    router.push("/");
  }

  function goToAuth(mode: "signup" | "signin") {
    saveProfile();
    router.push(`/login?mode=${mode}`);
  }

  return (
    <AnimatePresence mode="wait">
      {stage === "welcome" && (
        <motion.div
          key="welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <WelcomeStep onGetStarted={() => setStage("name")} />
        </motion.div>
      )}

      {stage === "name" && (
        <motion.div
          key="name"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <OnboardingShell step={stepNumber.name} totalSteps={totalSteps} onBack={() => setStage("welcome")}>
            <NameStep
              accountKind={accountKind}
              businessName={name}
              userName={userName}
              onChangeAccountKind={setAccountKind}
              onChangeBusinessName={setName}
              onChangeUserName={setUserName}
              onContinue={() => setStage(isBusiness ? "type" : "record")}
            />
          </OnboardingShell>
        </motion.div>
      )}

      {stage === "type" && (
        <motion.div
          key="type"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <OnboardingShell step={stepNumber.type} totalSteps={totalSteps} onBack={() => setStage("name")}>
            <TypeStep value={businessType} onChange={setBusinessType} onContinue={() => setStage("record")} />
          </OnboardingShell>
        </motion.div>
      )}

      {stage === "record" && (
        <motion.div
          key="record"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <OnboardingShell
            step={stepNumber.record}
            totalSteps={totalSteps}
            onBack={() => setStage(isBusiness ? "type" : "name")}
          >
            <RecordStep onContinue={() => setStage("first")} />
          </OnboardingShell>
        </motion.div>
      )}

      {stage === "first" && (
        <motion.div
          key="first"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <OnboardingShell step={stepNumber.first} totalSteps={totalSteps} onBack={() => setStage("record")}>
            <FirstExpenseStep onFinish={() => setStage("backup")} />
          </OnboardingShell>
        </motion.div>
      )}

      {stage === "backup" && (
        <motion.div
          key="backup"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <OnboardingShell step={stepNumber.backup} totalSteps={totalSteps} onBack={() => setStage("first")}>
            <BackupPromptStep
              onSignUp={() => goToAuth("signup")}
              onLogIn={() => goToAuth("signin")}
              onSkip={finishLocally}
            />
          </OnboardingShell>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

