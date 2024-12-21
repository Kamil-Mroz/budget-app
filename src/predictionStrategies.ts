import {groupByMonth, sortByMonth} from "./utils";

export interface PredictionStrategy {
  predict(
    expenses: { amount: number; date: Date; category: string }[]
  ): number;
}

export class AveragePredictionStrategy implements PredictionStrategy {
  predict(
    expenses: { amount: number; date: Date; category: string }[]
  ): number {
    if (expenses.length === 0) return 0;

    const monthlyTotals: Record<string, number> = groupByMonth(expenses);
    const sortedMonths = sortByMonth(monthlyTotals)
    const totalMonths = Object.keys(sortedMonths).length - 1;
    const totalExpenses = Object.entries(monthlyTotals).reduce(
      (sum, [key, monthlyTotal]) =>key !== sortedMonths[totalMonths] ? sum + monthlyTotal:sum,
      0
    );

    return totalExpenses / totalMonths || 0;
  }
}

export class LastMonthPredictionStrategy implements PredictionStrategy {
  predict(
    expenses: { amount: number; date: Date; category: string }[]
  ): number {
    console.log(expenses);
    if (expenses.length === 0) return 0;

    const monthlyTotals: Record<string, number> = groupByMonth(expenses);
    const sortedMonths = sortByMonth(monthlyTotals)
    const lastMonth = sortedMonths[sortedMonths.length - 2];

    return monthlyTotals[lastMonth] ?? 0;
  }
}
