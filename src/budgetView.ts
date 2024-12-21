import { ExpenseType, IncomeType } from "./budgetModel";
import { formatCurrency } from "./utils";

export class BudgetView {
  private monthlyLimitData = document.getElementById("monthlyLimitData")!;
  private totalIncomeData = document.getElementById("totalIncomeData")!;
  private totalExpensesData = document.getElementById("totalExpensesData")!;
  private incomeList = document.getElementById("incomeList")!;
  private expenseList = document.getElementById("expenseList")!;
  private reportOutput = document.getElementById("reportOutput")!;
  private predictionOutput = document.getElementById("predictionOutput")!;
  private exportOutput = document.getElementById("exportOutput")!;

  updateMonthlySummary(
    monthlyLimit: number,
    totalIncome: number,
    totalExpenses: number
  ): void {
    this.monthlyLimitData.innerText = formatCurrency(monthlyLimit);
    this.totalIncomeData.innerText = formatCurrency(totalIncome);
    this.totalExpensesData.innerText = formatCurrency(totalExpenses);
  }

  renderIncomes(incomes: IncomeType[]): void {
    this.incomeList.innerHTML = "";
    incomes.forEach((income) => {
      const li = document.createElement("li");
      li.textContent = `Amount: ${formatCurrency(
        income.amount
      )}, Date: ${income.date.toLocaleDateString()}`;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.setAttribute(`data-income-id`, `${income.id}`);

      li.appendChild(deleteButton);

      this.incomeList.appendChild(li);
    });
  }

  renderExpenses(expenses: ExpenseType[]): void {
    this.expenseList.innerHTML = "";
    expenses.forEach((expense) => {
      const li = document.createElement("li");
      li.textContent = `Amount: ${formatCurrency(
        expense.amount
      )}, Date: ${expense.date.toLocaleDateString()}, Category: ${
        expense.category
      }`;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.setAttribute(`data-expense-id`, `${expense.id}`);

      li.appendChild(deleteButton);

      this.expenseList.appendChild(li);
    });
  }

  renderReport(report: string): void {
    this.reportOutput.innerText = report;
  }

  renderPrediction(prediction: number): void {
    this.predictionOutput.innerText =
      `Predicted expenses for next month: ` + formatCurrency(prediction);
  }

  renderExportedData(data: string): void {
    this.exportOutput.innerText = data;
  }

  showAlert(message: string): void {
    alert(message);
  }
}
