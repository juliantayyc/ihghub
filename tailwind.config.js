// tailwind.config.js
const { fontFamily } = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        color: {
          1: '#FFB266', // Lighter orange color
          2: '#FFE580', // Lighter yellow color
          3: '#FF9999', // Lighter red color
          4: '#99FF99', // Lighter green color
          5: '#99CCFF', // Lighter blue color
          6: '#FF99CC', // Lighter pink color
        },
        stroke: {
          1: '#333333', // Softer black color for strokes
        },
        n: {
          1: '#333333', // Set n-1 to softer black for text
          2: '#666666', // Softer gray for secondary text
          3: '#999999', // Light gray for secondary text
          4: '#CCCCCC', // Lighter gray for disabled text
          5: '#E0E0E0', // Very light gray
          6: '#F0F0F0', // Even lighter gray
          7: '#FFFFFF', // Set n-7 to white for background
          8: '#FFF5E6', // Lighter cream color
          9: '#D9D9D9', // Even lighter gray
          10: '#CCCCCC', // Light gray
          11: '#B3B3B3', // Lighter gray
          12: '#999999', // Light gray
          13: '#666666', // Softer gray
        },
      },
      fontFamily: {
        sans: ['var(--font-sora)', ...fontFamily.sans],
        code: 'var(--font-code)',
        grotesk: 'var(--font-grotesk)',
      },
      letterSpacing: {
        tagline: '.15em',
      },
      spacing: {
        0.25: '0.0625rem',
        7.5: '1.875rem',
        15: '3.75rem',
      },
      opacity: {
        15: '.15',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'linear',
      },
      zIndex: {
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
      },
      borderWidth: {
        DEFAULT: '0.0625rem',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(var(--tw-gradient-stops))',
        'conic-gradient':
          'conic-gradient(from 225deg, #FFE580, #FFB266, #FF9999, #99FF99, #99CCFF, #FF99CC, #FFE580)',
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, addComponents, addUtilities }) {
      addBase({});
      addComponents({
        '.container': {
          '@apply max-w-[77.5rem] mx-auto px-5 md:px-10 lg:px-15 xl:max-w-[87.5rem]':
            {},
        },
        '.h1': {
          '@apply font-semibold text-[2.5rem] leading-[3.25rem] md:text-[2.75rem] md:leading-[3.75rem] lg:text-[3.25rem] lg:leading-[4.0625rem] xl:text-[3.75rem] xl:leading-[4.5rem]':
            {},
        },
        '.h2': {
          '@apply text-[1.75rem] leading-[2.5rem] md:text-[2rem] md:leading-[2.5rem] lg:text-[2.5rem] lg:leading-[3.5rem] xl:text-[3rem] xl:leading-tight':
            {},
        },
        '.h3': {
          '@apply text-[2rem] leading-normal md:text-[2.5rem]': {},
        },
        '.h4': {
          '@apply text-[2rem] leading-normal': {},
        },
        '.h5': {
          '@apply text-2xl leading-normal': {},
        },
        '.h6': {
          '@apply font-semibold text-lg leading-8': {},
        },
        '.body-1': {
          '@apply text-[0.875rem] leading-[1.5rem] md:text-[1rem] md:leading-[1.75rem] lg:text-[1.25rem] lg:leading-8':
            {},
        },
        '.body-2': {
          '@apply font-light text-[0.875rem] leading-6 md:text-base': {},
        },
        '.caption': {
          '@apply text-sm': {},
        },
        '.tagline': {
          '@apply font-grotesk font-light text-xs tracking-tagline uppercase':
            {},
        },
        '.quote': {
          '@apply font-code text-lg leading-normal': {},
        },
        '.button': {
          '@apply font-code text-xs font-bold uppercase tracking-wider': {},
        },
      });
      addUtilities({
        '.tap-highlight-color': {
          '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
        },
      });
    }),
  ],
};
