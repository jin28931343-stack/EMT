/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // 設定 Noto Serif TC
        serif: ['"Noto Serif TC"', 'serif'],
      },
      keyframes: {
        // 定義動畫關鍵影格
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        // 定義動畫名稱
        'fade-in-up': 'fade-in-up 0.3s ease-out forwards',
      }
    },
  },
  plugins: [],
}