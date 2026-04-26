import type { Config } from "tailwindcss";
import { Playfair_Display, Inter } from "next/font/google";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)"
        },
        border: "var(--border)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        danger: "var(--danger)",
        // Keep these legacy colors temporarily to prevent breaking old classes
        champagne: "#F7E1D7",
        taupe: "#8C838A",
        burgundy: "#800020",
        beige: "#FAF9F6",
        gold: {
          light: "#EEDFAE",
          DEFAULT: "#D4AF37",
          dark: "#AA8B2C"
        }
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -10px rgba(0,0,0,0.08)',
        'luxury-dark': '0 20px 40px -10px rgba(0,0,0,0.5), 0 0 40px -10px rgba(212,175,55,0.03)',
        'glow': '0 0 20px rgba(212, 175, 55, 0.4)',
      },
      backgroundImage: {
        'premium-gradient': 'linear-gradient(135deg, var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};
export default config;
