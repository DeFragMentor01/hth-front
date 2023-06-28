// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          1: '#33CF7A',
          2: '#4BD588',
          3: '#64DB95',
          4: '#7CE1A3',
          5: '#95E8B1',
          6: '#ADF0BF',
          7: '#C6F8CD',
          8: '#DFFFDc',
          9: '#F7FFEA',
          10: '#FFFFFF', 
        },
        secondary: {
          1: '#654EEB',
          2: '#7775F3',
          3: '#899DFB',
          4: '#9BC5FF',
          5: '#ADD3FF',
          6: '#C0E1FF',
          7: '#D3EFFF',
          8: '#E7FDFF',
          9: '#FAFFFE',
          10: '#FFFFFF',
        },
        tertiary: {
          1: '#AE47E0',
          2: '#C059EC',
          3: '#D36BF8',
          4: '#E57DFF',
          5: '#F68FFF',
          6: '#FFA1FF',
          7: '#FFB4FF',
          8: '#FFC7FF',
          9: '#FFDAFF',
          10: '#FFEDFF',
        },
        error: {
          1: '#E14469',
          2: '#E8567B',
          3: '#EF688D',
          4: '#F67A9F',
          5: '#FD8CB1',
          6: '#FF9EC3',
          7: '#FFB0D5',
          8: '#FFC2E7',
          9: '#FFD4F9',
          10: '#FFE6FB',
        },
        info: {
          1: '#E28844',
          2: '#E99456',
          3: '#F0A068',
          4: '#F7AC7A',
          5: '#FEB88C',
          6: '#FFC49E',
          7: '#FFD0B0',
          8: '#FFDCC2',
          9: '#FFE8D4',
          10: '#FFF4E6',
        },
      },
      fontFamily: {
        sans: ['Roboto', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
