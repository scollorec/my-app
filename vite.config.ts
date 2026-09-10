import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

const isGitHubPagesBuild = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.GITHUB_ACTIONS === 'true'

export default defineConfig({
  // GitHub Pages serves this project from /hygienecheck-uk/, not the domain root.
  // Without this, the deployed page requests /assets/* and renders blank.
  base: isGitHubPagesBuild ? '/hygienecheck-uk/' : '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true,
  },
})
