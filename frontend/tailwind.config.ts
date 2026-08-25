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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        "logro-overlay-fade": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "logro-pop": {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "60%": { transform: "scale(1.1)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "logro-overlay-fade": "logro-overlay-fade 300ms ease-out forwards",
        "logro-pop": "logro-pop 500ms ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
