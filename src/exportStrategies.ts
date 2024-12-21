import { ExpenseType, IncomeType } from "./budgetModel";

export interface Exporter {
  exportData(incomes: IncomeType[], expenses: ExpenseType[]): string;
}

export class CSVExporter implements Exporter {
  exportData(incomes: IncomeType[], expenses: ExpenseType[]): string {
    let incomesHeader = "";
    let expensesHeader = "";
    let incomesRows = "";
    let expensesRows = "";

    if (incomes.length > 0) {
      incomesHeader = Object.keys(incomes[0]).join(",") + "\n";

      incomesRows = incomes
        .map(
          (row) =>
            `${row.id},${row.amount},${row.date.toLocaleDateString("PL-pl", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}`
        )
        .join("\n");
    }

    if (expenses.length > 0) {
      expensesHeader = Object.keys(expenses[0]).join(",") + "\n";

      expensesRows = expenses
        .map(
          (row) =>
            `${row.id},${row.amount},${row.date.toLocaleDateString("PL-pl", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })},${row.category}`
        )
        .join("\n");
    }

    return incomesHeader + incomesRows + "\n\n" + expensesHeader + expensesRows;
  }
}
export class JSONExporter implements Exporter {
  exportData(incomes: IncomeType[], expenses: ExpenseType[]): string {
    const data = { incomes, expenses };

    return JSON.stringify(data, null, 2);
  }
}

export class XMLExporter implements Exporter {
  exportData(incomes: IncomeType[], expenses: ExpenseType[]): string {
    const incomeRows = incomes
      .map(
        (row) =>
          `<row>${Object.entries(row)
            .map(
              ([key, value]) =>
                `<${key}>${
                  value instanceof Date
                    ? value.toLocaleDateString("PL-pl", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : value
                }</${key}>`
            )
            .join("")}</row>\n`
      )
      .join("");

    const expenseRows = expenses
      .map(
        (row) =>
          `<row>${Object.entries(row)
            .map(
              ([key, value]) =>
                `<${key}>${
                  value instanceof Date
                    ? value.toLocaleDateString("PL-pl", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : value
                }</${key}>`
            )
            .join("")}</row>\n`
      )
      .join("");

    return `<data>\n<incomes>\n${incomeRows}</incomes>\n<expenses>\n${expenseRows}</expenses>\n</data>`;
  }
}
// FACTORY
export class ExporterFactory {
  static createExporter(type: "csv" | "json" | "xml"): Exporter {
    switch (type) {
      case "csv":
        return new CSVExporter();
      case "json":
        return new JSONExporter();
      case "xml":
        return new XMLExporter();
      default:
        throw new Error("Invalid export type");
    }
  }
}
