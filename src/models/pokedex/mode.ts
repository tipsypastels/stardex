import { computed, createModel, effect, signal } from "@preact/signals";
import RAW_DATA from "../../data/pokedex_modes.json" with { type: "json" };
import { stored } from "../../utils/storage";
import { upgradePokedexModeKey } from "../versioned";
import { type V0_PokedexModeKey } from "../versioned/v0";

const store = stored<PokedexModeKey | V0_PokedexModeKey>("stardex_pokedex_mode");

export type PokedexModeKey = keyof typeof RAW_DATA;
export type PokedexMode = InstanceType<typeof PokedexMode>;

export const PokedexMode = createModel(($key: PokedexModeKey) => {
  const key = signal($key);
  const name = computed(() => RAW_DATA[key.value].name);
  const icon = computed(() => RAW_DATA[key.value].icon);
  const description = computed(() => RAW_DATA[key.value].description);
  const index = computed(() => POKEDEX_MODES.keys.indexOf(key.value));

  effect(() => {
    store.dump(key.value);
  });

  return { key, name, icon, description, index };
});

export const POKEDEX_MODES = (() => {
  const keys = Object.keys(RAW_DATA) as PokedexModeKey[];
  const defaultKey: PokedexModeKey = "icons";

  const options = keys.map((key) => ({ key, ...RAW_DATA[key] }));

  function initial() {
    const key = store.load();
    return new PokedexMode(key ? upgradePokedexModeKey(key) : defaultKey);
  }

  return { keys, defaultKey, options, initial };
})();
