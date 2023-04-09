declare class Logger {
  private _isDevelopMode: boolean;
  private _count: number;
  constructor(options: { isDevelopMode: boolean });
  message(options: { name: string, value: any }): void;
  private #_runDevelop(name: string, value: any): void;
  private #_runProduct(): void;
}

export = Logger;