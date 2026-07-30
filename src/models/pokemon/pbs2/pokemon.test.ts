import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { parsePBSAsPokemons } from "./pokemon";

describe(parsePBSAsPokemons, () => {
  test("all", () => {
    const pokemons = [
      ...parsePBSAsPokemons({
        name: "pokemon.txt",
        text: readFileSync("samples/pbs/pokemon.txt", "utf-8"),
      }).pokemons,
      ...parsePBSAsPokemons({
        name: "pokemon_gen9.txt",
        text: readFileSync("samples/pbs/pokemon_gen9.txt", "utf-8"),
      }).pokemons,
    ];

    for (const pokemon of pokemons) {
      expect(pokemon.raw).toEqual(expect.objectContaining({ species: expect.any(String) }));
    }
  });
});
