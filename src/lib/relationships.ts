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

  // Services & Known Companies
  "food delivery": { bg: "var(--color-peach-soft)", fg: "var(--color-peach)" },
  "quick commerce": { bg: "var(--color-violet-soft)", fg: "var(--color-violet)" },
  "cab service": { bg: "var(--color-mint-soft)", fg: "var(--color-mint)" },
  "ev cabs": { bg: "var(--color-mint-soft)", fg: "var(--color-mint)" },
  "fast food": { bg: "var(--color-rose-soft)", fg: "var(--color-rose)" },
  cafe: { bg: "var(--color-amber-soft)", fg: "var(--color-amber)" },
  restaurant: { bg: "var(--color-rose-soft)", fg: "var(--color-rose)" },
  "sweets & dining": { bg: "var(--color-amber-soft)", fg: "var(--color-amber)" },
  supermarket: { bg: "var(--color-mint-soft)", fg: "var(--color-mint)" },
  grocery: { bg: "var(--color-mint-soft)", fg: "var(--color-mint)" },
  "dairy & grocery": { bg: "var(--color-mint-soft)", fg: "var(--color-mint)" },
  "meat & seafood": { bg: "var(--color-rose-soft)", fg: "var(--color-rose)" },
  "fresh produce": { bg: "var(--color-mint-soft)", fg: "var(--color-mint)" },
  delivery: { bg: "var(--color-violet-soft)", fg: "var(--color-violet)" },
  railways: { bg: "var(--color-blue-soft)", fg: "var(--color-blue)" },
  airline: { bg: "var(--color-blue-soft)", fg: "var(--color-blue)" },
  "travel booking": { bg: "var(--color-blue-soft)", fg: "var(--color-blue)" },
  "bus booking": { bg: "var(--color-rose-soft)", fg: "var(--color-rose)" },
  "public transit": { bg: "var(--color-mint-soft)", fg: "var(--color-mint)" },
  hotels: { bg: "var(--color-rose-soft)", fg: "var(--color-rose)" },
  "fuel pump": { bg: "var(--color-mint-soft)", fg: "var(--color-mint)" },
  telecom: { bg: "var(--color-blue-soft)", fg: "var(--color-blue)" },
  broadband: { bg: "var(--color-mint-soft)", fg: "var(--color-mint)" },
  dth: { bg: "var(--color-rose-soft)", fg: "var(--color-rose)" },
  "e-commerce": { bg: "var(--color-amber-soft)", fg: "var(--color-amber)" },
  fashion: { bg: "var(--color-rose-soft)", fg: "var(--color-rose)" },
  "beauty & fashion": { bg: "var(--color-rose-soft)", fg: "var(--color-rose)" },
  beauty: { bg: "var(--color-rose-soft)", fg: "var(--color-rose)" },
  sports: { bg: "var(--color-blue-soft)", fg: "var(--color-blue)" },
  "furniture & home": { bg: "var(--color-blue-soft)", fg: "var(--color-blue)" },
  "home services": { bg: "var(--color-amber-soft)", fg: "var(--color-amber)" },
  streaming: { bg: "var(--color-rose-soft)", fg: "var(--color-rose)" },
  music: { bg: "var(--color-mint-soft)", fg: "var(--color-mint)" },
  "video & music": { bg: "var(--color-rose-soft)", fg: "var(--color-rose)" },
  entertainment: { bg: "var(--color-rose-soft)", fg: "var(--color-rose)" },
  cinema: { bg: "var(--color-amber-soft)", fg: "var(--color-amber)" },
  audiobooks: { bg: "var(--color-amber-soft)", fg: "var(--color-amber)" },
  "tech & subscriptions": { bg: "var(--color-blue-soft)", fg: "var(--color-blue)" },
  payments: { bg: "var(--color-blue-soft)", fg: "var(--color-blue)" },
  fintech: { bg: "var(--color-violet-soft)", fg: "var(--color-violet)" },
  bank: { bg: "var(--color-blue-soft)", fg: "var(--color-blue)" },
  broker: { bg: "var(--color-mint-soft)", fg: "var(--color-mint)" },
  insurance: { bg: "var(--color-blue-soft)", fg: "var(--color-blue)" },
  pharmacy: { bg: "var(--color-mint-soft)", fg: "var(--color-mint)" },
  healthcare: { bg: "var(--color-mint-soft)", fg: "var(--color-mint)" },
  diagnostics: { bg: "var(--color-amber-soft)", fg: "var(--color-amber)" },
  fitness: { bg: "var(--color-rose-soft)", fg: "var(--color-rose)" },
  "ai subscription": { bg: "var(--color-mint-soft)", fg: "var(--color-mint)" },
  software: { bg: "var(--color-blue-soft)", fg: "var(--color-blue)" },
  "cloud & software": { bg: "var(--color-blue-soft)", fg: "var(--color-blue)" },
  "design tool": { bg: "var(--color-violet-soft)", fg: "var(--color-violet)" },
  "design software": { bg: "var(--color-rose-soft)", fg: "var(--color-rose)" },
  "developer tool": { bg: "var(--color-violet-soft)", fg: "var(--color-violet)" },
  productivity: { bg: "var(--color-peach-soft)", fg: "var(--color-peach)" },
  "video conferencing": { bg: "var(--color-blue-soft)", fg: "var(--color-blue)" },
  "professional network": { bg: "var(--color-blue-soft)", fg: "var(--color-blue)" },
  "web hosting": { bg: "var(--color-violet-soft)", fg: "var(--color-violet)" },
  "domain & hosting": { bg: "var(--color-mint-soft)", fg: "var(--color-mint)" },
  service: { bg: "var(--color-primary-soft)", fg: "var(--color-primary)" },
};

const DEFAULT_STYLE: RelationshipStyle = { bg: "var(--color-primary-soft)", fg: "var(--color-primary)" };

export function relationshipStyle(relationship?: string): RelationshipStyle {
  if (!relationship) return DEFAULT_STYLE;
  return STYLES[relationship.trim().toLowerCase()] ?? DEFAULT_STYLE;
}
