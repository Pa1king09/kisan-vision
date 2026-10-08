/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-bg': 'var(--bg-primary)',
        'brand-bg-secondary': 'var(--bg-secondary)',
        'brand-bg-tertiary': 'var(--bg-tertiary)',
        'brand-surface': 'var(--surface-solid)',
        'brand-surface-inset': 'var(--surface-inset)',
        'brand-surface-elevated': 'var(--surface-elevated)',
        'brand-text-primary': 'var(--text-primary)',
        'brand-text-secondary': 'var(--text-secondary)',
        'brand-text-tertiary': 'var(--text-tertiary)',
        'brand-text-muted': 'var(--text-muted)',
        'brand-primary': 'var(--accent-primary)',
        'brand-dark': 'var(--accent-hover)',
        'brand-soft': 'var(--accent-soft)',
        'brand-green': 'var(--accent-primary)',
        'brand-gold': 'var(--accent-cyan)',
        'brand-border': 'var(--border-color)',
        'brand-border-strong': 'var(--border-strong)',
        'brand-success': 'var(--success)',
        'brand-warning': 'var(--warning)',
        'brand-danger': 'var(--danger)',
        'brand-info': 'var(--info)',
        'brand-cream': 'var(--surface-solid)',
        'brand-olive': 'var(--text-secondary)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'premium': 'var(--shadow-premium)',
        'premium-hover': 'var(--shadow-premium-hover)',
        'glow': '0 0 20px rgba(16, 185, 129, 0.25)',
        'glow-lg': '0 0 40px rgba(16, 185, 129, 0.3)',
        'glow-sm': '0 0 10px rgba(16, 185, 129, 0.15)',
      },
      fontFamily: {
        'display': ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        'sans': ['Inter', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      transitionDuration: {
        '400': '400ms',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 3s',
        'glow-pulse': 'glowPulse 4s ease-in-out infinite',
        'scanner': 'scanner 4s ease-in-out infinite',
        'gradient-shift': 'gradientShift 15s ease infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.4)' },
          '50%': { boxShadow: '0 0 20px 10px rgba(16, 185, 129, 0.1)' },
        },
        scanner: {
          '0%': { top: '0%', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { top: '100%', opacity: '0' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      blur: {
        '4xl': '120px',
        '5xl': '160px',
      },
    },
  },
  plugins: [],
}
