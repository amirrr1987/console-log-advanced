import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

// --- unit: package exports ---

const plugin = await import('../dist/vite.js')
assert.equal(typeof plugin.default, 'function', 'default export is plugin factory')
assert.equal(typeof plugin.consoleLogAdvanced, 'function', 'named export consoleLogAdvanced')

const logger = await import('../dist/index.js')
assert.equal(typeof logger.default, 'function', 'logger default export is LogFn')
assert.equal(typeof logger.createLogger, 'function', 'createLogger export')
assert.equal(typeof logger.attachToConsole, 'function', 'attachToConsole export')

// --- unit: plugin metadata ---

const instance = plugin.default({ inject: false })
assert.equal(instance.name, 'vite-plugin-console-log-advanced', 'plugin name')
assert.equal(typeof instance.config, 'function', 'config hook')
assert.equal(typeof instance.resolveId, 'function', 'resolveId hook')
assert.equal(typeof instance.load, 'function', 'load hook')
assert.equal(typeof instance.transform, 'function', 'transform hook')

// --- unit: virtual module ---

const resolved = instance.resolveId('virtual:vite-plugin-console-log-advanced')
assert.ok(resolved, 'resolves virtual module id')

const virtualCode = instance.load(resolved)
assert.match(virtualCode, /vite-plugin-console-log-advanced\/logger/, 'virtual module imports logger subpath')

// --- unit: config hook ---

const configResult = instance.config({}, { mode: 'development' })
assert.equal(configResult.define.__CONSOLE_LOG_ADVANCED_DEV__, 'true', 'dev mode define')
assert.deepEqual(configResult.optimizeDeps.include, ['vite-plugin-console-log-advanced/logger'], 'optimizeDeps')

const prodConfig = instance.config({}, { mode: 'production' })
assert.equal(prodConfig.define.__CONSOLE_LOG_ADVANCED_DEV__, 'false', 'prod mode define')

// --- unit: transform injection ---

const transformPlugin = plugin.default()
const entryId = '/project/src/main.js'
const ctx = {
  getModuleInfo(id) {
    return id === entryId ? { isEntry: true } : null
  },
}
const transformed = transformPlugin.transform.call(ctx, 'console.log("hi")', entryId)
assert.match(transformed.code, /virtual:vite-plugin-console-log-advanced/, 'injects virtual import into entry')

// --- integration: vite build with plugin ---

const fixtureRoot = resolve(__dirname, 'fixture')
const fixtureOut = resolve(fixtureRoot, 'dist')

await build({
  root: fixtureRoot,
  logLevel: 'silent',
  plugins: [plugin.default({ logLevel: 'info' })],
  build: {
    outDir: fixtureOut,
    emptyOutDir: true,
    write: true,
    minify: false,
  },
})

const bundle = readFileSync(resolve(fixtureOut, 'assets/index.js'), 'utf8')
assert.ok(bundle.length > 0, 'fixture build produced output')
assert.doesNotMatch(bundle, /console\.logger\.debug/, 'prod build strips dev logger calls when tree-shaken')

console.log('All tests passed.')
