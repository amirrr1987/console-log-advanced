import type { Plugin, ResolvedConfig } from 'vite'
import type { BetterConsoleOptions, LoggerOptions } from './types.js'

// ─── Constants ───────────────────────────────────────────────────────────────

const PLUGIN_NAME      = 'vite-plugin-better-console'
const VIRTUAL_ID       = 'virtual:better-console'
const RESOLVED_VIRTUAL = '\0virtual:better-console'
const RUNTIME_PKG      = `${PLUGIN_NAME}/runtime`

/** Extensions that are considered candidate entry points */
const ENTRY_EXTS = new Set(['.js', '.ts', '.jsx', '.tsx', '.mjs', '.mts', '.cjs', '.cts', '.vue', '.svelte'])

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalize(p: string): string {
  return p.replace(/\\/g, '/')
}

function resolveEntry(root: string, entry: string): string {
  const e = entry.startsWith('/') ? entry.slice(1) : entry
  return normalize(`${normalize(root)}/${e}`.replace(/\/+/g, '/'))
}

function globToRegex(glob: string): RegExp {
  const escaped = glob
    .replace(/\\/g, '/')
    .replace(/[.+^${}()|[\]]/g, '\\$&')   // escape regex meta except * and ?
    .replace(/\*\*/g, '\x00')             // placeholder for **
    .replace(/\*/g, '[^/]*')              // * → any segment char
    .replace(/\x00/g, '.*')              // ** → anything
    .replace(/\?/g, '[^/]')              // ? → single char

  return new RegExp(`^${escaped}$`)
}

function matchPattern(pattern: string | RegExp, id: string): boolean {
  if (!pattern) return false
  const normalized = normalize(id)
  if (pattern instanceof RegExp) return pattern.test(normalized)
  return globToRegex(pattern).test(normalized)
}

/** Collect <script type="module" src="..."> entries from HTML */
function htmlModuleEntries(html: string, root: string): Set<string> {
  const result = new Set<string>()
  const re = /<script([^>]*)>/gi
  let m: RegExpExecArray | null

  while ((m = re.exec(html)) !== null) {
    const attrs = m[1]
    if (!/type\s*=\s*["']module["']/i.test(attrs)) continue

    const src = attrs.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1]
    if (!src || /^https?:\/\//i.test(src) || src.startsWith('//')) continue

    result.add(resolveEntry(root, src))
  }

  return result
}

/** Collect entries from rollupOptions.input */
function rollupEntries(config: ResolvedConfig): Set<string> {
  const result = new Set<string>()
  const { root } = config
  const input = config.build?.rollupOptions?.input

  if (typeof input === 'string') {
    result.add(resolveEntry(root, input))
  } else if (Array.isArray(input)) {
    for (const e of input) result.add(resolveEntry(root, e))
  } else if (input && typeof input === 'object') {
    for (const e of Object.values(input)) result.add(resolveEntry(root, e))
  }

  return result
}

/** Serialize only the options that the runtime needs (no plugin-specific keys) */
function serializeRuntimeOptions(options: BetterConsoleOptions): string {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { inject: _i, injectEntries: _ie, injectPattern: _ip, ...rest } = options
  return JSON.stringify(rest)
}

// ─── Plugin ──────────────────────────────────────────────────────────────────

/**
 * `betterConsole(options?)` — Vite plugin.
 *
 * Registers `console.better` (and `console.logger` for compat) in every app
 * entry automatically. All logging is a complete no-op in production builds.
 */
export function betterConsole(options: BetterConsoleOptions = {}): Plugin {
  const {
    inject         = true,
    injectEntries  = [],
    injectPattern,
    warnInProduction = true,
  } = options

  const serialized = serializeRuntimeOptions(options)

  /** Tracks which modules already received the injection */
  const injected   = new Set<string>()
  /** All resolved entry paths (populated lazily from config + HTML) */
  let entryPaths   = new Set<string>()
  let projectRoot  = process.cwd()
  let isDev        = false

  // ── shouldInject guard ────────────────────────────────────────────────────

  function shouldInject(id: string): boolean {
    if (!inject)                       return false
    if (injected.has(id))              return false
    if (id.includes('node_modules'))   return false
    if (id.startsWith('\0'))           return false
    if (id.startsWith('virtual:'))     return false
    if (id.includes(PLUGIN_NAME))      return false

    const norm = normalize(id)

    // Explicit entry list — match against:
    //   1. The raw pattern (e.g. already absolute)
    //   2. The resolved absolute path (e.g. 'src/main.ts' → '/root/src/main.ts')
    //   3. As a suffix (e.g. id ends with the pattern, useful for relative globs)
    if (
      injectEntries.some((e) => {
        const resolved = resolveEntry(projectRoot, e)
        return (
          matchPattern(e, norm) ||
          matchPattern(resolved, norm) ||
          norm.endsWith('/' + normalize(e))
        )
      })
    ) return true

    // Explicit pattern
    if (injectPattern && matchPattern(injectPattern, norm)) return true

    // Auto-detected rollup / HTML entries
    if (entryPaths.has(norm)) {
      return ENTRY_EXTS.has(norm.slice(norm.lastIndexOf('.')))
    }

    return false
  }

  // ── Plugin object ─────────────────────────────────────────────────────────

  return {
    name:    PLUGIN_NAME,
    enforce: 'pre',        // run before framework plugins (e.g. @vitejs/plugin-vue)

    // 1. Inject compile-time defines so the runtime knows mode and options
    config(_cfg, env) {
      isDev = env.command === 'serve' || env.mode !== 'production'

      return {
        define: {
          __BETTER_CONSOLE_DEV__:     JSON.stringify(isDev),
          __BETTER_CONSOLE_WARN__:    JSON.stringify(warnInProduction),
          __BETTER_CONSOLE_OPTIONS__: serialized,
        },
        optimizeDeps: {
          // Pre-bundle the runtime so HMR doesn't break on first load
          include: [RUNTIME_PKG],
        },
      }
    },

    // 2. Save the resolved root and collect rollup entries
    configResolved(config) {
      projectRoot = config.root
      entryPaths  = rollupEntries(config)
    },

    // 3. Collect <script type="module"> entries from index.html
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        for (const path of htmlModuleEntries(html, projectRoot)) {
          entryPaths.add(path)
        }
        // Nothing to add to the HTML itself
        return []
      },
    },

    // 4. Virtual module: the thin glue that imports the runtime
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_VIRTUAL
    },

    load(id) {
      if (id === RESOLVED_VIRTUAL) {
        // Import the runtime, which auto-attaches console.better
        return `import '${RUNTIME_PKG}'`
      }
    },

    // 5. Prepend the virtual import to every matched entry
    transform(code, id) {
      if (!shouldInject(id)) return null

      // Dev only: skip injection if we're building for production
      // (the define already sets dev=false so calls are no-ops, but we
      //  can also skip the import entirely to save bytes)
      if (!isDev) return null

      injected.add(id)

      return {
        code: `import '${VIRTUAL_ID}'\n${code}`,
        map:  null,
      }
    },
  }
}

export default betterConsole
