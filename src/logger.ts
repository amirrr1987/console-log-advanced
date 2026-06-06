import type { LogLevel, LoggerOptions, LogFn, LogCallOptions } from './types.js'
import { resolveOptions, shouldLog } from './config.js'
import { getCaller } from './caller.js'
import { typeOf, formatTimestamp, printMeta, printValue } from './format.js'

// ─── Production warning (fires at most once per page load) ───────────────────

const warnProductionOnce = (() => {
  let fired = false
  return () => {
    if (fired) return
    fired = true
    console.log(
      '%c better-console %c disabled in production ',
      'background:#dc2626;color:#fff;font-size:11px;padding:3px 6px;border-radius:4px 0 0 4px;font-weight:700',
      'background:#1e293b;color:#94a3b8;font-size:11px;padding:3px 8px;border-radius:0 4px 4px 0',
    )
  }
})()

// ─── Default badges per level ─────────────────────────────────────────────────

const DEFAULT_BADGES: Record<LogLevel, string> = {
  debug: 'DEBUG',
  info:  'INFO',
  warn:  'WARN',
  error: 'ERROR',
  silent: '',
}

// ─── createLogger ────────────────────────────────────────────────────────────

export function createLogger(userOptions: LoggerOptions = {}): LogFn {
  const opts = resolveOptions(userOptions)

  const {
    dev,
    warnInProduction,
    logLevel,
    collapsed: defaultCollapsed,
    showPath,
    showLine,
    showFn,
    showType,
    timestamp: defaultTimestamp,
    timestampFormat,
    theme,
    badge: badgeMap,
  } = opts

  // ── Core dispatcher ────────────────────────────────────────────────────────

  function logAtLevel(
    level: LogLevel,
    label: string,
    value: unknown,
    callOpts: LogCallOptions = {},
  ): void {
    // 1. Production guard
    if (!dev) {
      if (warnInProduction) warnProductionOnce()
      return
    }

    // 2. Level filter
    const effectiveLevel = callOpts.level ?? level
    if (!shouldLog(effectiveLevel, logLevel)) return

    // 3. enabled flag
    if (callOpts.enabled === false) return

    // 4. Resolve per-call options
    const {
      comment,
      collapsed = defaultCollapsed,
      path: overridePath,
      line: overrideLine,
      fn: overrideFn,
      timestamp: showTimestamp = defaultTimestamp,
    } = callOpts

    // 5. Caller detection
    let caller = getCaller()
    if (overridePath != null) caller = { ...caller, path: overridePath }
    if (overrideLine != null) caller = { ...caller, line: String(overrideLine) }
    if (overrideFn != null)   caller = { ...caller, fn: overrideFn }

    // 6. Badge label
    const badgeText =
      badgeMap === false
        ? label
        : `${(badgeMap && badgeMap[effectiveLevel]) ?? DEFAULT_BADGES[effectiveLevel]} · ${label}`

    const badgeStyle = theme[`badge_${effectiveLevel}` as keyof typeof theme] ?? theme.badge_info

    // 7. Open group
    const groupFn = collapsed ? console.groupCollapsed : console.group
    groupFn(`%c ${badgeText} `, badgeStyle)

    // 8. Meta rows
    if (showTimestamp) {
      printMeta('time', formatTimestamp(new Date(), timestampFormat), opts)
    }

    if (showFn && caller.fn) {
      printMeta('function', caller.fn, opts)
    }

    if (showPath && caller.path) {
      printMeta('file', caller.path, opts)
    }

    if (showLine && caller.line) {
      printMeta('line', caller.line, opts)
    }

    if (showType && value !== undefined) {
      printMeta('type', typeOf(value), opts)
    }

    // 9. The value
    printValue(value)

    // 10. Optional comment
    if (comment) {
      printMeta('note', comment, opts)
    }

    console.groupEnd()
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  const log = (label: string, value?: unknown, options?: LogCallOptions) =>
    logAtLevel('info', label, value, options)

  log.debug = (label: string, value?: unknown, options?: LogCallOptions) =>
    logAtLevel('debug', label, value, options)

  log.info = (label: string, value?: unknown, options?: LogCallOptions) =>
    logAtLevel('info', label, value, options)

  log.warn = (label: string, value?: unknown, options?: LogCallOptions) =>
    logAtLevel('warn', label, value, options)

  log.error = (label: string, value?: unknown, options?: LogCallOptions) =>
    logAtLevel('error', label, value, options)

  log.table = (label: string, data: unknown, options: LogCallOptions = {}) =>
    logAtLevel('info', label, data, { ...options, collapsed: false })

  Object.defineProperty(log, 'dev',   { get: () => dev,      enumerable: true })
  Object.defineProperty(log, 'level', { get: () => logLevel, enumerable: true })

  return log as LogFn
}
