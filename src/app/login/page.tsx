"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>(searchParams.get("mode") === "signup" ? "signup" : "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "auth_failed"
      ? "Sign-in failed. Please try again."
      : searchParams.get("error") === "confirmation_failed"
        ? "That confirmation link is invalid or expired."
        : null,
  );
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleGoogleSignIn() {
    setError(null);
    setGoogleLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
    // On success the browser is redirected to Google, so no further state change here.
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      router.push("/");
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      if (!data.session) {
        setCheckEmail(true);
        return;
      }
      router.push("/");
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas px-6 pb-8 pt-6">
      <Link
        href="/onboarding"
        aria-label="Back"
        className="flex h-9 w-9 items-center justify-center text-ink"
      >
        <ArrowLeft size={20} />
      </Link>

      <div className="flex flex-1 flex-col pt-10">
        <h1 className="text-[26px] font-bold leading-snug text-ink">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {mode === "signin"
            ? "Log in to sync your Hisab across devices."
            : "Sign up to keep your Hisab backed up."}
        </p>

        <div className="mt-6 inline-flex w-fit rounded-full bg-surface p-1">
          {(["signin", "signup"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setError(null);
                setCheckEmail(false);
              }}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                mode === m ? "bg-primary text-white" : "text-muted"
              }`}
            >
              {m === "signin" ? "Log in" : "Sign up"}
            </button>
          ))}
        </div>

        {checkEmail ? (
          <div className="mt-8 rounded-2xl bg-primary-soft px-4 py-3.5 text-sm text-ink">
            Check <span className="font-semibold">{email}</span> for a confirmation link to finish creating your
            account.
          </div>
        ) : (
          <div className="mt-8 flex flex-col gap-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-surface py-4 text-base font-semibold text-ink disabled:opacity-60"
            >
              <GoogleLogo />
              {googleLoading ? "Redirecting…" : "Continue with Google"}
            </button>

            <div className="flex items-center gap-3 py-1">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium text-muted">or continue with email</span>
              <span className="h-px flex-1 bg-border" />
            </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="block rounded-2xl border-2 border-primary px-4 pb-3 pt-2">
              <span className="text-xs font-semibold text-primary">Email</span>
              <span className="flex items-center gap-2">
                <Mail size={16} className="shrink-0 text-muted" />
                <input
                  type="email"
                  autoFocus
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="min-w-0 flex-1 bg-transparent text-lg text-ink outline-none"
                />
              </span>
            </label>

            <label className="block rounded-2xl border-2 border-primary px-4 pb-3 pt-2">
              <span className="text-xs font-semibold text-primary">Password</span>
              <span className="flex items-center gap-2">
                <Lock size={16} className="shrink-0 text-muted" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="min-w-0 flex-1 bg-transparent text-lg text-ink outline-none"
                />
              </span>
            </label>

            {error && <p className="text-sm text-rose">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Please wait…" : mode === "signin" ? "Log in" : "Create account"}
            </button>
          </form>
          </div>
        )}
      </div>
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.03l3-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .95 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58Z"
      />
    </svg>
  );
}
