/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF5F2',
          100: '#FFE8E0',
          200: '#FFD4C4',
          300: '#FFB89E',
          400: '#FF9470',
          500: '#E8735A',
          600: '#D45A3F',
          700: '#B04530',
          800: '#8C3626',
          900: '#6B2A1E',
        },
        cream: {
          50: '#FFFDF9',
          100: '#FFF8F0',
          200: '#FDF6EE',
          300: '#F5EDE3',
          400: '#E8DFD5',
          500: '#D4CBC2',
        },
        warm: {
          text: '#2D2017',
          'text-light': '#6B5B4F',
          'text-muted': '#9B8B7F',
        }
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Noto Serif SC"', 'Georgia', 'serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'warm': '0 4px 20px rgba(232, 115, 90, 0.08)',
        'warm-lg': '0 8px 30px rgba(232, 115, 90, 0.12)',
        'card': '0 2px 12px rgba(45, 32, 23, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}
