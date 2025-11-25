export interface MultiFunctionDevice
  extends PrintDevice,
    ScanDevice,
    FaxDevice {}

interface PrintDevice {
  print(doc: string): void;
}

interface ScanDevice {
  scan(doc: string): void;
}

interface FaxDevice {
  fax(doc: string): void;
}

export class SimplePrinter implements PrintDevice {
  print(doc: string) {
    console.log('Printing:', doc);
  }
}
