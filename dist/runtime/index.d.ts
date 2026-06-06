// Injected by `vite-plugin-better-console` — do not set manually.
declare const __BETTER_CONSOLE_DEV__:     boolean | undefined
declare const __BETTER_CONSOLE_WARN__:    boolean | undefined
declare const __BETTER_CONSOLE_OPTIONS__: string  | undefined

export type {
  LogLevel,
  LoggerOptions,
  LogCallOptions,
  LogFn,
  ThemeStyles,
  BetterConsoleOptions,
} from './types.js'

export { LOG_LEVEL_RANK }                       from './types.js'
export { DEFAULT_THEME, DEFAULT_OPTIONS, resolveOptions, shouldLog, detectDev, detectWarnInProduction } from './config.js'
export { getCaller }                            from './caller.js'
export { typeOf, formatTimestamp, printMeta, printValue } from './format.js'
export { createLogger }                         from './logger.js'
export { attachRuntime }                        from './index.js'

declare const _logger: import('./types.js').LogFn
export default _logger

// ── Augment global console ─────────────────────────────────────────────────

declare global {
  interface Console {
    /** Better-console logger (primary) */
    better: import('./types.js').LogFn
    /** Better-console logger (legacy alias) */
    logger: import('./types.js').LogFn
  }
}
