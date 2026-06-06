const VIRTUAL_MODULE_ID = 'virtual:console-log-advanced'
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID

const DEFAULT_ENTRY_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx', '.vue', '.svelte']

/**
 * @param {string | RegExp} pattern
 * @param {string} id
 */
function matchPattern(pattern, id) {
  if (!pattern) return false
  if (pattern instanceof RegExp) return pattern.test(id)

  const normalized = id.replace(/\\/g, '/')
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

  const shouldInject = function shouldInject(id, ctx) {
    if (!inject || injected.has(id)) return false
    if (id.includes('node_modules') || id.startsWith('\0')) return false
    if (id.includes(VIRTUAL_MODULE_ID)) return false

    const normalized = id.replace(/\\/g, '/')

    if (injectEntries.some((entry) => matchPattern(entry, normalized))) {
      return true
    }

    if (injectPattern && matchPattern(injectPattern, normalized)) {
      return true
    }

    const info = ctx.getModuleInfo(id)
    if (info?.isEntry) {
      return DEFAULT_ENTRY_EXTENSIONS.some((ext) => normalized.endsWith(ext))
    }

    return false
  }

  return {
    name: 'console-log-advanced',
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
          include: ['console-log-advanced'],
        },
      }
    },

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_VIRTUAL_MODULE_ID
    },

    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        return `import 'console-log-advanced'`
      }
    },

    transform(code, id) {
      if (!shouldInject(id, this)) return

      injected.add(id)

      return {
        code: `import '${VIRTUAL_MODULE_ID}'\n${code}`,
        map: null,
      }
    },
  }
}

export default consoleLogAdvanced
