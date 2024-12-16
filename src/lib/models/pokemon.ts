import DATA from "../data/pokemon.json" with { type: "json" };

export interface Pokemon {
  id: number;
  name: string;
  type: string[];
  evos?: PokemonEvos;
}

export interface PokemonEvos {
  from?: string;
  to?: string[];
}

export function resolvePokemon(key: keyof typeof DATA): Pokemon;
export function resolvePokemon(key: string): Pokemon | undefined;
export function resolvePokemon(key: string): Pokemon | undefined {
  return (DATA as Record<string, Pokemon>)[key];
}

export function resolveEvolutionLine(pokemon: Pokemon) {
  if (!pokemon.evos || (!pokemon.evos.from && !pokemon.evos.to)) {
    return [pokemon];
  }

  const origin = findEvolutionOrigin(pokemon);
  const out = new Set<Pokemon>([origin]);

  followEvolutionLine(origin, out);

  const outArray = [...out];
  outArray.sort((a, b) => a.id - b.id);
  return outArray;
}

function findEvolutionOrigin(pokemon: Pokemon) {
  let origin = pokemon;
  while (origin.evos?.from) {
    origin = resolvePokemon(origin.evos.from)!;
  }
  return origin;
}

function followEvolutionLine(pokemon: Pokemon, out: Set<Pokemon>) {
  if (pokemon.evos?.to) {
    for (const to of pokemon.evos.to.map((to) => resolvePokemon(to)!)) {
      out.add(to);
      followEvolutionLine(to, out);
    }
  }
}
