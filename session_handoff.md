# Hisab — Session Handoff

Written at the end of the build session that took Hisab from a design doc to a working mobile-first Next.js app. Read this before picking the project back up.

## What this project is

**Hisab** — "Your business. Your Hisab." — an AI-flavored expense notebook for Indian small business owners/freelancers. Core idea: typing `500 diesel` or `Ramesh 500` should be as fast as writing it in a paper notebook, with the app inferring amount, category, and person automatically.

Two top-level folders:
- `UI Plan/` — the design source of truth. `UI Plan/HISAB — COMPLETE UI STRUCTURE.md` is the full mobile+desktop UX spec (58→62 numbered sections after this session's edits). `UI Plan/Mobile/` and `UI Plan/Mobile/Onbaording/` hold the reference mockup screenshots. **Treat the mockups as the visual source of truth** — when asked to build/fix a screen, compare against the matching PNG before assuming the build is "close enough."
- `web/` — the actual Next.js app. Everything below lives here unless noted.

## Current state: what's actually built

A real, running mobile web app (not a mockup) — Next.js 16.3.2 (App Router, Turbopack), React 19, TypeScript, Tailwind v4. **No backend** — everything is client-only, persisted to `localStorage`. Dev server runs on port 3100.

Screens implemented, all matching their respective mockups:
- **Onboarding** (`/onboarding`) — Welcome → Name (with a Business/Individual toggle — Individual skips the next step) → Business Type (business only) → How-do-you-record → First Expense (reuses the real input component). Own cream/green chrome, no bottom nav.
- **Home** (`/`) — greeting, today's total, the Hisab input, today's entries, daily total.
- **Accounts** (`/accounts`, `/accounts/[id]`) — list with search/filters and relationship-color-coded rows, individual ledger view with Add expense / Settle up / Edit account (including nickname "aliases") / Export CSV / Download PDF / Send on WhatsApp.
- **Entries** (`/entries`) — full transaction log, date-grouped, filterable, floating add button.
- **Insights** (`/insights`) — period picker, totals, category donut, spending trend, computed insight cards.
- **More** (`/more` + subpages) — Business/Your Details, Categories, Payment Methods, Export, Subscription, Settings (incl. theme picker), **Help** (full feature documentation), About, "Restart onboarding".

## Architecture decisions worth knowing

- **State**: `src/lib/store.tsx` — a single `HisabProvider` React Context, persisted to `localStorage` under key `hisab_state_v1`. Seeded from `src/lib/seed.ts` (a demo business with 4 accounts — Ramesh/ABC Traders/Sharma Hardware/Suresh — whose balances intentionally match the numeric examples in the original product brief).
- **Local parsing engine**: `src/lib/parser.ts` — `parseInput()` does amount extraction, category-keyword matching (`src/lib/categories.ts`), known-entity/alias matching, direction detection (outgoing="You gave"/incoming="You got"), and a mishearing-correction pass for common English/Hindi speech-to-text mix-ups (sent↔saint, kal↔call, maal↔mall, etc.) before anything else runs. Confidence score drives whether `HisabInput` auto-saves, asks to confirm, or shows an error.
- **Balance model** (`src/lib/selectors.ts::computeBalance`): khata convention — whoever received more value owes it back. `"You owe"` / `"They owe you"`, not raw paid/received. This was buggy earlier in the session (Settle Up made debts bigger) and is now fixed and verified.
- **Theming**: `src/lib/themes.ts` is the theme registry (currently `indigo` default + `sage`, the cream/green look from the onboarding mockups). Themes are CSS-variable overrides keyed by `data-theme` on `<html>` (see `[data-theme="sage"]` in `globals.css`) — **only brand/surface tokens change per theme** (canvas, surface, ink, primary, etc.); functional tokens (mint/rose/amber/blue/peach/violet — success/danger/category colors) stay constant across themes on purpose. `ThemeProvider` + `ThemeScript` (a synchronous pre-paint bootstrap script) avoid a flash of the wrong theme; `<html>` has `suppressHydrationWarning` because of this. Switch themes from Settings → Theme; it applies everywhere instantly, including onboarding.
- **PDF statements**: `src/lib/statementPdf.ts` (jsPDF + jspdf-autotable). **Important gotcha already fixed**: jsPDF's built-in fonts don't include the ₹ glyph — it silently renders as a garbled superscript character. `formatRupeesPlain()` in `src/lib/format.ts` uses `"Rs. "` instead of `₹` specifically for PDF output; the on-screen `formatRupees()` still uses `₹` since browsers render it fine.
- **WhatsApp send**: `src/lib/whatsapp.ts`. There is no browser API that both targets a specific phone number *and* attaches a file — Web Share API can attach a file but only opens the general share sheet (contact picked manually); a `wa.me` link can target the exact number but text-only. Implementation tries `navigator.share` with the PDF first, falls back to opening the targeted `wa.me` chat + downloading the PDF so the user attaches it manually.
- **Route groups**: `app/(app)/` holds every screen that gets the bottom-nav shell (`app/(app)/layout.tsx`); `app/onboarding/` sits outside that group with its own layout (no nav). Root `app/layout.tsx` only sets up fonts + `ThemeProvider`/`HisabProvider`, no visual shell — needed so onboarding could have a different chrome than the rest of the app.
- **Assets**: real brand assets live in `public/Assets/` (kept the folder's original capitalization — renaming mid-session hit a file lock; case doesn't matter on Windows dev but would on a case-sensitive host later). `logo.png` is the actual app icon (used in Welcome), `ledger-desk.png` is the Welcome hero photo (full-bleed, breaks out of the page's padding, with the CTA button overlapping its bottom edge — matches the mockup), `receipt-scanner-icon.png` is used in the onboarding "Scan it" row.

## Data model (`src/lib/types.ts`)

```ts
Entity: { id, name, aliases[], type, relationship?, phone?, notes?, createdAt }
Transaction: { id, amount, categoryId?, description, entityId?, direction?, paymentMethod, source, rawInput?, createdAt }
BusinessProfile: { name, type, currency, accountKind: "business" | "individual" }
```
`Transaction.entityId` is a foreign key into `Entity` — the data is inherently relational (relevant if/when a backend gets picked, see below).

## Full file map (`src/`)

```
app/
  layout.tsx                 root layout: fonts, ThemeScript, ThemeProvider, HisabProvider (no visual shell)
  globals.css                theme tokens + [data-theme="sage"] override
  onboarding/
    layout.tsx, page.tsx     own chrome, renders OnboardingFlow
  (app)/
    layout.tsx                the shell: max-w-[440px] column + BottomNav
    page.tsx                  Home
    accounts/page.tsx, accounts/[id]/page.tsx
    entries/page.tsx
    insights/page.tsx
    more/page.tsx + about/, business/, categories/, export/, help/, payment-methods/, settings/, subscription/
components/
  hisab/     AccountDetailScreen, AccountRow, HisabInput, TransactionRow, TransactionDetailSheet, TrendChart
  layout/    BottomNav, PageHeader, SubPageHeader
  onboarding/ OnboardingFlow, OnboardingShell, WelcomeStep, NameStep, TypeStep, RecordStep, FirstExpenseStep
  theme/     ThemeProvider, ThemeScript, ThemePicker
  ui/        Card, Chip, EmptyState, IconBadge, Sheet
lib/
  store.tsx       HisabProvider / useHisab() — the whole app's state + actions
  types.ts        Entity / Transaction / BusinessProfile
  seed.ts         demo data
  parser.ts       local NLP-ish parsing engine
  categories.ts   category keyword dictionary + icons
  selectors.ts    computeBalance, groupByDay, etc.
  insights.ts     period ranges, category breakdown, trend, insight-card generation
  format.ts       formatRupees (screen) / formatRupeesPlain (PDF-safe) / date helpers
  relationships.ts color coding per relationship type
  statementPdf.ts PDF statement generator
  whatsapp.ts     best-effort WhatsApp send
  themes.ts       theme registry
```

## Known bugs fixed this session (don't reintroduce these)

1. **Balance polarity was inverted** — Settle Up used to make a debt bigger instead of clearing it. Fixed in `computeBalance`; verified live (paying down Ramesh's balance now correctly goes to ₹0/"Settled").
2. **Parser string-join bug** — `stripAmount()` in `parser.ts` used to naively concatenate the text before/after the matched amount, which ate a space when the regex's trailing `\s?` consumed it — "Send 500 to Satyam" became the entity "Sendto Satyam". Fixed by explicitly rejoining with a space; also added "send/sent/receive/received/got/from/give/gave" to the stripped connector words.
3. **PDF ₹ symbol garbling** — see `formatRupeesPlain` above.
4. **Hydration warning on `<html data-theme>`** — expected with a pre-paint theme script; fixed with `suppressHydrationWarning` on `<html>` (standard pattern, same one theme libraries like `next-themes` use).

## Known limitations (honest, not accidental)

- No backend/auth/cloud sync — single device, `localStorage` only. Clearing browser data wipes everything (Export/Download PDF are the only backup path right now).
- Receipt scanning is a stub — opens the camera/file picker but doesn't OCR anything yet (says so honestly in the UI and in Help).
- Voice input needs a browser with the Web Speech API (mic button just greys out otherwise).
- WhatsApp send can't both target a specific number *and* attach a file (browser platform limitation, not a bug — see `whatsapp.ts` comment).
- Categories are a fixed built-in dictionary, not yet user-customizable.
- "Log in" on the Welcome screen and "View Plans" (Subscription) are inert — no real auth or billing.

## Backend: Supabase — schema + auth built, data migration not started

Compared Supabase vs Firebase free tiers for this project specifically: **Supabase** won — the data is relational (`entityId` FK, category/day aggregations), Firebase removed free file storage in 2026 (a problem given planned receipt scanning), and Firestore's daily read quota is a worse fit for a read-heavy Insights page than Supabase's unmetered-by-operation free tier.

**What's actually built (2026-08-23):**
- Supabase project **"hisab"** (id `uwyjvhwdhadsakkaguhg`, region `ap-south-1`, org `hljqsanbmbpwqgohtmno`/"Magraa's Org", free tier). Note: this reused a placeholder project named "Magraa's Project" in the dashboard — the account is capped at 2 free projects and one was already used by an unrelated "ProperCoupons" project, so creating a brand-new one wasn't possible without pausing/deleting something. Consider renaming it to "hisab" in the dashboard for clarity; the MCP tools have no rename call.
- Schema (`public.profiles`, `public.entities`, `public.transactions`) mirroring `src/lib/types.ts`'s `BusinessProfile`/`Entity`/`Transaction` almost 1:1 (snake_case columns, text+check-constraint enums instead of Postgres enums for easy iteration). Full RLS on all three tables (`user_id = auth.uid()` / `id = auth.uid()` for profiles), a `handle_new_user()` trigger that auto-inserts a `profiles` row on signup (EXECUTE revoked from `public`/`anon`/`authenticated` so it's not RPC-callable), and `(select auth.uid())` in every policy per the Supabase performance advisor. `categories` was deliberately *not* turned into a table — stays the static `src/lib/categories.ts` dictionary since it's not user-customizable yet; migrating that is a separate future decision.
- App wiring: `@supabase/supabase-js` + `@supabase/ssr` installed. `src/lib/supabase/{client,server,middleware,types}.ts` follow the standard Next.js App Router pattern (browser client, server client via `cookies()`, middleware session-refresh helper). Root `middleware.ts` calls it but **does not gate routes** — it only keeps the session cookie fresh, on purpose (see below). `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (the modern `sb_publishable_...` key, not the legacy anon JWT), already covered by the repo's blanket `.env*` gitignore rule.
- Real auth UI: `/login` (own chrome, no bottom nav, matches onboarding's visual style) with email/password sign-in and sign-up tabs, wired to `supabase.auth.signInWithPassword`/`signUp`. `/auth/confirm/route.ts` handles the email-confirmation link (`verifyOtp`). Settings (`more/settings`) has a new "Account" section showing signed-in email + Sign out, or a Log in link when signed out. Welcome screen's "Log in" text is now a real link to `/login`.
- **Tested live in-browser end to end** (then cleaned up): sign-up → confirmation-required message shown → verified in DB that `auth.users` row + auto-created `profiles` row exist with correct defaults → sign-in attempt on the unconfirmed account correctly rejected with "Email not confirmed" surfaced in the UI → deleted the test user, confirmed the `profiles` row cascade-deleted too.

**Deliberately not done this pass** (scope was "schema + auth", not the full migration):
- `store.tsx` is still 100% `localStorage` — signing in does not yet sync/replace local data. The app is fully usable signed-out, same as before.
- Middleware does not redirect unauthenticated users anywhere — there's no reason to force login until there's cloud data worth protecting.
- No password-reset flow, no OAuth providers, no rate limiting beyond Supabase defaults.

**Next steps if resuming this thread**: migrate `store.tsx`'s reducer/actions to read/write Supabase (`entities`/`transactions`/`profiles`) instead of `localStorage`, decide on an offline/optimistic-update strategy (the app's whole pitch is speed — don't regress the "type `500 diesel`, done" feel with network round-trips), and decide what happens to existing localStorage data on first sign-in (probably: offer to import it once).

## How to run it

```
cd E:\Project\HisabAI\web
npm run dev -- -p 3100     # dev server, http://localhost:3100
npm run build               # production build (do this after any change — it's the fast way to catch type errors)
```
Dev server log (when run in background this session) was piped to `/tmp/hisab-dev.log`. To reset to fresh seed data in a browser: `localStorage.removeItem('hisab_state_v1')` then reload. Theme preference is a separate key: `localStorage.setItem('hisab_theme', 'indigo' | 'sage')`.

## If you're picking this up cold

1. Read `UI Plan/HISAB — COMPLETE UI STRUCTURE.md` and skim the mockup PNGs first — they're the spec.
2. `npm run build` before touching anything, so you know the baseline is clean.
3. The plan file at `C:\Users\Magra\.claude\plans\hisab-your-clever-quail.md` currently holds the Supabase-vs-Firebase writeup (the most recent planning session) — it gets overwritten each time plan mode is used, so don't assume it reflects earlier decisions like the Accounts-tab nav work (that's done and merged into the UI Plan doc itself, not just the plan file).
4. Biggest open door: picking a backend and wiring up real persistence/auth. Second biggest: receipt OCR (needs an AI vision call, not just UI).
