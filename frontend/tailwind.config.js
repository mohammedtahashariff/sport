/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#070C1B',
          800: '#0B132B',
          700: '#1C2541',
          600: '#263456',
          500: '#3A506B',
        },
        sport: {
          orange: '#FF6B00',
          orangeHover: '#E55F00',
          green: '#10B981',
          greenHover: '#059669',
          cyan: '#06B6D4',
          yellow: '#FBBF24',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-orange': '0 0 25px -5px rgba(255, 107, 0, 0.4)',
        'glow-green': '0 0 25px -5px rgba(16, 185, 129, 0.4)',
        'card-hover': '0 12px 30px -10px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
};
