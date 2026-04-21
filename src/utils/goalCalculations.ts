import type { SavingsGoal } from "../types";

/** Calculate monthly needed to reach target in given months */
export function monthlyFor(targetAmount: number, months: number): number {
  return Math.ceil(targetAmount / Math.max(1, months));
}

/** How many months to reach target at given monthly rate */
export function monthsFor(targetAmount: number, currentAmount: number, monthly: number): number {
  const remaining = Math.max(0, targetAmount - currentAmount);
  return monthly > 0 ? Math.ceil(remaining / monthly) : 999;
}

/** Format months as human-readable string */
export function fmtMonths(n: number): string {
  if (n <= 0) return "atteint";
  if (n < 12) return `${n} mois`;
  const y = Math.floor(n / 12);
  const m = n % 12;
  return m > 0 ? `${y} an${y > 1 ? "s" : ""} ${m} mois` : `${y} an${y > 1 ? "s" : ""}`;
}

/** Format amount in French */
export function fmtAmount(n: number): string {
  return n.toLocaleString("fr-FR") + " €";
}

/** Progress percentage capped at 100 */
export function pct(current: number, target: number): number {
  return Math.min(100, Math.round((current / Math.max(1, target)) * 100));
}

/**
 * Allocate a monthly budget across goals ordered by priority.
 * High-priority goals get their full monthly amount first,
 * remaining surplus is distributed proportionally.
 */
export function allocateBudget(
  goals: SavingsGoal[],
  totalMonthly: number,
): SavingsGoal[] {
  if (goals.length === 0 || totalMonthly <= 0) return goals;

  const sorted = [...goals].sort((a, b) => a.priority - b.priority);
  let remaining = totalMonthly;

  return sorted.map((g, i) => {
    const share = i === sorted.length - 1
      ? remaining
      : Math.min(g.monthlyAmount, remaining);
    remaining = Math.max(0, remaining - share);
    const months = monthsFor(g.targetAmount, g.currentAmount, share);
    const td = new Date();
    td.setMonth(td.getMonth() + months);
    return {
      ...g,
      monthlyAmount: share,
      targetDate: td.toISOString().split("T")[0],
    };
  });
}

/** Suggested monthly for a given declared goal and income bracket */
export function suggestedMonthly(
  targetAmount: number,
  months: number,
): number {
  return monthlyFor(targetAmount, months);
}

/** Reorder goals by priority after drag */
export function reorderGoals(goals: SavingsGoal[], fromIndex: number, toIndex: number): SavingsGoal[] {
  const updated = [...goals];
  const [moved] = updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, moved);
  return updated.map((g, i) => ({ ...g, priority: i + 1 }));
}
