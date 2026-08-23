import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert, TablesUpdate } from "./types";
import { SEED_ENTITY_IDS } from "../seed";
import { DEFAULT_CATEGORIES } from "../categories";
import type {
  AccountKind,
  BusinessProfile,
  Category,
  CategoryColor,
  Direction,
  Entity,
  EntityType,
  ParsingMode,
  PaymentMethod,
  Transaction,
  TxSource,
} from "../types";

type Client = SupabaseClient<Database>;
type EntityRow = Tables<"entities">;
type TransactionRow = Tables<"transactions">;
type ProfileRow = Tables<"profiles">;
type CategoryRow = Tables<"categories">;

export interface CloudState {
  entities: Entity[];
  transactions: Transaction[];
  categories: Category[];
  business: BusinessProfile;
  enabledPaymentMethods: PaymentMethod[];
  hasOnboarded: boolean;
  parsingMode: ParsingMode;
}

export type ProfilePatch = Partial<BusinessProfile> & {
  enabledPaymentMethods?: PaymentMethod[];
  hasOnboarded?: boolean;
  parsingMode?: ParsingMode;
};

function entityFromRow(row: EntityRow): Entity {
  return {
    id: row.id,
    name: row.name,
    aliases: row.aliases,
    type: row.type as EntityType,
    relationship: row.relationship ?? undefined,
    phone: row.phone ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
  };
}

function transactionFromRow(row: TransactionRow): Transaction {
  return {
    id: row.id,
    amount: Number(row.amount),
    categoryId: row.category_id ?? undefined,
    description: row.description,
    name: row.name ?? undefined,
    entityId: row.entity_id ?? undefined,
    direction: (row.direction as Direction | null) ?? undefined,
    paymentMethod: row.payment_method as PaymentMethod,
    source: row.source as TxSource,
    rawInput: row.raw_input ?? undefined,
    createdAt: row.created_at,
  };
}

function categoryFromRow(row: CategoryRow): Category {
  return {
    id: row.id,
    label: row.label,
    icon: row.icon,
    color: row.color as CategoryColor,
    keywords: row.keywords,
  };
}

function categoryToInsert(category: Category, userId: string): TablesInsert<"categories"> {
  return {
    id: category.id,
    user_id: userId,
    label: category.label,
    icon: category.icon,
    color: category.color,
    keywords: category.keywords,
  };
}

function businessFromRow(row: ProfileRow): BusinessProfile {
  const isIndividual = row.account_kind === "individual";
  const name = row.name || "";
  return {
    name,
    userName: name || "Hisab User",
    type: row.type || (isIndividual ? "Individual" : "Retail"),
    currency: row.currency || "INR",
    accountKind: (row.account_kind as AccountKind) || "individual",
  };
}

function entityToInsert(entity: Entity, userId: string): TablesInsert<"entities"> {
  return {
    id: entity.id,
    user_id: userId,
    name: entity.name,
    aliases: entity.aliases,
    type: entity.type,
    relationship: entity.relationship ?? null,
    phone: entity.phone ?? null,
    notes: entity.notes ?? null,
    created_at: entity.createdAt,
  };
}

function transactionToInsert(tx: Transaction, userId: string): TablesInsert<"transactions"> {
  return {
    id: tx.id,
    user_id: userId,
    amount: tx.amount,
    category_id: tx.categoryId ?? null,
    description: tx.description,
    name: tx.name ?? null,
    entity_id: tx.entityId ?? null,
    direction: tx.direction ?? null,
    payment_method: tx.paymentMethod,
    source: tx.source,
    raw_input: tx.rawInput ?? null,
    created_at: tx.createdAt,
  };
}

function profilePatchToUpdate(patch: ProfilePatch): TablesUpdate<"profiles"> {
  const update: TablesUpdate<"profiles"> = {};
  if (patch.name !== undefined) update.name = patch.name;
  if (patch.type !== undefined) update.type = patch.type;
  if (patch.currency !== undefined) update.currency = patch.currency;
  if (patch.accountKind !== undefined) update.account_kind = patch.accountKind;
  if (patch.enabledPaymentMethods !== undefined) update.enabled_payment_methods = patch.enabledPaymentMethods;
  if (patch.hasOnboarded !== undefined) update.has_onboarded = patch.hasOnboarded;
  if (patch.parsingMode !== undefined) update.parsing_mode = patch.parsingMode;
  return update;
}

export async function fetchCloudState(supabase: Client, userId: string): Promise<CloudState> {
  const [profileResult, entitiesResult, transactionsResult, categoriesResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("entities").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
    supabase.from("transactions").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase.from("categories").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
  ]);

  if (entitiesResult.error) {
    console.error("Failed to fetch entities:", entitiesResult.error);
    throw entitiesResult.error;
  }
  if (transactionsResult.error) {
    console.error("Failed to fetch transactions:", transactionsResult.error);
    throw transactionsResult.error;
  }
  if (categoriesResult.error) {
    console.error("Failed to fetch categories:", categoriesResult.error);
    throw categoriesResult.error;
  }
  if (profileResult.error) {
    console.error("Failed to fetch profile:", profileResult.error);
    throw profileResult.error;
  }

  let profileRow = profileResult.data;
  if (!profileRow) {
    // Brand new cloud account without a profiles row yet
    const initialProfile: TablesInsert<"profiles"> = {
      id: userId,
      name: "Hisab User",
      type: "Retail",
      currency: "INR",
      account_kind: "individual",
      enabled_payment_methods: ["cash", "upi", "bank", "card", "credit"],
      has_onboarded: false,
      parsing_mode: "local",
    };

    const { data: createdProfile, error: createError } = await supabase
      .from("profiles")
      .upsert(initialProfile)
      .select()
      .maybeSingle();

    if (createError) {
      console.error("Failed to initialize profile:", createError);
      // Even if upserting fails (e.g., schema constraint), we can use fallback object
      profileRow = initialProfile as Tables<"profiles">;
    } else {
      profileRow = createdProfile ?? (initialProfile as Tables<"profiles">);
    }
  }

  return {
    entities: (entitiesResult.data ?? []).map(entityFromRow),
    transactions: (transactionsResult.data ?? []).map(transactionFromRow),
    categories: (categoriesResult.data ?? []).map(categoryFromRow),
    business: businessFromRow(profileRow),
    enabledPaymentMethods: (profileRow.enabled_payment_methods as PaymentMethod[]) ?? ["cash", "upi", "bank", "card", "credit"],
    hasOnboarded: profileRow.has_onboarded ?? false,
    parsingMode: (profileRow.parsing_mode as ParsingMode) || "local",
  };
}

export async function insertEntity(supabase: Client, userId: string, entity: Entity): Promise<void> {
  const { error } = await supabase.from("entities").insert(entityToInsert(entity, userId));
  if (error) throw error;
}

export async function updateEntityRow(
  supabase: Client,
  userId: string,
  id: string,
  patch: Partial<Entity>,
): Promise<void> {
  const update: TablesUpdate<"entities"> = {};
  if (patch.name !== undefined) update.name = patch.name;
  if (patch.aliases !== undefined) update.aliases = patch.aliases;
  if (patch.type !== undefined) update.type = patch.type;
  if (patch.relationship !== undefined) update.relationship = patch.relationship ?? null;
  if (patch.phone !== undefined) update.phone = patch.phone ?? null;
  if (patch.notes !== undefined) update.notes = patch.notes ?? null;
  const { error } = await supabase.from("entities").update(update).eq("id", id).eq("user_id", userId);
  if (error) throw error;
}

export async function insertCategory(supabase: Client, userId: string, category: Category): Promise<void> {
  const { error } = await supabase.from("categories").insert(categoryToInsert(category, userId));
  if (error) throw error;
}

export async function updateCategoryRow(
  supabase: Client,
  userId: string,
  id: string,
  patch: Partial<Category>,
): Promise<void> {
  const update: TablesUpdate<"categories"> = {};
  if (patch.label !== undefined) update.label = patch.label;
  if (patch.icon !== undefined) update.icon = patch.icon;
  if (patch.color !== undefined) update.color = patch.color;
  if (patch.keywords !== undefined) update.keywords = patch.keywords;
  const { error } = await supabase.from("categories").update(update).eq("id", id).eq("user_id", userId);
  if (error) throw error;
}

export async function deleteCategoryRow(supabase: Client, userId: string, id: string): Promise<void> {
  const { error } = await supabase.from("categories").delete().eq("id", id).eq("user_id", userId);
  if (error) throw error;
}

/** Seeds the standard built-in category list for an account that has none yet. */
export async function seedDefaultCategories(supabase: Client, userId: string): Promise<void> {
  const { error } = await supabase
    .from("categories")
    .upsert(DEFAULT_CATEGORIES.map((c) => categoryToInsert(c, userId)));
  if (error) {
    console.error("Failed to seed default categories:", error);
  }
}

export async function insertTransaction(supabase: Client, userId: string, tx: Transaction): Promise<void> {
  const { error } = await supabase.from("transactions").insert(transactionToInsert(tx, userId));
  if (error) throw error;
}

export async function updateTransactionRow(
  supabase: Client,
  userId: string,
  id: string,
  patch: Partial<Transaction>,
): Promise<void> {
  const update: TablesUpdate<"transactions"> = {};
  if (patch.amount !== undefined) update.amount = patch.amount;
  if (patch.categoryId !== undefined) update.category_id = patch.categoryId ?? null;
  if (patch.description !== undefined) update.description = patch.description;
  if (patch.name !== undefined) update.name = patch.name ?? null;
  if (patch.entityId !== undefined) update.entity_id = patch.entityId ?? null;
  if (patch.direction !== undefined) update.direction = patch.direction ?? null;
  if (patch.paymentMethod !== undefined) update.payment_method = patch.paymentMethod;
  if (patch.source !== undefined) update.source = patch.source;
  if (patch.rawInput !== undefined) update.raw_input = patch.rawInput ?? null;
  const { error } = await supabase.from("transactions").update(update).eq("id", id).eq("user_id", userId);
  if (error) throw error;
}

export async function deleteTransactionRow(supabase: Client, userId: string, id: string): Promise<void> {
  const { error } = await supabase.from("transactions").delete().eq("id", id).eq("user_id", userId);
  if (error) throw error;
}

export async function updateProfile(supabase: Client, userId: string, patch: ProfilePatch): Promise<void> {
  const update = profilePatchToUpdate(patch);
  if (Object.keys(update).length === 0) return;
  const { error } = await supabase.from("profiles").upsert({ id: userId, ...update });
  if (error) {
    console.error("Failed to update profile:", error);
    throw error;
  }
}

/**
 * One-time carry-over of a device's pre-signup local data into a brand-new
 * (empty) cloud account. Excludes the built-in demo seed. Returns whether
 * anything was imported.
 */
export async function importLocalData(
  supabase: Client,
  userId: string,
  local: {
    entities: Entity[];
    transactions: Transaction[];
    categories: Category[];
    business: BusinessProfile;
    enabledPaymentMethods: PaymentMethod[];
    hasOnboarded: boolean;
    parsingMode?: ParsingMode;
  },
): Promise<boolean> {
  const realEntities = local.entities.filter((e) => !SEED_ENTITY_IDS.has(e.id));
  const realTransactions = local.transactions.filter((t) => !t.id.startsWith("seed-"));
  const hasProfileData = local.hasOnboarded || (local.business?.name && local.business.name.trim().length > 0);

  if (realEntities.length === 0 && realTransactions.length === 0 && !hasProfileData) {
    return false;
  }

  if (realEntities.length > 0) {
    const { error } = await supabase.from("entities").upsert(realEntities.map((e) => entityToInsert(e, userId)));
    if (error) console.error("import entities error:", error);
  }

  if (realTransactions.length > 0) {
    const { error } = await supabase
      .from("transactions")
      .upsert(realTransactions.map((t) => transactionToInsert(t, userId)));
    if (error) console.error("import transactions error:", error);
  }

  if (local.categories && local.categories.length > 0) {
    const { error } = await supabase
      .from("categories")
      .upsert(local.categories.map((c) => categoryToInsert(c, userId)));
    if (error) console.error("import categories error:", error);
  }

  await updateProfile(supabase, userId, {
    ...local.business,
    enabledPaymentMethods: local.enabledPaymentMethods,
    hasOnboarded: local.hasOnboarded,
    parsingMode: local.parsingMode,
  });

  return true;
}
