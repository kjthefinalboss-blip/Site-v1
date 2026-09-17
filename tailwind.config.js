/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#0d7d4e',
          700: '#065f46',
          800: '#064e3b',
          900: '#022c22',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f5b50a',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        ink: {
          50: '#f8f8f8',
          100: '#f1f1f1',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#333333',
          800: '#1a1a1a',
          900: '#0d0d0d',
          950: '#050505',
        },
      },
      fontFamily: {
        display: ['Poppins', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.8s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.8s ease-out forwards',
        'slide-in-right': 'slideInRight 0.8s ease-out forwards',
        'scale-in': 'scaleIn 0.6s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'float-rotate': 'floatRotate 12s ease-in-out infinite',
        'pulse-slow': 'pulseSlow 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-slow': 'bounceSlow 2s ease-in-out infinite',
        'gradient': 'gradient 8s ease infinite',
        'aurora': 'aurora 18s ease-in-out infinite',
        'aurora-reverse': 'auroraReverse 22s ease-in-out infinite',
        'drift': 'drift 25s ease-in-out infinite',
        'drift-reverse': 'driftReverse 30s ease-in-out infinite',
        'shine': 'shine 1.2s ease-out forwards',
        'marquee': 'marquee 30s linear infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'tilt': 'tilt 8s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-60px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(60px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        aurora: {
          '0%, 100%': { transform: 'translate(0%, 0%) rotate(0deg) scale(1)' },
          '25%': { transform: 'translate(5%, -8%) rotate(3deg) scale(1.1)' },
          '50%': { transform: 'translate(-3%, 5%) rotate(-2deg) scale(0.95)' },
          '75%': { transform: 'translate(8%, 3%) rotate(2deg) scale(1.05)' },
        },
        auroraReverse: {
          '0%, 100%': { transform: 'translate(0%, 0%) rotate(0deg) scale(1)' },
          '25%': { transform: 'translate(-6%, 7%) rotate(-3deg) scale(1.08)' },
          '50%': { transform: 'translate(4%, -5%) rotate(2deg) scale(0.92)' },
          '75%': { transform: 'translate(-8%, -3%) rotate(-2deg) scale(1.05)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(40px, -30px) scale(1.05)' },
          '66%': { transform: 'translate(-30px, 20px) scale(0.98)' },
        },
        driftReverse: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(-35px, 25px) scale(1.08)' },
          '66%': { transform: 'translate(25px, -35px) scale(0.95)' },
        },
        floatRotate: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(5deg)' },
        },
        shine: {
          '0%': { left: '-120%' },
          '100%': { left: '120%' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px -5px var(--glow-color, rgba(16,185,129,0.4))' },
          '50%': { boxShadow: '0 0 40px 0px var(--glow-color, rgba(16,185,129,0.6))' },
        },
        tilt: {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
