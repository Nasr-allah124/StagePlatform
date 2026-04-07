import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const phpHost = env.VITE_PHP_HOST || 'http://localhost'
  const phpApiBasePath =
    env.VITE_PHP_BASE_PATH || '/projet_platforme/projet_php_backend/api'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: phpHost,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, phpApiBasePath),
        },
      },
    },
  }
})
