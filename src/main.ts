import { BudgetController } from "./budgetController";
import { BudgetModel } from "./budgetModel";
import { BudgetView } from "./budgetView";

document.addEventListener("DOMContentLoaded", () => {
  const model = new BudgetModel("test");

  const view = new BudgetView();
  new BudgetController(model, view);
});
