import { BudgetManager, ExpenseCategory } from "./budgetManager";
import { ExporterFactory } from "./exportStrategies";
import {
  AveragePredictionStrategy,
  PredictionStrategy,
} from "./predictionStrategies";
import { CategoryReportStrategy, ReportStrategy } from "./reportStrategies";

// FACADE
export class BudgetFacade {
  private budgetManager = BudgetManager.getInstance();
  private reportStrategy: ReportStrategy = new CategoryReportStrategy();
  private predictionStrategy: PredictionStrategy =
    new AveragePredictionStrategy();

  addIncome(amount: number, date: Date): void {
    this.budgetManager.addIncome(amount, date);
  }

  addExpense(amount: number, date: Date, category: ExpenseCategory): void {
    this.budgetManager.addExpense(amount, date, category);
  }

  getBudget() {
    const monthlyLimit = this.budgetManager.getMonthlyLimit();
    const totalIncome = this.budgetManager.getTotalIncomeThisMonth();
    const totalExpenses = this.budgetManager.getTotalExpensesThisMonth();
    return { monthlyLimit, totalIncome, totalExpenses };
  }

  getIncomes() {
    return this.budgetManager.getIncomes();
  }

  getExpenses() {
    return this.budgetManager.getExpenses();
  }

  setReportStrategy(strategy: ReportStrategy): void {
    this.reportStrategy = strategy;
  }

  generateReport(startDate?: Date, endDate?: Date): string {
    return this.reportStrategy.generateReport(
      this.budgetManager.getIncomes(),
      this.budgetManager.getExpenses(),
      startDate,
      endDate
    );
  }

  setPredictionStrategy(strategy: PredictionStrategy): void {
    this.predictionStrategy = strategy;
  }

  predictExpenses(): number {
    return this.predictionStrategy.predict(this.budgetManager.getExpenses());
  }

  exportData(type: "csv" | "json" | "xml"): string {
    const exporter = ExporterFactory.createExporter(type);
    const expenses = this.budgetManager.getExpenses();
    if (!expenses) {
      alert("Add expenses first!");
      return "";
    }
    return exporter.exportData(expenses);
  }

  setMonthlyLimit(limit: number) {
    this.budgetManager.setMonthlyLimit(limit);
  }
}
