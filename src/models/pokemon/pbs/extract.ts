import type { RawPokemon } from "..";
import { iterFilter } from "../../../utils/collection/iter";
import type { PBSDex } from "./dex";
import type { PBSForm } from "./form";
import type { PBSPokemon } from "./pokemon";

export interface ExtractPBSPokemonsToRawPokemonsOptions {
  pokemons: Iterable<PBSPokemon>;
  dex?: PBSDex;
  shouldSkipBase?(pokemon: PBSPokemon): boolean;
  shouldSkipForm?(form: PBSForm, pokemon: PBSPokemon): boolean;
}

export function extractPBSPokemonsToRawPokemons(options: ExtractPBSPokemonsToRawPokemonsOptions) {
  const out: RawPokemon[] = [];
  const pokemons = options.dex
    ? filterAndSortToDex(options.dex, options.pokemons)
    : options.pokemons;

  for (const pokemon of pokemons) {
    if (!options.shouldSkipBase?.(pokemon)) {
      out.push(pokemon.raw);
    }

    for (const form of pokemon.forms) {
      if (!form) {
        continue;
      }
      if (!options.shouldSkipForm?.(form, pokemon)) {
        out.push(form.raw);
      }
    }
  }

  return out;
}

function filterAndSortToDex(dex: PBSDex, pokemons: Iterable<PBSPokemon>) {
  const dexIndicesMap = new Map(dex.pokemonSections.map((s, i) => [s, i]));
  return [...iterFilter(pokemons, (pokemon) => dexIndicesMap.has(pokemon.section))].sort(
    (left, right) => dexIndicesMap.get(left.section)! - dexIndicesMap.get(right.section)!,
  );
}
