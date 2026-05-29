import { type Recommendation } from "$lib/metrics/recommendations";
import type { PokedexFormat } from "$lib/models/pokedex_format";
import type { Strictness } from "$lib/models/strictness";
import { type Readable, type Writable } from "svelte/store";
import { PokemonState } from "./classes/pokemon";
import { RegionsState } from "./classes/regions";
import type { TabsState } from "./classes/tabs";
import { getNonV1StateData } from "./shared";
import { createStateV1 } from "./v1";
import { createStateV2, type StateV2Data } from "./v2";

export interface State {
  pokemon: PokemonState;
  pokedexFilter: Writable<string | undefined>;
  pokedexFormat: Writable<PokedexFormat>;
  regions: RegionsState;
  strictness: Writable<Strictness>;
  recommendations: Readable<Recommendation[]>;
  tabs?: TabsState;
  upgrade?(): void;
}

function create(): State {
  const data = getNonV1StateData() as { version: number } | undefined;

  if (!data && localStorage.getItem("stardex_pokemon")) {
    return createStateV1();
  }

  switch (data?.version) {
    case 2:
    case undefined: {
      return createStateV2(data as StateV2Data | undefined);
    }
    default: {
      throw new Error(`Unknown state version '${data?.version}'`);
    }
  }
}

export const {
  pokemon,
  pokedexFilter,
  pokedexFormat,
  regions,
  strictness,
  recommendations,
  tabs,
  upgrade,
} = create();
