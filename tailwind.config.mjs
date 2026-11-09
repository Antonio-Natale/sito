/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  // Tema scuro automatico, in base alle impostazioni del dispositivo
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#b3ccff',
          300: '#80a8ff',
          400: '#4d80ff',
          500: '#245bff',
          600: '#1240db',
          700: '#0f32a8',
          800: '#0c2777',
          900: '#0a1f5c'
        }
      }
    }
  },
  plugins: []
};
