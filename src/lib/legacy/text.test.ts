import { describe, test, expect } from "vitest";
import { legacyTextToPokemonList as parse } from "./text";
import { resolveSpecies } from "$lib/models/species";

describe(parse, () => {
  test("single", () => {
    expect(parse("charmander")).toEqual([{ species: resolveSpecies("charmander") }]);
    expect(parse("Charmander")).toEqual([{ species: resolveSpecies("charmander") }]);
  });

  test("multiple", () => {
    expect(parse("charmander\ncharmeleon\ncharizard")).toEqual([
      { species: resolveSpecies("charmander") },
      { species: resolveSpecies("charmeleon") },
      { species: resolveSpecies("charizard") },
    ]);
  });

  test("comments", () => {
    expect(parse("# hello\npikachu")).toEqual([
      { species: resolveSpecies("pikachu"), comment: "hello" },
    ]);
    expect(parse("# hello\n# world\npikachu")).toEqual([
      { species: resolveSpecies("pikachu"), comment: "hello\nworld" },
    ]);
  });

  test("newlines", () => {
    expect(parse("pikachu\n\nraichu")).toEqual([
      { species: resolveSpecies("pikachu") },
      { species: resolveSpecies("raichu"), newlinesBefore: 1 },
    ]);
  });

  test("exclude", () => {
    expect(parse("pikachu @exclude")).toEqual([
      { species: resolveSpecies("pikachu"), exclude: true },
    ]);
    expect(parse("pikachu @ignore")).toEqual([
      { species: resolveSpecies("pikachu"), exclude: true },
    ]);
  });

  test("types", () => {
    expect(parse("pikachu (fire)")).toEqual([
      { species: resolveSpecies("pikachu"), type: ["fire"] },
    ]);
    expect(parse("pikachu (fire/fighting)")).toEqual([
      { species: resolveSpecies("pikachu"), type: ["fire", "fighting"] },
    ]);
  });

  test("types and exclude", () => {
    expect(parse("pikachu (fire) @exclude")).toEqual([
      { species: resolveSpecies("pikachu"), type: ["fire"], exclude: true },
    ]);
    expect(parse("pikachu @exclude (fire)")).toEqual([
      { species: resolveSpecies("pikachu"), type: ["fire"], exclude: true },
    ]);
  });
});
