import type { BusinessProfile, Entity, Transaction } from "./types";

export const SEED_ENTITY_IDS = new Set(["ent-ramesh", "ent-abc", "ent-suresh", "ent-sharma"]);

function daysAgo(days: number, hour: number, minute: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export function seedEntities(): Entity[] {
  const now = new Date().toISOString();
  return [
    {
      id: "ent-ramesh",
      name: "Ramesh",
      aliases: ["ramesh bhai", "ramesh ji"],
      type: "person",
      relationship: "Supplier",
      createdAt: now,
    },
    {
      id: "ent-abc",
      name: "ABC Traders",
      aliases: ["abc"],
      type: "vendor",
      relationship: "Vendor",
      createdAt: now,
    },
    {
      id: "ent-suresh",
      name: "Suresh",
      aliases: [],
      type: "customer",
      relationship: "Customer",
      createdAt: now,
    },
    {
      id: "ent-sharma",
      name: "Sharma Hardware",
      aliases: ["sharma"],
      type: "vendor",
      relationship: "Vendor",
      createdAt: now,
    },
  ];
}

export function seedTransactions(): Transaction[] {
  const base: Array<Omit<Transaction, "id">> = [
    { amount: 1200, categoryId: "raw_material", description: "Raw Material", paymentMethod: "cash", source: "manual", createdAt: daysAgo(0, 12, 40) },
    { amount: 500, categoryId: "fuel", description: "Fuel", paymentMethod: "cash", source: "manual", createdAt: daysAgo(0, 11, 25) },
    { amount: 850, categoryId: "supplies", description: "Shop Supplies", paymentMethod: "cash", source: "manual", createdAt: daysAgo(0, 10, 18) },
    { amount: 240, categoryId: "refreshments", description: "Refreshments", paymentMethod: "cash", source: "manual", createdAt: daysAgo(0, 9, 45) },
    { amount: 1490, categoryId: "transport", description: "Transport", paymentMethod: "upi", source: "manual", createdAt: daysAgo(0, 9, 10) },
    { amount: 2000, categoryId: "maintenance", description: "Machine Repair", paymentMethod: "bank", source: "manual", createdAt: daysAgo(0, 8, 30) },

    { amount: 2400, categoryId: "raw_material", description: "Raw Material", paymentMethod: "cash", source: "manual", createdAt: daysAgo(1, 16, 20) },
    { amount: 600, categoryId: "transport", description: "Transport", paymentMethod: "cash", source: "manual", createdAt: daysAgo(1, 11, 10) },

    { amount: 1280, categoryId: "electricity", description: "Electricity Bill", paymentMethod: "upi", source: "manual", createdAt: daysAgo(2, 19, 30) },
    { amount: 720, categoryId: "supplies", description: "Office Supplies", paymentMethod: "cash", source: "manual", createdAt: daysAgo(2, 9, 0) },

    { amount: 980, categoryId: "raw_material", description: "Raw Material", paymentMethod: "cash", source: "manual", createdAt: daysAgo(4, 14, 0) },
    { amount: 430, categoryId: "fuel", description: "Diesel", paymentMethod: "cash", source: "manual", createdAt: daysAgo(6, 9, 30) },
    { amount: 1750, categoryId: "raw_material", description: "Raw Material", paymentMethod: "bank", source: "manual", createdAt: daysAgo(9, 12, 0) },
    { amount: 12000, categoryId: "rent", description: "Rent", paymentMethod: "bank", source: "manual", createdAt: daysAgo(15, 10, 0) },

    // Entity ledger history.
    // direction "outgoing" = you gave value to them, "incoming" = you got value from them.
    // Whoever received net value owes it back (same convention as Khatabook's "You Gave / You Got").
    { amount: 3000, entityId: "ent-ramesh", direction: "incoming", description: "Ramesh", paymentMethod: "credit", source: "manual", createdAt: daysAgo(13, 12, 0) },
    { amount: 2500, entityId: "ent-ramesh", direction: "incoming", description: "Ramesh", paymentMethod: "credit", source: "manual", createdAt: daysAgo(8, 15, 0) },
    { amount: 1000, entityId: "ent-ramesh", direction: "outgoing", description: "Ramesh", paymentMethod: "cash", source: "manual", createdAt: daysAgo(5, 10, 0) },
    { amount: 2000, entityId: "ent-ramesh", direction: "outgoing", description: "Ramesh", paymentMethod: "cash", source: "manual", createdAt: daysAgo(3, 14, 0) },

    { amount: 8000, entityId: "ent-abc", direction: "incoming", description: "ABC Traders", paymentMethod: "credit", source: "manual", createdAt: daysAgo(9, 13, 0) },
    { amount: 7000, entityId: "ent-abc", direction: "incoming", description: "ABC Traders", paymentMethod: "credit", source: "manual", createdAt: daysAgo(4, 17, 0) },
    { amount: 2200, entityId: "ent-abc", direction: "outgoing", description: "ABC Traders", paymentMethod: "bank", source: "manual", createdAt: daysAgo(2, 11, 0) },

    { amount: 2000, entityId: "ent-suresh", direction: "outgoing", description: "Suresh", paymentMethod: "credit", source: "manual", createdAt: daysAgo(6, 10, 0) },

    { amount: 9400, entityId: "ent-sharma", direction: "incoming", description: "Sharma Hardware", paymentMethod: "credit", source: "manual", createdAt: daysAgo(11, 15, 0) },
    { amount: 1000, entityId: "ent-sharma", direction: "outgoing", description: "Sharma Hardware", paymentMethod: "bank", source: "manual", createdAt: daysAgo(6, 12, 0) },
  ];

  return base.map((tx, i) => ({ ...tx, id: `seed-${i}` }));
}

export function seedBusiness(): BusinessProfile {
  return { name: "Sharma Traders", type: "Retail", currency: "INR", accountKind: "business" };
}
