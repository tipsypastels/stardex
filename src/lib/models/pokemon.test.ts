import { test, expect, describe } from "vitest";
import { resolveEvolutionLine, resolvePokemon, type Pokemon } from "./pokemon";

test("resolvePokemon", () => {
  expect(resolvePokemon("nonexistant")).toBeUndefined();
  expect(resolvePokemon("bulbasaur")).toEqual({
    id: 1,
    name: "Bulbasaur",
    type: ["grass", "poison"],
    evos: { to: ["ivysaur"] },
  } satisfies Pokemon);
});

describe("resolveEvolutionLine", () => {
  describe("three-lines", () => {
    test("from bulbasaur", () => {
      expect(resolveEvolutionLine(resolvePokemon("bulbasaur"))).toEqual([
        resolvePokemon("bulbasaur"),
        resolvePokemon("ivysaur"),
        resolvePokemon("venusaur"),
      ]);
    });

    test("from ivysaur", () => {
      expect(resolveEvolutionLine(resolvePokemon("ivysaur"))).toEqual([
        resolvePokemon("bulbasaur"),
        resolvePokemon("ivysaur"),
        resolvePokemon("venusaur"),
      ]);
    });

    test("from venusaur", () => {
      expect(resolveEvolutionLine(resolvePokemon("venusaur"))).toEqual([
        resolvePokemon("bulbasaur"),
        resolvePokemon("ivysaur"),
        resolvePokemon("venusaur"),
      ]);
    });
  });
});
