import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        arc: {
          blue: '#00d4ff',
          purple: '#7c3aed',
          green: '#10b981',
          yellow: '#f59e0b',
          dark: '#030712',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-arc': 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
      },
      animation: {
        'border-glow': 'borderGlow 3s ease-in-out infinite',
        'live-pulse': 'livePulse 1.5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        borderGlow: {
          '0%, 100%': { borderColor: '#00d4ff' },
          '33%': { borderColor: '#7c3aed' },
          '66%': { borderColor: '#10b981' },
        },
        livePulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
