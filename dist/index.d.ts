// Runtime entry point — imported by the virtual module injected into app entries.
// This file intentionally runs side-effects so that console.log is patched
// before any app code executes.

export type { LogLevel, LoggerOptions, LogCallOptions, LogFn, ThemeStyles, BetterConsoleOptions } from './types.js'
export { LOG_LEVEL_RANK } from './types.js'
export { DEFAULT_THEME, DEFAULT_OPTIONS, resolveOptions, shouldLog, detectDev, detectWarnInProduction } from './config.js'
export { getCaller }   from './caller.js'
export { typeOf, formatTimestamp, printMeta, printValue } from './format.js'
export { createLogger } from './logger.js'

import { createLogger } from './logger.js'
import { resolveOptions } from './config.js'

/**
 * Attach a logger instance to `console.log` (aliased as `console.better`).
 * Calling this more than once is safe — subsequent calls overwrite the reference.
 */
export function attachRuntime(logger?: ReturnType<typeof createLogger>) {
  const instance = logger ?? createLogger(resolveOptions())

  if (typeof console !== 'undefined') {
    // Primary alias — idiomatic usage
    ;(console as any).log = (console as any).log    // keep original intact
    ;(console as any).better = instance

    // Legacy alias kept for users who prefer the old name
    ;(console as any).logger = instance
  }

  return instance
}

// ── Auto-attach on import ─────────────────────────────────────────────────────
// When the Vite plugin injects `import 'vite-plugin-better-console/runtime'`
// into an entry file this runs exactly once before app code.

const _logger = attachRuntime()
export default _logger
