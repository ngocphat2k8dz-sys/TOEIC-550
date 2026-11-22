import { defineConfig, loadEnv } from 'vite'
import { isPublicSupabaseKey } from './src/lib/publicSupabaseKey'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_SUPABASE_')
  const url = env.VITE_SUPABASE_URL?.trim()
  const key = env.VITE_SUPABASE_ANON_KEY?.trim()
  if (key && !isPublicSupabaseKey(key)) {
    throw new Error('VITE_SUPABASE_ANON_KEY requires an anon or publishable key.')
  }
  if (Boolean(url) !== Boolean(key)) {
    throw new Error('Set both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, or leave both empty for guest mode.')
  }
  return {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (key && id.includes('/node_modules/@supabase/')) return 'supabase'
            if (/\/data\/curriculum\/(starter-basics|starter-sentences|foundation-core|foundation-extension)\.ts$/.test(id)) return 'curriculum-material'
          },
        },
      },
    },
  }
})
