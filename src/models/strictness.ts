import { computed, createModel, signal } from "@preact/signals";
import RAW_DATA from "../data/strictnesses.json" with { type: "json" };

export type StrictnessKey = keyof typeof RAW_DATA;
export type Strictness = InstanceType<typeof Strictness>;

export const Strictness = createModel(($key: StrictnessKey) => {
  const key = signal($key);
  const name = computed(() => RAW_DATA[key.value].name);
  const description = computed(() => RAW_DATA[key.value].description);
  const maximumRatioDifference = computed(() => RAW_DATA[key.value].maximumRatioDifference);
  return { key, name, description, maximumRatioDifference };
});

export const STRICTNESSES = (() => {
  const defaultKey: StrictnessKey = "normal";
  return { defaultKey };
})();
