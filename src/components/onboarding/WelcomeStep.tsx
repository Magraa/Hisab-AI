import { Zap, Sparkles, ShieldCheck } from "lucide-react";

const FEATURES = [
  { icon: Zap, title: "Quick & effortless", body: "Add expenses in seconds" },
  { icon: Sparkles, title: "AI that understands", body: "It gets the amount and category from your words" },
  { icon: ShieldCheck, title: "Secure & private", body: "Your data is always safe" },
];

export function WelcomeStep({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas px-6 pb-8 pt-16">
      <div className="flex flex-1 flex-col items-center text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Assets/logo.png" alt="" className="h-14 w-14 object-contain" />
        </span>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink">HISAB</h1>
        <p className="mt-1 text-base text-muted">Your business. Finally in control.</p>

        <h2 className="mt-8 text-2xl font-bold leading-snug text-ink">
          A simpler way to
          <br />
          <span className="text-primary">record every expense.</span>
        </h2>

        <div className="mt-8 flex w-full flex-col gap-4 text-left">
          {FEATURES.map((f, i) => (
            <div key={f.title}>
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft">
                  <f.icon size={20} className="text-primary" />
                </span>
                <div>
                  <p className="font-semibold text-ink">{f.title}</p>
                  <p className="text-sm text-muted">{f.body}</p>
                </div>
              </div>
              {i < FEATURES.length - 1 && <div className="ml-[22px] mt-4 h-px bg-border" />}
            </div>
          ))}
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Assets/ledger-desk.png"
          alt="A notebook ledger with a pen and a receipt on a desk"
          className="mt-8 -mx-6 h-56 w-[calc(100%+3rem)] max-w-none object-cover"
        />
      </div>

      <div className="relative z-10 -mt-9">
        <button
          type="button"
          onClick={onGetStarted}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-semibold text-white shadow-lg"
        >
          Get started <span aria-hidden>→</span>
        </button>

        <div className="mt-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted">or</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <p className="mt-4 text-center text-sm text-ink">
          Already have an account? <span className="font-semibold text-primary">Log in</span>
        </p>
      </div>
    </div>
  );
}
