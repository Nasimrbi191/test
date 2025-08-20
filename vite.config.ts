import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true,
        type: 'module', // Use ES modules for the service worker,
      },
      includeAssets: [
        'favicon.svg',
        'robots.txt',
        'pwa-icons/*',
        'pwa-splash-screens/*',
      ],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,json}'], // cache all assets
        runtimeCaching: [
          {
            urlPattern: /./, // match all requests
            handler: 'NetworkFirst',
            options: {
              cacheName: 'app-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
        ]
      },
    })
  ],
  server: {
    port: 3003
  }
})
