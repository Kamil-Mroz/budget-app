import { ExpenseCategory } from "./budgetManager";
import { groupByMonth } from "./utils";


export interface PredictionStrategy {
  predict(
    expenses: { amount: number; date: Date; category: ExpenseCategory }[]
  ): number;
}

export class AveragePredictionStrategy implements PredictionStrategy {
  predict(
    expenses: { amount: number; date: Date; category: ExpenseCategory }[]
  ): number {
    if (expenses.length === 0) return 0;

    const monthlyTotals: Record<string, number> = groupByMonth(expenses);

    const totalMonths = Object.keys(monthlyTotals).length;
    const totalExpenses = Object.values(monthlyTotals).reduce(
      (sum, monthlyTotal) => sum + monthlyTotal,
      0
    );

    return totalExpenses / totalMonths;
  }
}

export class LastMonthPredictionStrategy implements PredictionStrategy {
  predict(
    expenses: { amount: number; date: Date; category: ExpenseCategory }[]
  ): number {
    if (expenses.length === 0) return 0;

    const monthlyTotals: Record<string, number> = groupByMonth(expenses);

    const sortedMonths = Object.keys(monthlyTotals).sort((a, b) => {
      const [yearA, monthA] = a.split("-").map(Number);
      const [yearB, monthB] = b.split("-").map(Number);

      return yearA === yearB ? monthA - monthB : yearA - yearB;
    });

    const lastMonth = sortedMonths.length - 1;

    return monthlyTotals[lastMonth];
  }
}
