import { BudgetModel } from "./budgetModel";
import { ExporterFactory } from "./exportStrategies";
import {
  AveragePredictionStrategy,
  LastMonthPredictionStrategy,
} from "./predictionStrategies";
import { CategoryReportStrategy, DateReportStrategy } from "./reportStrategies";

export class Facade {
  private budgetManager: BudgetModel;

  constructor(budgetManager: BudgetModel) {
    this.budgetManager = budgetManager;
  }

  generateReport(
    strategy: "category" | "date",
    startDate?: Date,
    endDate?: Date
  ): string {
    const reportStrategy =
      strategy === "category"
        ? new CategoryReportStrategy()
        : new DateReportStrategy();
    return reportStrategy.generateReport(
      this.budgetManager.getIncomes(),
      this.budgetManager.getExpenses(),
      startDate,
      endDate
    );
  }

  predictExpenses(strategy: "average" | "lastMonth"): number {
    const predictionStrategy =
      strategy === "average"
        ? new AveragePredictionStrategy()
        : new LastMonthPredictionStrategy();
    return predictionStrategy.predict(
      this.budgetManager.getExpenses()
    );
  }

  exportData(format: "csv" | "json" | "xml"): string {
    const exporter = ExporterFactory.createExporter(format);
    return exporter.exportData(
      this.budgetManager.getIncomes(),
      this.budgetManager.getExpenses()
    );
  }
}
