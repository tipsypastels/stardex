import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { parsePBSAsRecords } from "./parse";
import { getPBSRecordSectionSpecies } from "./species";

describe(getPBSRecordSectionSpecies, () => {
  test("all", () => {
    const records = [
      ...parsePBSAsRecords({
        name: "pokemon.txt",
        text: readFileSync("samples/pbs/pokemon.txt", "utf-8"),
      }).out,
      ...parsePBSAsRecords({
        name: "pokemon_gen9.txt",
        text: readFileSync("samples/pbs/pokemon_gen9.txt", "utf-8"),
      }).out,
    ];

    // PBS uses a different apostrophe character. This
    // does not matter, ignore it.
    const ignoreNameMismatches = new Set(["farfetchd", "sirfetchd"]);

    for (const record of records) {
      const species = getPBSRecordSectionSpecies(record.section, record.fields.name);

      if (species && ignoreNameMismatches.has(species.key)) {
        expect(species).toBeTruthy();
      } else {
        expect(species?.name).toBe(record.fields.name);
      }
    }
  });
});
