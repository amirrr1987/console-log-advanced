# Changelog

All notable changes to this project are documented here.

The repository history begins with a single commit (`Initial commit`, 2022-05-14).  
**v1.0.0** is the first published release of the current codebase.

## [1.0.0] — 2026-06-06

First release — Vite plugin + advanced dev logger.

### Added

- **Vite plugin** (`console-log-advanced/vite`) — configure everything in `vite.config.js`
- **`console.logger`** — global logger attached automatically (no app imports)
- **Auto-injection** — virtual module injected into app entry files
- **Caller info** — auto file, line, and function name from stack trace
- **Log levels** — `debug`, `info`, `warn`, `error` with `logLevel` filtering
- **Level helpers** — `console.logger.debug/info/warn/error()`
- **Grouped output** — collapsible `console.group` with styled headers
- **CSS styling** — configurable `%c` styles per level via `cssStyles`
- **Smart formatting** — `Object`, `Array`, `Map`, `Set`, `Promise`, `Date`, `Error`
- **Timestamp presets** — `locale`, `iso`, `time-only`, `date-only`
- **Display toggles** — `showPath`, `showLine`, `showFunction`, `showType`, `time`, `collapsed`
- **Injection targets** — `injectEntries`, `injectPattern`, `inject` flag
- **Production silence** — dev-only logging via Vite `define` + dead-code elimination
- **Node.js support** — works without Vite via `import` / `createLogger`
- **TypeScript** — full type definitions for logger and plugin options

### Package

- Zero runtime dependencies
- ESM-only (`type: module`)
- Peer dependency: `vite >= 5` (optional, for plugin subpath)
- Build via Vite library mode (`npm run build`)

[1.0.0]: https://github.com/amirrr1987/console-log-advanced/releases/tag/v1.0.0
