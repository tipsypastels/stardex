import { derived } from "svelte/store";
import { pokemons } from "./pokemons";
import { createAllotment } from "$lib/metrics/allotment";
import { regions } from "./regions";
import { strictness } from "./strictness";
import { createRecommendations } from "$lib/metrics/recommendations";

export const pokemonAllotment = derived(pokemons, ($pokemons) =>
  createAllotment($pokemons.toArray()),
);

export const regionsAllotment = derived(regions, ($regions) =>
  createAllotment($regions.toArray().flatMap((region) => region.members)),
);

export const recommendations = derived(
  [pokemonAllotment, regionsAllotment, strictness],
  ([own, against, strictness]) => createRecommendations(own, against, strictness),
);
