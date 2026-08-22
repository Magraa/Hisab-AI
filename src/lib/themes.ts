// The single source of truth for which themes exist. Adding a new theme is
// two steps: add its palette override in globals.css under
// `[data-theme="<id>"]`, then add an entry here so it shows up in Settings.
export type ThemeId = "indigo" | "sage";

export interface ThemeDef {
  id: ThemeId;
  label: string;
  description: string;
  // Swatch preview shown in the Settings picker — kept in sync with the
  // matching `[data-theme]` block in globals.css.
  swatch: {
    canvas: string;
    primary: string;
    ink: string;
  };
}

export const THEMES: ThemeDef[] = [
  {
    id: "indigo",
    label: "Indigo",
    description: "The default look — white surfaces, indigo accents.",
    swatch: { canvas: "#f4f5fa", primary: "#6c5ce7", ink: "#16171d" },
  },
  {
    id: "sage",
    label: "Sage",
    description: "Warm cream background with forest-green accents.",
    swatch: { canvas: "#faf6ec", primary: "#2f6b47", ink: "#16241b" },
  },
];

export const DEFAULT_THEME: ThemeId = "indigo";

export function isThemeId(value: string | null): value is ThemeId {
  return THEMES.some((t) => t.id === value);
}
