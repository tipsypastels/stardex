import { computed, createModel, effect, signal } from "@preact/signals";
import RAW_DATA from "../data/pokedex_formats.json" with { type: "json" };
import { stored } from "../utils/storage";

const store = stored<PokedexFormatKey>("stardex_pokedex_format");

export type PokedexFormatKey = keyof typeof RAW_DATA;
export type PokedexFormat = InstanceType<typeof PokedexFormat>;

export const PokedexFormat = createModel(($key: PokedexFormatKey) => {
  const key = signal($key);
  const name = computed(() => RAW_DATA[key.value].name);
  const description = computed(() => RAW_DATA[key.value].description);

  effect(() => {
    store.dump(key.value);
  });

  return { key, name, description };
});

export const POKEDEX_FORMATS = (() => {
  const keys = Object.keys(RAW_DATA) as PokedexFormatKey[];
  const defaultKey: PokedexFormatKey = "icons";

  function initial() {
    return new PokedexFormat(store.load() ?? defaultKey);
  }

  return { keys, defaultKey, initial };
})();
