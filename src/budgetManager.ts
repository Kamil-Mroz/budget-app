export type ExpenseCategory =
  | "Food"
  | "Transport"
  | "Entertainment"
  | "Bills"
  | "Other";

// SINGLETON

export class BudgetManager {
  private static instance: BudgetManager;
  private incomes: { amount: number; date: Date }[] = [];
  private expenses: {
    amount: number;
    date: Date;
    category: ExpenseCategory;
  }[] = [];
  private monthlyLimit: number = 0;

  private constructor() {}

  public static getInstance(): BudgetManager {
    if (!BudgetManager.instance) {
      BudgetManager.instance = new BudgetManager();
    }
    return BudgetManager.instance;
  }

  addIncome(amount: number, date: Date): void {
    this.incomes.push({ amount, date });
  }

  addExpense(amount: number, date: Date, category: ExpenseCategory): void {
    this.expenses.push({ amount, date, category });
  }

  getIncomes(): { amount: number; date: Date }[] {
    return this.incomes;
  }

  getExpenses(): { amount: number; date: Date; category: ExpenseCategory }[] {
    return this.expenses;
  }

  setMonthlyLimit(limit: number): void {
    this.monthlyLimit = limit;
  }

  getMonthlyLimit(): number {
    return this.monthlyLimit;
  }

  getTotalExpensesThisMonth(): number {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return this.expenses
      .filter(
        (expense) =>
          expense.date.getFullYear() === currentYear &&
          expense.date.getMonth() === currentMonth
      )
      .reduce((total, expense) => total + expense.amount, 0);
  }
}
