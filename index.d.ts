declare class ConsoleLogAdvanced {
  private readonly #isDevelopMode: boolean;
  private readonly #count: number;
  constructor(options: { isDevelopMode: boolean });
  logger(data: { name?: string, value: any, file?: string, line?: string, comment?: string, isActive?: boolean }): void;
}
export default ConsoleLogAdvanced;
