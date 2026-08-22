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
  type LucideIcon,
} from "lucide-react";

export interface CategoryDef {
  id: string;
  label: string;
  icon: LucideIcon;
  bg: string;
  fg: string;
  keywords: string[];
}

export const CATEGORIES: CategoryDef[] = [
  {
    id: "raw_material",
    label: "Raw Material",
    icon: ShoppingCart,
    bg: "var(--color-peach-soft)",
    fg: "var(--color-peach)",
    keywords: ["raw material", "samaan", "saman", "maal", "material", "goods"],
  },
  {
    id: "fuel",
    label: "Fuel",
    icon: Fuel,
    bg: "var(--color-mint-soft)",
    fg: "var(--color-mint)",
    keywords: ["diesel", "petrol", "fuel"],
  },
  {
    id: "supplies",
    label: "Shop Supplies",
    icon: Package,
    bg: "var(--color-amber-soft)",
    fg: "var(--color-amber)",
    keywords: ["supplies", "shop supplies", "office supplies", "stationery"],
  },
  {
    id: "refreshments",
    label: "Refreshments",
    icon: Coffee,
    bg: "var(--color-blue-soft)",
    fg: "var(--color-blue)",
    keywords: ["chai", "tea", "nashta", "refreshments", "snacks", "coffee"],
  },
  {
    id: "transport",
    label: "Transport",
    icon: Truck,
    bg: "var(--color-violet-soft)",
    fg: "var(--color-violet)",
    keywords: ["transport", "courier", "delivery", "freight"],
  },
  {
    id: "maintenance",
    label: "Machine Repair",
    icon: Wrench,
    bg: "var(--color-rose-soft)",
    fg: "var(--color-rose)",
    keywords: ["repair", "machine", "maintenance", "service"],
  },
  {
    id: "electricity",
    label: "Electricity Bill",
    icon: Zap,
    bg: "var(--color-mint-soft)",
    fg: "var(--color-mint)",
    keywords: ["electricity", "bijli", "current", "power bill"],
  },
  {
    id: "rent",
    label: "Rent",
    icon: Home,
    bg: "var(--color-peach-soft)",
    fg: "var(--color-peach)",
    keywords: ["rent", "kiraya"],
  },
  {
    id: "labour",
    label: "Labour",
    icon: Users,
    bg: "var(--color-blue-soft)",
    fg: "var(--color-blue)",
    keywords: ["labour", "labor", "mazdoori", "salary", "wages"],
  },
  {
    id: "other",
    label: "Other",
    icon: Sparkles,
    bg: "var(--color-subtle)",
    fg: "var(--color-muted)",
    keywords: [],
  },
];

export function getCategory(id: string | undefined): CategoryDef {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
}

export function findCategoryByKeyword(text: string): CategoryDef | undefined {
  const lower = text.toLowerCase();
  for (const cat of CATEGORIES) {
    for (const kw of cat.keywords) {
      if (lower.includes(kw)) return cat;
    }
  }
  return undefined;
}
