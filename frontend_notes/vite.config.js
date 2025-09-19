import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // config proxy -> localhost:5317/api sẽ thành localhost:3001/api
  server: {
    proxy: {
      '/api' : {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
})
