import { ExpenseCategory } from "./budgetManager";

export function groupByMonth(
  expenses: { amount: number; date: Date; category?: ExpenseCategory }[]
) {
  const monthlyTotals: Record<string, number> = {};
  expenses.forEach((expense) => {
    const yearMonth = `${expense.date.getFullYear()}-${
      expense.date.getMonth() + 1
    }`;
    monthlyTotals[yearMonth] = (monthlyTotals[yearMonth] || 0) + expense.amount;
  });

  return monthlyTotals;
}

export function objectToString(object: Record<string, number>): string {
  return Object.entries(object)
    .map(([key, value]) => `[${key}]:${value}`)
    .join("\n");
}
