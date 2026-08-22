import { BookText, Zap, Sparkles, ShieldCheck } from "lucide-react";
import { onboarding as theme } from "./theme";
import { PlaceholderArt } from "./PlaceholderArt";

const FEATURES = [
  { icon: Zap, title: "Quick & effortless", body: "Add expenses in seconds" },
  { icon: Sparkles, title: "AI that understands", body: "It gets the amount and category from your words" },
  { icon: ShieldCheck, title: "Secure & private", body: "Your data is always safe" },
];

export function WelcomeStep({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="flex min-h-screen flex-col px-6 pb-8 pt-16" style={{ backgroundColor: theme.bg }}>
      <div className="flex flex-1 flex-col items-center text-center">
        <span
          className="flex h-20 w-20 items-center justify-center rounded-full"
          style={{ backgroundColor: theme.primarySoft }}
        >
          <BookText size={34} style={{ color: theme.primary }} />
        </span>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight" style={{ color: theme.ink }}>
          HISAB
        </h1>
        <p className="mt-1 text-base" style={{ color: theme.muted }}>
          Your business. Finally in control.
        </p>

        <h2 className="mt-8 text-2xl font-bold leading-snug" style={{ color: theme.ink }}>
          A simpler way to
          <br />
          <span style={{ color: theme.primary }}>record every expense.</span>
        </h2>

        <div className="mt-8 flex w-full flex-col gap-4 text-left">
          {FEATURES.map((f, i) => (
            <div key={f.title}>
              <div className="flex items-center gap-4">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: theme.primarySoft }}
                >
                  <f.icon size={20} style={{ color: theme.primary }} />
                </span>
                <div>
                  <p className="font-semibold" style={{ color: theme.ink }}>
                    {f.title}
                  </p>
                  <p className="text-sm" style={{ color: theme.muted }}>
                    {f.body}
                  </p>
                </div>
              </div>
              {i < FEATURES.length - 1 && <div className="ml-[22px] mt-4 h-px" style={{ backgroundColor: theme.border }} />}
            </div>
          ))}
        </div>

        <PlaceholderArt label="Notebook photo — brand asset to add later" className="mt-8 w-full" height={140} />
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={onGetStarted}
          className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-semibold text-white"
          style={{ backgroundColor: theme.primary }}
        >
          Get started <span aria-hidden>→</span>
        </button>

        <div className="mt-5 flex items-center gap-3">
          <span className="h-px flex-1" style={{ backgroundColor: theme.border }} />
          <span className="text-xs" style={{ color: theme.muted }}>
            or
          </span>
          <span className="h-px flex-1" style={{ backgroundColor: theme.border }} />
        </div>

        <p className="mt-4 text-center text-sm" style={{ color: theme.ink }}>
          Already have an account?{" "}
          <span className="font-semibold" style={{ color: theme.primary }}>
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
