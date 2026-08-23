import type { Category, Entity } from "./types";
import type { ParsedInput } from "./parser";
import type { AiParsedEntry, ParseTextResponse } from "@/app/api/parse-text/route";
import { getCategory } from "./categories";

interface ParseWithAiOptions {
  apiKey: string | null;
  pinnedEntityName?: string;
  timeoutMs?: number;
  /** External abort signal (e.g. a user-triggered Cancel button) — combined with the internal timeout. */
  signal?: AbortSignal;
}

/**
 * Calls the Gemini-backed /api/parse-text endpoint and maps its response onto
 * the same ParsedInput shape the local parser produces, so callers don't need
 * to branch on where a result came from. Never throws — any failure (bad
 * response, network error, timeout, or a null AI result) resolves to null so
 * the caller can silently fall back to the local parser.
 */
export async function parseInputWithAI(
  raw: string,
  entities: Entity[],
  categories: Category[],
  opts: ParseWithAiOptions
): Promise<ParsedInput | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), opts.timeoutMs ?? 7000);
  if (opts.signal) {
    if (opts.signal.aborted) controller.abort();
    else opts.signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  try {
    const res = await fetch("/api/parse-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: raw,
        pinnedEntityName: opts.pinnedEntityName || undefined,
        existingEntities: entities.map((e) => e.name),
        categories: categories.map((c) => ({ id: c.id, label: c.label, keywords: c.keywords })),
        apiKey: opts.apiKey || undefined,
      }),
      signal: controller.signal,
    });

    if (!res.ok) return null;

    const data = (await res.json()) as ParseTextResponse;
    if (!data.result) return null;

    return mapAiResult(data.result, categories);
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

function mapAiResult(result: AiParsedEntry, categories: Category[]): ParsedInput {
  const direction = result.direction === "incoming" ? "incoming" : "outgoing";

  if (result.amount !== null && result.type === "entity" && result.entityName) {
    return {
      amount: result.amount,
      entityName: result.entityName,
      entityType: result.entityType ?? "person",
      direction,
      description: result.entityName,
      confidence: result.confidence,
    };
  }

  if (result.amount !== null && result.type === "category" && result.categoryId) {
    return {
      amount: result.amount,
      categoryId: result.categoryId,
      name: result.itemName ?? undefined,
      direction,
      description: getCategory(categories, result.categoryId).label,
      confidence: result.confidence,
    };
  }

  // "unknown" type, missing amount, or an incomplete category/entity guess —
  // force confidence below the auto-commit threshold so this always lands in
  // the confirm/error UI rather than silently committing a bad guess.
  return {
    amount: result.amount,
    categoryId: "other",
    direction,
    description: "Expense",
    confidence: Math.min(result.confidence, 0.4),
  };
}
