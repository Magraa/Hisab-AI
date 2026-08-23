export type EntityType = "person" | "vendor" | "customer" | "employee" | "group";

export type Direction = "outgoing" | "incoming";
// outgoing = you paid the entity, incoming = you received from the entity

export type PaymentMethod = "cash" | "upi" | "bank" | "card" | "credit" | "other";

export type TxSource = "local_text" | "voice" | "manual" | "settlement" | "receipt";

export interface Entity {
  id: string;
  name: string;
  aliases: string[];
  type: EntityType;
  avatar?: string;
  relationship?: string;
  phone?: string;
  notes?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  amount: number;
  categoryId?: string;
  description: string;
  /** Specific item/thing name for a category expense, e.g. "Chicken Tikka Masala" for a Refreshments entry. */
  name?: string;
  entityId?: string;
  direction?: Direction;
  paymentMethod: PaymentMethod;
  source: TxSource;
  rawInput?: string;
  createdAt: string; // ISO datetime
}

export type CategoryColor = "mint" | "amber" | "rose" | "blue" | "peach" | "violet" | "subtle";

export interface Category {
  id: string;
  label: string;
  icon: string;
  color: CategoryColor;
  keywords: string[];
}

export type AccountKind = "business" | "individual";

export interface BusinessProfile {
  name: string;
  userName?: string;
  avatar?: string;
  type: string;
  currency: string;
  accountKind: AccountKind;
}
