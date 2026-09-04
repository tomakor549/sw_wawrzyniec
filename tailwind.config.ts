import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        wine: {
          DEFAULT: "#4C1D1D",
          deep: "#2F1212",
          soft: "#6B2E2E",
        },
        brick: "#8E3B32",
        gold: {
          DEFAULT: "#C9A227",
          pale: "#E8D48B",
          dim: "#8A7018",
        },
        cream: "#F4EDE1",
        paper: "#FBF7F0",
        ink: "#1C1614",
        stone: "#6B5E55",
        sand: "#C4B5A0",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 12px 40px -18px rgba(47, 18, 18, 0.35)",
      },
      maxWidth: {
        prose: "42rem",
      },
    },
  },
  plugins: [],
};

export default config;
