import type { Category, Direction, Entity, EntityType } from "./types";
import { findCategoryByKeyword } from "./categories";
import { findMerchant } from "./merchants";

export interface ParsedInput {
  amount: number | null;
  categoryId?: string;
  entityId?: string;
  entityName?: string;
  entityType?: EntityType;
  entityAvatar?: string;
  direction?: Direction;
  description: string;
  /** Specific item name for a category match, e.g. "Chicken Tikka Masala" — the raw text typed, kept separate from the category's own label. */
  name?: string;
  confidence: number;
  isMerchant?: boolean;
}

// Speech recognition (and quick typing) regularly swaps these words for a
// same-sounding one that means something completely different to the parser.
// Fix the common ones before anything else runs, whole-word only so we don't
// clobber a word that merely contains one of these as a substring.
const MISHEARD_CORRECTIONS: Array<[RegExp, string]> = [
  // English homophones of words this app listens for.
  [/\bsaint\b/gi, "sent"],
  [/\bscent\b/gi, "sent"],
  [/\bcent\b/gi, "sent"],
  [/\bsand\b/gi, "send"],
  [/\bform\b/gi, "from"],
  [/\bcache\b/gi, "cash"],
  [/\brant\b/gi, "rent"],
  [/\bcelery\b/gi, "salary"],
  [/\bbell\b/gi, "bill"],
  // Hindi words this app recognizes, commonly misheard as their English
  // near-homophone by an English speech model.
  [/\bcall\b/gi, "kal"], // kal = yesterday/tomorrow
  [/\bmall\b/gi, "maal"], // maal = goods/stuff
];

function correctMishears(text: string): string {
  return MISHEARD_CORRECTIONS.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), text);
}

const FILLER_WORDS = new Set([
  "ko",
  "ke",
  "liye",
  "diye",
  "diya",
  "de",
  "do",
  "ka",
  "ki",
  "liya",
  "se",
  "ne",
  "hua",
  "the",
  "a",
  "an",
  "for",
  "of",
  "paid",
  "spent",
  "on",
  "to",
  "from",
  "send",
  "sent",
  "give",
  "gave",
  "receive",
  "received",
  "got",
  "rs",
  "rs.",
  "rupee",
  "rupees",
  "rupaye",
  "rupaya",
  "rupya",
  "rupye",
  "aaj",
  "kal",
  "today",
  "yesterday",
  "bheja",
  "bheji",
  "transferred",
  "transfer",
  "debited",
  "kharch",
  "kharcha",
  "credited",
  "refund",
  "jama",
  "vasool",
]);

const OUTGOING_WORDS = ["diye", "diya", "de diya", "gave", "give", "paid", "send", "sent", "bheja", "bheji", "transferred", "debited", "kharch", "kharcha"];
const INCOMING_WORDS = ["mila", "mile", "milaa", "received", "receive", "aaya", "aya", "got", "credited", "refund", "jama", "vasool"];

const BUSINESS_KEYWORDS = [
  "store",
  "shop",
  "mart",
  "supermarket",
  "kirana",
  "clinic",
  "hospital",
  "pharmacy",
  "restaurant",
  "hotel",
  "cafe",
  "dhaba",
  "traders",
  "enterprises",
  "agency",
  "services",
  "ltd",
  "pvt ltd",
  "petrol pump",
  "hardware",
];

export function isLikelyBusiness(text: string): boolean {
  const lower = text.toLowerCase();
  return BUSINESS_KEYWORDS.some((kw) => new RegExp(`\\b${kw}\\b`, "i").test(lower));
}

function stripAmount(text: string): { amount: number | null; remaining: string } {
  const match = text.match(/₹?\s?([\d,]+(?:\.\d+)?)\s?(k|K)?/);
  if (!match) return { amount: null, remaining: text };

  let value = parseFloat(match[1].replace(/,/g, ""));
  if (Number.isNaN(value)) return { amount: null, remaining: text };
  if (match[2]) value *= 1000;

  const before = text.slice(0, match.index ?? 0);
  const after = text.slice((match.index ?? 0) + match[0].length);
  // Join with a space and collapse — the match can swallow the whitespace on
  // either side of the number, which previously fused the surrounding words
  // together (e.g. "Send 500 to Satyam" -> "Sendto Satyam").
  const remaining = `${before} ${after}`.replace(/\s+/g, " ").trim();
  return { amount: value, remaining };
}

function cleanTokens(text: string): string[] {
  return text
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .filter((t) => !FILLER_WORDS.has(t.toLowerCase()));
}

function findKnownEntity(cleaned: string, entities: Entity[]): Entity | undefined {
  const lower = cleaned.toLowerCase();
  let best: Entity | undefined;
  let bestLen = 0;
  for (const entity of entities) {
    const names = [entity.name, ...entity.aliases];
    for (const name of names) {
      const n = name.toLowerCase();
      if (n.length > 0 && lower.includes(n) && n.length > bestLen) {
        best = entity;
        bestLen = n.length;
      }
    }
  }
  return best;
}

function titleCase(text: string): string {
  return text
    .split(/\s+/)
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export function parseInput(raw: string, knownEntities: Entity[], categories: Category[]): ParsedInput {
  const text = correctMishears(raw.trim());
  const lower = text.toLowerCase();

  const { amount, remaining } = stripAmount(text);
  const tokens = cleanTokens(remaining);
  const cleaned = tokens.join(" ");

  let direction: Direction | undefined;
  if (OUTGOING_WORDS.some((w) => lower.includes(w))) direction = "outgoing";
  else if (INCOMING_WORDS.some((w) => lower.includes(w))) direction = "incoming";

  // 1. Check if input matches a user's existing ledger entity first
  const knownEntity = cleaned ? findKnownEntity(cleaned, knownEntities) : undefined;
  if (knownEntity) {
    return {
      amount,
      entityId: knownEntity.id,
      entityName: knownEntity.name,
      entityType: knownEntity.type,
      entityAvatar: knownEntity.avatar,
      direction: direction ?? "outgoing",
      description: knownEntity.name,
      confidence: amount !== null ? 0.95 : 0.3,
    };
  }

  // 2. Check if input matches a Known Merchant / Company (Top 100+ daily services)
  const merchant = findMerchant(cleaned) || findMerchant(remaining) || findMerchant(text);
  if (merchant) {
    return {
      amount,
      entityName: merchant.name,
      entityType: merchant.entityType,
      entityAvatar: merchant.logo,
      categoryId: merchant.defaultCategoryId,
      direction: direction ?? "outgoing",
      description: merchant.name,
      confidence: amount !== null ? 0.95 : 0.4,
      isMerchant: true,
    };
  }

  // 3. Check if input matches an expense category keyword (chai, diesel, rent, etc.)
  const category = findCategoryByKeyword(categories, lower);
  if (category) {
    return {
      amount,
      categoryId: category.id,
      name: cleaned.length > 0 ? titleCase(cleaned) : undefined,
      description: category.label,
      confidence: amount !== null ? 0.9 : 0.3,
    };
  }

  // 4. Check if input is a custom name or business
  if (cleaned.length > 0) {
    const guessedName = titleCase(cleaned);
    const isBusiness = isLikelyBusiness(cleaned);
    return {
      amount,
      entityName: guessedName,
      entityType: isBusiness ? "vendor" : "person",
      direction: direction ?? "outgoing",
      description: guessedName,
      confidence: amount !== null ? 0.65 : 0.25,
    };
  }

  return {
    amount,
    categoryId: "other",
    description: "Expense",
    confidence: amount !== null ? 0.5 : 0,
  };
}

// Splits on "and"/"aur"/"&"/";"/newline — deliberately NOT on a bare comma,
// since stripAmount() treats a comma as a thousands separator ("1,000
// diesel") and splitting on it first would mangle that number.
const MULTI_ENTRY_SPLIT = /\s*(?:;|\n|&|\band\b|\baur\b)\s*/gi;

/**
 * Splits one typed/spoken line into multiple transactions when it clearly
 * describes more than one, e.g. "Prashant ko 200 diye and Anjali ko 600 diye".
 * Falls back to a single parseInput() result for everything else, including
 * a phrase that merely contains the word "and" as part of an item name
 * (e.g. "fish and chips 200") — guarded by requiring at least two of the
 * split segments to carry their own amount before treating this as multiple
 * entries at all.
 */
export function parseMultipleInputs(raw: string, knownEntities: Entity[], categories: Category[]): ParsedInput[] {
  const segments = raw
    .split(MULTI_ENTRY_SPLIT)
    .map((s) => s.trim())
    .filter(Boolean);

  if (segments.length < 2) {
    return [parseInput(raw, knownEntities, categories)];
  }

  const parsed = segments.map((seg) => parseInput(seg, knownEntities, categories));
  const withAmount = parsed.filter((p) => p.amount !== null).length;

  if (withAmount < 2) {
    return [parseInput(raw, knownEntities, categories)];
  }

  return parsed;
}
