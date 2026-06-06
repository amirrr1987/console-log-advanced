import { resolveLoggerOptions, shouldLog } from './config.js'
import { getCaller } from './caller.js'
import { formatTimestamp, printField, printValue, typeOf } from './format.js'

const warnProductionOnce = (() => {
  let shown = false
  return () => {
    if (shown) return
    shown = true
    console.log(
      '%cLogs disabled in production',
      'background:#ef4444;color:#fff;font-size:13px;padding:6px 10px;border-radius:6px',
    )
  }
})()

export function createLogger(userOptions = {}) {
  const options = resolveLoggerOptions(userOptions)
  const {
    dev,
    warnInProduction,
    logLevel,
    collapsed: defaultCollapsed,
    showPath,
    showLine,
    showFunction,
    showType,
    time: defaultTime,
    timestampFormat,
    cssStyles,
  } = options

  const logAtLevel = (level, label, value, logOptions = {}) => {
    if (!dev) {
      if (warnInProduction) warnProductionOnce()
      return
    }

    const effectiveLevel = logOptions.level ?? level
    if (!shouldLog(effectiveLevel, logLevel)) return

    const {
      comment,
      collapsed = defaultCollapsed,
      enabled = true,
      path,
      line,
      time = defaultTime,
    } = logOptions

    if (!enabled) return

    let caller = {}
    if (path && line != null) {
      caller = { path, line, function: logOptions.function }
    } else {
      try {
        caller = getCaller(0)
      } catch {
        caller = {}
      }
    }

    const headerStyle = cssStyles[effectiveLevel] ?? cssStyles.header
    const group = collapsed ? console.groupCollapsed : console.group

    group(`%c ${effectiveLevel.toUpperCase()} · ${label} `, headerStyle)

    if (time) {
      printField('Time', formatTimestamp(new Date(), timestampFormat), cssStyles)
    }

    if (showFunction) printField('Function', caller.function, cssStyles)
    if (showPath) printField('Path', caller.path, cssStyles)
    if (showLine) printField('Line', caller.line, cssStyles)
    if (showType && value !== undefined) printField('Type', typeOf(value), cssStyles)

    printValue(value, typeOf(value))
    printField('Comment', comment, cssStyles)

    console.groupEnd()
  }

  const log = (label, value, opts) => logAtLevel('info', label, value, opts)

  log.debug = (label, value, opts) => logAtLevel('debug', label, value, opts)
  log.info = (label, value, opts) => logAtLevel('info', label, value, opts)
  log.warn = (label, value, opts) => logAtLevel('warn', label, value, opts)
  log.error = (label, value, opts) => logAtLevel('error', label, value, opts)
  log.table = (label, data, opts = {}) => log(label, data, { ...opts, collapsed: false })
  log.dev = dev
  log.level = logLevel

  return log
}
