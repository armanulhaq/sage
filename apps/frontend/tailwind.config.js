/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0b0c10',
        card: '#13161f',
        brightYellow: {
          DEFAULT: '#FACC15', // Vibrant bright yellow
          hover: '#FDE047',
          active: '#EAB308',
          glow: 'rgba(250, 204, 21, 0.25)',
        },
      },
      fontFamily: {
        sans: ['"Google Sans"', '"Poppins"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Google Sans"', '"Poppins"', 'sans-serif'],
        heading: ['"Google Sans"', '"Poppins"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
