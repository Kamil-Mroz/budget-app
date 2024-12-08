import { ExpenseCategory } from "./budgetManager";
import { groupByMonth, objectToString } from "./utils";

export interface ReportStrategy {
  generateReport(
    incomes: { amount: number; date: Date }[],
    expenses: { amount: number; date: Date; category: ExpenseCategory }[],
    startDate?: Date,
    endDate?: Date
  ): string;
}

export class CategoryReportStrategy implements ReportStrategy {
  generateReport(
    incomes: { amount: number; date: Date }[],
    expenses: { amount: number; date: Date; category: ExpenseCategory }[],
    startDate?: Date,
    endDate?: Date
  ): string {
    const filteredExpenses = expenses.filter(
      (exp) =>
        (!startDate || exp.date >= startDate) &&
        (!endDate || exp.date <= endDate)
    );

    const categories = filteredExpenses.reduce((summary, exp) => {
      summary[exp.category] = (summary[exp.category] || 0) + exp.amount;
      return summary;
    }, {} as Record<ExpenseCategory, number>);

    const categorySummary = objectToString(categories);

    const filteredIncome = incomes.filter(
      (income) =>
        (!startDate || income.date >= startDate) &&
        (!endDate || income.date <= endDate)
    );
    const incomeSummary = objectToString(groupByMonth(filteredIncome));

    return `Income Report:\n${incomeSummary} \nCategory Report: \n${categorySummary}`;
  }
}
// STRATEGY
export class DateReportStrategy implements ReportStrategy {
  generateReport(
    incomes: { amount: number; date: Date }[],
    expenses: { amount: number; date: Date; category: ExpenseCategory }[],
    startDate?: Date,
    endDate?: Date
  ): string {
    const filteredExpenses = expenses.filter(
      (exp) =>
        (!startDate || exp.date >= startDate) &&
        (!endDate || exp.date <= endDate)
    );

    const summary = objectToString(groupByMonth(filteredExpenses));

    const filteredIncome = incomes.filter(
      (income) =>
        (!startDate || income.date >= startDate) &&
        (!endDate || income.date <= endDate)
    );

    const incomeSummary = objectToString(groupByMonth(filteredIncome));

    return `Income Report:\n${incomeSummary}\n Date Report:\n${summary}`;
  }
}
