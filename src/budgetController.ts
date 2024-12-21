import { BudgetModel } from "./budgetModel";
import { BudgetView } from "./budgetView";
import { Facade } from "./facade";

export class BudgetController {
  private model: BudgetModel;
  private facade: Facade;
  private view: BudgetView;
  private eventListeners = [
    { id: "addIncomeButton", action: () => this.addIncome() },
    { id: "setLimitButton", action: () => this.setMonthlyLimit() },
    { id: "addExpenseButton", action: () => this.addExpense() },
    { id: "generateReportButton", action: () => this.generateReport() },
    { id: "predictionButton", action: () => this.predictExpenses() },
    { id: "exportButton", action: () => this.exportData() },
    { id: "col", action: (event: Event) => this.deleteItem(event) },
  ];

  constructor(model: BudgetModel, view: BudgetView) {
    this.model = model;
    this.view = view;
    this.facade = new Facade(model);
    this.initEventListeners();
    this.updateView();
  }

  private initEventListeners(): void {
    this.eventListeners.forEach((listener) => {
      document
        .getElementById(listener.id)!
        .addEventListener("click", listener.action);
    });
  }

  private addIncome(): void {
    const amountEl = document.getElementById(
      "incomeAmount"
    ) as HTMLInputElement;
    const dateEl = document.getElementById("incomeDate") as HTMLInputElement;

    const amount = parseFloat(amountEl.value);
    const date = new Date(dateEl.value);

    if (!amount || amount <= 0 || isNaN(date.getTime())) {
      this.view.showAlert("Must provide a valid amount or date");
      return;
    }

    this.model.addIncome(amount, date);
    this.view.showAlert("Added Income");
    this.updateView();
    amountEl.value = "";
    dateEl.value = "";
  }

  private addExpense(): void {
    const amountEl = document.getElementById(
      "expenseAmount"
    ) as HTMLInputElement;
    const dateEl = document.getElementById("expenseDate") as HTMLInputElement;
    const categoryEl = document.getElementById(
      "expenseCategory"
    ) as HTMLInputElement;

    const amount = parseFloat(amountEl.value);
    const date = new Date(dateEl.value);
    const category = categoryEl.value;

    if (!amount || amount <= 0 || isNaN(date.getTime()) || !category) {
      this.view.showAlert("Must provide a valid amount, date, or category");
      return;
    }

    this.model.addExpense(amount, category, date);
    this.updateView();
    amountEl.value = "";
    dateEl.value = "";
    categoryEl.value = "";
  }
  private setMonthlyLimit(): void {
    const limitEl = document.getElementById("monthlyLimit") as HTMLInputElement;
    const limit = parseFloat(limitEl.value);

    if (!limit || limit <= 0) {
      this.view.showAlert("Must provide a valid limit.");
      return;
    }

    this.model.setMonthlyLimit(limit);
    this.view.showAlert(`Monthly limit set to: ${limit}`);
    this.updateView();
    limitEl.value = "";
  }

  private generateReport(): void {
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    const startDateEl = document.getElementById(
      "startDate"
    ) as HTMLInputElement;
    const endDateEl = document.getElementById("endDate") as HTMLInputElement;
    const reportTypeEl = document.getElementById(
      "reportType"
    ) as HTMLInputElement;

    startDate = new Date(startDateEl.value);
    endDate = new Date(endDateEl.value);
    if (isNaN(startDate.getTime())) {
      startDate = undefined;
    }

    if (isNaN(endDate.getTime())) {
      endDate = undefined;
    }

    const reportType = reportTypeEl.value as "category" | "date";

    const report = this.facade.generateReport(reportType);

    this.view.renderReport(report);

    startDateEl.value = "";
    endDateEl.value = "";
  }

  private predictExpenses(): void {
    const predictStrategyEl = document.getElementById(
      "predictStrategy"
    ) as HTMLInputElement;
    const strategy = predictStrategyEl.value as "average" | "lastMonth";

    const prediction = this.facade.predictExpenses(strategy);

    this.view.renderPrediction(prediction);
  }

  private exportData(): void {
    const exportTypeEl = document.getElementById(
      "exportType"
    ) as HTMLInputElement;
    const exportType = exportTypeEl.value as "csv" | "json" | "xml";

    const exportedData = this.facade.exportData(exportType);
    this.view.renderExportedData(exportedData);
  }

  private updateView(): void {
    this.view.updateMonthlySummary(
      this.model.getMonthlyLimit(),
      this.model.getTotalIncomeCurrentMonth(),
      this.model.getTotalExpenseCurrentMonth()
    );
    this.view.renderIncomes(this.model.getIncomes());
    this.view.renderExpenses(this.model.getExpenses());
  }

  private deleteItem(event: Event): void {
    // @ts-ignore
    let incomeIndex = event.target!.dataset.incomeId;
    // @ts-ignore
    let expenseIndex = event.target!.dataset.expenseId;

    if (!incomeIndex && !expenseIndex) {
      return;
    }

    if (incomeIndex) {
      this.model.removeIncome(incomeIndex);
    }
    if (expenseIndex) {
      this.model.removeExpense(expenseIndex);
    }

    this.updateView();
  }
}
