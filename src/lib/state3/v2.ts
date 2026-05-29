import { derived, writable } from "svelte/store";
import type { State } from ".";
import { TabsState, type TabData } from "./classes/tabs";
import { transformed } from "./shared";
import { PokemonState } from "./classes/pokemon";
import { RegionsState } from "./classes/regions";

export interface StateV2Data {
  version: 2;
  tabs: TabData[];
  currentTabIndex: number;
}

export function createStateV2(data: StateV2Data | undefined): State {
  const tabs = new TabsState(writable(data?.tabs ?? []), writable(data?.currentTabIndex ?? 0));

  const pokemon = new PokemonState(tabs.writableTabKey("pokemon"));
  const pokedexFilter = transformed(writable<string | undefined>(), (x) => x || undefined);
  const pokedexFormat = tabs.writableTabKey("pokedexFormat");

  const regions = new RegionsState(tabs.writableTabKey("regions"));
  const strictness = tabs.writableTabKey("strictness");

  const recommendations = derived(
    [pokemon.allotment, regions.allotment, strictness],
    ([own, against, strictness]) => createRecommendations(own, against, strictness),
  );

  return {
    tabs,
  };
}
