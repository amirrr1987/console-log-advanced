/** Injected by `console-log-advanced/vite` plugin — do not set manually. */
declare const __CONSOLE_LOG_ADVANCED_DEV__: boolean | undefined
/** Injected by `console-log-advanced/vite` plugin — do not set manually. */
declare const __CONSOLE_LOG_ADVANCED_WARN__: boolean | undefined
/** JSON logger options injected by the Vite plugin from vite.config.js */
declare const __CONSOLE_LOG_ADVANCED_OPTIONS__: string | undefined

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export type TimestampFormat = 'locale' | 'iso' | 'time-only' | 'date-only'

export interface CssStyles {
  header?: string
  label?: string
  value?: string
  debug?: string
  info?: string
  warn?: string
  error?: string
}

export interface LogOptions {
  /** Log level for this call (overrides default filter) */
  level?: LogLevel
  /** Extra note shown at the end of the group */
  comment?: string
  /** Collapse the console group */
  collapsed?: boolean
  /** Skip this log when false */
  enabled?: boolean
  /** Override caller file path */
  path?: string
  /** Override caller line number */
  line?: number | string
  /** Override caller function name */
  function?: string
  /** Show timestamp for this call */
  time?: boolean
}

export interface LoggerOptions {
  /** Enable logging (auto-detected when omitted) */
  dev?: boolean
  /** One-time warning when logging in production */
  warnInProduction?: boolean
  /** Minimum level to print */
  logLevel?: LogLevel
  /** Default collapsed state for groups */
  collapsed?: boolean
  /** Show caller file path */
  showPath?: boolean
  /** Show caller line number */
  showLine?: boolean
  /** Show caller function name */
  showFunction?: boolean
  /** Show value type label */
  showType?: boolean
  /** Show timestamp by default */
  time?: boolean
  /** Timestamp preset (custom functions only via createLogger in app code) */
  timestampFormat?: TimestampFormat | ((date: Date) => string)
  /** Console CSS styles (%c) */
  cssStyles?: CssStyles
}

export interface LogFn {
  (label: string, value?: unknown, options?: LogOptions): void
  debug: (label: string, value?: unknown, options?: LogOptions) => void
  info: (label: string, value?: unknown, options?: LogOptions) => void
  warn: (label: string, value?: unknown, options?: LogOptions) => void
  error: (label: string, value?: unknown, options?: LogOptions) => void
  table: (label: string, data: unknown, options?: LogOptions) => void
  readonly dev: boolean
  readonly level: LogLevel
}

export function createLogger(options?: LoggerOptions): LogFn
export function detectDev(): boolean
export function detectWarnInProduction(): boolean
export function attachToConsole(logger?: LogFn): LogFn
export function resolveLoggerOptions(overrides?: LoggerOptions): Required<
  Omit<LoggerOptions, 'timestampFormat'> & { timestampFormat: TimestampFormat | ((date: Date) => string) }
> & { dev: boolean; cssStyles: Required<CssStyles> }
export function shouldLog(level: LogLevel, minLevel?: LogLevel): boolean

declare global {
  interface Console {
    logger: LogFn
  }
}

declare const log: LogFn
export default log
