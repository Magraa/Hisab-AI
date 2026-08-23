"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHisab } from "@/lib/store";

export function OnboardingGate() {
  const { hydrated, hasOnboarded } = useHisab();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !hasOnboarded) router.replace("/onboarding");
  }, [hydrated, hasOnboarded, router]);

  return null;
}
