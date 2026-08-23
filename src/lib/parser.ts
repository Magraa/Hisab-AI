import type { Category, Direction, Entity } from "./types";
import { findCategoryByKeyword } from "./categories";

export interface ParsedInput {
  amount: number | null;
  categoryId?: string;
  entityId?: string;
  entityName?: string;
  direction?: Direction;
  description: string;
  confidence: number;
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
]);

const OUTGOING_WORDS = ["diye", "diya", "de diya", "gave", "give", "paid", "send", "sent"];
const INCOMING_WORDS = ["mila", "mile", "milaa", "received", "receive", "aaya", "aya", "got"];

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

  const knownEntity = cleaned ? findKnownEntity(cleaned, knownEntities) : undefined;
  const category = findCategoryByKeyword(categories, lower);

  if (knownEntity) {
    return {
      amount,
      entityId: knownEntity.id,
      entityName: knownEntity.name,
      direction: direction ?? "outgoing",
      description: knownEntity.name,
      confidence: amount !== null ? 0.95 : 0.3,
    };
  }

  if (category) {
    return {
      amount,
      categoryId: category.id,
      description: category.label,
      confidence: amount !== null ? 0.9 : 0.3,
    };
  }

  if (cleaned.length > 0) {
    const guessedName = titleCase(cleaned);
    return {
      amount,
      entityName: guessedName,
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
