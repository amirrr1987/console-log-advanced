declare class ConsoleLogAdvanced {
  private readonly #isDevelopMode: boolean;
  private readonly #count: number;
  constructor({ isDevelopMode }: { isDevelopMode: boolean });
  logger(data: {
    name: string,
    value: unknown,
    path?: string,
    line?: string,
    comment?: string,
    date?: string,
    time?: string,
    isActive?: boolean
  }): void;
}
export default ConsoleLogAdvanced;