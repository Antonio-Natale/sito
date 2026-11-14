/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  // Tema scuro: classe "dark" su <html>, impostata in BaseLayout (scelta salvata o impostazioni del dispositivo)
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
        // titoli (h1, h2, h3: vedi src/styles/global.css)
        display: ['"Bricolage Grotesque Variable"', '"Inter Variable"', 'system-ui', 'sans-serif'],
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
          900: '#0a1f5c',
          950: '#06133a'
        }
      }
    }
  },
  plugins: []
};
