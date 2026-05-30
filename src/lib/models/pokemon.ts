import type { Species } from "./species";
import { resolveType, type Type } from "./type";

export type Pokemon = PokemonCustom | PokemonSpecies;

interface PokemonShared {
  exclude?: boolean;
  comment?: string;
  newlinesBefore?: number;
}

export interface PokemonCustom extends PokemonShared {
  key: string;
  name: string;
  type: string[];
}

export interface PokemonSpecies extends PokemonShared {
  species: Species;
  type?: string[];
}

export function resolvePokemonKey(pokemon: Pokemon) {
  return isPokemonCustom(pokemon) ? pokemon.key : pokemon.species.key;
}

export function resolvePokemonName(pokemon: Pokemon) {
  return isPokemonCustom(pokemon) ? pokemon.name : pokemon.species.name;
}

export function resolvePokemonTypeKeys(pokemon: Pokemon): string[] {
  if (pokemon.type) return pokemon.type;
  return (pokemon as PokemonSpecies).species.type;
}

export function resolvePokemonTypes(pokemon: Pokemon): Type[] {
  return resolvePokemonTypeKeys(pokemon).map(resolveType);
}

export function isPokemonCustom(p: Pokemon): p is PokemonCustom {
  return !("species" in p);
}

export function askBeforeOverwritingMons(mons: Pokemon[]) {
  return mons.length === 0 || confirm("Overwrite your existing Pokédex? This cannot be reversed.");
}
