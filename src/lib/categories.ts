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
  { id: "fuel", label: "Fuel", icon: "fuel", color: "mint", keywords: ["diesel", "petrol", "fuel"] },
  { id: "supplies", label: "Shop Supplies", icon: "package", color: "amber", keywords: ["supplies", "shop supplies", "office supplies", "stationery"] },
  { id: "refreshments", label: "Refreshments", icon: "coffee", color: "blue", keywords: ["chai", "tea", "nashta", "refreshments", "snacks", "coffee"] },
  { id: "transport", label: "Transport", icon: "truck", color: "violet", keywords: ["transport", "courier", "delivery", "freight"] },
  { id: "maintenance", label: "Machine Repair", icon: "wrench", color: "rose", keywords: ["repair", "machine", "maintenance", "service"] },
  { id: "electricity", label: "Electricity Bill", icon: "zap", color: "mint", keywords: ["electricity", "bijli", "current", "power bill"] },
  { id: "rent", label: "Rent", icon: "home", color: "peach", keywords: ["rent", "kiraya"] },
  { id: "labour", label: "Labour", icon: "users", color: "blue", keywords: ["labour", "labor", "mazdoori", "salary", "wages"] },
  { id: "other", label: "Other", icon: "sparkles", color: "subtle", keywords: [] },
];

export function cloneDefaultCategories(): Category[] {
  return DEFAULT_CATEGORIES.map((c) => ({ ...c, keywords: [...c.keywords] }));
}

export function getCategoryIcon(iconKey: string): LucideIcon {
  return CATEGORY_ICONS[iconKey] ?? Sparkles;
}

export function getCategoryColors(color: CategoryColor): { bg: string; fg: string } {
  return CATEGORY_COLORS[color] ?? CATEGORY_COLORS.subtle;
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
