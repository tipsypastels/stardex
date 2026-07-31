import type { RawBuiltinPokemon, RawCustomPokemon, RawPokemon } from ".";
import { mapOfArraysAppend } from "../../utils/collection/map";

export type RawPokemonWithoutClaimedId =
  Omit<RawBuiltinPokemon, "id"> | Omit<RawCustomPokemon, "id">;

export class PokemonIdDump {
  // NOTE: This supports having multiple Pokemon with the same key,
  // but the only consumer of this API right now, PBS file importer,
  // requires Pokemon to be unique. Keep support in case we want
  // this for text editor file importing in the future.
  #map = new Map<string, string[]>();

  constructor(pokemons: RawPokemon[]) {
    for (const pokemon of pokemons) {
      const key = this.#makeKey(pokemon);
      mapOfArraysAppend(this.#map, key, pokemon.id);
    }
  }

  claim(pokemon: RawPokemonWithoutClaimedId) {
    const key = this.#makeKey(pokemon);
    const ids = this.#map.get(key);
    if (!ids || ids.length === 0) return;
    return ids.splice(0, 1)[0];
  }

  #makeKey(pokemon: RawPokemonWithoutClaimedId) {
    if ("species" in pokemon) {
      return `${pokemon.species}:${pokemon.alt ?? pokemon.customAltName ?? ""}`;
    } else {
      return `${pokemon.name}:${pokemon.altName ?? ""}`;
    }
  }
}
