// ─── Log Levels ──────────────────────────────────────────────────────────────

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent'

export const LOG_LEVEL_RANK: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 99,
}

// ─── Timestamp ───────────────────────────────────────────────────────────────

export type TimestampFormat =
  | 'locale'
  | 'iso'
  | 'time-only'
  | 'date-only'
  | 'relative'
  | ((date: Date) => string)

// ─── CSS Styles ──────────────────────────────────────────────────────────────

export interface ThemeStyles {
  badge_debug?: string
  badge_info?: string
  badge_warn?: string
  badge_error?: string
  label?: string
  value?: string
  meta?: string
  divider?: string
}

// ─── Per-call Options ────────────────────────────────────────────────────────

export interface LogCallOptions {
  /** Override the effective log level for this call */
  level?: LogLevel
  /** Short note appended at the end of the group */
  comment?: string
  /** Force collapsed / expanded (overrides global default) */
  collapsed?: boolean
  /** When false, this call is skipped entirely — handy for feature flags */
  enabled?: boolean
  /** Override auto-detected caller path */
  path?: string
  /** Override auto-detected caller line */
  line?: string | number
  /** Override auto-detected caller function name */
  fn?: string
  /** Show timestamp for this call (overrides global default) */
  timestamp?: boolean
}

// ─── Logger Options ──────────────────────────────────────────────────────────

export interface LoggerOptions {
  /** Explicitly set dev mode (auto-detected when omitted) */
  dev?: boolean
  /** Show a one-time warning banner when called in production */
  warnInProduction?: boolean
  /** Minimum log level to print. Calls below this are no-ops. */
  logLevel?: LogLevel
  /** Whether console groups are collapsed by default */
  collapsed?: boolean
  /** Show caller file path */
  showPath?: boolean
  /** Show caller line number */
  showLine?: boolean
  /** Show caller function name */
  showFn?: boolean
  /** Show the JS type of the logged value */
  showType?: boolean
  /** Show a timestamp on every log */
  timestamp?: boolean
  /** Format for timestamps */
  timestampFormat?: TimestampFormat
  /** Customise %c badge/label/value colours */
  theme?: ThemeStyles
  /**
   * Badge prefix shown in the group header.
   * Defaults to the log level name in uppercase.
   * Pass an object to customise per level.
   */
  badge?: Partial<Record<LogLevel, string>> | false
}

// ─── Logger Function ─────────────────────────────────────────────────────────

export interface LogFn {
  (label: string, value?: unknown, options?: LogCallOptions): void
  debug: (label: string, value?: unknown, options?: LogCallOptions) => void
  info:  (label: string, value?: unknown, options?: LogCallOptions) => void
  warn:  (label: string, value?: unknown, options?: LogCallOptions) => void
  error: (label: string, value?: unknown, options?: LogCallOptions) => void
  /** Always prints as a table (non-collapsed) */
  table: (label: string, data: unknown, options?: LogCallOptions) => void
  /** True when in dev mode */
  readonly dev: boolean
  /** Current minimum log level */
  readonly level: LogLevel
}

// ─── Plugin Options ──────────────────────────────────────────────────────────

export interface BetterConsoleOptions extends LoggerOptions {
  /**
   * Auto-inject the runtime into Rollup/Vite entry files.
   * Set to false to import the runtime manually.
   * @default true
   */
  inject?: boolean
  /**
   * Additional entry paths/globs to inject into (supports * and **).
   * e.g. `['src/main.ts', 'src/bootstrap.ts']`
   */
  injectEntries?: string[]
  /**
   * A glob string or RegExp. Any matching module also gets the injection.
   * e.g. `'**\/setup.{ts,js}'`
   */
  injectPattern?: string | RegExp
}
