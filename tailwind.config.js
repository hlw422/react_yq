/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1677FF',
          light: '#4096FF',
          dark: '#0958D9',
        },
        yuque: {
          bg: '#FFFFFF',
          surface: '#F5F7FA',
          border: '#E5E6EB',
          text: '#1F1F1F',
          'text-secondary': '#8C8C8C',
          'text-hint': '#BFBFBF',
        },
        dark: {
          bg: '#1E1E1E',
          surface: '#252526',
          border: '#3C3C3C',
          text: '#CCCCCC',
          'text-secondary': '#999999',
          'text-hint': '#666666',
        }
      },
      fontFamily: {
        sans: ['PingFang SC', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Consolas', 'Monaco', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}
