import { mergeConfig } from 'vite'
import { defineConfig } from 'vitest/config'

import viteConfig from './vite.config.js'

export default mergeConfig(
  viteConfig({ command: 'serve', mode: 'dev' }),
  defineConfig({
    define: {
      // Ensure process.env.NODE_ENV is properly set
      'process.env.NODE_ENV': JSON.stringify('development'),
    },
    test: {
      // Default to dev mode for all tests
      environment: 'jsdom',
      environmentOptions: {
        // Ensure React is in development mode
        customExportConditions: ['node', 'development'],
      },
      globals: true,
      setupFiles: './src/setupTests.js',
    },
  })
)
