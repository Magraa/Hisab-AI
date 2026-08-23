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
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

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
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
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
        )}
      </div>
    </div>
  );
}
