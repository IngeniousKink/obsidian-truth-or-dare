import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
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
