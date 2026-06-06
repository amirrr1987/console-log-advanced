import type { LogLevel, LoggerOptions, ThemeStyles, TimestampFormat } from './types.js'
import { LOG_LEVEL_RANK } from './types.js'

// ─── Global define injected by the Vite plugin ───────────────────────────────
declare const __BETTER_CONSOLE_DEV__: boolean | undefined
declare const __BETTER_CONSOLE_WARN__: boolean | undefined
declare const __BETTER_CONSOLE_OPTIONS__: string | undefined

// ─── Default theme ───────────────────────────────────────────────────────────

export const DEFAULT_THEME: Required<ThemeStyles> = {
  badge_debug:
    'display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;letter-spacing:.5px;background:#f3f0ff;color:#6d28d9;border:1px solid #c4b5fd',
  badge_info:
    'display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;letter-spacing:.5px;background:#eff6ff;color:#1d4ed8;border:1px solid #93c5fd',
  badge_warn:
    'display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;letter-spacing:.5px;background:#fffbeb;color:#b45309;border:1px solid #fcd34d',
  badge_error:
    'display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;letter-spacing:.5px;background:#fef2f2;color:#dc2626;border:1px solid #fca5a5',
  label: 'color:#94a3b8;font-size:11px;min-width:68px;display:inline-block',
  value: 'color:#0ea5e9;font-weight:600',
  meta:  'color:#64748b;font-size:11px',
  divider: 'color:#cbd5e1',
}

// ─── Default logger options ───────────────────────────────────────────────────

export const DEFAULT_OPTIONS: Required<Omit<LoggerOptions, 'dev' | 'warnInProduction' | 'theme' | 'badge'>> = {
  logLevel: 'debug',
  collapsed: true,
  showPath: true,
  showLine: true,
  showFn: true,
  showType: true,
  timestamp: true,
  timestampFormat: 'locale',
}

// ─── Dev / warn detection ─────────────────────────────────────────────────────

export function detectDev(): boolean {
  // 1. Plugin compile-time define (most reliable)
  if (typeof __BETTER_CONSOLE_DEV__ !== 'undefined') {
    return __BETTER_CONSOLE_DEV__
  }
  // 2. Vite HMR env
  try {
    if (import.meta.env?.PROD) return false
    if (import.meta.env?.DEV)  return true
  } catch { /* not in Vite context */ }
  // 3. Node env
  if (typeof process !== 'undefined') {
    return process.env?.NODE_ENV !== 'production'
  }
  return true
}

export function detectWarnInProduction(): boolean {
  if (typeof __BETTER_CONSOLE_WARN__ !== 'undefined') {
    return __BETTER_CONSOLE_WARN__
  }
  return true
}

// ─── Injected options (from vite.config) ─────────────────────────────────────

function parseInjectedOptions(): Partial<LoggerOptions> {
  if (typeof __BETTER_CONSOLE_OPTIONS__ === 'undefined') return {}
  try {
    const raw = __BETTER_CONSOLE_OPTIONS__
    return (typeof raw === 'string' ? JSON.parse(raw) : raw) ?? {}
  } catch {
    return {}
  }
}

// ─── Resolve ─────────────────────────────────────────────────────────────────

export type ResolvedLoggerOptions = {
  dev: boolean
  warnInProduction: boolean
  logLevel: LogLevel
  collapsed: boolean
  showPath: boolean
  showLine: boolean
  showFn: boolean
  showType: boolean
  timestamp: boolean
  timestampFormat: TimestampFormat
  theme: Required<ThemeStyles>
  badge: Partial<Record<LogLevel, string>> | false
}

export function resolveOptions(overrides: LoggerOptions = {}): ResolvedLoggerOptions {
  const injected = parseInjectedOptions()

  return {
    ...DEFAULT_OPTIONS,
    ...injected,
    ...overrides,
    dev:              overrides.dev              ?? detectDev(),
    warnInProduction: overrides.warnInProduction ?? detectWarnInProduction(),
    theme: {
      ...DEFAULT_THEME,
      ...injected.theme,
      ...overrides.theme,
    },
    badge: overrides.badge ?? injected.badge ?? {},
  }
}

// ─── Level check ─────────────────────────────────────────────────────────────

export function shouldLog(level: LogLevel, minLevel: LogLevel = 'debug'): boolean {
  return (LOG_LEVEL_RANK[level] ?? 0) >= (LOG_LEVEL_RANK[minLevel] ?? 0)
}
