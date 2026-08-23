<div align="center">

  <img src="./public/Assets/logo-with-tagline.png" alt="Hisab AI Logo" width="380" />

  <p align="center">
    <strong>Your Business. Your Hisab.</strong>
    <br />
    <em>An intelligent, lightning-fast financial ledger and AI-powered expense notebook crafted for Indian small businesses, freelancers, and smart spenders.</em>
  </p>

  <p align="center">
    <a href="#-key-features"><img src="https://img.shields.io/badge/AI%20Vision-Gemini%202.0%20Flash-4285F4?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Gemini 2.0 Flash" /></a>
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/Framework-Next.js%2016%20(App%20Router)-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js 16" /></a>
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/Database-Supabase%20Postgres-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" /></a>
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/PWA-Installable%20%26%20Offline-FF6B6B?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA Ready" /></a>
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/Avatars-260%2B%20Included-8A2BE2?style=for-the-badge" alt="260+ Avatars" /></a>
    <a href="#license"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License: MIT" /></a>
  </p>

  <p align="center">
    <a href="#-live-ui-showcase">UI Showcase</a> •
    <a href="#-superpowers--core-features">Features</a> •
    <a href="#-260-avatar-system">Avatars</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-nlp-engine-in-action">NLP Engine</a> •
    <a href="#-getting-started">Quickstart</a> •
    <a href="#-database--security">Security</a> •
    <a href="#-roadmap">Roadmap</a>
  </p>

  <br />

  <!-- Hero Mockup Display -->
  <a href="#-live-ui-showcase">
    <img src="./public/screenshots/pc-dashboard.png" alt="Hisab AI Desktop & Mobile Dashboard" width="95%" style="border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.15);" />
  </a>

</div>

---

## 🌟 Overview

**Hisab AI** transforms the way Indian shopkeepers, MSMEs, contractors, and individuals manage their daily cash flow and credit accounts (*Bahi-Khata*). 

Instead of tedious multi-step form entry, **Hisab** lets you type or speak naturally — like `500 diesel`, `Ramesh 500`, or `Sent 1200 to Sharma Hardware for cement` — and instantly categorizes the transaction, infers incoming vs. outgoing flow, matches contacts, and keeps running balances accurate to the paisa.

Equipped with **Google Gemini 2.0 Flash Vision AI**, Hisab also scans printed receipts, grocery slips, and **handwritten physical ledger notes**, converting them into structured accounting entries in seconds.

---

## 📱 Live UI Showcase

<div align="center">
  <table>
    <tr>
      <td width="33%" align="center">
        <strong>✨ Home & Natural Input</strong><br/><br/>
        <img src="./public/screenshots/home-dashboard.png" alt="Home Screen" width="100%" style="border-radius: 10px;" />
      </td>
      <td width="33%" align="center">
        <strong>📊 Business Insights</strong><br/><br/>
        <img src="./public/screenshots/insights.png" alt="Insights Screen" width="100%" style="border-radius: 10px;" />
      </td>
      <td width="33%" align="center">
        <strong>📜 Transaction Ledger</strong><br/><br/>
        <img src="./public/screenshots/entries.png" alt="Entries Screen" width="100%" style="border-radius: 10px;" />
      </td>
    </tr>
    <tr>
      <td width="33%" align="center">
        <strong>🚀 Onboarding Flow</strong><br/><br/>
        <img src="./public/screenshots/welcome.png" alt="Welcome Onboarding" width="100%" style="border-radius: 10px;" />
      </td>
      <td width="33%" align="center">
        <strong>⚙️ Settings & Theme Hub</strong><br/><br/>
        <img src="./public/screenshots/settings.png" alt="Settings Screen" width="100%" style="border-radius: 10px;" />
      </td>
      <td width="33%" align="center">
        <strong>💼 Personalized Setup</strong><br/><br/>
        <img src="./public/screenshots/onboarding-type.png" alt="Business Type Setup" width="100%" style="border-radius: 10px;" />
      </td>
    </tr>
  </table>
</div>

---

## ⚡ Superpowers & Core Features

### 🧠 1. Hybrid Natural Language Entry & Gemini 2.0 Flash AI Parsing
- **3-Way Parsing Mode Switch** *(Settings → Parsing Engine)*:
  - ⚡ **Local**: Instant on-device NLP parser running in <2ms with phonetic speech-to-text mishearing normalization (`sent ↔ saint`, `kal ↔ call`, `maal ↔ mall`). 100% offline-ready.
  - 🧠 **Smart Auto**: Fast local parser runs first; if confidence is low or complex sentence structures are detected, it seamlessly escalates to **Gemini 2.0 Flash AI**.
  - 🤖 **Always AI**: Routes every entry through Gemini 2.0 Flash for maximum contextual and semantic extraction.
- **Resilient, Non-Blocking UX**: Displays an animated *"Thinking…"* state with a **Cancel** button while the AI call is in flight. Silently and instantly falls back to the local parser on any timeout, offline state, or quota exhaustion — **user entry is never blocked**.
- **Dedicated Daily Quotas**: Built-in free tier with **25 AI text parses/day** (independent of the 3/day receipt scan quota), or unlimited usage by entering your own free Gemini API key in Settings.
- **Provenance & AI Tagging**: Entries parsed by Gemini are tagged `source: "ai_text"` and display a distinctive *"AI parsed"* badge in the Transaction Detail Sheet.

### 🎙️ 2. Native Voice-to-Hisab
- Tap the microphone and speak your transaction in Hinglish or English.
- Real-time transcription via Web Speech API with instantaneous parsing directly into the ledger.

### 👁️ 3. Multimodal Gemini 2.0 Flash Vision OCR
- **Receipt & Invoice Scanner**: Point your camera at thermal paper slips, invoices, or grocery bills.
- **Handwritten Khata Reader**: Reads handwritten dairy pages and bahi-khata notebooks.
- **Multi-Item Extraction**: Breaks down bundled receipts into categorized sub-entries with vendor association and user-provided API key quota controls.

### 📖 4. Smart Bahi-Khata Ledger Engine
- **Khata Directionality**: Strict accounting conventions — clearly monitors *"You owe"* vs. *"They owe you"*.
- **Entity Relationship Tagging**: Organize contacts by `Customer`, `Supplier`, `Employee`, `Partner`, `Freelancer`, or `Personal`.
- **Nickname & Alias System**: Attach nicknames (e.g. *"Pappu"*, *"Hardware Shop"*) so the parser always resolves the right person.
- **One-Tap Settle Up**: Seamless debt reconciliation with auto-generated settlement records.

### 📊 5. Dynamic Financial Insights & Analytics
- **Multi-Period Filters**: Filter instantly by `Today`, `This Week`, `This Month`, `Last Month`, `This Year`, or `All Time`.
- **Visual Category Donut**: Interactive breakdown of your highest spending categories.
- **Daily Spending Trend Charts**: Clean SVG visualization of daily cash flow.
- **Auto-Generated Financial Health Cards**: Contextual warnings on spike spending, highest-debt customers, and cash vs. digital split.

### 📲 6. Progressive Web App (PWA) & Offline Mode
- **Installable on Any Device**: Native standalone experience on iOS (Safari Add to Home Screen) and Android (Chrome PWA prompt).
- **Service Worker Offline Caching**: Full cache fallback for core assets and routes, allowing continuous access even in zero-connectivity areas.

### 📄 7. PDF Statements & 1-Tap WhatsApp Dispatch
- **Custom-Engineered PDF Export**: Auto-formatted account statements with transaction histories, debt balance boxes, and clean rupee typography.
- **WhatsApp Direct Dispatch**: Native Web Share API integration to send PDFs or formatted ledger balances directly to party WhatsApp numbers.

### ☁️ 8. Dual-Mode Cloud Architecture & Google Auth
- **Signed-Out Mode**: 100% offline-ready, single-device `localStorage` persistence.
- **Signed-In Mode**: Supabase Cloud Sync with Row-Level Security (RLS), Google 1-Tap OAuth & Email/Password auth, optimistic UI updates, and automatic seed-to-cloud migration on first login.

### 🎨 9. Pastel & Sage Design System
- **Mobile-First Luxury UI**: Designed with delicate pastel tones, soft borders, clean card elevation, and tactile typography.
- **Smooth Spring Physics**: Powered by `motion` with gesture-driven swipeable sheets and tactile haptics.
- **Instant Theme Switching**: Sage (warm earthy palette) and Indigo (crisp modern palette) with zero-flash CSS variable tokens.

---

## 🎭 260+ Avatar System

Hisab includes a built-in library of **260+ vibrant 3D & illustrated WebP avatars** with deterministic name hashing. Every party, vendor, and business profile receives a unique, charming avatar automatically:

<div align="center">
  <table>
    <tr>
      <td align="center"><img src="./public/Assets/avatars/astronaut-coral.webp" width="52" height="52" style="border-radius:50%;" alt="Astronaut" /><br/><sub>Astronaut</sub></td>
      <td align="center"><img src="./public/Assets/avatars/baby-dragon.webp" width="52" height="52" style="border-radius:50%;" alt="Dragon" /><br/><sub>Dragon</sub></td>
      <td align="center"><img src="./public/Assets/avatars/alpaca.webp" width="52" height="52" style="border-radius:50%;" alt="Alpaca" /><br/><sub>Alpaca</sub></td>
      <td align="center"><img src="./public/Assets/avatars/arctic-fox-2.webp" width="52" height="52" style="border-radius:50%;" alt="Arctic Fox" /><br/><sub>Arctic Fox</sub></td>
      <td align="center"><img src="./public/Assets/avatars/axolotl.webp" width="52" height="52" style="border-radius:50%;" alt="Axolotl" /><br/><sub>Axolotl</sub></td>
      <td align="center"><img src="./public/Assets/avatars/beagle.webp" width="52" height="52" style="border-radius:50%;" alt="Beagle" /><br/><sub>Beagle</sub></td>
      <td align="center"><img src="./public/Assets/avatars/bee.webp" width="52" height="52" style="border-radius:50%;" alt="Bee" /><br/><sub>Bee</sub></td>
      <td align="center"><img src="./public/Assets/avatars/bento-box.webp" width="52" height="52" style="border-radius:50%;" alt="Bento" /><br/><sub>Bento</sub></td>
    </tr>
    <tr>
      <td align="center"><img src="./public/Assets/avatars/bonsai.webp" width="52" height="52" style="border-radius:50%;" alt="Bonsai" /><br/><sub>Bonsai</sub></td>
      <td align="center"><img src="./public/Assets/avatars/camera.webp" width="52" height="52" style="border-radius:50%;" alt="Camera" /><br/><sub>Camera</sub></td>
      <td align="center"><img src="./public/Assets/avatars/cat.webp" width="52" height="52" style="border-radius:50%;" alt="Cat" /><br/><sub>Cat</sub></td>
      <td align="center"><img src="./public/Assets/avatars/corgi.webp" width="52" height="52" style="border-radius:50%;" alt="Corgi" /><br/><sub>Corgi</sub></td>
      <td align="center"><img src="./public/Assets/avatars/coffee-mug-2.webp" width="52" height="52" style="border-radius:50%;" alt="Coffee" /><br/><sub>Coffee</sub></td>
      <td align="center"><img src="./public/Assets/avatars/badger.webp" width="52" height="52" style="border-radius:50%;" alt="Badger" /><br/><sub>Badger</sub></td>
      <td align="center"><img src="./public/Assets/avatars/baby-seal.webp" width="52" height="52" style="border-radius:50%;" alt="Baby Seal" /><br/><sub>Baby Seal</sub></td>
      <td align="center"><img src="./public/Assets/avatars/backpack.webp" width="52" height="52" style="border-radius:50%;" alt="Backpack" /><br/><sub>Backpack</sub></td>
    </tr>
  </table>
  <p><em>...and 244+ more collectible avatars optimized for instant rendering!</em></p>
</div>

---

## 💡 Hybrid NLP & AI Engine in Action

Hisab dynamically routes parsing based on your chosen engine mode (**Local**, **Smart Auto**, or **Always AI**):

```
Input: "Sent 4500 to Sharma Hardware for cement via UPI"
│
├── 🤖 Engine       : Gemini 2.0 Flash / Local Fallback
├── 💰 Amount       : ₹4,500
├── 👤 Entity       : Sharma Hardware (matched alias: "cement supplier")
├── 🏷️ Category     : Construction / Materials (matched keyword: "cement")
├── 🔄 Direction    : Outgoing ("You gave")
├── 💳 Payment      : UPI
├── 🏷️ Source       : ai_text (Tagged with "AI parsed" badge)
└── 🎯 Confidence   : 98% (Auto-suggests one-tap record)
```

| Input Sample | Detected Entity | Amount | Category | Direction | Source |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `500 diesel petrol pump` | *None* | ₹500 | Fuel & Travel | Outgoing | Local (<2ms) |
| `Ramesh gave 1200 cash for rent` | Ramesh | ₹1,200 | Rent & Utilities | Incoming | Local (<2ms) |
| `Paid 15000 salary to Mukesh via NEFT` | Mukesh | ₹15,000 | Salaries & Wages | Outgoing | Gemini AI |
| `Tea snacks with client 120` | *None* | ₹120 | Food & Dining | Outgoing | Local (<2ms) |
| `Received 5000 from ABC Corp for invoice 42` | ABC Corp | ₹5,000 | Sales / Income | Incoming | Gemini AI |

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Client ["Client (Browser / PWA / Service Worker)"]
        UI["React 19 + Next.js App Router"]
        Input["HisabInput (Thinking State & Fallback)"]
        Voice["Web Speech API"]
        OCR["Camera / Receipt Upload"]
        LocalParser["Local NLP & Phonetic Engine (<2ms)"]
        AIHelper["src/lib/aiParser.ts"]
        Store["Dual-Mode State Layer (Optimistic Store)"]
        SW["Service Worker (Offline Cache)"]
    end

    subgraph AI_Cloud ["AI & Cloud Services"]
        GeminiText["Gemini 2.0 Flash (/api/parse-text)"]
        GeminiVision["Gemini 2.0 Flash Vision (/api/scan-receipt)"]
        SupabaseAuth["Supabase Auth (Google OAuth & Email)"]
        SupabaseDB[("Supabase PostgreSQL (RLS & Profiles)")]
        PDFGen["jsPDF + AutoTable Engine"]
    end

    Input --> |Local / Fallback| LocalParser
    Input --> |Smart Auto / Always AI| AIHelper
    Voice --> Input
    AIHelper --> GeminiText
    GeminiText -.-> |Silent Fallback on Timeout| LocalParser
    OCR --> GeminiVision
    GeminiVision --> Store
    LocalParser --> Store
    AIHelper --> Store
    Store <--> |Signed Out| LocalStorage[("Browser localStorage")]
    Store <--> |Signed In / Optimistic Sync| SupabaseDB
    Store --> PDFGen
    PDFGen --> WhatsApp["WhatsApp / Web Share API"]
    SW <--> UI
```

---

## 🛠️ Tech Stack Matrix

<div align="center">
  <table>
    <thead>
      <tr>
        <th>Layer</th>
        <th>Technology</th>
        <th>Purpose</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Core Framework</strong></td>
        <td><a href="https://nextjs.org/">Next.js 16 (App Router)</a></td>
        <td>Turbopack-powered SSR/CSR hybrid web application</td>
      </tr>
      <tr>
        <td><strong>UI & Runtime</strong></td>
        <td><a href="https://react.dev/">React 19</a> + <a href="https://www.typescriptlang.org/">TypeScript 5</a></td>
        <td>High-performance UI state management & full type safety</td>
      </tr>
      <tr>
        <td><strong>Styling</strong></td>
        <td><a href="https://tailwindcss.com/">Tailwind CSS v4</a></td>
        <td>Utility-first styling with custom CSS variable themes</td>
      </tr>
      <tr>
        <td><strong>Animations & UX</strong></td>
        <td><a href="https://motion.dev/">Motion (Framer Motion)</a></td>
        <td>Spring physics, swipeable bottom sheets & micro-interactions</td>
      </tr>
      <tr>
        <td><strong>Artificial Intelligence</strong></td>
        <td><a href="https://ai.google.dev/">Google Gemini 2.0 Flash</a></td>
        <td>Multimodal vision OCR for receipts & handwritten ledgers</td>
      </tr>
      <tr>
        <td><strong>Backend & Database</strong></td>
        <td><a href="https://supabase.com/">Supabase (PostgreSQL)</a></td>
        <td>Google OAuth, relational schema, and Row-Level Security</td>
      </tr>
      <tr>
        <td><strong>PWA & Offline</strong></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps">Progressive Web App</a></td>
        <td>Service worker offline caching and home-screen installability</td>
      </tr>
      <tr>
        <td><strong>Document Generation</strong></td>
        <td><a href="https://github.com/parallax/jsPDF">jsPDF</a> + <a href="https://github.com/simonbengtsson/jsPDF-AutoTable">jspdf-autotable</a></td>
        <td>Client-side vector PDF statement generator with Rupee formatting</td>
      </tr>
      <tr>
        <td><strong>Icons & Avatars</strong></td>
        <td><a href="https://lucide.dev/">Lucide React</a> + 260+ WebP Avatars</td>
        <td>Deterministic visual representation and lightweight SVG icons</td>
      </tr>
    </tbody>
  </table>
</div>

---

## 📂 Repository Structure

```
HisabAI/
├── web/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (app)/                  # Main app route group (BottomNav shell)
│   │   │   │   ├── page.tsx            # Home dashboard & quick hisab entry
│   │   │   │   ├── accounts/           # Bahi-Khata ledger & party detail pages
│   │   │   │   ├── entries/            # Full date-grouped transaction history
│   │   │   │   ├── insights/           # Analytics, donuts, trends & cards
│   │   │   │   └── more/               # Settings, themes, categories, export
│   │   │   ├── api/
│   │   │   │   └── scan-receipt/       # Gemini 2.0 Flash multimodal OCR route
│   │   │   ├── login/                  # Auth portal (Google OAuth / Email)
│   │   │   └── onboarding/             # Guided setup wizard
│   │   ├── components/
│   │   │   ├── hisab/                  # Account detail, transaction row, OCR modal
│   │   │   ├── layout/                 # BottomNav, page headers, error banners
│   │   │   ├── onboarding/             # Step-by-step onboarding wizard screens
│   │   │   ├── theme/                  # Theme script, provider, & selector
│   │   │   └── ui/                     # Cards, chips, bottom sheets, icon badges
│   │   └── lib/
│   │       ├── parser.ts               # Local NLP parser & phonetic normalizer
│   │       ├── store.tsx               # Unified Dual-Mode State Provider
│   │       ├── avatars.ts              # 260+ Avatar catalog & deterministic hasher
│   │       ├── categories.ts           # Category dictionary & keyword registry
│   │       ├── statementPdf.ts         # PDF statement engine with Rupee support
│   │       ├── whatsapp.ts             # Direct WhatsApp sharing handler
│   │       ├── selectors.ts            # Khata balance computation algorithms
│   │       └── supabase/               # SSR client, server queries, RLS mappers
│   └── public/
│       ├── Assets/                     # Brand logos, icons, & 260+ avatars
│       ├── screenshots/                # Showcase captures for web & mobile
│       ├── sw.js                       # Service worker for PWA offline caching
│       └── manifest.json               # Web App Manifest
└── UI Plan/                            # Complete product UX specifications & mockups
```

---

## 🚀 Getting Started

Follow these steps to run **Hisab AI** locally on your machine.

### 📋 Prerequisites
- **Node.js**: v18.18.0 or later (Node 20+ recommended)
- **Package Manager**: `npm`, `pnpm`, or `yarn`
- **Supabase Account** *(optional, for cloud sync)*: [supabase.com](https://supabase.com)
- **Google Gemini API Key** *(optional, for AI receipt scanning)*: [Google AI Studio](https://aistudio.google.com/)

---

### 📥 1. Clone the Repository

```bash
git clone https://github.com/Magraa/Hisab-AI.git
cd Hisab-AI/web
```

### 📦 2. Install Dependencies

```bash
npm install
```

### ⚙️ 3. Configure Environment Variables

Create a `.env.local` file in the `web` directory:

```env
# Supabase Configuration (Optional for cloud sync)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Gemini AI Vision Key (Optional - users can also provide their own key in Settings)
GEMINI_API_KEY=your-gemini-api-key
```

> **Note**: Hisab runs **100% locally out-of-the-box** using browser `localStorage` if Supabase environment variables are omitted!

### 💻 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3100` if custom port is used) in your browser.

### 🏗️ 5. Build for Production

```bash
npm run build
npm run start
```

---

## 🔒 Database & Security Model

When Supabase is enabled, Hisab enforces strict **PostgreSQL Row-Level Security (RLS)**:

```sql
-- Example RLS Policy for Transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own transactions"
ON public.transactions
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

- **Zero Data Leaks**: Every entity, transaction, and profile is scoped to `auth.uid()`.
- **Encrypted Local Storage**: Client keys and offline entries remain on your hardware.
- **Client-Side Key Option**: Users can input their personal Gemini API key stored strictly in local memory.

---

## 🗺️ Roadmap

- [x] **Core MVP**: Natural language parsing, transaction feeds, and Bahi-Khata ledger.
- [x] **Supabase Sync**: Real-time cloud backup, authentication, and offline rollback.
- [x] **Google OAuth**: One-tap sign-in and account backup.
- [x] **Gemini 2.0 Flash OCR**: Multimodal receipt and handwritten note scanner.
- [x] **Hybrid AI Text Parsing**: Gemini 2.0 Flash text endpoint (`/api/parse-text`) + 3-Way Mode Switch.
- [x] **Dynamic Categories**: User-customizable categories with custom keywords.
- [x] **260+ Deterministic Avatars**: Instant visual identities for contacts & accounts.
- [x] **Progressive Web App (PWA)**: Offline service worker caching & install prompt.
- [x] **PDF & WhatsApp**: Auto-generated statements with direct WhatsApp share.
- [ ] **Multi-Currency Support**: International currencies beyond INR (`₹`).
- [ ] **GST Invoice Export**: One-tap monthly GST breakdown reports for Indian businesses.
- [ ] **SMS Auto-Detection**: Android companion to parse bank transactional SMS.

---

## 🤝 Contributing

Contributions make the open-source community thrive. Any contributions you make are **greatly appreciated**!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">
  <p>Crafted with ❤️ for Indian MSMEs, Freelancers, and Small Businesses.</p>
  <p><strong>Hisab AI</strong> • <em>Your business. Your Hisab.</em></p>
</div>

