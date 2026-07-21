import { fileTests } from "@lezer/generator/test";
import * as fs from "node:fs";
import { describe, it } from "vitest";
import { parser } from "./parse";

const testsFile = "parse.test.txt";
const tests = fs.readFileSync(`${import.meta.dirname}/${testsFile}`, "utf-8");

describe("parser", () => {
  for (const test of fileTests(tests, testsFile)) {
    it(test.name, () => {
      test.run(parser);
    });
  }
});
