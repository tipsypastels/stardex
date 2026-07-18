import { createMemo, createRoot } from "solid-js";
import { createAllotment } from "../metrics/allotment";
import { createRecommendations } from "../metrics/recommendations";
import { pokemons } from "./pokemon/list";
import { regions } from "./region/set";
import { strictness } from "./strictness";
import { excludedTypes } from "./type/excluded";

export const pokemonsAllotment = createRoot(() => {
  const value = createMemo(() => createAllotment(pokemons.all, excludedTypes.all));
  return {
    get value() {
      return value();
    },
  };
});

export const regionsAllotment = createRoot(() => {
  const value = createMemo(() => createAllotment(regions.all.flatMap((region) => region.members)));
  return {
    get value() {
      return value();
    },
  };
});

export const recommendations = createRoot(() => {
  const value = createMemo(() =>
    createRecommendations(
      pokemonsAllotment.value,
      regionsAllotment.value,
      strictness.maximumRatioDifference,
      excludedTypes.all,
    ),
  );
  return {
    get value() {
      return value();
    },
  };
});
