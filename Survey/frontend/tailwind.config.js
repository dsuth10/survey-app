import {heroui} from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Non-HeroUI custom colours — do NOT put "primary" here, it breaks
        // HeroUI's CSS variable generation. Configure HeroUI colours via the plugin below.
        "background-light": "#f6f6f8",
        "background-dark": "#101622",
      },
      fontFamily: {
        display: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              50:  "#e6edfa",
              100: "#bdd0f3",
              200: "#94b3ec",
              300: "#6a96e5",
              400: "#4179de",
              500: "#0f49bd",
              600: "#0d41aa",
              700: "#0a3890",
              800: "#082f77",
              900: "#05205e",
              DEFAULT: "#0f49bd",
              foreground: "#ffffff",
            },
          },
        },
        dark: {
          colors: {
            primary: {
              50:  "#e6edfa",
              100: "#bdd0f3",
              200: "#94b3ec",
              300: "#6a96e5",
              400: "#4179de",
              500: "#0f49bd",
              600: "#0d41aa",
              700: "#0a3890",
              800: "#082f77",
              900: "#05205e",
              DEFAULT: "#0f49bd",
              foreground: "#ffffff",
            },
          },
        },
      },
    }),
  ],
};
