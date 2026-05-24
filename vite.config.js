import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // mirrors the nginx proxy so `bun dev` and Docker behave identically
      '/api/yt-feed': {
        target: 'https://www.youtube.com',
        changeOrigin: true,
        rewrite: path => path.replace('/api/yt-feed', '/feeds/videos.xml'),
      },
    },
  },
})
