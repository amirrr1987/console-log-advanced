# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-06

First release of **vite-plugin-better-console** — a zero-dependency Vite plugin for structured, colour-coded, dev-only logging.

### Added

- **Vite plugin** (`betterConsole()`) — configure once in `vite.config.ts`, use everywhere with no app imports
- **Auto-injection** into Rollup/Vite entry files and `<script type="module">` tags from `index.html`
- **`console.better`** as the primary global API, with `.debug` / `.info` / `.warn` / `.error` / `.table`
- **Legacy alias** `console.logger` for backward compatibility
- **Log level filtering** — `debug`, `info`, `warn`, `error`, `silent`
- **Colour-coded badges** per level with fully customisable `%c` CSS themes
- **Auto caller detection** — file path, line number, and function name from the stack (Chrome, Firefox, Safari)
- **Timestamps** — `locale`, `iso`, `time-only`, `date-only`, `relative` (+ custom formatter)
- **Smart value formatting** — `Map`, `Set`, `Date`, `Promise`, `Error`, `Function`, `Array`, `Object`, and primitives
- **Per-call overrides** — `level`, `comment`, `collapsed`, `enabled`, `path`, `line`, `fn`, `timestamp`
- **Production safety** — compile-time `define` flags; runtime is a no-op in production; import skipped in prod builds
- **One-time production banner** when logging is attempted in production (`warnInProduction`)
- **Standalone runtime** export at `vite-plugin-better-console/runtime` for Node scripts, tests, and non-Vite setups
- **Full TypeScript** — types for every option; global augmentation for `console.better` and `console.logger`
- **Explicit injection targets** — `injectEntries` (globs) and `injectPattern` (glob or RegExp)
- **esbuild build** — separate Node (plugin) and browser (runtime) bundles with zero runtime dependencies

### Changed

- Package renamed from `console-log-advanced` / `vite-plugin-console-log-advanced` to **`vite-plugin-better-console`**
- Entire codebase rewritten in **TypeScript** with a modular `src/` layout (`plugin`, `logger`, `config`, `caller`, `format`, `types`)
- Build switched from Vite library mode to **esbuild** (`build.mjs`) — fixes Node built-in externalisation issues in CI
- Entry detection no longer uses `ModuleInfo.isEntry` — compatible with **Vite 6+ and Vite 7**
- Default export path is now the **plugin**; runtime lives at `./runtime` (was `./logger` or `./vite` in earlier iterations)
- Badge labels default to uppercase level names (`DEBUG`, `INFO`, …) instead of emoji — emoji still supported via `badge` option

### Removed

- Manual `import 'console-log-advanced'` in every app entry (replaced by plugin auto-injection)
- Class-based API (`new ConsoleLogAdvanced({ … })`) from v1.x
- Node built-in usage (`node:fs`, `node:path`) in the plugin — entry detection uses Vite config and HTML parsing only
- Bun lockfile and single-file root `index.js` layout

### Migration

**From `console-log-advanced` or `vite-plugin-console-log-advanced`:**

```bash
npm uninstall console-log-advanced vite-plugin-console-log-advanced
npm install vite-plugin-better-console
```

```ts
// vite.config.ts
import { betterConsole } from 'vite-plugin-better-console'

export default defineConfig({
  plugins: [betterConsole()],
})
```

```ts
// App code — no import needed
console.better('user loaded', user)          // was: console.logger(...) or log(...)
console.better.warn('slow response', data)   // new: level methods
```

For TypeScript global types:

```ts
/// <reference types="vite-plugin-better-console/runtime" />
```

**Standalone (without Vite):**

```ts
import { createLogger, attachRuntime } from 'vite-plugin-better-console/runtime'

attachRuntime(createLogger({ dev: true }))
console.better.info('ready')
```
