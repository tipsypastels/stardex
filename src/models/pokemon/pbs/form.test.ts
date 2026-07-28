import { readFileSync, writeFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { getPBSFormFilterBuckets } from "./form";
import { parsePBSAsRecords } from "./parse";

describe(getPBSFormFilterBuckets, () => {
  test("everything", () => {
    const records = [
      ...parsePBSAsRecords({
        name: "pokemon.txt",
        text: readFileSync("samples/pbs/pokemon.txt", "utf-8"),
      }).out,
      ...parsePBSAsRecords({
        name: "pokemon_gen9.txt",
        text: readFileSync("samples/pbs/pokemon_gen9.txt", "utf-8"),
      }).out,
      ...parsePBSAsRecords({
        name: "pokemon_forms.txt",
        text: readFileSync("samples/pbs/pokemon_forms.txt", "utf-8"),
      }).out,
      ...parsePBSAsRecords({
        name: "pokemon_forms_gen9.txt",
        text: readFileSync("samples/pbs/pokemon_forms_gen9.txt", "utf-8"),
      }).out,
      ...parsePBSAsRecords({
        name: "pokemon_forms_gmax.txt",
        text: readFileSync("samples/pbs/pokemon_forms_gmax.txt", "utf-8"),
      }).out,
    ];

    const res = getPBSFormFilterBuckets(records);

    writeFileSync("x.json", JSON.stringify(res, null, 2));

    expect(false).toBeTruthy();
  });
});
