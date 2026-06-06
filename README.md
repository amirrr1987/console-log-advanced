# vite-plugin-better-console

Zero-dependency Vite plugin that replaces the plain `console.log` workflow with a structured, colour-coded, dev-only logger. Every call is automatically **silent in production** — no dead code, no bundle bloat.

---

## Features

| | |
|---|---|
| 🎨 **Colour-coded badges** | per log level (debug / info / warn / error) |
| 📍 **Auto caller info** | file, line, and function name from the stack |
| 🔢 **Log level filtering** | suppress noisy debug logs in staging |
| 🧩 **Smart value formatting** | Map, Set, Date, Promise, Error, Array, Object all pretty-printed |
| ⏱ **Timestamps** | locale, ISO, time-only, date-only, or relative (`+42ms`) |
| 🔇 **Production safe** | entire logger tree is a no-op when `mode === 'production'` |
| 🏗 **Zero imports in app code** | plugin auto-injects into your entry files |
| 🦾 **Full TypeScript** | types for every option, augments `console.better` globally |

---

## Install

```bash
npm install vite-plugin-better-console
# or
pnpm add vite-plugin-better-console
# or
yarn add vite-plugin-better-console
```

Requires **Vite 5+**.

---

## Quick start

### 1. Register the plugin

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { betterConsole } from 'vite-plugin-better-console'

export default defineConfig({
  plugins: [betterConsole()],
})
```

### 2. Use `console.better` anywhere in your app

```ts
// No import needed — the plugin injects it automatically
console.better('user loaded', { id: 1, name: 'Ada' })
console.better.debug('cache key', cacheKey)
console.better.warn('slow response', response, { comment: 'over 2 s' })
console.better.error('fetch failed', error)
console.better.table('users', users)
```

---

## Configuration

All options are optional.

```ts
betterConsole({
  // ── Plugin ────────────────────────────────────────────────
  inject: true,                    // auto-inject into detected entries (default: true)
  injectEntries: ['src/main.ts'],  // additional explicit entries
  injectPattern: '**/bootstrap.{ts,js}', // glob or RegExp for extra targets

  // ── Logger ────────────────────────────────────────────────
  warnInProduction: true,    // one-time banner if called in production
  logLevel: 'debug',         // 'debug' | 'info' | 'warn' | 'error' | 'silent'
  collapsed: true,           // collapse groups by default
  showPath: true,            // show caller file path
  showLine: true,            // show caller line number
  showFn: true,              // show caller function name
  showType: true,            // show value type
  timestamp: true,           // show timestamp
  timestampFormat: 'locale', // 'locale'|'iso'|'time-only'|'date-only'|'relative'

  // ── Custom badge labels ───────────────────────────────────
  badge: {
    debug: '🐛',
    info:  'ℹ️',
    warn:  '⚠️',
    error: '🔴',
  },
  // badge: false  — disable the prefix, show only the label

  // ── CSS theme ─────────────────────────────────────────────
  theme: {
    badge_debug: 'color:#7c3aed;font-weight:700',
    badge_info:  'color:#1d4ed8;font-weight:700',
    badge_warn:  'color:#b45309;font-weight:700',
    badge_error: 'color:#dc2626;font-weight:700',
    label: 'color:#94a3b8;font-size:11px',
    value: 'color:#0ea5e9;font-weight:600',
    meta:  'color:#64748b;font-size:11px',
  },
})
```

### Option reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `inject` | `boolean` | `true` | Auto-inject runtime into entry files |
| `injectEntries` | `string[]` | `[]` | Additional entry globs |
| `injectPattern` | `string \| RegExp` | — | Extra glob/regex targets |
| `warnInProduction` | `boolean` | `true` | Show one-time prod warning |
| `logLevel` | `LogLevel` | `'debug'` | Minimum level to print |
| `collapsed` | `boolean` | `true` | Collapse groups by default |
| `showPath` | `boolean` | `true` | Show file path |
| `showLine` | `boolean` | `true` | Show line number |
| `showFn` | `boolean` | `true` | Show function name |
| `showType` | `boolean` | `true` | Show value type |
| `timestamp` | `boolean` | `true` | Show timestamp |
| `timestampFormat` | `TimestampFormat` | `'locale'` | Timestamp format |
| `badge` | `Record<LogLevel,string> \| false` | built-in | Badge prefix per level |
| `theme` | `ThemeStyles` | built-in | CSS `%c` strings |

---

## Per-call options

Override any global option for a single call:

```ts
console.better('api response', data, {
  level: 'warn',          // treat as warn
  comment: 'slow path',   // note appended at the end
  collapsed: false,       // expand this group
  enabled: isDebugMode,   // conditional logging
  timestamp: false,       // skip timestamp
  // Manual caller override:
  path: 'src/App.vue',
  line: 42,
  fn: 'handleSubmit',
})
```

---

## Timestamp formats

| Format | Example |
|--------|---------|
| `'locale'` | `06 Jun 2026 14:32:11` |
| `'iso'` | `2026-06-06T14:32:11.000Z` |
| `'time-only'` | `14:32:11` |
| `'date-only'` | `06 Jun 2026` |
| `'relative'` | `+142ms` (since page load) |

---

## Value smart-formatting

| Type | Output |
|------|--------|
| `Array` / `Object` | `console.table` |
| `Map` | `console.table` with `{ key, value }` rows |
| `Set` | `console.table` with `{ index, value }` rows |
| `Date` | ISO + local string |
| `Promise` | `Promise { <pending> }` + resolved/rejected |
| `Error` | Full stack trace |
| `Function` | `ƒ functionName` |
| `null` / `undefined` | Styled italic |
| Primitives | `console.info` |

---

## Standalone usage (without Vite)

You can use the runtime directly — useful in Node scripts, tests, or frameworks
that don't use Vite:

```ts
import { createLogger, attachRuntime } from 'vite-plugin-better-console/runtime'

// Standalone logger
const log = createLogger({ dev: true, logLevel: 'info' })
log('server ready', { port: 3000 })
log.warn('rate limit', { ip: '1.2.3.4' })

// Or attach to console globally
attachRuntime(createLogger({ dev: process.env.NODE_ENV !== 'production' }))
console.better.info('attached')
```

---

## How it works

```
vite.config.ts
  └─ betterConsole()
       │
       ├─ config()          — injects __BETTER_CONSOLE_DEV__ / _WARN_ / _OPTIONS__ defines
       ├─ configResolved()  — collects Rollup entry paths
       ├─ transformIndexHtml() — collects <script type="module" src="…"> entries
       ├─ resolveId()       — handles `virtual:better-console`
       ├─ load()            — virtual module: `import 'vite-plugin-better-console/runtime'`
       └─ transform()       — prepends the virtual import to each entry
                              (dev only — production builds skip this entirely)

Browser
  └─ runtime/index.js (auto-executed)
       ├─ resolveOptions()  — reads injected JSON + defaults
       ├─ createLogger()    — builds the LogFn
       └─ attachRuntime()   — sets console.better = log
```

---

## TypeScript support

`console.better` is globally typed — no import needed in your app:

```ts
// tsconfig.json — add to types or reference
/// <reference types="vite-plugin-better-console/runtime" />
```

Or add to `vite-env.d.ts`:

```ts
/// <reference types="vite-plugin-better-console/runtime" />
```

---

## License

MIT
