import type { IncomeBracket, SavingsGoal } from "../types";

export type GoalTemplate = {
  emoji: string;
  name: string;
  category: string;
  amounts: Record<IncomeBracket, number>;
  defaultMonths: number;
  keywords: string[];
};

export const GOAL_TEMPLATES: GoalTemplate[] = [
  {
    emoji: "🏖️", name: "Mon voyage", category: "Voyage",
    amounts: { low: 1000, medium: 2000, high: 4000 },
    defaultMonths: 12,
    keywords: ["voyage", "travel", "vacances", "trip"],
  },
  {
    emoji: "🚗", name: "Ma voiture", category: "Transport",
    amounts: { low: 3000, medium: 8000, high: 15000 },
    defaultMonths: 24,
    keywords: ["voiture", "car", "auto", "vehicule"],
  },
  {
    emoji: "🏠", name: "Mon apport immobilier", category: "Immobilier",
    amounts: { low: 10000, medium: 20000, high: 40000 },
    defaultMonths: 36,
    keywords: ["immobilier", "housing", "maison", "appartement", "apport"],
  },
  {
    emoji: "🛡️", name: "Mon épargne de sécurité", category: "Urgence",
    amounts: { low: 1000, medium: 3000, high: 6000 },
    defaultMonths: 12,
    keywords: ["urgence", "emergency", "securite", "épargne"],
  },
  {
    emoji: "🎓", name: "Ma formation", category: "Formation",
    amounts: { low: 1500, medium: 3000, high: 8000 },
    defaultMonths: 18,
    keywords: ["formation", "education", "études", "cours"],
  },
];

export const DEFAULT_TEMPLATE: GoalTemplate = {
  emoji: "🎯", name: "Mon objectif", category: "Autre",
  amounts: { low: 1000, medium: 1500, high: 3000 },
  defaultMonths: 12,
  keywords: [],
};

/** Returns the best matching template given the user's declared goal string */
export function matchTemplate(declaredGoal: string): GoalTemplate {
  const lower = declaredGoal.toLowerCase();
  return (
    GOAL_TEMPLATES.find((t) => t.keywords.some((kw) => lower.includes(kw))) ??
    DEFAULT_TEMPLATE
  );
}

/** Build a prefilled SavingsGoal from declared goal + income bracket */
export function buildPrefillGoal(
  declaredGoal: string,
  incomeBracket: IncomeBracket,
  monthlyBudget = 200,
): SavingsGoal {
  const tpl = matchTemplate(declaredGoal);
  const targetAmount = tpl.amounts[incomeBracket];
  const monthlyAmount = monthlyBudget || Math.round(targetAmount / tpl.defaultMonths);
  const months = Math.ceil(targetAmount / monthlyAmount);
  const target = new Date();
  target.setMonth(target.getMonth() + months);

  return {
    id: `g${Date.now()}`,
    name: tpl.name,
    emoji: tpl.emoji,
    category: tpl.category,
    targetAmount,
    currentAmount: 0,
    monthlyAmount,
    targetDate: target.toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
    priority: 1,
  };
}

// Visual tile definitions for the multi-select goal picker
export const GOAL_TILES = [
  { emoji: "✈️", label: "Voyage",      amount: 1500,  key: "voyage"     },
  { emoji: "🚗", label: "Voiture",     amount: 8000,  key: "voiture"    },
  { emoji: "🏠", label: "Immobilier",  amount: 20000, key: "immobilier" },
  { emoji: "🛡️", label: "Urgence",     amount: 3000,  key: "urgence"    },
  { emoji: "🎓", label: "Formation",   amount: 3000,  key: "formation"  },
  { emoji: "✨", label: "Autre",       amount: 1500,  key: "autre"      },
] as const;
