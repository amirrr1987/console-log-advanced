import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const PACKAGE_NAME = 'vite-plugin-console-log-advanced'
const VIRTUAL_MODULE_ID = 'virtual:vite-plugin-console-log-advanced'
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID

const DEFAULT_ENTRY_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx', '.vue', '.svelte']

/**
 * @param {string} id
 */
function normalizePath(id) {
  return id.replace(/\\/g, '/')
}

/**
 * @param {string} root
 * @param {string} entry
 */
function resolveEntryPath(root, entry) {
  const cleaned = entry.startsWith('/') ? entry.slice(1) : entry
  return normalizePath(resolve(root, cleaned))
}

/**
 * @param {string} html
 * @param {string} root
 */
function collectHtmlModuleEntries(html, root) {
  /** @type {Set<string>} */
  const entries = new Set()
  const scriptTagRegex = /<script([^>]*)>/gi
  let match

  while ((match = scriptTagRegex.exec(html)) !== null) {
    const attrs = match[1]
    if (!/type\s*=\s*["']module["']/i.test(attrs)) continue

    const src = attrs.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1]
    if (!src || /^https?:\/\//i.test(src) || src.startsWith('//')) continue

    entries.add(resolveEntryPath(root, src))
  }

  return entries
}

/**
 * @param {import('vite').ResolvedConfig} config
 */
function collectEntryPaths(config) {
  /** @type {Set<string>} */
  const entries = new Set()
  const root = config.root

  const input = config.build.rollupOptions?.input
  if (typeof input === 'string') {
    entries.add(resolveEntryPath(root, input))
  } else if (Array.isArray(input)) {
    for (const item of input) entries.add(resolveEntryPath(root, item))
  } else if (input && typeof input === 'object') {
    for (const item of Object.values(input)) entries.add(resolveEntryPath(root, item))
  }

  const htmlPath = resolve(root, 'index.html')
  if (existsSync(htmlPath)) {
    for (const entry of collectHtmlModuleEntries(readFileSync(htmlPath, 'utf-8'), root)) {
      entries.add(entry)
    }
  }

  return entries
}

/**
 * @param {string | RegExp} pattern
 * @param {string} id
 */
function matchPattern(pattern, id) {
  if (!pattern) return false
  if (pattern instanceof RegExp) return pattern.test(id)

  const normalized = normalizePath(id)
  const glob = String(pattern).replace(/\\/g, '/')
  const regex = new RegExp(
    `^${glob.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*')}$`,
  )

  return regex.test(normalized)
}

/**
 * @param {import('../vite.d.ts').ConsoleLogAdvancedOptions} options
 */
function serializeLoggerOptions(options) {
  const {
    inject: _inject,
    injectEntries: _injectEntries,
    injectPattern: _injectPattern,
    warnInProduction,
    ...loggerOptions
  } = options

  return JSON.stringify({
    warnInProduction,
    ...loggerOptions,
  })
}

/**
 * @param {import('../vite.d.ts').ConsoleLogAdvancedOptions} [options]
 * @returns {import('vite').Plugin}
 */
export function consoleLogAdvanced(options = {}) {
  const {
    inject = true,
    injectEntries = [],
    injectPattern,
    warnInProduction = true,
  } = options

  const injected = new Set()
  const serializedOptions = serializeLoggerOptions(options)
  /** @type {Set<string>} */
  let entryPaths = new Set()

  const shouldInject = function shouldInject(id) {
    if (!inject || injected.has(id)) return false
    if (id.includes('node_modules') || id.startsWith('\0')) return false
    if (id.startsWith('virtual:') || id.includes(VIRTUAL_MODULE_ID)) return false

    const normalized = normalizePath(id)

    if (injectEntries.some((entry) => matchPattern(entry, normalized))) {
      return true
    }

    if (injectPattern && matchPattern(injectPattern, normalized)) {
      return true
    }

    if (entryPaths.has(normalized)) {
      return DEFAULT_ENTRY_EXTENSIONS.some((ext) => normalized.endsWith(ext))
    }

    return false
  }

  return {
    name: PACKAGE_NAME,
    enforce: 'pre',

    config(_config, { mode }) {
      const dev = mode !== 'production'

      return {
        define: {
          __CONSOLE_LOG_ADVANCED_DEV__: JSON.stringify(dev),
          __CONSOLE_LOG_ADVANCED_WARN__: JSON.stringify(warnInProduction),
          __CONSOLE_LOG_ADVANCED_OPTIONS__: serializedOptions,
        },
        optimizeDeps: {
          include: [`${PACKAGE_NAME}/logger`],
        },
      }
    },

    configResolved(config) {
      entryPaths = collectEntryPaths(config)
    },

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_VIRTUAL_MODULE_ID
    },

    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        return `import '${PACKAGE_NAME}/logger'`
      }
    },

    transform(code, id) {
      if (!shouldInject(id)) return

      injected.add(id)

      return {
        code: `import '${VIRTUAL_MODULE_ID}'\n${code}`,
        map: null,
      }
    },
  }
}

export default consoleLogAdvanced
