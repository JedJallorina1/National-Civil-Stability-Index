import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/retrieveData': {
        target: 'https://nationalcivilstabilityindex.netlify.app/',
        changeOrigin: true
      },
      '/initiateCookies':{
        target: 'https://nationalcivilstabilityindex.netlify.app/',
        changeOrigin: true
      }
    }
  }
})
