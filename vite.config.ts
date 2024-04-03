import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: 'export/',
  resolve: {
    alias: {
      '@obsidian-truth-or-dare': path.resolve(__dirname, './src/')
    },
  }
})
