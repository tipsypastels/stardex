import { test, expect } from "vitest";
import { resolvePokemon } from "./pokemon";

test("resolvePokemon", () => {
  expect(resolvePokemon("nonexistant")).toBeUndefined();
  expect(resolvePokemon("bulbasaur")).toEqual({
    id: 1,
    name: "Bulbasaur",
    type: ["grass", "poison"],
    evos: ["ivysaur"],
  });
});
