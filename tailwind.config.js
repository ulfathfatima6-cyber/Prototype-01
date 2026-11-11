/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        crimson: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#F43F5E',
          600: '#E11D48',
          700: '#BE123C',
          800: '#9F1239',
          900: '#881337',
          950: '#4C0519',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-alert': 'pulseAlert 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-up': 'fadeUp 0.5s ease-out both',
        'fade-in': 'fadeIn 0.3s ease-out both',
        'slide-in': 'slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
        'drop-fall': 'dropFall 5s linear infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        pulseAlert: {
          '0%, 100%': {
            boxShadow:
              '0 0 0 0 rgba(190, 18, 60, 0.55), 0 10px 24px -8px rgba(190, 18, 60, 0.5)',
          },
          '50%': {
            boxShadow:
              '0 0 0 12px rgba(190, 18, 60, 0), 0 10px 24px -8px rgba(190, 18, 60, 0.5)',
          },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        dropFall: {
          '0%': { transform: 'translateY(-8px)', opacity: '0' },
          '15%': { opacity: '1' },
          '85%': { opacity: '1' },
          '100%': { transform: 'translateY(120px)', opacity: '0' },
        },
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
};
