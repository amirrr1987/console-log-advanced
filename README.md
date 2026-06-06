# console-log-advanced

[![npm version](https://badge.fury.io/js/console-log-advanced.svg)](https://badge.fury.io/js/console-log-advanced)
[![License: MIT](https://img.shields.io/github/license/amirrr1987/console-log-advanced)](https://github.com/amirrr1987/console-log-advanced/blob/master/LICENSE)

Zero-dependency **Vite plugin** and dev logger. Pretty grouped console output, caller info, log levels, CSS styling — silent in production. Configure once in `vite.config.js`, use `console.logger` everywhere.

## Features

- No imports in app code — plugin injects init into your entry
- `console.logger` with `.debug` / `.info` / `.warn` / `.error`
- Auto caller info: file, line, function
- Log level filtering, `%c` CSS themes, smart value formatting
- Production-safe — logger code stripped at build time

## Install

```bash
npm i console-log-advanced
```

Requires **Vite 5+** for the plugin subpath.

## Quick start

### 1. Plugin (`vite.config.js`)

```js
import { defineConfig } from 'vite'
import consoleLogAdvanced from 'console-log-advanced/vite'

export default defineConfig({
  plugins: [consoleLogAdvanced()],
})
```

### 2. Log anywhere

```js
console.logger('user', { id: 1, name: 'Ada' })
console.logger.debug('cache', cacheKey)
console.logger.warn('api', response, { comment: 'slow response' })
console.logger.error('fetch', error)
console.logger.table('users', users)
```

## Configuration

All options go in `vite.config.js`:

```js
consoleLogAdvanced({
  // Plugin
  inject: true,
  injectEntries: ['src/main.ts'],
  injectPattern: '**/bootstrap.{ts,js}',
  warnInProduction: true,

  // Logger
  logLevel: 'debug',
  collapsed: true,
  showPath: true,
  showLine: true,
  showFunction: true,
  showType: true,
  time: true,
  timestampFormat: 'locale',

  cssStyles: {
    debug: 'color:#8b5cf6',
    info: 'color:#0284c7',
    warn: 'color:#d97706;font-weight:700',
    error: 'color:#dc2626;font-weight:700',
  },
})
```

| Option | Default | Description |
|--------|---------|-------------|
| `inject` | `true` | Auto-inject into app entries |
| `injectEntries` | `[]` | Extra entry globs |
| `injectPattern` | — | Glob or `RegExp` for injection |
| `warnInProduction` | `true` | One-time prod warning |
| `logLevel` | `'debug'` | Minimum level to print |
| `collapsed` | `true` | Collapse console groups |
| `showPath` / `showLine` / `showFunction` | `true` | Caller info fields |
| `showType` | `true` | Show value type |
| `time` | `true` | Show timestamp |
| `timestampFormat` | `'locale'` | `locale` · `iso` · `time-only` · `date-only` |
| `cssStyles` | built-in | `%c` CSS per level |

## Per-call options

```js
console.logger('payload', data, {
  level: 'warn',
  comment: 'after mutation',
  collapsed: false,
  enabled: true,
  path: 'src/App.vue',
  line: 42,
  function: 'onSubmit',
})
```

## Examples

**API response**

```js
const users = await fetch('/api/users').then((r) => r.json())
console.logger.info('users', users, { comment: 'GET /api/users' })
```

**Error handling**

```js
try {
  await saveProfile(form)
} catch (error) {
  console.logger.error('saveProfile', error)
}
```

**Map / Set**

```js
console.logger.debug('cache', new Map([['user:1', user]]))
```

## Node.js (without Vite)

```js
import log from 'console-log-advanced'

log.info('server', { port: 3000 })
```

```js
import { attachToConsole, createLogger } from 'console-log-advanced'

attachToConsole(
  createLogger({
    dev: process.env.NODE_ENV !== 'production',
    logLevel: 'info',
  }),
)
```

## How it works

1. Plugin `config` sets compile-time flags from Vite `mode` and serializes logger options as JSON.
2. Virtual module `virtual:console-log-advanced` imports the package and attaches `console.logger`.
3. `transform` prepends the virtual import to Rollup entry files.
4. In production builds, dead-code elimination removes logger bodies.

## Development

```bash
npm run build
npm run dev      # watch
```

## License

MIT — [Amir Maghami](http://amirmaghami.ir/)

See [CHANGELOG.md](./CHANGELOG.md) for release history.
