export interface Exporter {
  exportData(data: any): string;
}

export class CSVExporter implements Exporter {
  exportData(data: any): string {
    return (
      Object.keys(data[0]).join(",") +
      "\n" +
      data.map((row: any) => Object.values(row).join(",")).join("\n")
    );
  }
}
export class JSONExporter implements Exporter {
  exportData(data: any): string {
    return JSON.stringify(data, null, 2);
  }
}
export class XMLExporter implements Exporter {
  exportData(data: any): string {
    const rows = data
      .map(
        (row: any) =>
          `<row>${Object.entries(row)
            .map(([key, value]) => `<${key}>${value}</${key}>`)
            .join("")}</row>`
      )
      .join("");
    return `<data>${rows}</data>`;
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
