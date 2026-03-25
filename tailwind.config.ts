import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mystic: {
          bg: "#0B0D1A",
          card: "#111427",
          cardHover: "#161938",
          elevated: "#1A1D35",
          input: "#0D1020",
        },
        gold: {
          DEFAULT: "#D4A843",
          light: "#E8C66A",
          dark: "#A07D2E",
          subtle: "rgba(212,168,67,0.15)",
          glow: "rgba(212,168,67,0.20)",
        },
        text: {
          primary: "#F0EBE0",
          secondary: "#9B9484",
          muted: "#5C5647",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        accent: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      boxShadow: {
        gold: "0 0 20px rgba(212,168,67,0.20)",
        "gold-lg": "0 0 40px rgba(212,168,67,0.20)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulsSubtle: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212,168,67,0.20)" },
          "50%": { boxShadow: "0 0 32px rgba(212,168,67,0.45)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out both",
        "pulse-subtle": "pulsSubtle 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
