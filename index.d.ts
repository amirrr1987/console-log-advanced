declare class Logger {
  private readonly #isDevelopMode: boolean;
  private readonly #count: number;
  constructor(options: { isDevelopMode: boolean });
  message(data: { name?: string, value: any, path?: string, line?: string, comment?: string }): void;
}
export default Logger;
