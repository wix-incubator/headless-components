const colors = require("tailwindcss/colors");

const colorsLightTheme = {
  primary: colors.slate[900],
  "primary-foreground": "#ffffff",
  secondary: "#8b5cf6",
  "secondary-foreground": "#ffffff",
  background: "#ffffff",
  foreground: "#1e293b",
  destructive: "#ef4444",
  "destructive-foreground": "#ffffff",
};

const colorsDarkTheme = {
  primary: "#3b82f6",
  "primary-foreground": "#ffffff",
  secondary: "#8b5cf6",
  "secondary-foreground": "#ffffff",
  background: "#1e293b",
  foreground: "#f1f5f9",
  destructive: "#ef4444",
  "destructive-foreground": "#ffffff",
};

const colorsVibeTheme = {
  foreground: "#FFFFFF",
  background: "#0A0A0A",
  secondary: "#1A1A2E",
  "secondary-foreground": "#FFFFFF",
  "primary-foreground": "#000000",
  primary: "#FF6B35",
  destructive: "#ef4444",
  "destructive-foreground": "#ffffff",
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem", letterSpacing: "-0.01em" }],
        sm: ["0.875rem", { lineHeight: "1.25rem", letterSpacing: "-0.01em" }],
        base: ["1rem", { lineHeight: "1.5rem", letterSpacing: "-0.01em" }],
        lg: ["1.125rem", { lineHeight: "1.75rem", letterSpacing: "-0.01em" }],
        xl: [
          "1.25rem",
          {
            lineHeight: "1.75rem",
            letterSpacing: "-0.01em",
            fontWeight: "bold",
          },
        ],
        "2xl": [
          "1.5rem",
          { lineHeight: "2rem", letterSpacing: "-0.01em", fontWeight: "bold" },
        ],
        "3xl": [
          "1.875rem",
          {
            lineHeight: "2.25rem",
            letterSpacing: "-0.01em",
            fontWeight: "bold",
          },
        ],
        "4xl": [
          "2.25rem",
          {
            lineHeight: "2.5rem",
            letterSpacing: "-0.01em",
            fontWeight: "bold",
          },
        ],
        "5xl": [
          "3rem",
          { lineHeight: "1", letterSpacing: "-0.01em", fontWeight: "bold" },
        ],
        "6xl": [
          "3.75rem",
          { lineHeight: "1", letterSpacing: "-0.01em", fontWeight: "bold" },
        ],
        "7xl": [
          "4.5rem",
          { lineHeight: "1", letterSpacing: "-0.01em", fontWeight: "bold" },
        ],
        "8xl": [
          "5.25rem",
          { lineHeight: "1", letterSpacing: "-0.01em", fontWeight: "bold" },
        ],
        "9xl": [
          "6rem",
          { lineHeight: "1", letterSpacing: "-0.01em", fontWeight: "bold" },
        ],
      },
      fontFamily: {
        heading: ["'Epunda Slab'", "sans-serif"],
        paragraph: ["'Crimson Text'", "serif"],
      },
      colors: {
        ...colorsLightTheme,
        // ...colorsDarkTheme,
        // ...colorsVibeTheme,
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [
    require("@tailwindcss/container-queries"),
    require("@tailwindcss/typography"),
  ],
};

