import type { TimestampFormat } from './types.js'
import type { ResolvedLoggerOptions } from './config.js'

// ─── Type detection ───────────────────────────────────────────────────────────

export function typeOf(value: unknown): string {
  return Object.prototype.toString.call(value).slice(8, -1)
}

// ─── Timestamp ────────────────────────────────────────────────────────────────

let _start = Date.now()

export function formatTimestamp(date: Date, format: TimestampFormat): string {
  if (typeof format === 'function') return format(date)

  switch (format) {
    case 'iso':
      return date.toISOString()

    case 'time-only':
      return date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })

    case 'date-only':
      return date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      })

    case 'relative': {
      const ms = date.getTime() - _start
      if (ms < 1000) return `+${ms}ms`
      if (ms < 60_000) return `+${(ms / 1000).toFixed(2)}s`
      return `+${(ms / 60_000).toFixed(1)}min`
    }

    case 'locale':
    default: {
      const d = date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      })
      const t = date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      return `${d} ${t}`
    }
  }
}

// ─── Meta row printer ────────────────────────────────────────────────────────

export function printMeta(
  label: string,
  value: unknown,
  opts: ResolvedLoggerOptions,
): void {
  if (value == null || value === '') return

  console.info(
    `%c${label.padEnd(10)}%c${value}`,
    opts.theme.label,
    opts.theme.value,
  )
}

// ─── Value pretty-printer ────────────────────────────────────────────────────

export function printValue(value: unknown): void {
  const kind = typeOf(value)

  switch (kind) {
    case 'Map': {
      const rows = Array.from(value as Map<unknown, unknown>, ([k, v]) => ({ key: k, value: v }))
      console.table(rows)
      return
    }

    case 'Set': {
      const rows = Array.from(value as Set<unknown>, (v, i) => ({ index: i, value: v }))
      console.table(rows)
      return
    }

    case 'Array':
    case 'Object':
      console.table(value)
      return

    case 'Date': {
      const d = value as Date
      console.info(`${d.toISOString()}  (local: ${d.toLocaleString()})`)
      return
    }

    case 'Promise':
      console.info('%cPromise { <pending> }', 'color:#94a3b8;font-style:italic')
      ;(value as Promise<unknown>).then(
        (r)  => console.info('  ↳ resolved →', r),
        (e)  => console.info('  ↳ rejected →', e),
      )
      return

    case 'Error': {
      const err = value as Error
      console.info(err.stack ?? err.message ?? String(err))
      return
    }

    case 'Function':
      console.info(`ƒ ${(value as Function).name || '(anonymous)'}`)
      return

    case 'RegExp':
      console.info(String(value))
      return

    case 'Null':
      console.info('%cnull', 'color:#94a3b8;font-style:italic')
      return

    case 'Undefined':
      console.info('%cundefined', 'color:#94a3b8;font-style:italic')
      return

    default:
      if (value !== undefined) console.info(value)
  }
}
