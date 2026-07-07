import { computed, createModel, signal } from "@preact/signals";
import RAW_DATA from "../data/pokedex_formats.json" with { type: "json" };

export type PokedexFormatKey = keyof typeof RAW_DATA;
export type PokedexFormat = InstanceType<typeof PokedexFormat>;

export const PokedexFormat = createModel(($key: PokedexFormatKey) => {
  const key = signal($key);
  const name = computed(() => RAW_DATA[key.value].name);
  const description = computed(() => RAW_DATA[key.value].description);
  return { key, name, description };
});

export const POKEDEX_FORMATS = (() => {
  const defaultKey: PokedexFormatKey = "icons";
  return { defaultKey };
})();
