import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { readPBSSampleSync } from "./_test_utils";
import { getPBSFormFilterBuckets } from "./form";
import { parsePBSAsRecords } from "./parse";

describe(getPBSFormFilterBuckets, () => {
  test("everything", () => {
    const records = [
      ...parsePBSAsRecords(readPBSSampleSync("pokemon", readFileSync)).out,
      ...parsePBSAsRecords(readPBSSampleSync("pokemon_forms", readFileSync)).out,
      ...parsePBSAsRecords(readPBSSampleSync("pokemon_gen9", readFileSync)).out,
      ...parsePBSAsRecords(readPBSSampleSync("pokemon_forms_gen9", readFileSync)).out,
    ];

    expect(getPBSFormFilterBuckets(records)).toEqual([]);
  });
});
