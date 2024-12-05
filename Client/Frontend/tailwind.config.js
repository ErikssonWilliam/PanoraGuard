/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      // for windowsizes
      xs: "480px", // Small phones
      sm: "640px", // Phones
      md: "768px", // Tablets
      lg: "1024px", // Small laptops
      xl: "1280px", // Desktops
      "2xl": "1536px", // Large desktops
      "4k": "2560px", // 4K displays
      //for window sizes ends
      sd: "1024px", // Large screens: standard laptops and smaller desktops
      hd: "1280px", // Extra-large screens: wider desktops
      fhd: "1920px", // Full HD
      wuxga: { raw: "(min-width: 1920px) and (min-height: 1200px)" }, //WUXGA
    },
    extend: {
      fontFamily: {
        poppings: ["poppings", "sans-serif"],
        jakarta: ["Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        NavyBlue: "#0A3D62",
        SlateBlue: "#2E5984",
        LightGray: "#D1D5DB",
        SoftBlue: "#A3C3D9",
        TealBlue: "#237F94",
        BG: "#F5F7FA",
        ButtonsBlue: "#0650C6",
        AlaramRed: "#C60606",
        NewRed: "#D43941",
        NewYellow: "#E4B468",
      },
      keyframes: {
        float: {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
          "100%": { transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
