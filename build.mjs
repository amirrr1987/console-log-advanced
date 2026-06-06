// build.mjs — builds the plugin with esbuild
import { build } from 'esbuild'
import { cp, mkdir, writeFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dist = join(__dirname, 'dist')
const src  = join(__dirname, 'src')

await mkdir(dist, { recursive: true })
await mkdir(join(dist, 'runtime'), { recursive: true })

const shared = {
  bundle:   true,
  platform: 'browser',
  format:   'esm',
  target:   ['es2020'],
  external: ['vite'],
  minify:   false,
  sourcemap: false,
}

// ── Plugin (Node-side, consumed by vite.config.js) ────────────────────────
await build({
  ...shared,
  platform:   'node',
  entryPoints: [join(src, 'plugin.ts')],
  outfile:     join(dist, 'plugin.js'),
})

// ── Runtime (browser-side, injected into app bundle) ─────────────────────
await build({
  ...shared,
  entryPoints: [join(src, 'index.ts')],
  outfile:     join(dist, 'runtime', 'index.js'),
})

// ── Copy type declarations ────────────────────────────────────────────────
await cp(join(src, 'plugin.d.ts'),  join(dist, 'plugin.d.ts'))
await cp(join(src, 'runtime.d.ts'), join(dist, 'runtime', 'index.d.ts'))
await cp(join(src, 'types.ts'),     join(dist, 'types.d.ts'))
await cp(join(src, 'config.ts'),    join(dist, 'config.d.ts'))
await cp(join(src, 'caller.ts'),    join(dist, 'caller.d.ts'))
await cp(join(src, 'format.ts'),    join(dist, 'format.d.ts'))
await cp(join(src, 'logger.ts'),    join(dist, 'logger.d.ts'))
await cp(join(src, 'index.ts'),     join(dist, 'index.d.ts'))

console.log('✓ build complete')
