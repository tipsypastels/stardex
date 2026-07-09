import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [preact(), tailwindcss()],
  // @ts-ignore I don't want @types/node just for this.
  base: process.env.BASE,
});
