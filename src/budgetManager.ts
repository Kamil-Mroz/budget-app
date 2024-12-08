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

  private constructor() {
    this.loadFromStorage();
  }

  private saveToStorage(): void {
    const data = {
      incomes: this.incomes,
      expenses: this.expenses,
      monthlyLimit: this.monthlyLimit,
    };
    localStorage.setItem("budgetData", JSON.stringify(data));
  }

  public static getInstance(): BudgetManager {
    if (!BudgetManager.instance) {
      BudgetManager.instance = new BudgetManager();
    }
    return BudgetManager.instance;
  }

  addIncome(amount: number, date: Date): void {
    this.incomes.push({ amount, date });
    this.saveToStorage();
  }

  addExpense(amount: number, date: Date, category: ExpenseCategory): void {
    this.expenses.push({ amount, date, category });
    this.saveToStorage();
  }

  getIncomes(): { amount: number; date: Date }[] {
    return this.incomes;
  }

  getExpenses(): { amount: number; date: Date; category: ExpenseCategory }[] {
    return this.expenses;
  }

  setMonthlyLimit(limit: number): void {
    this.monthlyLimit = limit;
    this.saveToStorage();
  }

  private loadFromStorage(): void {
    const data = localStorage.getItem("budgetData");
    if (data) {
      const parsedData = JSON.parse(data);
      this.incomes = parsedData.incomes.map((income: any) => ({
        amount: parseFloat(income.amount),
        date: new Date(income.date),
      }));
      this.expenses = parsedData.expenses.map((expense: any) => ({
        ...expense,
        amount: parseFloat(expense.amount),
        date: new Date(expense.date),
      }));
      this.monthlyLimit = parseFloat(parsedData.monthlyLimit) || 0;
    }
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
  getTotalIncomeThisMonth(): number {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return this.incomes
      .filter(
        (income) =>
          income.date.getFullYear() === currentYear &&
          income.date.getMonth() === currentMonth
      )
      .reduce((total, income) => total + income.amount, 0);
  }
}
