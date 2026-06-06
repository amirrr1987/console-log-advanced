import type { Plugin } from 'vite'
import type { CssStyles, LogLevel, LoggerOptions, TimestampFormat } from './index.d.ts'

export interface ConsoleLogAdvancedOptions extends LoggerOptions {
  /** Auto-inject init into app entries (default: true) */
  inject?: boolean
  /** Explicit entry globs, e.g. `src/main.ts` or `**/bootstrap.ts` */
  injectEntries?: string[]
  /** Extra glob/regex targets for injection beyond Rollup entries */
  injectPattern?: string | RegExp
}

export interface ConsoleLogAdvancedStyles extends CssStyles {}

export type { CssStyles, LogLevel, TimestampFormat }

export function consoleLogAdvanced(options?: ConsoleLogAdvancedOptions): Plugin

declare const plugin: typeof consoleLogAdvanced
export default plugin
