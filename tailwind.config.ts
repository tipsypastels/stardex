import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import defaultTheme from "tailwindcss/defaultTheme";
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    fontFamily: {
      sans: ["Itim", ...defaultTheme.fontFamily.sans],
      serif: ["Itim", ...defaultTheme.fontFamily.serif],
    },
  },

  plugins: [typography, forms],
} satisfies Config;
