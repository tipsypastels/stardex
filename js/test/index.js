// @ts-check
/// <reference types="../node_modules/@types/mocha" />

import { starLangLanguage } from "../dist/index.js";
import { fileTests } from "@lezer/generator/dist/test";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const CASE_FILE_PATH = /\.txt$/;
const CASE_FILE_NAME = /^[^\.]*/;

const dir = path.dirname(fileURLToPath(import.meta.url));
const language = starLangLanguage();

for (const file of fs.readdirSync(dir)) {
  if (!CASE_FILE_PATH.test(file)) {
    continue;
  }

  const name = CASE_FILE_NAME.exec(file)?.[0];
  if (!name) {
    continue;
  }

  describe(name, () => {
    const contents = fs.readFileSync(path.join(dir, file), "utf-8");
    const tests = fileTests(contents, file);

    for (const { name, run } of tests) {
      it(name, () => {
        run(language.parser);
      });
    }
  });
}
