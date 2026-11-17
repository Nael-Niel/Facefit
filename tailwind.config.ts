import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FAF9F6",
          100: "#F8F6F2",
          200: "#EDF2F4",
          300: "#E2E8F0",
        },
        terracotta: {
          50: "#FBF6F3",
          100: "#F4E8E2",
          200: "#E7CEBF",
          300: "#D3A992",
          400: "#B87A5B",
          500: "#7C432B",
          600: "#6B3823",
          700: "#5A2E1C",
          800: "#4A2C1D",
          900: "#361E14",
        },
        olive: {
          50: "#F6F8F4",
          100: "#EAF0E6",
          200: "#D5E1CD",
          300: "#B6CCAA",
          400: "#91B082",
          500: "#6B7F5E",
          600: "#55674A",
          700: "#43523B",
          800: "#364130",
          900: "#2B3427",
        },
        charcoal: {
          50: "#F7F7F7",
          100: "#E3E3E3",
          200: "#C8C8C8",
          300: "#A4A4A4",
          400: "#737373",
          500: "#525252",
          600: "#3A3A3A",
          700: "#2B2B2B",
          800: "#1E1E1E",
          900: "#141414",
          950: "#0D0D0D",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        serif: ["'Playfair Display'", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
