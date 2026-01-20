import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    server: {
        host: '0.0.0.0', // Allow access from network
        port: 5173,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    optimizeDeps: {
        esbuildOptions: {
            define: {
                global: 'globalThis'
            }
        }
    },
    build: {
        commonjsOptions: {
            transformMixedEsModules: true
        }
    }
});
