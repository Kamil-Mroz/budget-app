export type IncomeType = {
  id: string;
  amount: number;
  date: Date;
};
export type ExpenseType = {
  id: string;
  amount: number;
  category: string;
  date: Date;
};

export class IDGenerator {
  private static instance: IDGenerator;
  private currentId: number = 0;

  private constructor() {}

  public static getInstance(): IDGenerator {
    if (!IDGenerator.instance) {
      IDGenerator.instance = new IDGenerator();
    }
    return IDGenerator.instance;
  }

  public generateId(): string {
    this.currentId += 1;
    return `ID-${this.currentId}`;
  }
}

export class Incomes {
  private data: IncomeType[] = [];
  private idGenerator: IDGenerator;

  constructor() {
    this.idGenerator = IDGenerator.getInstance();
  }

  addIncome(amount: number, date: Date) {
    const id = this.idGenerator.generateId();
    this.data.push({ id, amount, date });
  }

  removeIncome(id: string) {
    this.data = this.data.filter((income) => income.id !== id);
  }

  getIncomes(): IncomeType[] {
    return this.data;
  }
  getTotalIncomeCurrentMonth(): number {
    return this.data.reduce((total, income) => {
      if (
        income.date.getFullYear() === new Date().getFullYear() &&
        income.date.getMonth() === new Date().getMonth()
      ) {
        return total + income.amount;
      } else {
        return total;
      }
    }, 0);
  }

  clear() {
    this.data = [];
  }
}

export class Expenses {
  private data: ExpenseType[] = [];
  private idGenerator: IDGenerator;

  constructor() {
    this.idGenerator = IDGenerator.getInstance();
  }

  addExpense(amount: number, category: string, date: Date) {
    const id = this.idGenerator.generateId();
    this.data.push({ id, amount, category, date });
  }

  removeExpense(id: string) {
    this.data = this.data.filter((expense) => expense.id !== id);
  }
  getExpenses(): ExpenseType[] {
    return this.data;
  }

  getTotalExpenseCurrentMonth(): number {
    return this.data.reduce((total, expense) => {
      if (
        expense.date.getFullYear() === new Date().getFullYear() &&
        expense.date.getMonth() === new Date().getMonth()
      ) {
        return total + expense.amount;
      } else {
        return total;
      }
    }, 0);
  }

  clear() {
    this.data = [];
  }
}

export class MonthlyLimit {
  private limit: number = 0;

  constructor() {}

  setLimit(amount: number) {
    this.limit = amount;
  }

  getMonthlyLimit(): number {
    return this.limit;
  }
}

export class BudgetModel {
  private incomes: Incomes = new Incomes();
  private expenses: Expenses = new Expenses();
  private monthlyLimit: MonthlyLimit = new MonthlyLimit();
  private readonly userId: string;

  constructor(userId: string) {
    this.userId = userId;
    this.loadFromStorage();
  }

  addIncome(amount: number, date: Date) {
    this.incomes.addIncome(amount, date);
    this.saveToStorage();
  }

  getIncomes(): IncomeType[] {
    return this.incomes.getIncomes();
  }

  getTotalIncomeCurrentMonth(): number {
    return this.incomes.getTotalIncomeCurrentMonth();
  }

  removeIncome(id: string) {
    this.incomes.removeIncome(id);
    this.saveToStorage();
  }

  addExpense(amount: number, category: string, date: Date) {
    this.expenses.addExpense(amount, category, date);
    this.saveToStorage();
  }

  getExpenses(): ExpenseType[] {
    return this.expenses.getExpenses();
  }
  getTotalExpenseCurrentMonth(): number {
    return this.expenses.getTotalExpenseCurrentMonth();
  }

  removeExpense(id: string) {
    this.expenses.removeExpense(id);
    this.saveToStorage();
  }

  setMonthlyLimit(amount: number) {
    this.monthlyLimit.setLimit(amount);
    this.saveToStorage();
  }

  getMonthlyLimit(): number {
    return this.monthlyLimit.getMonthlyLimit();
  }

  private saveToStorage(): void {
    const incomesData = { incomes: this.incomes.getIncomes() };
    const expensesData = { expenses: this.expenses.getExpenses() };
    const monthlyLimitData = {
      monthlyLimit: this.monthlyLimit.getMonthlyLimit(),
    };

    localStorage.setItem(
      `budgetData_incomes_${this.userId}`,
      JSON.stringify(incomesData)
    );
    localStorage.setItem(
      `budgetData_expenses_${this.userId}`,
      JSON.stringify(expensesData)
    );
    localStorage.setItem(
      `budgetData_monthlyLimit_${this.userId}`,
      JSON.stringify(monthlyLimitData)
    );
  }

  private loadFromStorage(): void {
    const incomesData = localStorage.getItem(
      `budgetData_incomes_${this.userId}`
    );
    const expensesData = localStorage.getItem(
      `budgetData_expenses_${this.userId}`
    );
    const monthlyLimitData = localStorage.getItem(
      `budgetData_monthlyLimit_${this.userId}`
    );

    if (incomesData) {
      const parsedIncomes = JSON.parse(incomesData);
      parsedIncomes.incomes.forEach((income: any) => {
        const amount = parseFloat(income.amount);
        const date = new Date(income.date);
        this.incomes.addIncome(amount, date);
      });
    }

    if (expensesData) {
      const parsedExpenses = JSON.parse(expensesData);
      parsedExpenses.expenses.forEach((expense: any) => {
        const amount = parseFloat(expense.amount);
        const category = expense.category;
        const date = new Date(expense.date);
        this.expenses.addExpense(amount, category, date);
      });
    }

    if (monthlyLimitData) {
      const parsedLimit = JSON.parse(monthlyLimitData);
      this.monthlyLimit.setLimit(parseFloat(parsedLimit.monthlyLimit) || 0);
    }
  }
}
