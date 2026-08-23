import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

interface ParseTextCategory {
  id: string;
  label: string;
  keywords: string[];
}

interface ParseTextRequestBody {
  text?: string;
  pinnedEntityName?: string;
  existingEntities?: string[];
  categories?: ParseTextCategory[];
  apiKey?: string;
}

export interface AiParsedEntry {
  amount: number | null;
  type: "category" | "entity" | "unknown";
  categoryId?: string | null;
  itemName?: string | null;
  entityName?: string | null;
  entityType?: "person" | "vendor" | "customer" | "employee" | null;
  isExistingEntity?: boolean;
  direction: "outgoing" | "incoming";
  confidence: number;
}

export interface ParseTextResponse {
  result: AiParsedEntry | null;
  sourceKeyType?: "custom" | "system";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ParseTextRequestBody;
    const { text, pinnedEntityName, existingEntities, categories, apiKey: clientApiKey } = body;

    const apiKey = clientApiKey?.trim() || process.env.GEMINI_API_KEY?.trim();
    const sourceKeyType = clientApiKey?.trim() ? "custom" : "system";

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "NO_API_KEY",
          message: "Gemini API key is required. Add GEMINI_API_KEY in .env.local or enter your free API key in Settings.",
        },
        { status: 400 }
      );
    }

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Missing text to parse." }, { status: 400 });
    }

    const existingEntitiesList = existingEntities && existingEntities.length > 0 ? existingEntities.join(", ") : "None";
    const categoryList = (categories ?? [])
      .map((c) => `  ${c.id}: ${c.label} — ${c.keywords.join(", ") || "(no keywords, fallback only)"}`)
      .join("\n");

    const promptText = `You are a fast, precise text parser for 'Hisab', an expense and khata (ledger) app used by
Indian small businesses, freelancers, and individuals. The user typed or spoke a short phrase
describing ONE money transaction, often in Hinglish or a regional language (typed in Latin or
Devanagari script), e.g. "500 diesel", "chicken tikka masala 200", "छोले भटूरे 150",
"Ramesh ko 1000 diye".

Context:
- Pinned Person/Entity (if any): "${pinnedEntityName || "None"}"
- Known existing people/vendors in this user's ledger: ${existingEntitiesList}
- Known expense categories (id: label — keywords):
${categoryList || "  (none provided)"}

Decision rules:
1. If the text names a specific person, customer, or business that money was given to or
   received from, classify as type "entity". Prefer an exact/near match against "Known existing
   people/vendors" — if matched, set isExistingEntity true and copy that name EXACTLY as given.
   Otherwise propose a sensible proper-cased new name and best-guess entityType ("person" for an
   individual, "vendor" for a shop/business/company).
2. If the text names a general good, service, dish, or expense (including specific food/drink
   items, fuel, repairs, rent, bills, supplies, etc. — even ones with no literal keyword match,
   e.g. a dish name implies a food/refreshments category), classify as type "category" and pick
   the single best-fit categoryId from the list above. Put the specific item as typed, proper-
   cased, into itemName (e.g. "Chicken Tikka Masala", "छोले भटूरे"). Only use the fallback/"other"
   category if truly nothing else fits.
3. If you cannot confidently tell whether it's a person or a category/item, or there is no
   discernible subject at all, use type "unknown".
4. direction: "outgoing" for money paid/spent/given (diya, gave, paid, sent) — this is the
   default when ambiguous. "incoming" for money received (mila, liya, received, got, aaya).
5. amount: the numeric amount in the text. Treat a trailing "k"/"K" as ×1000. Ignore currency
   symbols and thousands separators. If there is genuinely no amount in the text, set amount to
   null.
6. confidence: your own 0-1 confidence in this specific classification (type + categoryId/entity
   choice), not just whether you found an amount.
7. Keep itemName/entityName in the same language/script the user used — do not translate to
   English, and do not invent a translation.

Return ONLY a valid JSON object strictly matching this structure:
{
  "result": {
    "amount": 200,
    "type": "category",
    "categoryId": "refreshments",
    "itemName": "Chicken Tikka Masala",
    "entityName": null,
    "entityType": null,
    "isExistingEntity": false,
    "direction": "outgoing",
    "confidence": 0.92
  }
}
If truly nothing usable can be extracted, return { "result": null }.

User input text: "${text}"`;

    // Cheapest models first, falling back to pricier/older ones if unavailable.
    const models = ["gemini-3.1-flash-lite", "gemini-3.5-flash-lite", "gemini-2.5-flash"];
    let lastError: Error | null = null;
    let resultJson: ParseTextResponse | null = null;

    for (const modelName of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: {
              response_mime_type: "application/json",
              temperature: 0.1,
            },
          }),
        });

        if (!response.ok) {
          const errBody = await response.text();
          if (response.status === 400 || response.status === 403) {
            throw new Error("INVALID_API_KEY: The provided Gemini API key is invalid or lacks permissions.");
          }
          throw new Error(`Gemini API error (${response.status}): ${errBody}`);
        }

        const data = await response.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!candidateText) {
          throw new Error("No response text from Gemini model.");
        }

        resultJson = JSON.parse(candidateText) as ParseTextResponse;
        break;
      } catch (err: unknown) {
        lastError = err instanceof Error ? err : new Error(String(err));
        console.warn(`Attempt with ${modelName} failed:`, lastError.message);
      }
    }

    if (!resultJson) {
      const isInvalidKey = lastError?.message.includes("INVALID_API_KEY");
      return NextResponse.json(
        {
          error: isInvalidKey ? "INVALID_API_KEY" : "PARSE_FAILED",
          message: isInvalidKey
            ? "Your Gemini API key appears to be invalid. Please check your key in Settings."
            : lastError?.message || "Failed to parse text with AI.",
        },
        { status: isInvalidKey ? 400 : 500 }
      );
    }

    // Validate and sanitize the model's response before trusting it.
    const result = resultJson.result;
    if (result) {
      const knownCategoryIds = new Set((categories ?? []).map((c) => c.id));
      result.confidence = Math.max(0, Math.min(1, Number(result.confidence) || 0));
      if (result.type === "category") {
        if (!result.categoryId || !knownCategoryIds.has(result.categoryId)) {
          result.categoryId = "other";
        }
      }
      if (result.type === "entity" && (!result.entityName || !result.entityName.trim())) {
        result.type = "unknown";
      }
      if (result.direction !== "incoming") {
        result.direction = "outgoing";
      }
    }

    resultJson.sourceKeyType = sourceKeyType;

    return NextResponse.json(resultJson);
  } catch (error: unknown) {
    console.error("Parse text error:", error);
    return NextResponse.json(
      {
        error: "INTERNAL_ERROR",
        message: error instanceof Error ? error.message : "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
