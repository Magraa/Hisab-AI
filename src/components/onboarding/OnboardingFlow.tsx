"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useHisab } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { getRandomCreativeName } from "@/lib/creativeNames";
import type { AccountKind } from "@/lib/types";
import { WelcomeStep } from "./WelcomeStep";
import { NameStep } from "./NameStep";
import { TypeStep } from "./TypeStep";
import { RecordStep } from "./RecordStep";
import { FirstExpenseStep } from "./FirstExpenseStep";
import { BackupPromptSheet } from "./BackupPromptStep";
import { OnboardingShell } from "./OnboardingShell";

type Stage = "welcome" | "name" | "type" | "record" | "first";

export function OnboardingFlow() {
  const router = useRouter();
  const { completeOnboarding } = useHisab();

  const [stage, setStage] = useState<Stage>("welcome");
  const [accountKind, setAccountKind] = useState<AccountKind>("business");
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [businessType, setBusinessType] = useState("Retail");
  const [showBackupSheet, setShowBackupSheet] = useState(false);

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

  async function handleGoogleSignIn() {
    saveProfile();
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {stage === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex h-full min-h-0 flex-1 flex-col overflow-hidden"
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
            className="flex h-full min-h-0 flex-1 flex-col overflow-hidden"
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
            className="flex h-full min-h-0 flex-1 flex-col overflow-hidden"
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
            className="flex h-full min-h-0 flex-1 flex-col overflow-hidden"
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
            className="flex h-full min-h-0 flex-1 flex-col overflow-hidden"
          >
            <OnboardingShell step={stepNumber.first} totalSteps={totalSteps} onBack={() => setStage("record")}>
              <FirstExpenseStep onFinish={() => setShowBackupSheet(true)} />
            </OnboardingShell>
          </motion.div>
        )}
      </AnimatePresence>

      <BackupPromptSheet
        open={showBackupSheet}
        onClose={() => setShowBackupSheet(false)}
        onGoogleSignIn={handleGoogleSignIn}
        onSignUp={() => goToAuth("signup")}
        onLogIn={() => goToAuth("signin")}
        onSkip={finishLocally}
      />
    </>
  );
}

