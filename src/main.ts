import { ExpenseCategory } from "./budgetManager";
import { BudgetFacade } from "./facade";

import { CategoryReportStrategy, DateReportStrategy } from "./reportStrategies";

const addIncomeButton = document.getElementById("addIncomeButton");
const setLimitButton = document.getElementById("setLimitButton");
const addExpenseButton = document.getElementById("addExpenseButton");
const generateReportButton = document.getElementById("generateReportButton");
const predictionButton = document.getElementById("predictionButton");
const exportButton = document.getElementById("exportButton");

addIncomeButton?.addEventListener("click", addIncome);
setLimitButton?.addEventListener("click", setMonthlyLimit);
addExpenseButton?.addEventListener("click", addExpense);
generateReportButton?.addEventListener("click", generateReport);
predictionButton?.addEventListener("click", predictExpenses);
exportButton?.addEventListener("click", exportData);

const budgetFacade = new BudgetFacade();
const categoryReport = new CategoryReportStrategy();
const monthlyReport = new DateReportStrategy();

// Add Income
function addIncome() {
  const amountEl = document.getElementById("incomeAmount") as HTMLInputElement;
  const dateEl = document.getElementById("incomeDate") as HTMLInputElement;

  const amount = parseFloat(amountEl.value);
  const date = new Date(dateEl.value);

  if (!amount || amount <= 0 || !date) {
    alert("Must provide a valid amount or date");
    return;
  }

  budgetFacade.addIncome(amount, date);
  alert("Added Income");
  amountEl.value = "";
  dateEl.value = "";
}

// Add Expense
function addExpense() {
  const amountEl = document.getElementById("expenseAmount") as HTMLInputElement;
  const dateEl = document.getElementById("expenseDate") as HTMLInputElement;

  const amount = parseFloat(amountEl.value);
  const date = new Date(dateEl.value);

  const categoryEl = document.getElementById(
    "expenseCategory"
  ) as HTMLInputElement;
  const category = categoryEl.value;

  if (!amount || amount <= 0 || !date || !category) {
    alert("Must provide a valid amount or date or category");
    return;
  }
  budgetFacade.addExpense(amount, date, category as ExpenseCategory);
  amountEl.value = "";
  dateEl.value = "";
  categoryEl.value = "";
}

// Set Monthly Limit
function setMonthlyLimit() {
  const limitEl = document.getElementById("monthlyLimit") as HTMLInputElement;
  const limit = parseFloat(limitEl.value);

  if (!limit || limit <= 0) {
    alert("Must provide a valid ");
    return;
  }
  budgetFacade.setMonthlyLimit(limit);
  alert(`Monthly limit set to: ${limit}`);
  limitEl.value = "";
}

// Generate Report
function generateReport() {
  const startDateEl = document.getElementById("startDate") as HTMLInputElement;
  const endDateEl = document.getElementById("endDate") as HTMLInputElement;
  const startDate = new Date(startDateEl.value);
  const endDate = new Date(endDateEl.value);

  const reportType = (document.getElementById("reportType") as HTMLInputElement)
    .value;

  if (reportType === "category") {
    budgetFacade.setReportStrategy(categoryReport);
  } else if (reportType === "monthly") {
    budgetFacade.setReportStrategy(monthlyReport);
  }

  alert("Generated report");

  const report = budgetFacade.generateReport(startDate, endDate);
  document.getElementById("reportOutput")!.innerText = report;

  startDateEl.value = "";
  endDateEl.value = "";
}

// Predict Expenses
function predictExpenses() {
  const prediction = budgetFacade.predictExpenses();
  document.getElementById(
    "predictionOutput"
  )!.innerText = `Predicted expenses for next month: ${prediction}`;
}

// Export Data
function exportData() {
  const exportType = (document.getElementById("exportType") as HTMLInputElement)
    ?.value as "csv" | "json" | "xml";
  const exportedData = budgetFacade.exportData(exportType);
  document.getElementById("exportOutput")!.innerText = exportedData;
}
