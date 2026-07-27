import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { readPBSSampleSync } from "./_test_utils";
import { parsePBSAsRecords } from "./parse";
import { getPBSRecordSectionSpecies } from "./species";

describe(getPBSRecordSectionSpecies, () => {
  test("all", () => {
    const records = [
      ...parsePBSAsRecords(readPBSSampleSync("pokemon", readFileSync)).out,
      ...parsePBSAsRecords(readPBSSampleSync("pokemon_gen9", readFileSync)).out,
    ];

    // PBS uses a different apostrophe character. This
    // does not matter, ignore it.
    const ignoreNameMismatches = new Set(["farfetchd", "sirfetchd"]);

    for (const record of records) {
      const species = getPBSRecordSectionSpecies(record.section);
      if (!(species && ignoreNameMismatches.has(species.key))) {
        expect(species?.name).toEqual(record.fields.name);
      }
    }
  });
});
