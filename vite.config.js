import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.js'),
        vite: resolve(__dirname, 'src/vite.js'),
      },
      formats: ['es'],
      fileName: (_, name) => `${name}.js`,
    },
    rollupOptions: {
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
    minify: false,
    target: 'es2020',
    emptyOutDir: true,
  },
  define: {
    'import.meta.env.DEV': 'import.meta.env.DEV',
    'import.meta.env.PROD': 'import.meta.env.PROD',
    __CONSOLE_LOG_ADVANCED_DEV__: '__CONSOLE_LOG_ADVANCED_DEV__',
    __CONSOLE_LOG_ADVANCED_WARN__: '__CONSOLE_LOG_ADVANCED_WARN__',
    __CONSOLE_LOG_ADVANCED_OPTIONS__: '__CONSOLE_LOG_ADVANCED_OPTIONS__',
  },
})
