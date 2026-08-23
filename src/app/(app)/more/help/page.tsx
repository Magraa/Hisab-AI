import { ChevronDown } from "lucide-react";
import { SubPageHeader } from "@/components/layout/SubPageHeader";

interface Item {
  q: string;
  a: React.ReactNode;
}

interface Section {
  title: string;
  intro?: string;
  items: Item[];
}

const SECTIONS: Section[] = [
  {
    title: "Adding an expense by typing",
    intro: "The box at the top of Home is the whole app — everything else exists to support it.",
    items: [
      {
        q: "What should I type?",
        a: (
          <>
            Just an amount plus a word or two — the same way you&rsquo;d write it in a notebook:{" "}
            <b>&ldquo;500 diesel&rdquo;</b>, <b>&ldquo;300 chai&rdquo;</b>, <b>&ldquo;1200 rent&rdquo;</b>. Hisab pulls
            out the number and matches the rest against a category dictionary — diesel/petrol → Fuel, chai/tea/nashta
            → Refreshments, rent/kiraya → Rent, salary/mazdoori/labour → Labour, raw material/samaan/maal → Raw
            Material, supplies → Shop Supplies, electricity/bijli → Electricity, repair/machine → Machine Repair,
            transport/courier → Transport.
          </>
        ),
      },
      {
        q: "How do I record paying or receiving money from someone?",
        a: (
          <>
            Just use their name: <b>&ldquo;Ramesh 500&rdquo;</b> records a payment to Ramesh. To be explicit about
            direction, add a verb — <b>&ldquo;Send 500 to Satyam&rdquo;</b>, <b>&ldquo;Received 300 from Satyam&rdquo;</b>,
            or in Hindi <b>&ldquo;Satyam ko 500 diye&rdquo;</b> (gave) / <b>&ldquo;Satyam se 300 mile&rdquo;</b>{" "}
            (received). Connector words like ko/ke/liye/diya/liya/se/paid/to/from are stripped out automatically, so
            they never end up stuck to the name.
          </>
        ),
      },
      {
        q: "Why did it ask me to confirm instead of just saving?",
        a: (
          <>
            A brand-new name Hisab hasn&rsquo;t seen before gets a quick confirm step (&ldquo;I think this is: ₹500
            Satyam&rdquo;) before creating the account — tap <b>Yes, add</b>, <b>Edit</b> to change it, or the small ✕
            to dismiss. Once a name or category is recognized with high confidence, it saves instantly with a ✓
            toast.
          </>
        ),
      },
      {
        q: "It couldn't find an amount — what now?",
        a: "Hisab needs at least one number in the text. If none is found it shows a small error under the box instead of guessing — just retype with the amount included.",
      },
    ],
  },
  {
    title: "Voice input",
    items: [
      {
        q: "How do I use it?",
        a: "Tap the mic icon on the input box and speak naturally — in Hindi, Hinglish, or English. Words appear live as you talk, and the entry is parsed and saved automatically the moment you stop.",
      },
      {
        q: "What if the mic button looks greyed out?",
        a: "Your browser doesn't support speech recognition. Typing and (later) receipt scanning still work fully.",
      },
      {
        q: "Does it handle common mis-hearing mistakes?",
        a: 'Yes — a few English/Hindi mix-ups are corrected automatically before parsing: "saint/scent/cent" → sent, "sand" → send, "form" → from, "cache" → cash, "rant" → rent, "celery" → salary, "bell" → bill, "call" → kal (yesterday/tomorrow), "mall" → maal (goods).',
      },
    ],
  },
  {
    title: "Scan receipt",
    items: [
      {
        q: "Does it read the amount off a photo automatically?",
        a: "Not yet — tapping it opens your camera/gallery so you can capture the receipt, but automatic reading needs an AI step that isn't wired up. Add the amount in the text box for now; this is on the roadmap.",
      },
    ],
  },
  {
    title: "Accounts (people, vendors, customers)",
    intro: "Every name you mention becomes its own account automatically — there's no separate \"add person\" step.",
    items: [
      {
        q: "What does \"You owe\" / \"They owe you\" mean?",
        a: 'Same convention as a paper khata: whoever received more value owes it back. If you\'ve given a supplier more than you\'ve gotten from them, you owe them ("You owe"). If you\'ve given a customer goods and they haven\'t paid the full amount back, they owe you ("They owe you").',
      },
      {
        q: 'What is "Also known as"?',
        a: (
          <>
            Open an account → the <b>⋯</b> menu → <b>Edit account</b>, and add nicknames under &ldquo;Also known
            as&rdquo;. Once added, typing <b>&ldquo;Ramesh bhai 500&rdquo;</b> or <b>&ldquo;Ramesh ji 500&rdquo;</b>{" "}
            lands on the same account as plain &ldquo;Ramesh&rdquo; instead of creating a duplicate.
          </>
        ),
      },
      {
        q: "What do the filter chips do?",
        a: "All / You owe / They owe you narrow the list by balance direction; Vendors / Customers / Employees narrow by relationship type.",
      },
      {
        q: "Why are some account circles a different color?",
        a: "The avatar and relationship tag are color-coded so you can scan the list at a glance: Supplier = violet, Vendor = blue, Customer = green, Employee = amber.",
      },
    ],
  },
  {
    title: "Inside an account",
    items: [
      {
        q: "+ Add expense",
        a: "Opens the same quick-entry box as Home, pre-filled with this person so you only need to type the amount.",
      },
      {
        q: "Settle up",
        a: 'Records a payment that moves the balance — choose "You gave them" (reduces what you owe) or "You got from them" (reduces what they owe you), enter an amount, and it\'s logged like any other transaction.',
      },
      {
        q: "Export CSV / Download PDF",
        a: "Export CSV gives a spreadsheet-ready file of every transaction. Download PDF generates a proper statement — Hisab branding, the account's details, a full transaction table, and a totals summary — ready to print or send.",
      },
      {
        q: "Send statement on WhatsApp",
        a: "Only shows up once the account has a phone number saved. On a phone that supports sharing files, it opens your share sheet with the PDF and a caption attached, ready to pick WhatsApp. If your browser can't attach files that way, it downloads the PDF and opens the right WhatsApp chat instead, so you just attach the file that was saved.",
      },
    ],
  },
  {
    title: "Entries",
    items: [
      {
        q: "What am I looking at?",
        a: "Every transaction across every account and category, grouped by day with each day's subtotal on the right — the full digital khata.",
      },
      {
        q: "Search and filters",
        a: "Search matches a person's name or a category label. The Date / Category / Payment / Amount chips narrow the list further, and combine with each other.",
      },
      {
        q: "The + button",
        a: "Floats at the bottom-right and opens the same quick-entry box, so you can log something without going back to Home.",
      },
    ],
  },
  {
    title: "Insights",
    items: [
      {
        q: "What period am I seeing?",
        a: "Use the picker in the top-right to switch between This Month, Last Month, and All Time — every number on the page recalculates for that range.",
      },
      {
        q: "What do the numbers mean?",
        a: "Total spent, average per day, your single biggest spending day, and the percentage change versus the immediately preceding period of the same length.",
      },
      {
        q: "Category breakdown and trend",
        a: "The donut + list break down spending by category for the period; the line below shows day-by-day totals with the peak day called out.",
      },
      {
        q: "The small cards at the bottom",
        a: "Short, plain-language observations computed from your actual numbers — e.g. a category rising or falling versus last period — not generic tips.",
      },
    ],
  },
  {
    title: "Editing & deleting",
    items: [
      {
        q: "How do I fix a mistake?",
        a: "Tap any transaction anywhere in the app to open its detail sheet, then Edit to change the amount, category, or payment method, or Delete to remove it. Deleting always asks you to confirm first.",
      },
    ],
  },
  {
    title: "Categories & payment methods",
    items: [
      {
        q: "Can I add my own categories?",
        a: "Yes — More → Categories lets you add, edit, or delete categories: pick a name, color, icon, and the keywords that should auto-match it. Deleting a category moves its past expenses to \"Other\".",
      },
      {
        q: "Payment methods",
        a: "More → Payment Methods lets you toggle Cash/UPI/Bank/Card/Credit on or off for your business.",
      },
    ],
  },
  {
    title: "Themes",
    items: [
      {
        q: "How do I change the look?",
        a: "Settings → Theme. Indigo is the default look; Sage is the warm cream-and-green look from onboarding. Switching applies instantly across the whole app, including onboarding if you replay it, and is remembered next time you open Hisab.",
      },
    ],
  },
  {
    title: "Business vs. Individual",
    items: [
      {
        q: "What's the difference?",
        a: 'Chosen once during onboarding. "Business" asks for a business name and type; "Individual" just asks your name and skips the business-type step. You can change this later from More → Business/Your Details.',
      },
    ],
  },
  {
    title: "Your data",
    items: [
      {
        q: "Where is everything stored?",
        a: "On this device only, in your browser's local storage — there's no cloud sync yet, so clearing your browser's site data will erase it. Use Export CSV or Download PDF from any account (or More → Export for everything) if you want a backup you can keep elsewhere.",
      },
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="pb-8">
      <SubPageHeader title="Help & Support" subtitle="What each part of Hisab does" />

      <div className="mx-5 flex flex-col gap-6">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">{section.title}</p>
            {section.intro && <p className="mb-2 text-sm text-muted">{section.intro}</p>}
            <div className="overflow-hidden rounded-2xl border border-border bg-surface">
              {section.items.map((item, i) => (
                <details
                  key={item.q}
                  className={`group px-4 py-3.5 ${i === section.items.length - 1 ? "" : "border-b border-border"}`}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[15px] font-medium text-ink [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <ChevronDown size={16} className="shrink-0 text-subtle transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="mt-2 text-sm leading-relaxed text-muted">{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        ))}

        <p className="text-xs text-muted">
          Didn&rsquo;t find what you needed? This is a self-contained demo build with no support inbox yet — the
          people building Hisab are the ones reading this file.
        </p>
      </div>
    </div>
  );
}
