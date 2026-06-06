import type { Plugin } from 'vite'
export type { BetterConsoleOptions, LoggerOptions, LogLevel, LogCallOptions, ThemeStyles } from './types.js'
export { betterConsole } from './plugin.js'
export default betterConsole

declare function betterConsole(options?: import('./types.js').BetterConsoleOptions): Plugin
