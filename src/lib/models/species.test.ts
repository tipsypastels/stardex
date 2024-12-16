import { test, expect, describe } from "vitest";
import { resolveEvolutionLine, resolveSpecies, type Species } from "./species";

test("resolvePokemon", () => {
  expect(resolveSpecies("nonexistant")).toBeUndefined();
  expect(resolveSpecies("bulbasaur")).toEqual({
    id: 1,
    name: "Bulbasaur",
    type: ["grass", "poison"],
    evos: { to: ["ivysaur"] },
  } satisfies Species);
});

describe("resolveEvolutionLine", () => {
  describe("three-lines", () => {
    test("from bulbasaur", () => {
      expect(resolveEvolutionLine(resolveSpecies("bulbasaur"))).toEqual([
        resolveSpecies("bulbasaur"),
        resolveSpecies("ivysaur"),
        resolveSpecies("venusaur"),
      ]);
    });

    test("from ivysaur", () => {
      expect(resolveEvolutionLine(resolveSpecies("ivysaur"))).toEqual([
        resolveSpecies("bulbasaur"),
        resolveSpecies("ivysaur"),
        resolveSpecies("venusaur"),
      ]);
    });

    test("from venusaur", () => {
      expect(resolveEvolutionLine(resolveSpecies("venusaur"))).toEqual([
        resolveSpecies("bulbasaur"),
        resolveSpecies("ivysaur"),
        resolveSpecies("venusaur"),
      ]);
    });
  });
});
