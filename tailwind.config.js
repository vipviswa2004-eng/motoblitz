/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-red': {
          DEFAULT: '#E51E2B',
          hover: '#FF2A38',
          dark: '#B8131D',
          glow: 'rgba(229, 30, 43, 0.35)',
        },
        'brand-orange': {
          DEFAULT: '#FF6E1A',
          hover: '#FF853A',
          dark: '#D95507',
          glow: 'rgba(255, 110, 26, 0.35)',
        },
        'dark': {
          base: '#0A0B0E',
          surface: '#12141C',
          card: '#171A24',
          'card-hover': '#1E2230',
          border: '#252A3A',
          'border-light': '#363D52',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        racing: ['Rajdhani', 'sans-serif'],
      },
      backgroundImage: {
        'fire-gradient': 'linear-gradient(135deg, #E51E2B 0%, #FF6E1A 100%)',
        'carbon-mesh': 'radial-gradient(circle at 50% 50%, #151822 0%, #0A0B0E 100%)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'rev-sweep': 'revSweep 1.5s ease-in-out infinite',
        'float-slow': 'floatSlow 4s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.03)' },
        },
        revSweep: {
          '0%': { transform: 'rotate(-45deg)' },
          '50%': { transform: 'rotate(135deg)' },
          '100%': { transform: 'rotate(-45deg)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
