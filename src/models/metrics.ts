import { computed, createModel } from "@preact/signals";
import { createAllotment, type Allotable } from "../metrics/allotment";
import { createRecommendations } from "../metrics/recommendations";
import type { ReadonlySignalled } from "../utils/signal";
import type { PokemonList } from "./pokemon/list";
import type { RegionSet } from "./region/set";
import type { Strictness } from "./strictness";
import type { ExcludedTypesSet } from "./type/excluded";

export type Metrics = InstanceType<typeof Metrics>;

export const Metrics = createModel(
  (
    pokemons: PokemonList,
    regions: RegionSet,
    strictness: Strictness,
    excludedTypes: ExcludedTypesSet,
  ) => {
    function* eagerAllotables(allotables: Iterable<ReadonlySignalled<Allotable>>) {
      for (const allotable of allotables) {
        yield {
          types: allotable.types.value,
          exclude: allotable.exclude?.value,
        } satisfies Allotable;
      }
    }

    const pokemonsAllotment = computed(() => createAllotment(eagerAllotables(pokemons.all.value)));
    const regionsAllotment = computed(() =>
      createAllotment(regions.all.value.flatMap((r) => r.members)),
    );

    const recommendations = computed(() =>
      createRecommendations(
        pokemonsAllotment.value,
        regionsAllotment.value,
        strictness.maximumRatioDifference.value,
        excludedTypes.all.value,
      ),
    );

    return {
      pokemonsAllotment,
      regionsAllotment,
      recommendations,
    };
  },
);
