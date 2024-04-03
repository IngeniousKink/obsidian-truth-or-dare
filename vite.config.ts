import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
  ],
  define: {
    // By default, Vite doesn't include shims for NodeJS/
    // necessary for ecpair.js to work
    global: {},
  },
  root: 'web/',
  resolve: {
    alias: [
      {
        find: '@obsidian-truth-or-dare/hooks.js',
        replacement: path.resolve(__dirname, './web/src/hooks.web.js')
      },
      {
        find: '@obsidian-truth-or-dare',
        replacement: path.resolve(__dirname, './src/')
      }
    ]
  }
})
