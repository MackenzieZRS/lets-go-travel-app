import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          DEFAULT: "var(--color-terracotta)",
          muted: "var(--color-terracotta-muted)",
        },
        sage: {
          DEFAULT: "var(--color-sage)",
          light: "var(--color-sage-light)",
        },
        "dusty-blue": {
          DEFAULT: "var(--color-dusty-blue)",
          light: "var(--color-dusty-blue-light)",
        },
        sand: {
          DEFAULT: "var(--color-sand)",
          dark: "var(--color-sand-dark)",
        },
        charcoal: {
          DEFAULT: "var(--color-charcoal)",
          light: "var(--color-charcoal-light)",
          mid: "var(--color-charcoal-mid)",
        },
      },
      fontFamily: {
        playfair: ["var(--font-playfair-display)", "serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
