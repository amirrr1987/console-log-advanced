declare class Logger {
  private _isDevelopMode: boolean;
  private _count: number;
  constructor({ isDevelopMode }: { isDevelopMode: boolean });
  message({ name, value }: { name: string; value: unknown }): void;
  private #_runDevelop;
  private #_runProduct;
}

export default Logger;