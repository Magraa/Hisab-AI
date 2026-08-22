// Small, consistent color coding per relationship type — reuses the same
// functional tokens as expense categories so it stays recognizable across
// themes. Kept subtle on purpose: this is a scanning aid, not a redesign.
export interface RelationshipStyle {
  bg: string;
  fg: string;
}

const STYLES: Record<string, RelationshipStyle> = {
  supplier: { bg: "var(--color-violet-soft)", fg: "var(--color-violet)" },
  vendor: { bg: "var(--color-blue-soft)", fg: "var(--color-blue)" },
  customer: { bg: "var(--color-mint-soft)", fg: "var(--color-mint)" },
  employee: { bg: "var(--color-amber-soft)", fg: "var(--color-amber)" },
};

const DEFAULT_STYLE: RelationshipStyle = { bg: "var(--color-primary-soft)", fg: "var(--color-primary)" };

export function relationshipStyle(relationship?: string): RelationshipStyle {
  if (!relationship) return DEFAULT_STYLE;
  return STYLES[relationship.trim().toLowerCase()] ?? DEFAULT_STYLE;
}
