import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

interface ScanReceiptRequestBody {
  mode?: "scan" | "test_key";
  imageBase64?: string; // e.g. "data:image/jpeg;base64,..." or raw base64
  mimeType?: string;
  additionalInfo?: string;
  pinnedEntityName?: string;
  existingEntities?: string[];
  apiKey?: string;
}

export interface ExtractedEntry {
  amount: number;
  description: string;
  personName?: string | null;
  categoryId?: string | null;
  direction: "outgoing" | "incoming";
  date?: string | null;
  confidence: number;
}

export interface ScanReceiptResponse {
  vendorOrPerson?: string | null;
  summary: string;
  totalAmount: number;
  currency: string;
  entries: ExtractedEntry[];
  rawNotes?: string | null;
  sourceKeyType?: "custom" | "system";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ScanReceiptRequestBody;
    const {
      mode = "scan",
      imageBase64,
      mimeType = "image/jpeg",
      additionalInfo,
      pinnedEntityName,
      existingEntities,
      apiKey: clientApiKey,
    } = body;

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

    // MODE: TEST KEY VALIDATION
    if (mode === "test_key") {
      const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`;
      const testRes = await fetch(testUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Respond with the word 'PONG'." }] }],
        }),
      });

      if (!testRes.ok) {
        const errText = await testRes.text();
        if (testRes.status === 400 || testRes.status === 403) {
          return NextResponse.json(
            { error: "INVALID_API_KEY", message: "The API key provided is invalid or has expired." },
            { status: 400 }
          );
        }
        return NextResponse.json(
          { error: "API_ERROR", message: `Gemini test failed (${testRes.status}): ${errText}` },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Gemini API key is valid and connected successfully.",
      });
    }

    // MODE: SCAN RECEIPT
    if (!imageBase64) {
      return NextResponse.json({ error: "Missing image data." }, { status: 400 });
    }

    // Extract clean base64 data and mime type
    let cleanBase64 = imageBase64;
    let actualMimeType = mimeType;
    if (imageBase64.includes(";base64,")) {
      const parts = imageBase64.split(";base64,");
      const mimeMatch = parts[0].match(/data:(.*?);/);
      if (mimeMatch) actualMimeType = mimeMatch[1];
      cleanBase64 = parts[1];
    }

    const existingEntitiesList = existingEntities && existingEntities.length > 0 ? existingEntities.join(", ") : "None";

    const promptText = `You are an expert financial and handwriting OCR assistant for 'Hisab', an expense and khata management app for Indian small businesses, freelancers, and individuals.

Task:
Analyze the attached image (which could be a printed bill/receipt, invoice, hand-written bahi-khata ledger note, diary page, fuel slip, or grocery memo) and extract all transaction entries.

Context & Instructions:
- Pinned Person/Entity (if any): "${pinnedEntityName || "None"}"
- Known Existing Accounts/People in app: ${existingEntitiesList}
- User's Additional Notes/Guidance: "${additionalInfo || "None"}"

Extraction Rules:
1. Handwritten Khata / Multiple Entries:
   - If the image contains multiple entries (e.g. daily milk/diesel/labor ledger records, list of items, multiple entries across different dates, or entries for multiple people), EXTRACT EVERY SINGLE ROW/ENTRY as an individual item in the 'entries' array.
   - Do NOT just lump everything into a single total if multiple distinct line items or entries are visible.
2. Direction ('outgoing' vs 'incoming'):
   - 'outgoing' for expenses, money given, debit (diya / udhar / paid).
   - 'incoming' for income, money received, credit (mila / jama / payment received).
   - Default is 'outgoing' for store bills and expense slips.
3. Person Association:
   - If the entry belongs to a person or customer (or if pinnedEntityName is set or specified in additional notes), assign it to 'personName'. Use existing account names where appropriate.
4. Category Assignment:
   - If it's a general expense not tied to a customer ledger, assign one of:
     'raw-materials' | 'fuel' | 'food' | 'travel' | 'supplies' | 'utilities' | 'repairs' | 'rent' | 'salary' | 'other'
5. Date:
   - If a date is visible on the bill or per line entry, format as YYYY-MM-DD (e.g. assuming year 2026 if only day/month given). Otherwise return null.
6. Amounts:
   - Ensure amount is a positive number. Calculate correct numeric value without commas or currency marks.

Return ONLY a valid JSON object strictly matching this structure:
{
  "vendorOrPerson": "Store name or person name, or null",
  "summary": "Brief summary of what this document is (e.g. 'Ramesh Khata - 3 entries' or 'Shell Fuel Bill')",
  "totalAmount": 1250,
  "currency": "INR",
  "entries": [
    {
      "amount": 500,
      "description": "Diesel",
      "personName": null,
      "categoryId": "fuel",
      "direction": "outgoing",
      "date": "2026-08-22",
      "confidence": 0.95
    }
  ],
  "rawNotes": "Any extra detected handwritten notes or null"
}`;

    // Use Gemini Flash models (with automatic fallback)
    // Cheapest multimodal models first, falling back to pricier/older ones if unavailable.
    const models = ["gemini-3.1-flash-lite", "gemini-3.5-flash-lite", "gemini-2.5-flash"];
    let lastError: Error | null = null;
    let resultJson: ScanReceiptResponse | null = null;

    for (const modelName of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: promptText },
                  {
                    inline_data: {
                      mime_type: actualMimeType,
                      data: cleanBase64,
                    },
                  },
                ],
              },
            ],
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

        resultJson = JSON.parse(candidateText) as ScanReceiptResponse;
        break; // Successfully got response
      } catch (err: unknown) {
        lastError = err instanceof Error ? err : new Error(String(err));
        console.warn(`Attempt with ${modelName} failed:`, lastError.message);
      }
    }

    if (!resultJson) {
      const isInvalidKey = lastError?.message.includes("INVALID_API_KEY");
      return NextResponse.json(
        {
          error: isInvalidKey ? "INVALID_API_KEY" : "OCR_FAILED",
          message: isInvalidKey
            ? "Your Gemini API key appears to be invalid. Please check your key in Settings."
            : lastError?.message || "Failed to process receipt image with AI.",
        },
        { status: isInvalidKey ? 400 : 500 }
      );
    }

    // Validate and sanitize response
    if (!Array.isArray(resultJson.entries)) {
      resultJson.entries = [];
    }

    // If totalAmount is missing, compute it from entries
    if (typeof resultJson.totalAmount !== "number" || isNaN(resultJson.totalAmount)) {
      resultJson.totalAmount = resultJson.entries.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    }

    resultJson.sourceKeyType = sourceKeyType;

    return NextResponse.json(resultJson);
  } catch (error: unknown) {
    console.error("Scan receipt error:", error);
    return NextResponse.json(
      {
        error: "INTERNAL_ERROR",
        message: error instanceof Error ? error.message : "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
