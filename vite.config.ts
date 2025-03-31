import { defineConfig } from "vitest/config";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    // @ts-expect-error or something.
    sveltekit(),
    // @ts-expect-error or something.
    tailwindcss(),
  ],

  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
  },
});
