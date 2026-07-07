import { computed, createModel, effect, signal } from "@preact/signals";
import RAW_DATA from "../data/strictnesses.json" with { type: "json" };
import { stored } from "../utils/storage";

const store = stored<StrictnessKey>("stardex_strictness");

export type StrictnessKey = keyof typeof RAW_DATA;
export type Strictness = InstanceType<typeof Strictness>;

export const Strictness = createModel(($key: StrictnessKey) => {
  const key = signal($key);
  const name = computed(() => RAW_DATA[key.value].name);
  const description = computed(() => RAW_DATA[key.value].description);
  const maximumRatioDifference = computed(() => RAW_DATA[key.value].maximumRatioDifference);

  effect(() => {
    store.dump(key.value);
  });

  return { key, name, description, maximumRatioDifference };
});

export const STRICTNESSES = (() => {
  const keys = Object.keys(RAW_DATA) as StrictnessKey[];
  const defaultKey: StrictnessKey = "normal";

  function initial() {
    return new Strictness(store.load() ?? defaultKey);
  }

  return { keys, defaultKey, initial };
})();
