declare class Logger {
  private _isDevelopMode: boolean;
  constructor(options: { isDevelopMode: boolean });
  message(options: { name: string, value: any }): void;
  private #_runDevelop(name: string, value: any): void;
  private #_runProduct(): void;
}

export = Logger;