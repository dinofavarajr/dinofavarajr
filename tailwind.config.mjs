/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary:    '#6B5CE7',
        periwinkle: '#A89FF5',
        mint:       '#3BFFB3',
        dark:       '#1A1523',
        'off-white':'#F7F5FF',
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        light:  '300',
        normal: '400',
        medium: '500',
      },
      animation: {
        'fade-up':   'fadeUp 0.6s ease forwards',
        'count-up':  'countUp 0.4s ease forwards',
        'slide-in':  'slideIn 0.5s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
