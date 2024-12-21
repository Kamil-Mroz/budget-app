import { BudgetController } from "./budgetController";
import { BudgetModel } from "./budgetModel";
import { BudgetView } from "./budgetView";

document.addEventListener("DOMContentLoaded", () => {
  const model = new BudgetModel("kamil");

  const view = new BudgetView();
  new BudgetController(model, view);
});
