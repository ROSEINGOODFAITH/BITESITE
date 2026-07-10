/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        laurel: {
          950: '#16261D',
          900: '#22372C',
          800: '#2F4A3C',
          700: '#3D5C4B',
          200: '#C9D6CB',
          100: '#E3EAE2',
        },
        cream: '#F7F2E9',
        sand: '#EADFCB',
        ink: '#20201C',
        gold: '#B98F4E',
        clay: '#A85B38',
      },
      fontFamily: {
        display: ['"Iowan Old Style"', '"Palatino Linotype"', 'Palatino', 'Georgia', 'serif'],
        body: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      maxWidth: {
        site: '75rem',
      },
      keyframes: {
        marquee: {
          '0%': {transform: 'translateX(0)'},
          '100%': {transform: 'translateX(-50%)'},
        },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
      },
    },
  },
  plugins: [],
};
