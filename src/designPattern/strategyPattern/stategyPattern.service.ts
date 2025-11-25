interface Report {
  printReport(data: string): void;
}

class PDFReport implements Report {
  printReport(data: string) {
    console.log('Generating PDF for:', data);
  }
}

class CSVReport implements Report {
  printReport(data: string) {
    console.log('Generating CSV with commas for:', data);
  }
}

class ExcelReport implements Report {
  printReport(data: string) {
    console.log('Generating Excel spreadsheet for:', data);
  }
}

class ReportFactory {
  private static report: Record<string, new () => Report> = {
    PDF: PDFReport,
    CSV: CSVReport,
    EXCEL: ExcelReport,
  };

  static getReport(type: string): Report {
    const ReportClass = this.report[type];
    if (!ReportClass) {
      throw new Error('Format not supported');
    }
    return new ReportClass();
  }
}

export class ReportService {
  exportReport(type: string) {
    const report = ReportFactory.getReport(type);
    report.printReport('Annual Financial Data');
  }
}
