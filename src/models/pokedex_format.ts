import { computed, createModel, effect, signal } from "@preact/signals";
import RAW_DATA from "../data/pokedex_formats.json" with { type: "json" };
import { stored } from "../utils/storage";

const store = stored<PokedexFormatKey>("stardex_pokedex_format");

export type PokedexFormatKey = keyof typeof RAW_DATA;
export type PokedexFormat = InstanceType<typeof PokedexFormat>;

export const PokedexFormat = createModel(($key: PokedexFormatKey) => {
  const key = signal($key);
  const name = computed(() => RAW_DATA[key.value].name);
  const icon = computed(() => RAW_DATA[key.value].icon);
  const description = computed(() => RAW_DATA[key.value].description);
  const index = computed(() => POKEDEX_FORMATS.keys.indexOf(key.value));

  effect(() => {
    store.dump(key.value);
  });

  return { key, name, icon, description, index };
});

export const POKEDEX_FORMATS = (() => {
  const keys = Object.keys(RAW_DATA) as PokedexFormatKey[];
  const defaultKey: PokedexFormatKey = "icons";

  const options = keys.map((key) => ({ key, ...RAW_DATA[key] }));

  function initial() {
    let key = store.load();

    // Not deserving of a whole v0 thing.
    if ((key as string) === "legacyText") {
      key = "text";
    }

    return new PokedexFormat(key ?? defaultKey);
  }

  return { keys, defaultKey, options, initial };
})();
