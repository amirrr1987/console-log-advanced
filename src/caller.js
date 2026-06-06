const PACKAGE_ID = 'console-log-advanced'

const INTERNAL_SKIP = [
  PACKAGE_ID,
  'getCaller',
  'createLogger',
  'attachToConsole',
  'logAtLevel',
  'printField',
  'printValue',
  'formatTimestamp',
]

/** Chrome, Firefox, Node — with optional async prefix and function name. */
const FRAME_PATTERNS = [
  /^\s*at\s+(?:async\s+)?(?:((?:[\w$.<>\[\]]+\s*)+)\s+\()?(?:file:\/)?(.+?):(\d+)(?::(\d+))?\)?$/,
  /^\s*(?:([\w$.<>\[\]]+)@)?(.+?):(\d+)(?::(\d+))?$/,
  /^\s*at\s+(?:async\s+)?(?:((?:[\w$.<>\[\]]+\s*)+)\s+\()?(?:<anonymous>|eval)\)?$/,
]

/**
 * @param {number} [extraSkip] — extra frames when wrapping calls
 * @returns {{ path?: string, line?: string, column?: string, function?: string }}
 */
export function getCaller(extraSkip = 0) {
  const stack = new Error().stack
  if (!stack) return {}

  const lines = stack.split('\n').slice(1 + extraSkip)

  for (const line of lines) {
    const frame = parseStackLine(line)
    if (!frame || isInternalFrame(frame)) continue
    return frame
  }

  return {}
}

function parseStackLine(line) {
  for (const pattern of FRAME_PATTERNS) {
    const match = line.match(pattern)
    if (!match) continue

    const [, fn, path, lineNo, column] = match
    if (!path && !fn) continue

    return {
      function: fn?.trim() || undefined,
      path: path ? normalizePath(path) : undefined,
      line: lineNo,
      column,
    }
  }

  return null
}

function normalizePath(path) {
  return path
    .replace(/^file:\/\//, '')
    .replace(/\\/g, '/')
    .replace(/\?.*$/, '')
}

function isInternalFrame({ path = '', function: fn = '' }) {
  const haystack = `${path} ${fn}`.toLowerCase()
  return INTERNAL_SKIP.some((token) => haystack.includes(token.toLowerCase()))
}
