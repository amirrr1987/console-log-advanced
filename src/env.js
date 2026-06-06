/**
 * Dev mode resolution order:
 * 1. Vite plugin compile-time define (__CONSOLE_LOG_ADVANCED_DEV__)
 * 2. Vite client env (import.meta.env)
 * 3. Node fallback (NODE_ENV)
 */
export function detectDev() {
  if (typeof __CONSOLE_LOG_ADVANCED_DEV__ !== 'undefined') {
    return __CONSOLE_LOG_ADVANCED_DEV__
  }

  try {
    if (import.meta.env.PROD) return false
    if (import.meta.env.DEV) return true
  } catch {}

  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production') {
    return false
  }

  return true
}

export function detectWarnInProduction() {
  if (typeof __CONSOLE_LOG_ADVANCED_WARN__ !== 'undefined') {
    return __CONSOLE_LOG_ADVANCED_WARN__
  }

  const options = parseInjectedWarnFlag()
  if (options !== undefined) return options

  return true
}

function parseInjectedWarnFlag() {
  if (typeof __CONSOLE_LOG_ADVANCED_OPTIONS__ === 'undefined') return undefined

  try {
    const raw = __CONSOLE_LOG_ADVANCED_OPTIONS__
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
    return parsed?.warnInProduction
  } catch {
    return undefined
  }
}
