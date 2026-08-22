"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { BusinessProfile, Direction, Entity, PaymentMethod, Transaction, TxSource } from "./types";
import { seedBusiness, seedEntities, seedTransactions } from "./seed";

const STORAGE_KEY = "hisab_state_v1";

interface PersistedState {
  entities: Entity[];
  transactions: Transaction[];
  business: BusinessProfile;
  enabledPaymentMethods: PaymentMethod[];
  hasOnboarded: boolean;
}

function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function defaultState(): PersistedState {
  return {
    entities: seedEntities(),
    transactions: seedTransactions(),
    business: seedBusiness(),
    enabledPaymentMethods: ["cash", "upi", "bank", "card", "credit"],
    // The seeded demo data above simulates an existing user, so onboarding
    // stays skipped by default. "Restart onboarding" (More page) flips this.
    hasOnboarded: true,
  };
}

export interface AddTransactionInput {
  amount: number;
  description: string;
  categoryId?: string;
  entityName?: string;
  direction?: Direction;
  paymentMethod?: PaymentMethod;
  source?: TxSource;
  rawInput?: string;
}

interface HisabContextValue {
  entities: Entity[];
  transactions: Transaction[];
  business: BusinessProfile;
  enabledPaymentMethods: PaymentMethod[];
  hasOnboarded: boolean;
  hydrated: boolean;
  addTransaction: (input: AddTransactionInput) => Transaction;
  addSettlement: (entityId: string, amount: number, direction: Direction) => void;
  updateTransaction: (id: string, patch: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  updateEntity: (id: string, patch: Partial<Entity>) => void;
  updateBusiness: (patch: Partial<BusinessProfile>) => void;
  togglePaymentMethod: (method: PaymentMethod) => void;
  resolveEntityByName: (name: string) => Entity | undefined;
  completeOnboarding: (profile: Partial<BusinessProfile>) => void;
  resetOnboarding: () => void;
}

const HisabContext = createContext<HisabContextValue | null>(null);

export function HisabProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const loadedOnce = useRef(false);

  useEffect(() => {
    if (loadedOnce.current) return;
    loadedOnce.current = true;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedState;
        setState(parsed);
      }
    } catch {
      // corrupt storage, keep defaults
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage full or unavailable, ignore
    }
  }, [state, hydrated]);

  const resolveEntityByName = useCallback(
    (name: string): Entity | undefined => {
      const lower = name.trim().toLowerCase();
      return state.entities.find(
        (e) => e.name.toLowerCase() === lower || e.aliases.some((a) => a.toLowerCase() === lower)
      );
    },
    [state.entities]
  );

  const addTransaction = useCallback((input: AddTransactionInput): Transaction => {
    let entityId: string | undefined;

    if (input.entityName) {
      const existing = resolveEntityByName(input.entityName);
      if (existing) {
        entityId = existing.id;
      } else {
        const newEntity: Entity = {
          id: makeId("ent"),
          name: input.entityName,
          aliases: [],
          type: "person",
          createdAt: new Date().toISOString(),
        };
        entityId = newEntity.id;
        setState((s) => ({ ...s, entities: [...s.entities, newEntity] }));
      }
    }

    const tx: Transaction = {
      id: makeId("tx"),
      amount: input.amount,
      categoryId: input.entityName ? undefined : input.categoryId ?? "other",
      description: input.description,
      entityId,
      direction: input.entityName ? input.direction ?? "outgoing" : undefined,
      paymentMethod: input.paymentMethod ?? "cash",
      source: input.source ?? "manual",
      rawInput: input.rawInput,
      createdAt: new Date().toISOString(),
    };

    setState((s) => ({ ...s, transactions: [tx, ...s.transactions] }));
    return tx;
  }, [resolveEntityByName]);

  const addSettlement = useCallback((entityId: string, amount: number, direction: Direction) => {
    const tx: Transaction = {
      id: makeId("tx"),
      amount,
      entityId,
      direction,
      description: "Settlement",
      paymentMethod: "cash",
      source: "settlement",
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({ ...s, transactions: [tx, ...s.transactions] }));
  }, []);

  const updateTransaction = useCallback((id: string, patch: Partial<Transaction>) => {
    setState((s) => ({
      ...s,
      transactions: s.transactions.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setState((s) => ({ ...s, transactions: s.transactions.filter((t) => t.id !== id) }));
  }, []);

  const updateEntity = useCallback((id: string, patch: Partial<Entity>) => {
    setState((s) => ({
      ...s,
      entities: s.entities.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
  }, []);

  const updateBusiness = useCallback((patch: Partial<BusinessProfile>) => {
    setState((s) => ({ ...s, business: { ...s.business, ...patch } }));
  }, []);

  const togglePaymentMethod = useCallback((method: PaymentMethod) => {
    setState((s) => ({
      ...s,
      enabledPaymentMethods: s.enabledPaymentMethods.includes(method)
        ? s.enabledPaymentMethods.filter((m) => m !== method)
        : [...s.enabledPaymentMethods, method],
    }));
  }, []);

  const completeOnboarding = useCallback((profile: Partial<BusinessProfile>) => {
    setState((s) => ({ ...s, business: { ...s.business, ...profile }, hasOnboarded: true }));
  }, []);

  const resetOnboarding = useCallback(() => {
    setState((s) => ({ ...s, hasOnboarded: false }));
  }, []);

  const value = useMemo<HisabContextValue>(
    () => ({
      entities: state.entities,
      transactions: state.transactions,
      business: state.business,
      enabledPaymentMethods: state.enabledPaymentMethods,
      hasOnboarded: state.hasOnboarded,
      hydrated,
      addTransaction,
      addSettlement,
      updateTransaction,
      deleteTransaction,
      updateEntity,
      updateBusiness,
      togglePaymentMethod,
      resolveEntityByName,
      completeOnboarding,
      resetOnboarding,
    }),
    [
      state,
      hydrated,
      addTransaction,
      addSettlement,
      updateTransaction,
      deleteTransaction,
      updateEntity,
      updateBusiness,
      togglePaymentMethod,
      resolveEntityByName,
      completeOnboarding,
      resetOnboarding,
    ]
  );

  return <HisabContext.Provider value={value}>{children}</HisabContext.Provider>;
}

export function useHisab(): HisabContextValue {
  const ctx = useContext(HisabContext);
  if (!ctx) throw new Error("useHisab must be used within HisabProvider");
  return ctx;
}
