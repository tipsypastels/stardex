import { createEffect, createSignal } from "solid-js";
import RAW_DATA from "../data/strictnesses.json" with { type: "json" };
import { stored } from "../utils/storage";

export type StrictnessKey = keyof typeof RAW_DATA;

export const STRICTNESSES = (() => {
  const keys = Object.keys(RAW_DATA) as StrictnessKey[];
  const defaultKey: StrictnessKey = "normal";
  const options = keys.map((key) => ({ key, ...RAW_DATA[key] }));

  function initial() {
    const store = stored("stardex_strictness");
    let initialKey = store.load();
    if (!initialKey || typeof initialKey !== "string" || !(initialKey in RAW_DATA)) {
      initialKey = "normal";
    }

    const [key, setKey] = createSignal(initialKey as StrictnessKey);

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
      subscribe() {
        createEffect(() => {
          store.dump(key());
        });
      },
    };
  }

  return { keys, defaultKey, options, initial };
})();

export const strictness = STRICTNESSES.initial();
