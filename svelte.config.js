// @ts-check

import { mdsvex } from "mdsvex";
import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [vitePreprocess(), mdsvex()],

  kit: {
    adapter: adapter(),
    paths: {
      base: process.argv.includes("dev") ? "" : `/${process.env.GH_REPO_NAME}`,
    },
  },

  extensions: [".svelte", ".svx"],
};

export default config;