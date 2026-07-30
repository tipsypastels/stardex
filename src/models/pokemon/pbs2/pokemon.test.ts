import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { parsePBSAsPokemons, type PBSPokemon } from "./pokemon";

describe(parsePBSAsPokemons, () => {
  test("all", () => {
    const pokemons = new Map<string, PBSPokemon>();

    expect(
      parsePBSAsPokemons(
        { name: "pokemon.txt", text: readFileSync("samples/pbs/pokemon.txt", "utf-8") },
        pokemons,
      ).errors,
    ).toEqual([]);

    expect(
      parsePBSAsPokemons(
        { name: "pokemon_gen9.txt", text: readFileSync("samples/pbs/pokemon_gen9.txt", "utf-8") },
        pokemons,
      ).errors,
    ).toEqual([]);

    for (const pokemon of pokemons.values()) {
      expect(pokemon.raw).toEqual(expect.objectContaining({ species: expect.any(String) }));
    }
  });
});
