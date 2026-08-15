/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      /* ======================================================
         BRAND TOKENS — the only place to change the look.
         Colours below map to the Tailwind utilities used
         across the app (bg-paper, text-ink, border-green-300…).
         ====================================================== */
      colors: {
        paper: '#FAF8F5',
        surface: '#FFFFFF',
        ink: {
          DEFAULT: '#1C1C1E',
          muted: '#6E6E73',
        },
        gray: {
          card: '#EFEEEC',
        },
        green: {
          100: '#D8EFE2',
          300: '#74C69D',
          500: '#2D6A4F',
          700: '#1B4332',
          900: '#0F2A1E',
        },
        red: {
          100: '#FBD7DA',
          500: '#E63946',
          600: '#D62839',
          700: '#B21E2C',
        },
      },
      fontFamily: {
        display: ['Anton', 'Impact', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        display: '0.02em',
      },
      boxShadow: {
        card: '0 1px 3px rgba(28, 28, 30, 0.08), 0 8px 24px rgba(28, 28, 30, 0.08)',
        modal: '0 8px 40px rgba(28, 28, 30, 0.22)',
      },
    },
  },
  plugins: [],
};
