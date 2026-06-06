// ─── Caller Detection ────────────────────────────────────────────────────────
//
// Parses the V8 / SpiderMonkey / JavaScriptCore stack trace format to find
// the first frame that is NOT part of this library's own internals.
//
// Supported formats:
//   Chrome/Node:  "    at FnName (file:///path/to/file.js:12:5)"
//   Chrome anon:  "    at file:///path/to/file.js:12:5"
//   Firefox:      "FnName@file:///path/to/file.js:12:5"
//   Safari:       "FnName@file:///path/to/file.js:12:5"
// ─────────────────────────────────────────────────────────────────────────────

export interface CallerInfo {
  path?: string
  line?: string
  col?: string
  fn?: string
}

/**
 * Tokens that identify internal frames we want to skip.
 * These are matched case-insensitively against "path fn".
 */
const SKIP_TOKENS = [
  'vite-plugin-better-console',
  'betterConsole',
  'getCaller',
  'createLogger',
  'attachRuntime',
  'logAtLevel',
  'printMeta',
  'printValue',
]

// Chrome / Node: `at [async] [FnName] (path:line:col)` or `at path:line:col`
const RE_V8 =
  /^\s*at\s+(?:async\s+)?(?:([\w$.<>\[\] ]+?)\s+\()?(?:file:\/\/)?(.+?):(\d+)(?::(\d+))?\)?$/

// Firefox / Safari: `[FnName@]path:line:col`
const RE_FF =
  /^\s*(?:([\w$.<>\[\]]+)@)?(?:file:\/\/)?(.+?):(\d+)(?::(\d+))?$/

function parseFrame(raw: string): CallerInfo | null {
  let m = raw.match(RE_V8)
  if (m) {
    const [, fn, path, line, col] = m
    if (!path) return null
    return { fn: fn?.trim() || undefined, path: cleanPath(path), line, col }
  }

  m = raw.match(RE_FF)
  if (m) {
    const [, fn, path, line, col] = m
    if (!path) return null
    return { fn: fn?.trim() || undefined, path: cleanPath(path), line, col }
  }

  return null
}

function cleanPath(raw: string): string {
  return raw
    .replace(/^file:\/\//, '')
    .replace(/\\/g, '/')
    .replace(/\?.*$/, '')   // strip HMR query strings e.g. ?t=123456
    .replace(/^\/\//, '/')
}

function isInternal(info: CallerInfo): boolean {
  const haystack = `${info.path ?? ''} ${info.fn ?? ''}`.toLowerCase()
  return SKIP_TOKENS.some((tok) => haystack.includes(tok.toLowerCase()))
}

/**
 * Returns the first non-internal caller from the current stack.
 * `extraSkip` bumps the start position when wrapped inside additional helpers.
 */
export function getCaller(extraSkip = 0): CallerInfo {
  const stack = new Error().stack
  if (!stack) return {}

  // Slice off "Error\n" + the frames that belong to getCaller itself
  const lines = stack.split('\n').slice(1 + extraSkip)

  for (const line of lines) {
    const frame = parseFrame(line)
    if (!frame) continue
    if (isInternal(frame)) continue
    return frame
  }

  return {}
}
