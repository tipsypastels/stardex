// @ts-check

import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

/** @type {import('rollup').RollupOptions} */
const options = {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.js",
      format: "esm",
      compact: true,
      plugins: [terser()],
    },
  ],
  plugins: [
    nodeResolve(),
    replace({
      preventAssignment: true,
      values: { "process.env.NODE_ENV": "production" },
    }),
    typescript(),
  ],
};

export default options;
