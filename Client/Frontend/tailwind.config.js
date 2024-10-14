/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
       'poppings' : ['poppings','sans-serif'],
       'jakarta' : [ "Plus Jakarta Sans", 'sans-serif'],
      },
      colors: {
        NavyBlue: '#0A3D62',
        SlateBlue: '#2E5984',
        LightGray: '#D1D5DB',
        SoftBlue: '#A3C3D9',
        TealBlue: '#237F94',
        BG: '#F5F7FA',
        ButtonsBlue: '#0650C6',
        AlaramRed: '#C60606',
      },
    },
  },
  plugins: [],
}