/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        slab: '#f3efe8',
        pour: '#e6e0d4',
        hoarding: '#141311',
        deep: '#0d0c0b',
        spruce: '#1d1b18',
        moss: '#3a362f',
        ply: '#b89a68',
        'ply-light': '#e8dfca',
        survey: '#c2a36d',
        'survey-deep': '#7a5f2e',
        ink: '#16140f',
        'on-dark': '#efeae0',
      },
      fontFamily: {
        sans: ['"Instrument Sans Variable"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['"Fraunces Variable"', 'Georgia', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
};
