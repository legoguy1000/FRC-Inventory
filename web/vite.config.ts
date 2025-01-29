import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        watch: {
            usePolling: true
        },
        headers: {
            "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
        },
        cors: {
            // the origin you will be accessing via browser
            origin: 'http://localhost:3000',
        },
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, '')
            }
        },
    }
})
