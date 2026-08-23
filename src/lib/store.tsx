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
import type { BusinessProfile, Category, Direction, Entity, PaymentMethod, Transaction, TxSource } from "./types";
import { cloneDefaultCategories } from "./categories";
// Demo-data seeding is disabled below so a fresh signed-out user goes through
// real onboarding instead of landing on pre-filled demo data (see
// OnboardingGate). To restore it for testing, uncomment this import and the
// three seed* calls in defaultState(), then flip hasOnboarded back to true.
// import { seedBusiness, seedEntities, seedTransactions } from "./seed";
import { createClient } from "./supabase/client";
import {
  deleteCategoryRow,
  deleteTransactionRow,
  fetchCloudState,
  importLocalData,
  insertCategory,
  insertEntity,
  insertTransaction,
  seedDefaultCategories,
  updateCategoryRow,
  updateEntityRow,
  updateProfile,
  updateTransactionRow,
} from "./supabase/queries";

const STORAGE_KEY = "hisab_state_v1";

interface PersistedState {
  entities: Entity[];
  transactions: Transaction[];
  categories: Category[];
  business: BusinessProfile;
  enabledPaymentMethods: PaymentMethod[];
  hasOnboarded: boolean;
  geminiApiKey?: string | null;
  scanUsage?: { date: string; count: number };
}

function defaultState(): PersistedState {
  return {
    entities: [], // seedEntities(),
    transactions: [], // seedTransactions(),
    categories: cloneDefaultCategories(),
    business: { name: "", type: "", currency: "INR", accountKind: "individual" }, // seedBusiness(),
    enabledPaymentMethods: ["cash", "upi", "bank", "card", "credit"],
    hasOnboarded: false,
    geminiApiKey: null,
    scanUsage: undefined,
  };
}

// What a signed-in user sees while their cloud data loads, or if it fails to
// load — never their device's local/demo data, which could belong to nobody
// or to a different account entirely.
function emptyCloudState(): PersistedState {
  return {
    entities: [],
    transactions: [],
    categories: cloneDefaultCategories(),
    business: { name: "", type: "", currency: "INR", accountKind: "individual" },
    enabledPaymentMethods: ["cash", "upi", "bank", "card", "credit"],
    hasOnboarded: false,
    geminiApiKey: null,
    scanUsage: undefined,
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

export interface CloudUser {
  id: string;
  email: string | null;
}

export interface AddCategoryInput {
  label: string;
  icon: string;
  color: Category["color"];
  keywords?: string[];
}

interface HisabContextValue {
  entities: Entity[];
  transactions: Transaction[];
  categories: Category[];
  business: BusinessProfile;
  enabledPaymentMethods: PaymentMethod[];
  hasOnboarded: boolean;
  hydrated: boolean;
  cloudUser: CloudUser | null;
  cloudError: string | null;
  dismissCloudError: () => void;
  geminiApiKey: string | null;
  setGeminiApiKey: (key: string | null) => void;
  dailyScansRemaining: number;
  recordScanUsage: () => void;
  addTransaction: (input: AddTransactionInput) => Transaction;
  addTransactionsBulk: (inputs: AddTransactionInput[]) => Transaction[];
  addSettlement: (entityId: string, amount: number, direction: Direction) => void;
  updateTransaction: (id: string, patch: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  updateEntity: (id: string, patch: Partial<Entity>) => void;
  updateBusiness: (patch: Partial<BusinessProfile>) => void;
  togglePaymentMethod: (method: PaymentMethod) => void;
  resolveEntityByName: (name: string) => Entity | undefined;
  completeOnboarding: (profile: Partial<BusinessProfile>) => void;
  resetOnboarding: () => void;
  addCategory: (input: AddCategoryInput) => Category;
  updateCategory: (id: string, patch: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

const HisabContext = createContext<HisabContextValue | null>(null);

export function HisabProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [cloudUser, setCloudUser] = useState<CloudUser | null>(null);
  const [cloudError, setCloudError] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // The device's pre-signin local snapshot, frozen at first read — used only
  // as the source for a possible one-time cloud import. Never touched again.
  const localSnapshotRef = useRef<PersistedState | null>(null);
  const loadedLocalOnce = useRef(false);

  useEffect(() => {
    if (loadedLocalOnce.current) return;
    loadedLocalOnce.current = true;
    try {
      const savedApiKey = window.localStorage.getItem("hisab_gemini_api_key");
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedState;
        // Older snapshots (saved before categories were user-editable) won't
        // have this field — backfill the defaults rather than starting empty.
        if (!parsed.categories || parsed.categories.length === 0) {
          parsed.categories = cloneDefaultCategories();
        }
        if (savedApiKey && !parsed.geminiApiKey) {
          parsed.geminiApiKey = savedApiKey;
        }
        localSnapshotRef.current = parsed;
        setState(parsed);
        return;
      } else if (savedApiKey) {
        const base = defaultState();
        base.geminiApiKey = savedApiKey;
        localSnapshotRef.current = base;
        setState(base);
        return;
      }
    } catch {
      // corrupt storage, fall through to defaults
    }
    localSnapshotRef.current = defaultState();
  }, []);

  // Track auth state; store.tsx is the single owner of it so other
  // components (Settings, etc.) read cloudUser from context instead of
  // subscribing separately.
  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      const user = data.session?.user;
      setCloudUser(user ? { id: user.id, email: user.email ?? null } : null);
      setAuthChecked(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      setCloudUser(user ? { id: user.id, email: user.email ?? null } : null);
      setAuthChecked(true);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  // Load the right data source once we know the auth state, and whenever it
  // changes (sign in / sign out switches the whole data source live).
  useEffect(() => {
    if (!authChecked) return;
    let cancelled = false;

    async function load() {
      if (!cloudUser) {
        setState(localSnapshotRef.current ?? defaultState());
        setCloudError(null);
        setHydrated(true);
        return;
      }

      try {
        let cloud = await fetchCloudState(supabase, cloudUser.id);
        if (cloud.entities.length === 0 && cloud.transactions.length === 0) {
          const imported = await importLocalData(supabase, cloudUser.id, localSnapshotRef.current ?? defaultState());
          if (imported) {
            cloud = await fetchCloudState(supabase, cloudUser.id);
          }
        }
        // Covers both a brand-new account (import above had nothing to carry
        // over) and an existing account from before categories were synced.
        if (cloud.categories.length === 0) {
          await seedDefaultCategories(supabase, cloudUser.id);
          cloud = await fetchCloudState(supabase, cloudUser.id);
        }
        if (cancelled) return;
        setState(cloud);
        setCloudError(null);
        setHydrated(true);
      } catch {
        if (cancelled) return;
        setState(emptyCloudState());
        setCloudError("Couldn't load your data. Check your connection and reload.");
        setHydrated(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [authChecked, cloudUser, supabase]);

  // Signed-out mode only: mirror state to localStorage, exactly as before.
  // Signed-in mode never writes here — Supabase is the source of truth and
  // this key stays untouched so a future sign-out sees it unchanged.
  useEffect(() => {
    if (!hydrated || cloudUser) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage full or unavailable, ignore
    }
  }, [state, hydrated, cloudUser]);

  const dismissCloudError = useCallback(() => setCloudError(null), []);

  const setGeminiApiKey = useCallback((key: string | null) => {
    const cleanKey = key?.trim() || null;
    setState((s) => ({ ...s, geminiApiKey: cleanKey }));
    try {
      if (cleanKey) {
        window.localStorage.setItem("hisab_gemini_api_key", cleanKey);
      } else {
        window.localStorage.removeItem("hisab_gemini_api_key");
      }
    } catch {
      // ignore
    }
  }, []);

  const dailyScansRemaining = useMemo(() => {
    if (state.geminiApiKey) return 1500;
    const today = new Date().toISOString().slice(0, 10);
    const count = state.scanUsage?.date === today ? state.scanUsage.count : 0;
    return Math.max(0, 3 - count);
  }, [state.geminiApiKey, state.scanUsage]);

  const recordScanUsage = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    setState((s) => {
      const currentCount = s.scanUsage?.date === today ? s.scanUsage.count : 0;
      return {
        ...s,
        scanUsage: {
          date: today,
          count: currentCount + 1,
        },
      };
    });
  }, []);

  function runCloudWrite(promise: Promise<void>, rollback: () => void) {
    promise.catch((err) => {
      console.error(err);
      rollback();
      setCloudError("Couldn't save — check your connection and try again.");
    });
  }

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
    let newEntity: Entity | undefined;

    if (input.entityName) {
      const existing = resolveEntityByName(input.entityName);
      if (existing) {
        entityId = existing.id;
      } else {
        newEntity = {
          id: crypto.randomUUID(),
          name: input.entityName,
          aliases: [],
          type: "person",
          createdAt: new Date().toISOString(),
        };
        entityId = newEntity.id;
      }
    }

    const tx: Transaction = {
      id: crypto.randomUUID(),
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

    setState((s) => ({
      ...s,
      entities: newEntity ? [...s.entities, newEntity] : s.entities,
      transactions: [tx, ...s.transactions],
    }));

    if (cloudUser) {
      const uid = cloudUser.id;
      const createdEntity = newEntity;
      runCloudWrite(
        (async () => {
          if (createdEntity) await insertEntity(supabase, uid, createdEntity);
          await insertTransaction(supabase, uid, tx);
        })(),
        () =>
          setState((s) => ({
            ...s,
            entities: createdEntity ? s.entities.filter((e) => e.id !== createdEntity.id) : s.entities,
            transactions: s.transactions.filter((t) => t.id !== tx.id),
          }))
      );
    }

    return tx;
  }, [resolveEntityByName, cloudUser, supabase]);

  const addTransactionsBulk = useCallback((inputs: AddTransactionInput[]): Transaction[] => {
    if (inputs.length === 0) return [];
    const newEntities: Entity[] = [];
    const createdTxs: Transaction[] = [];

    // Helper map of local entities including those created in this same batch
    const tempEntities = [...state.entities];

    for (const input of inputs) {
      let entityId: string | undefined;
      if (input.entityName) {
        const lower = input.entityName.trim().toLowerCase();
        let existing = tempEntities.find(
          (e) => e.name.toLowerCase() === lower || e.aliases.some((a) => a.toLowerCase() === lower)
        );
        if (!existing) {
          existing = {
            id: crypto.randomUUID(),
            name: input.entityName.trim(),
            aliases: [],
            type: "person",
            createdAt: new Date().toISOString(),
          };
          tempEntities.push(existing);
          newEntities.push(existing);
        }
        entityId = existing.id;
      }

      const tx: Transaction = {
        id: crypto.randomUUID(),
        amount: input.amount,
        categoryId: input.entityName ? undefined : input.categoryId ?? "other",
        description: input.description,
        entityId,
        direction: input.entityName ? input.direction ?? "outgoing" : undefined,
        paymentMethod: input.paymentMethod ?? "cash",
        source: input.source ?? "receipt",
        rawInput: input.rawInput,
        createdAt: new Date().toISOString(),
      };
      createdTxs.push(tx);
    }

    setState((s) => ({
      ...s,
      entities: newEntities.length > 0 ? [...s.entities, ...newEntities] : s.entities,
      transactions: [...createdTxs, ...s.transactions],
    }));

    if (cloudUser) {
      const uid = cloudUser.id;
      runCloudWrite(
        (async () => {
          for (const ent of newEntities) {
            await insertEntity(supabase, uid, ent);
          }
          for (const tx of createdTxs) {
            await insertTransaction(supabase, uid, tx);
          }
        })(),
        () => {
          const newEntityIds = new Set(newEntities.map((e) => e.id));
          const newTxIds = new Set(createdTxs.map((t) => t.id));
          setState((s) => ({
            ...s,
            entities: s.entities.filter((e) => !newEntityIds.has(e.id)),
            transactions: s.transactions.filter((t) => !newTxIds.has(t.id)),
          }));
        }
      );
    }

    return createdTxs;
  }, [state.entities, cloudUser, supabase]);

  const addSettlement = useCallback((entityId: string, amount: number, direction: Direction) => {
    const tx: Transaction = {
      id: crypto.randomUUID(),
      amount,
      entityId,
      direction,
      description: "Settlement",
      paymentMethod: "cash",
      source: "settlement",
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({ ...s, transactions: [tx, ...s.transactions] }));

    if (cloudUser) {
      const uid = cloudUser.id;
      runCloudWrite(
        insertTransaction(supabase, uid, tx),
        () => setState((s) => ({ ...s, transactions: s.transactions.filter((t) => t.id !== tx.id) }))
      );
    }
  }, [cloudUser, supabase]);

  const updateTransaction = useCallback((id: string, patch: Partial<Transaction>) => {
    const previous = stateRef.current.transactions.find((t) => t.id === id);
    setState((s) => ({
      ...s,
      transactions: s.transactions.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));

    if (cloudUser && previous) {
      const uid = cloudUser.id;
      runCloudWrite(
        updateTransactionRow(supabase, uid, id, patch),
        () => setState((s) => ({ ...s, transactions: s.transactions.map((t) => (t.id === id ? previous : t)) }))
      );
    }
  }, [cloudUser, supabase]);

  const deleteTransaction = useCallback((id: string) => {
    const previous = stateRef.current.transactions.find((t) => t.id === id);
    setState((s) => ({ ...s, transactions: s.transactions.filter((t) => t.id !== id) }));

    if (cloudUser && previous) {
      const uid = cloudUser.id;
      runCloudWrite(
        deleteTransactionRow(supabase, uid, id),
        () => setState((s) => ({ ...s, transactions: [previous, ...s.transactions] }))
      );
    }
  }, [cloudUser, supabase]);

  const updateEntity = useCallback((id: string, patch: Partial<Entity>) => {
    const previous = stateRef.current.entities.find((e) => e.id === id);
    setState((s) => ({
      ...s,
      entities: s.entities.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));

    if (cloudUser && previous) {
      const uid = cloudUser.id;
      runCloudWrite(
        updateEntityRow(supabase, uid, id, patch),
        () => setState((s) => ({ ...s, entities: s.entities.map((e) => (e.id === id ? previous : e)) }))
      );
    }
  }, [cloudUser, supabase]);

  const updateBusiness = useCallback((patch: Partial<BusinessProfile>) => {
    const previous = stateRef.current.business;
    setState((s) => ({ ...s, business: { ...s.business, ...patch } }));

    if (cloudUser) {
      const uid = cloudUser.id;
      runCloudWrite(
        updateProfile(supabase, uid, patch),
        () => setState((s) => ({ ...s, business: previous }))
      );
    }
  }, [cloudUser, supabase]);

  const togglePaymentMethod = useCallback((method: PaymentMethod) => {
    const previous = stateRef.current.enabledPaymentMethods;
    const next = previous.includes(method) ? previous.filter((m) => m !== method) : [...previous, method];
    setState((s) => ({ ...s, enabledPaymentMethods: next }));

    if (cloudUser) {
      const uid = cloudUser.id;
      runCloudWrite(
        updateProfile(supabase, uid, { enabledPaymentMethods: next }),
        () => setState((s) => ({ ...s, enabledPaymentMethods: previous }))
      );
    }
  }, [cloudUser, supabase]);

  const completeOnboarding = useCallback((profile: Partial<BusinessProfile>) => {
    const previousBusiness = stateRef.current.business;
    const previousHasOnboarded = stateRef.current.hasOnboarded;
    setState((s) => ({ ...s, business: { ...s.business, ...profile }, hasOnboarded: true }));

    if (cloudUser) {
      const uid = cloudUser.id;
      runCloudWrite(
        updateProfile(supabase, uid, { ...profile, hasOnboarded: true }),
        () => setState((s) => ({ ...s, business: previousBusiness, hasOnboarded: previousHasOnboarded }))
      );
    }
  }, [cloudUser, supabase]);

  const resetOnboarding = useCallback(() => {
    const previous = stateRef.current.hasOnboarded;
    setState((s) => ({ ...s, hasOnboarded: false }));

    if (cloudUser) {
      const uid = cloudUser.id;
      runCloudWrite(
        updateProfile(supabase, uid, { hasOnboarded: false }),
        () => setState((s) => ({ ...s, hasOnboarded: previous }))
      );
    }
  }, [cloudUser, supabase]);

  const addCategory = useCallback((input: AddCategoryInput): Category => {
    const category: Category = {
      id: crypto.randomUUID(),
      label: input.label,
      icon: input.icon,
      color: input.color,
      keywords: input.keywords ?? [],
    };
    setState((s) => ({ ...s, categories: [...s.categories, category] }));

    if (cloudUser) {
      const uid = cloudUser.id;
      runCloudWrite(
        insertCategory(supabase, uid, category),
        () => setState((s) => ({ ...s, categories: s.categories.filter((c) => c.id !== category.id) }))
      );
    }

    return category;
  }, [cloudUser, supabase]);

  const updateCategory = useCallback((id: string, patch: Partial<Category>) => {
    const previous = stateRef.current.categories.find((c) => c.id === id);
    setState((s) => ({
      ...s,
      categories: s.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));

    if (cloudUser && previous) {
      const uid = cloudUser.id;
      runCloudWrite(
        updateCategoryRow(supabase, uid, id, patch),
        () => setState((s) => ({ ...s, categories: s.categories.map((c) => (c.id === id ? previous : c)) }))
      );
    }
  }, [cloudUser, supabase]);

  // Reassigns any expenses in the deleted category to "Other" rather than
  // leaving them pointing at a categoryId that no longer exists.
  const deleteCategory = useCallback((id: string) => {
    if (id === "other") return;
    const previousCategories = stateRef.current.categories;
    const reassigned = stateRef.current.transactions.filter((t) => t.categoryId === id);
    setState((s) => ({
      ...s,
      categories: s.categories.filter((c) => c.id !== id),
      transactions: s.transactions.map((t) => (t.categoryId === id ? { ...t, categoryId: "other" } : t)),
    }));

    if (cloudUser) {
      const uid = cloudUser.id;
      runCloudWrite(
        (async () => {
          await Promise.all(reassigned.map((t) => updateTransactionRow(supabase, uid, t.id, { categoryId: "other" })));
          await deleteCategoryRow(supabase, uid, id);
        })(),
        () =>
          setState((s) => ({
            ...s,
            categories: previousCategories,
            transactions: s.transactions.map((t) =>
              reassigned.some((r) => r.id === t.id) ? { ...t, categoryId: id } : t
            ),
          }))
      );
    }
  }, [cloudUser, supabase]);

  const value = useMemo<HisabContextValue>(
    () => ({
      entities: state.entities,
      transactions: state.transactions,
      categories: state.categories,
      business: state.business,
      enabledPaymentMethods: state.enabledPaymentMethods,
      hasOnboarded: state.hasOnboarded,
      hydrated,
      cloudUser,
      cloudError,
      dismissCloudError,
      geminiApiKey: state.geminiApiKey ?? null,
      setGeminiApiKey,
      dailyScansRemaining,
      recordScanUsage,
      addTransaction,
      addTransactionsBulk,
      addSettlement,
      updateTransaction,
      deleteTransaction,
      updateEntity,
      updateBusiness,
      togglePaymentMethod,
      resolveEntityByName,
      completeOnboarding,
      resetOnboarding,
      addCategory,
      updateCategory,
      deleteCategory,
    }),
    [
      state,
      hydrated,
      cloudUser,
      cloudError,
      dismissCloudError,
      setGeminiApiKey,
      dailyScansRemaining,
      recordScanUsage,
      addTransaction,
      addTransactionsBulk,
      addSettlement,
      updateTransaction,
      deleteTransaction,
      updateEntity,
      updateBusiness,
      togglePaymentMethod,
      resolveEntityByName,
      completeOnboarding,
      resetOnboarding,
      addCategory,
      updateCategory,
      deleteCategory,
    ]
  );

  return <HisabContext.Provider value={value}>{children}</HisabContext.Provider>;
}

export function useHisab(): HisabContextValue {
  const ctx = useContext(HisabContext);
  if (!ctx) throw new Error("useHisab must be used within HisabProvider");
  return ctx;
}
