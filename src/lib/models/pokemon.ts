import type { Species } from "./species";
import { resolveType, type Type } from "./type";

export type PokemonRecommendationBehaviour = "filler" | "exempt";
export type Pokemon = PokemonCustom | PokemonSpecies;

export interface PokemonCustom {
  name: string;
  type: string[];
  rec?: PokemonRecommendationBehaviour;
}

export interface PokemonSpecies {
  species: Species;
  type?: string[];
  rec?: PokemonRecommendationBehaviour;
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
