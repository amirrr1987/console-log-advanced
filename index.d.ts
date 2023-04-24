declare class ConsoleLogAdvanced {
  private readonly #isDevelopMode: boolean;
  private readonly #count: number;
  constructor(options: { isDevelopMode: boolean });
  logger(data: { name?: string, value: any, path?: string, line?: string, commit?: string,debugger?: boolean, isActive?: boolean }): void;
}
export default ConsoleLogAdvanced;
