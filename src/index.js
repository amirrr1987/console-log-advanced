export { LOG_LEVELS, DEFAULT_CSS_STYLES, DEFAULT_LOGGER_OPTIONS, resolveLoggerOptions, shouldLog } from './config.js'
export { detectDev, detectWarnInProduction } from './env.js'
export { getCaller } from './caller.js'
export { typeOf, formatTimestamp } from './format.js'
export { createLogger } from './logger.js'
import { createLogger } from './logger.js'
import { resolveLoggerOptions } from './config.js'

/** Attach logger to `console.logger` using plugin/runtime options from vite.config. */
export function attachToConsole(logger) {
  const instance = logger ?? createLogger(resolveLoggerOptions())

  if (typeof console !== 'undefined') {
    console.logger = instance
  }

  return instance
}

const log = attachToConsole()
export default log
