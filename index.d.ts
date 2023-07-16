declare class ConsoleLogAdvanced {
  private readonly #_isDevelopMode: boolean;
  private readonly #_count: number;
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
    collapsed?: boolean
  }): void;
}
export default ConsoleLogAdvanced;