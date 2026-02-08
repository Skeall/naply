/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        naply: {
          // Primary palette - calm blues and purples
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        sage: {
          50: '#f8faf9',
          100: '#f1f5f2',
          200: '#e2eae4',
          300: '#c8d7cc',
          400: '#a8bfad',
          500: '#8ba490',
          600: '#718777',
          700: '#5d6f62',
          800: '#4c5a52',
          900: '#404a44',
          950: '#242c26',
        },
        dark: {
          DEFAULT: '#0f172a',
          card: '#1e293b',
          border: '#334155',
        }
      },
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      backgroundImage: {
        'gradient-calm': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0c4a6e 100%)',
        'gradient-sage': 'linear-gradient(135deg, #242c26 0%, #404a44 50%, #5d6f62 100%)',
        'gradient-mesh': 'radial-gradient(circle at 20% 80%, #0ea5e9 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8ba490 0%, transparent 50%), radial-gradient(circle at 40% 40%, #1e293b 0%, transparent 50%)',
      }
    },
  },
  plugins: [],
}
