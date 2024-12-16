import DATA from "../data/pokemon.json" with { type: "json" };

export type Pokemon = PokemonNoForms | PokemonWithForms;

export interface PokemonNoForms {
  name: string;
  type: string[];
  evos?: string[];
}

export interface PokemonWithForms {
  name: string;
  type?: string[];
  evos?: string[];
  forms: Record<string, Pick<PokemonNoForms, "name" | "type">>;
}

export function resolvePokemon(key: string): Pokemon | undefined {
  return (DATA as Record<string, Pokemon>)[key];
}
