import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 注意：這裡不需要 tailwindcss 插件
export default defineConfig({
  base: '/EMT/',
  plugins: [react()],
})