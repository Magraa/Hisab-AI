import {
  ShoppingCart,
  Fuel,
  Package,
  Coffee,
  Truck,
  Wrench,
  Zap,
  Home,
  Users,
  Sparkles,
  Tag,
  Car,
  Wifi,
  Phone,
  Utensils,
  Gift,
  Heart,
  Book,
  Briefcase,
  CreditCard,
  Building2,
  Plane,
  ShoppingBag,
  Stethoscope,
  Clapperboard,
  Shirt,
  Shield,
  Scissors,
  PawPrint,
  type LucideIcon,
} from "lucide-react";
import type { Category, CategoryColor } from "./types";

// Icon and color are stored as string keys (not component refs) so a user's
// category list can be persisted as plain data — to localStorage and to the
// `categories` Supabase table — the same way entities/transactions are.
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  shopping_cart: ShoppingCart,
  fuel: Fuel,
  package: Package,
  coffee: Coffee,
  truck: Truck,
  wrench: Wrench,
  zap: Zap,
  home: Home,
  users: Users,
  sparkles: Sparkles,
  tag: Tag,
  car: Car,
  wifi: Wifi,
  phone: Phone,
  utensils: Utensils,
  gift: Gift,
  heart: Heart,
  book: Book,
  briefcase: Briefcase,
  credit_card: CreditCard,
  building: Building2,
  plane: Plane,
  shopping_bag: ShoppingBag,
  stethoscope: Stethoscope,
  film: Clapperboard,
  shirt: Shirt,
  shield: Shield,
  scissors: Scissors,
  paw_print: PawPrint,
};

export const CATEGORY_ICON_KEYS = Object.keys(CATEGORY_ICONS);

export const CATEGORY_COLORS: Record<CategoryColor, { bg: string; fg: string }> = {
  mint: { bg: "var(--color-mint-soft)", fg: "var(--color-mint)" },
  amber: { bg: "var(--color-amber-soft)", fg: "var(--color-amber)" },
  rose: { bg: "var(--color-rose-soft)", fg: "var(--color-rose)" },
  blue: { bg: "var(--color-blue-soft)", fg: "var(--color-blue)" },
  peach: { bg: "var(--color-peach-soft)", fg: "var(--color-peach)" },
  violet: { bg: "var(--color-violet-soft)", fg: "var(--color-violet)" },
  subtle: { bg: "var(--color-subtle)", fg: "var(--color-muted)" },
};

export const CATEGORY_COLOR_KEYS = Object.keys(CATEGORY_COLORS) as CategoryColor[];

// Seeded into every new user's category list (local first-run and cloud
// first-fetch alike) — after that it's just their data, fully editable.
export const DEFAULT_CATEGORIES: Category[] = [
  { id: "raw_material", label: "Raw Material", icon: "shopping_cart", color: "peach", keywords: ["raw material", "samaan", "saman", "maal", "material", "goods"] },
  { id: "fuel", label: "Fuel", icon: "fuel", color: "mint", keywords: ["diesel", "petrol", "fuel", "cng", "gas bharwaya", "gas bharaya"] },
  { id: "supplies", label: "Shop Supplies", icon: "package", color: "amber", keywords: ["supplies", "shop supplies", "office supplies", "stationery", "printer", "cartridge", "packaging"] },
  { id: "refreshments", label: "Refreshments", icon: "coffee", color: "blue", keywords: ["chai", "tea", "nashta", "refreshments", "snacks", "coffee"] },
  { id: "transport", label: "Transport", icon: "truck", color: "violet", keywords: ["transport", "courier", "delivery", "freight", "taxi", "cab", "auto", "rickshaw", "bus", "train", "toll", "parking"] },
  { id: "maintenance", label: "Machine Repair", icon: "wrench", color: "rose", keywords: ["repair", "machine", "maintenance", "service", "plumber", "electrician", "carpenter", "ac service"] },
  { id: "electricity", label: "Electricity Bill", icon: "zap", color: "mint", keywords: ["electricity", "bijli", "current", "power bill", "water bill", "lpg", "gas cylinder", "cylinder"] },
  { id: "rent", label: "Rent", icon: "home", color: "peach", keywords: ["rent", "kiraya"] },
  { id: "labour", label: "Labour", icon: "users", color: "blue", keywords: ["labour", "labor", "mazdoori", "salary", "wages"] },
  { id: "entertainment", label: "Entertainment", icon: "film", color: "violet", keywords: ["movie", "movies", "cinema", "film", "netflix", "prime video", "hotstar", "ott", "subscription", "theatre", "theater", "pvr", "inox", "multiplex", "ticket", "tickets", "game", "gaming", "outing", "picnic"] },
  { id: "groceries", label: "Groceries", icon: "shopping_bag", color: "amber", keywords: ["grocery", "groceries", "kirana", "vegetables", "sabzi", "sabji", "ration", "supermarket", "fruits"] },
  { id: "medical", label: "Medical & Health", icon: "stethoscope", color: "rose", keywords: ["medicine", "medicines", "doctor", "hospital", "clinic", "pharmacy", "medical", "dawai", "checkup"] },
  { id: "mobile_internet", label: "Mobile & Internet", icon: "wifi", color: "blue", keywords: ["recharge", "mobile", "internet", "wifi", "broadband", "data pack", "dth", "sim"] },
  { id: "clothing", label: "Clothing & Shopping", icon: "shirt", color: "peach", keywords: ["clothes", "clothing", "shopping", "shirt", "dress", "footwear", "shoes", "kapde"] },
  { id: "education", label: "Education", icon: "book", color: "mint", keywords: ["school", "college", "fees", "tuition", "books", "course", "school fees", "admission"] },
  { id: "travel", label: "Travel", icon: "plane", color: "violet", keywords: ["travel", "trip", "vacation", "holiday", "flight", "hotel", "booking"] },
  { id: "insurance", label: "Insurance", icon: "shield", color: "blue", keywords: ["insurance", "premium", "policy", "lic", "mediclaim", "health insurance", "car insurance", "bike insurance"] },
  { id: "loan_emi", label: "EMI & Loan", icon: "credit_card", color: "rose", keywords: ["emi", "loan", "installment", "instalment", "credit card bill", "cc bill", "loan payment"] },
  { id: "donation", label: "Donation & Charity", icon: "heart", color: "peach", keywords: ["donation", "charity", "daan", "temple", "mandir", "chanda", "ngo", "trust"] },
  { id: "personal_care", label: "Personal Care", icon: "scissors", color: "violet", keywords: ["salon", "parlour", "parlor", "spa", "haircut", "grooming", "beauty", "makeup"] },
  { id: "pet_care", label: "Pet Care", icon: "paw_print", color: "amber", keywords: ["pet", "dog", "cat", "vet", "veterinary", "pet food", "pet shop"] },
  { id: "taxes_fees", label: "Taxes & Fees", icon: "briefcase", color: "mint", keywords: ["tax", "taxes", "gst", "income tax", "tds", "penalty", "fine", "challan", "bank charges", "service charge"] },
  { id: "other", label: "Other", icon: "sparkles", color: "subtle", keywords: [] },
];

export function cloneDefaultCategories(): Category[] {
  return DEFAULT_CATEGORIES.map((c) => ({ ...c, keywords: [...c.keywords] }));
}

/**
 * Default categories (or their keyword sets) added after a user already
 * onboarded won't retroactively appear for them — seeding only fires for an
 * empty list. This returns just the ones missing from an existing list so
 * callers can backfill without touching anything the user already has or
 * may have customized (renamed, re-colored, deleted).
 */
export function missingDefaultCategories(existing: Category[]): Category[] {
  const existingIds = new Set(existing.map((c) => c.id));
  return DEFAULT_CATEGORIES.filter((c) => !existingIds.has(c.id)).map((c) => ({ ...c, keywords: [...c.keywords] }));
}

export function getCategoryIcon(iconKey: string): LucideIcon {
  return CATEGORY_ICONS[iconKey] ?? Sparkles;
}

export function getCategoryColors(color: CategoryColor): { bg: string; fg: string } {
  return CATEGORY_COLORS[color] ?? CATEGORY_COLORS.subtle;
}

export const CATEGORY_IMAGES: Record<string, string> = {
  raw_material: "/Assets/categories/raw-material.webp",
  fuel: "/Assets/categories/fuel.webp",
  supplies: "/Assets/categories/shop-supplies.webp",
  refreshments: "/Assets/categories/refreshments.webp",
  transport: "/Assets/categories/transport.webp",
  maintenance: "/Assets/categories/machine-repair.webp",
  electricity: "/Assets/categories/electricity.webp",
  rent: "/Assets/categories/rent.webp",
  labour: "/Assets/categories/labour.webp",
  entertainment: "/Assets/categories/entertainment.webp",
  groceries: "/Assets/categories/groceries.webp",
  medical: "/Assets/categories/medical.webp",
  mobile_internet: "/Assets/categories/mobile-internet.webp",
  clothing: "/Assets/categories/clothing.webp",
  education: "/Assets/categories/education.webp",
  travel: "/Assets/categories/travel.webp",
  insurance: "/Assets/categories/insurance.webp",
  loan_emi: "/Assets/categories/loan-emi.webp",
  donation: "/Assets/categories/donation.webp",
  personal_care: "/Assets/categories/personal-care.webp",
  pet_care: "/Assets/categories/pet-care.webp",
  taxes_fees: "/Assets/categories/taxes-fees.webp",
};

export function getCategoryImage(categoryIdOrIconKey: string | undefined): string | undefined {
  if (!categoryIdOrIconKey) return undefined;
  return CATEGORY_IMAGES[categoryIdOrIconKey];
}

export function getCategory(categories: Category[], id: string | undefined): Category {
  return (
    categories.find((c) => c.id === id) ??
    categories.find((c) => c.id === "other") ??
    categories[categories.length - 1] ??
    DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1]
  );
}

export function findCategoryByKeyword(categories: Category[], text: string): Category | undefined {
  const lower = text.toLowerCase();
  for (const cat of categories) {
    for (const kw of cat.keywords) {
      if (kw && lower.includes(kw.toLowerCase())) return cat;
    }
  }
  return undefined;
}
