import { detectDev, detectWarnInProduction } from './env.js'

export const LOG_LEVELS = Object.freeze({
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
})

export const DEFAULT_CSS_STYLES = Object.freeze({
  header: 'padding:4px 8px;border:1px solid #f87171;color:#2563eb;font-weight:600;text-transform:capitalize',
  label: 'color:#64748b',
  value: 'color:#0ea5e9;font-weight:600',
  debug: 'padding:4px 8px;border:1px solid #8b5cf6;color:#7c3aed;font-weight:600',
  info: 'padding:4px 8px;border:1px solid #38bdf8;color:#0284c7;font-weight:600',
  warn: 'padding:4px 8px;border:1px solid #fbbf24;color:#d97706;font-weight:700',
  error: 'padding:4px 8px;border:1px solid #f87171;color:#dc2626;font-weight:700',
})

export const DEFAULT_LOGGER_OPTIONS = Object.freeze({
  logLevel: 'debug',
  collapsed: true,
  showPath: true,
  showLine: true,
  showFunction: true,
  showType: true,
  time: true,
  timestampFormat: 'locale',
})

/** @returns {import('../index.d.ts').LoggerOptions} */
export function parseInjectedOptions() {
  if (typeof __CONSOLE_LOG_ADVANCED_OPTIONS__ === 'undefined') return {}

  try {
    const raw = __CONSOLE_LOG_ADVANCED_OPTIONS__
    return typeof raw === 'string' ? JSON.parse(raw) : { ...raw }
  } catch {
    return {}
  }
}

/** Merge plugin/runtime defaults with explicit overrides. */
export function resolveLoggerOptions(overrides = {}) {
  const injected = parseInjectedOptions()

  return {
    ...DEFAULT_LOGGER_OPTIONS,
    ...injected,
    ...overrides,
    cssStyles: {
      ...DEFAULT_CSS_STYLES,
      ...injected.cssStyles,
      ...overrides.cssStyles,
    },
    dev: overrides.dev ?? detectDev(),
    warnInProduction: overrides.warnInProduction ?? detectWarnInProduction(),
  }
}

export function shouldLog(level, minLevel = 'debug') {
  const current = LOG_LEVELS[level] ?? LOG_LEVELS.info
  const minimum = LOG_LEVELS[minLevel] ?? LOG_LEVELS.debug
  return current >= minimum
}
