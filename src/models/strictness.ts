import { createEffect, createRoot, createSignal } from "solid-js";
import * as v from "valibot";
import RAW_DATA from "../data/strictnesses.json" with { type: "json" };
import { stored } from "../utils/storage";

const KEYS = Object.keys(RAW_DATA) as StrictnessKey[];

export type StrictnessKey = keyof typeof RAW_DATA;
export const StrictnessKey = v.picklist(KEYS);

export const STRICTNESSES = {
  keys: KEYS,
  defaultKey: "normal" as StrictnessKey,
  options: KEYS.map((key) => ({ key, ...RAW_DATA[key] })),
};

export const strictness = createRoot(() => {
  const store = stored("stardex_strictness");
  let initialKey = store.load();
  if (!initialKey || typeof initialKey !== "string" || !(initialKey in RAW_DATA)) {
    initialKey = "normal";
  }

  const [key, setKey] = createSignal(initialKey as StrictnessKey);

  createEffect(() => {
    store.dump(key());
  });

  return {
    get key() {
      return key();
    },
    set key(key: StrictnessKey) {
      setKey(key);
    },
    get name() {
      return RAW_DATA[key()].name;
    },
    get icon() {
      return RAW_DATA[key()].icon;
    },
    get description() {
      return RAW_DATA[key()].description;
    },
    get maximumRatioDifference() {
      return RAW_DATA[key()].maximumRatioDifference;
    },
    get index() {
      return STRICTNESSES.keys.indexOf(key());
    },
  };
});
