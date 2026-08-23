# Hisab — Session Handoff

Written at the end of the build session that took Hisab from a design doc to a working mobile-first Next.js app. Read this before picking the project back up.

## What this project is

**Hisab** — "Your business. Your Hisab." — an AI-flavored expense notebook for Indian small business owners/freelancers. Core idea: typing `500 diesel` or `Ramesh 500` should be as fast as writing it in a paper notebook, with the app inferring amount, category, and person automatically.

Two top-level folders:
- `UI Plan/` — the design source of truth. `UI Plan/HISAB — COMPLETE UI STRUCTURE.md` is the full mobile+desktop UX spec (58→62 numbered sections after this session's edits). `UI Plan/Mobile/` and `UI Plan/Mobile/Onbaording/` hold the reference mockup screenshots. **Treat the mockups as the visual source of truth** — when asked to build/fix a screen, compare against the matching PNG before assuming the build is "close enough."
- `web/` — the actual Next.js app. Everything below lives here unless noted.

## Current state: what's actually built

A real, running mobile web app (not a mockup) — Next.js 16.3.2 (App Router, Turbopack), React 19, TypeScript, Tailwind v4. Client-only `localStorage` persistence when signed out; **real Supabase cloud sync when signed in** (see the Backend section below — this is no longer aspirational, it's built and tested). Dev server runs on port 3100.

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
  login/
    layout.tsx, page.tsx     email/password sign-in + sign-up, own chrome
  auth/confirm/route.ts      email-confirmation link handler
  onboarding/
    layout.tsx, page.tsx     own chrome, renders OnboardingFlow
  (app)/
    layout.tsx                the shell: max-w-[440px] column + OnboardingGate + CloudErrorBanner + BottomNav
    page.tsx                  Home
    accounts/page.tsx, accounts/[id]/page.tsx
    entries/page.tsx
    insights/page.tsx
    more/page.tsx + about/, business/, categories/, export/, help/, payment-methods/, settings/, subscription/
middleware.ts                 calls lib/supabase/middleware.ts, session-refresh only, no route gating
components/
  hisab/     AccountDetailScreen, AccountRow, HisabInput, TransactionRow, TransactionDetailSheet, TrendChart
  layout/    BottomNav, PageHeader, SubPageHeader, CloudErrorBanner, OnboardingGate
  onboarding/ OnboardingFlow, OnboardingShell, WelcomeStep, NameStep, TypeStep, RecordStep, FirstExpenseStep
  theme/     ThemeProvider, ThemeScript, ThemePicker
  ui/        Card, Chip, EmptyState, IconBadge, Sheet
lib/
  store.tsx       HisabProvider / useHisab() — dual-mode (localStorage signed-out, Supabase signed-in), same public interface either way
  types.ts        Entity / Transaction / BusinessProfile
  seed.ts         demo data + SEED_ENTITY_IDS (used to exclude seed rows from cloud import)
  parser.ts       local NLP-ish parsing engine
  categories.ts   category keyword dictionary + icons
  selectors.ts    computeBalance, groupByDay, etc.
  insights.ts     period ranges, category breakdown, trend, insight-card generation
  format.ts       formatRupees (screen) / formatRupeesPlain (PDF-safe) / date helpers
  relationships.ts color coding per relationship type
  statementPdf.ts PDF statement generator
  whatsapp.ts     best-effort WhatsApp send
  themes.ts       theme registry
  supabase/
    client.ts, server.ts, middleware.ts   browser/server/middleware Supabase clients (@supabase/ssr pattern)
    types.ts        generated Database types — regenerate after any schema change
    queries.ts       row↔model mappers, CRUD functions, importLocalData()
```

## Known bugs fixed this session (don't reintroduce these)

1. **Balance polarity was inverted** — Settle Up used to make a debt bigger instead of clearing it. Fixed in `computeBalance`; verified live (paying down Ramesh's balance now correctly goes to ₹0/"Settled").
2. **Parser string-join bug** — `stripAmount()` in `parser.ts` used to naively concatenate the text before/after the matched amount, which ate a space when the regex's trailing `\s?` consumed it — "Send 500 to Satyam" became the entity "Sendto Satyam". Fixed by explicitly rejoining with a space; also added "send/sent/receive/received/got/from/give/gave" to the stripped connector words.
3. **PDF ₹ symbol garbling** — see `formatRupeesPlain` above.
4. **Hydration warning on `<html data-theme>`** — expected with a pre-paint theme script; fixed with `suppressHydrationWarning` on `<html>` (standard pattern, same one theme libraries like `next-themes` use).

## Known limitations (honest, not accidental)

- Signed-out mode is still single-device `localStorage` only — clearing browser data wipes everything unless the user has signed in (Export/Download PDF are the only backup path signed-out). Signing in backs data up to Supabase; see the Backend section.
- Receipt scanning is a stub — opens the camera/file picker but doesn't OCR anything yet (says so honestly in the UI and in Help).
- Voice input needs a browser with the Web Speech API (mic button just greys out otherwise).
- WhatsApp send can't both target a specific number *and* attach a file (browser platform limitation, not a bug — see `whatsapp.ts` comment).
- Categories are a fixed built-in dictionary, not yet user-customizable.
- "Log in" on the Welcome screen and "View Plans" (Subscription) are inert — no real auth or billing.

## Backend: Supabase — schema, auth, and full cloud sync, all built and tested

Compared Supabase vs Firebase free tiers for this project specifically: **Supabase** won — the data is relational (`entityId` FK, category/day aggregations), Firebase removed free file storage in 2026 (a problem given planned receipt scanning), and Firestore's daily read quota is a worse fit for a read-heavy Insights page than Supabase's unmetered-by-operation free tier.

**Project**: Supabase project **"hisab"** (id `uwyjvhwdhadsakkaguhg`, region `ap-south-1`, org `hljqsanbmbpwqgohtmno`/"Magraa's Org", free tier). Reused a placeholder project named "Magraa's Project" in the dashboard — the account is capped at 2 free projects and one was already used by an unrelated "ProperCoupons" project. Consider renaming it to "hisab" in the dashboard for clarity; the MCP tools have no rename call.

**Schema** (`public.profiles`, `public.entities`, `public.transactions`) mirrors `src/lib/types.ts`'s `BusinessProfile`/`Entity`/`Transaction` 1:1, including `enabled_payment_methods text[]` and `has_onboarded boolean` on `profiles` (added in the sync pass — the initial schema pass missed these two `PersistedState` fields). Snake_case columns, text+check-constraint enums instead of Postgres enums for easy iteration. Full RLS on all three tables (`(select auth.uid()) = user_id` / `= id` for profiles, wrapped in `select` per the performance advisor), a `handle_new_user()` trigger that auto-inserts a `profiles` row on signup (EXECUTE revoked from `public`/`anon`/`authenticated`). `categories` deliberately stays the static `src/lib/categories.ts` dictionary, not a table — not user-customizable yet.

**Auth UI**: `/login` (own chrome, matches onboarding's visual style) with email/password sign-in/sign-up, wired to `supabase.auth.signInWithPassword`/`signUp`. `/auth/confirm/route.ts` handles the email-confirmation link. Settings (`more/settings`) has an "Account" section (signed-in email + Sign out) or a polished "Back up your Hisab" promo card (signed-out, styled like the More page's "Upgrade to Hisab Pro" card) linking to `/login`. Welcome screen's "Log in" text links to `/login`.

**Cloud sync (`src/lib/store.tsx` + `src/lib/supabase/queries.ts`)** — the full migration off `localStorage` for signed-in users:
- `HisabProvider`'s public interface (`useHisab()`) is **unchanged** — all 14 consumer components needed zero edits. Internally it now runs one of two modes based on a live `supabase.auth.onAuthStateChange` subscription: signed-out is byte-for-byte the old `localStorage` behavior; signed-in fetches `profiles`/`entities`/`transactions` on mount and every mutator (`addTransaction`, `updateEntity`, `addSettlement`, etc.) does an **optimistic local update first, then a background Supabase write**, rolling back on failure and surfacing a dismissible `cloudError` banner (`src/components/layout/CloudErrorBanner.tsx`, mounted in `(app)/layout.tsx`). No offline queue/service worker — a failed write just reverts and tells the user, deliberately kept simple.
- `makeId()` was replaced with `crypto.randomUUID()` everywhere (confirmed via grep that nothing anywhere parsed the old `tx-`/`ent-` id prefixes) — the optimistic client-side object *is* the row that gets inserted, no ID-swap needed after the network call resolves.
- **A brand-new signed-in account starts empty and goes through real onboarding** (`has_onboarded` defaults `false` server-side) rather than getting the demo seed — this needed a new `src/components/layout/OnboardingGate.tsx` (mounted in `(app)/layout.tsx`) that redirects to `/onboarding` whenever `hydrated && !hasOnboarded`, since nothing like that existed before (the local demo always seeded `hasOnboarded: true`, so this code path was previously unreachable except via the manual "Restart onboarding" button).
- **One-time local→cloud import**: right after the first cloud fetch, if it comes back with zero entities/transactions, `importLocalData()` (in `queries.ts`) reads `hisab_state_v1`, filters out the demo seed (transactions with `id.startsWith("seed-")`, entities in `seed.ts`'s exported `SEED_ENTITY_IDS`), and if anything real remains, bulk-inserts it plus the local `BusinessProfile`/payment-methods/`hasOnboarded` into the new account, then refetches. Verified live: a fake real transaction planted in `localStorage` correctly migrated to a fresh account while ~24 seed rows were correctly excluded.

**Tested live end-to-end in-browser** (all test users/rows cleaned up after): sign-up → confirm email via SQL (hit Supabase's free-tier email-send rate limit after repeated test signups, so later test accounts were seeded directly via SQL with `pgcrypto`'s `crypt()`/`gen_salt('bf')` to match GoTrue's bcrypt format, plus a matching `auth.identities` row — the real `signUp()` UI flow itself was already proven earlier) → sign in → fresh account correctly routed to onboarding instead of showing demo data → completed onboarding, added a category transaction and an entity transaction via the real `HisabInput`, did a Settle Up, toggled a payment method → every one verified via SQL to have landed correctly in Supabase → signed out → instantly reverted to local demo data with no reload → signed back in → cloud data reappeared correctly → tested the import path with planted local data → all clean.

**One thing to know if you see it again**: right after the very first sign-in of a session (StrictMode double-effect territory in Next dev mode), a one-time "Couldn't load your data" `cloudError` banner appeared once despite the data underneath being completely correct and unaffected. Reproduced clean sign-outs/sign-ins afterward with console tracking on and couldn't reproduce it again — treated as a dev-only transient, not a real bug, but worth a second look if it ever recurs with actual data loss attached.

**Still not done**: no password-reset flow, no OAuth providers, no offline queue (a failed write reverts rather than retries), receipt OCR still a stub. Categories are still not user-customizable / not synced (deliberate — see above).

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
4. Backend/auth/cloud sync is done (see the Backend section above). Biggest open door now: receipt OCR (needs an AI vision call, not just UI). Second: making categories user-customizable and syncing them; a password-reset flow; OAuth providers.
