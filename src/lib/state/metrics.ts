import { derived } from "svelte/store";
import { pokemon } from "./pokemon";
import { createAllotment, createRegionAllotment } from "$lib/metrics/allotment";
import { regions } from "./regions";
import { resolveRegion } from "$lib/models/region";
import { strictness } from "./strictness";
import { createRecommendations } from "$lib/metrics/recommendations";

export const pokemonAllotment = derived(pokemon, createAllotment);
export const regionsAllotment = derived(regions, ($keys) => {
  const regions = [...$keys].map(resolveRegion);
  return createRegionAllotment(regions);
});

export const recommendations = derived(
  [pokemonAllotment, regionsAllotment, strictness],
  ([own, against, strictness]) => createRecommendations(own, against, strictness),
);
