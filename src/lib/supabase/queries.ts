import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert, TablesUpdate } from "./types";
import { SEED_ENTITY_IDS } from "../seed";
import type {
  AccountKind,
  BusinessProfile,
  Direction,
  Entity,
  EntityType,
  PaymentMethod,
  Transaction,
  TxSource,
} from "../types";

type Client = SupabaseClient<Database>;
type EntityRow = Tables<"entities">;
type TransactionRow = Tables<"transactions">;
type ProfileRow = Tables<"profiles">;

export interface CloudState {
  entities: Entity[];
  transactions: Transaction[];
  business: BusinessProfile;
  enabledPaymentMethods: PaymentMethod[];
  hasOnboarded: boolean;
}

export type ProfilePatch = Partial<BusinessProfile> & {
  enabledPaymentMethods?: PaymentMethod[];
  hasOnboarded?: boolean;
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
    entityId: row.entity_id ?? undefined,
    direction: (row.direction as Direction | null) ?? undefined,
    paymentMethod: row.payment_method as PaymentMethod,
    source: row.source as TxSource,
    rawInput: row.raw_input ?? undefined,
    createdAt: row.created_at,
  };
}

function businessFromRow(row: ProfileRow): BusinessProfile {
  return {
    name: row.name,
    type: row.type,
    currency: row.currency,
    accountKind: row.account_kind as AccountKind,
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
  return update;
}

export async function fetchCloudState(supabase: Client, userId: string): Promise<CloudState> {
  const [profileResult, entitiesResult, transactionsResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),
    supabase.from("entities").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
    supabase.from("transactions").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
  ]);

  if (profileResult.error) throw profileResult.error;
  if (entitiesResult.error) throw entitiesResult.error;
  if (transactionsResult.error) throw transactionsResult.error;

  return {
    entities: (entitiesResult.data ?? []).map(entityFromRow),
    transactions: (transactionsResult.data ?? []).map(transactionFromRow),
    business: businessFromRow(profileResult.data),
    enabledPaymentMethods: profileResult.data.enabled_payment_methods as PaymentMethod[],
    hasOnboarded: profileResult.data.has_onboarded,
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
  const { error } = await supabase.from("profiles").update(update).eq("id", userId);
  if (error) throw error;
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
    business: BusinessProfile;
    enabledPaymentMethods: PaymentMethod[];
    hasOnboarded: boolean;
  },
): Promise<boolean> {
  const realEntities = local.entities.filter((e) => !SEED_ENTITY_IDS.has(e.id));
  const realTransactions = local.transactions.filter((t) => !t.id.startsWith("seed-"));

  if (realEntities.length === 0 && realTransactions.length === 0) return false;

  if (realEntities.length > 0) {
    const { error } = await supabase.from("entities").insert(realEntities.map((e) => entityToInsert(e, userId)));
    if (error) throw error;
  }

  if (realTransactions.length > 0) {
    const { error } = await supabase
      .from("transactions")
      .insert(realTransactions.map((t) => transactionToInsert(t, userId)));
    if (error) throw error;
  }

  await updateProfile(supabase, userId, {
    ...local.business,
    enabledPaymentMethods: local.enabledPaymentMethods,
    hasOnboarded: local.hasOnboarded,
  });

  return true;
}
