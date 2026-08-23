import Link from "next/link";
import { Zap, Sparkles, ShieldCheck } from "lucide-react";

const FEATURES = [
  { icon: Zap, title: "Quick & effortless", body: "Add expenses in seconds" },
  { icon: Sparkles, title: "AI that understands", body: "Gets amount & category from your words" },
  { icon: ShieldCheck, title: "Secure & private", body: "Your data is always safe & private" },
];

export function WelcomeStep({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="flex h-[100dvh] max-h-[100dvh] w-full flex-col justify-between overflow-hidden bg-canvas px-[clamp(1rem,4.5vw,1.5rem)] py-[clamp(0.75rem,2.5vh,1.5rem)]">
      <div className="flex flex-1 flex-col items-center justify-center text-center min-h-0">
        <span className="flex h-[clamp(3.25rem,7.5vh,4.25rem)] w-[clamp(3.25rem,7.5vh,4.25rem)] shrink-0 items-center justify-center rounded-full bg-primary-soft shadow-xs">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Assets/onboarding/logo.webp" alt="" className="h-[clamp(2rem,5vh,2.75rem)] w-[clamp(2rem,5vh,2.75rem)] object-contain" />
        </span>
        <h1 className="mt-[clamp(0.35rem,1.2vh,0.75rem)] text-[clamp(1.6rem,4.2vh,2.25rem)] font-extrabold tracking-tight text-ink">
          HISAB
        </h1>
        <p className="mt-[clamp(0.1rem,0.4vh,0.25rem)] text-[clamp(0.78rem,1.6vh,0.92rem)] text-muted">
          Your business. Finally in control.
        </p>

        <h2 className="mt-[clamp(0.65rem,2.2vh,1.35rem)] text-[clamp(1.1rem,2.6vh,1.35rem)] font-bold leading-snug text-ink">
          A simpler way to <span className="text-primary">record every expense.</span>
        </h2>

        <div className="mt-[clamp(0.65rem,2.2vh,1.35rem)] flex w-full flex-col gap-[clamp(0.4rem,1.4vh,0.75rem)] text-left">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-center gap-[clamp(0.5rem,2.5vw,0.875rem)] rounded-xl bg-surface/70 p-[clamp(0.45rem,1.3vh,0.7rem)] border border-border/70 shadow-2xs">
              <span className="flex h-[clamp(2rem,4.5vh,2.5rem)] w-[clamp(2rem,4.5vh,2.5rem)] shrink-0 items-center justify-center rounded-full bg-primary-soft">
                <f.icon size={16} className="text-primary" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[clamp(0.78rem,1.7vh,0.88rem)] font-semibold text-ink leading-tight">{f.title}</p>
                <p className="text-[clamp(0.68rem,1.4vh,0.76rem)] text-muted leading-tight mt-0.5">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 shrink-0 pt-[clamp(0.5rem,1.8vh,1rem)]">
        <button
          type="button"
          onClick={onGetStarted}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-[clamp(0.75rem,2vh,1rem)] text-[clamp(0.95rem,2vh,1.05rem)] font-semibold text-white shadow-md hover:bg-primary-hover active:scale-[0.99] transition-all cursor-pointer"
        >
          Get started <span aria-hidden>→</span>
        </button>

        <div className="mt-[clamp(0.35rem,1vh,0.65rem)] flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-[clamp(0.68rem,1.3vh,0.75rem)] text-muted">or</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <p className="mt-[clamp(0.25rem,0.8vh,0.5rem)] text-center text-[clamp(0.72rem,1.5vh,0.82rem)] text-ink">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
