import { defineConfig } from 'vite'
import consoleLogAdvanced from '../../dist/vite.js'

export default defineConfig({
  plugins: [consoleLogAdvanced()],
})
