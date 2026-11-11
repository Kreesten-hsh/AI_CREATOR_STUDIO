/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-red': '#B63131',
        'dark-red': '#922626',
        'dusty-pink': '#E6A0A8',
        'pale-pink': '#F7E0E2',
        cream: '#FAF6F0',
        surface: '#FFFDFC',
        ink: '#171313',
      },
      fontFamily: {
        display: ['"Archivo Black"', '"Syne"', 'Impact', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      boxShadow: {
        'brutal-xs': '2px 2px 0px #171313',
        'brutal': '4px 4px 0px #171313',
      },
      borderRadius: {
        'brutal-tag': '4px',
        'brutal-btn': '6px',
        'brutal-card': '8px',
      },
    },
  },
  plugins: [],
};
