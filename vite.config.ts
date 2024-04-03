import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: 'export/',
  resolve: {
    alias: [
      {
        find: '@obsidian-truth-or-dare/hooks.js',
        replacement: path.resolve(__dirname, './export/src/hooks.web.js')
      },
      {
        find: '@obsidian-truth-or-dare',
        replacement: path.resolve(__dirname, './src/')
      }
    ]
  }
})
