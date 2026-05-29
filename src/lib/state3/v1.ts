import { createRecommendations } from "$lib/metrics/recommendations";
import { DEFAULT_POKEDEX_FORMAT, type PokedexFormat } from "$lib/models/pokedex_format";
import { DEFAULT_REGION_KEYS } from "$lib/models/region";
import { DEFAULT_STRICTNESS, type Strictness } from "$lib/models/strictness";
import { Set as ISet } from "immutable";
import { derived, writable } from "svelte/store";
import type { State } from ".";
import { PokemonState } from "./classes/pokemon";
import { RegionsState } from "./classes/regions";
import { transformed } from "./shared";

export function createStateV1(): State {
  function json<T>(key: string) {
    const json = localStorage.getItem(key);
    if (json) return JSON.parse(json) as T;
  }

  const pokemon = new PokemonState(writable(json("stardex_pokemon")));

  const pokedexFilter = transformed(writable<string | undefined>(), (x) => x || undefined);

  const pokedexFormat = writable(
    json<PokedexFormat>("stardex_pokedex_format") ?? DEFAULT_POKEDEX_FORMAT,
  );

  const regions = new RegionsState(writable(ISet(json("stardex_regions") ?? DEFAULT_REGION_KEYS)));

  const strictness = writable(json<Strictness>("stardex_strictness") ?? DEFAULT_STRICTNESS);

  const recommendations = derived(
    [pokemon.allotment, regions.allotment, strictness],
    ([own, against, strictness]) => createRecommendations(own, against, strictness),
  );

  return {
    pokemon,
    pokedexFilter,
    pokedexFormat,
    regions,
    strictness,
    recommendations,
  };
}
