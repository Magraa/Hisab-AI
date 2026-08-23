export const CREATIVE_UNISEX_NAMES: string[] = [
  "BudgetMafia",
  "CashCrafter",
  "CoinNinja",
  "PennyPilot",
  "WealthWizard",
  "KhataHero",
  "LedgerLover",
  "MoneyMind",
  "SmartSaver",
  "HisabHero",
  "ChaiCapitalist",
  "ProfitPanda",
  "RupeeRanger",
  "DimeDetective",
  "BalanceBoss",
  "FinMaster",
  "LedgerLegend",
  "CapitalCrafter",
  "PocketPro",
  "CashCaptain",
  "VentureVoyager",
  "FiscalFalcon",
  "MintMaven",
  "AssetAce",
  "SpendSage",
  "AuditAvenger",
  "LedgerLion",
  "WealthWarden",
  "KhataKnight",
  "CoinCommander",
];

export function getRandomCreativeName(): string {
  const index = Math.floor(Math.random() * CREATIVE_UNISEX_NAMES.length);
  return CREATIVE_UNISEX_NAMES[index];
}
