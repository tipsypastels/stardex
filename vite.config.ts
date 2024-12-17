import { defineConfig } from "vitest/config";
import { sveltekit } from "@sveltejs/kit/vite";

export default defineConfig({
  plugins: [
    // @ts-expect-error or something.
    sveltekit(),
  ],

  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
  },
});
