import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import PluginRewriteAll from 'vite-plugin-rewrite-all'


// https://vitejs.dev/config/
export default defineConfig({
  
  scripts: {
    "build": "vite build",
    "preview": "vite preview"
  },

  proxy: {
    // Configura aquí tu proxy
    "/api": {
      target: "http://localhost:8800", // URL base del servidor que deseas hacer proxy
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ""), // Elimina el prefijo '/api' de la ruta
    },
  },
  plugins: [react(), tailwindcss(), PluginRewriteAll()],
});
