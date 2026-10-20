import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { apiDevPlugin } from "./dev/apiDevPlugin";
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),apiDevPlugin()],
})
