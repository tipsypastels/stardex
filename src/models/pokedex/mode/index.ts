import { createEffect, createSignal } from "solid-js";
import * as v from "valibot";
import RAW_DATA from "../../../data/pokedex_modes.json" with { type: "json" };
import { stored } from "../../../utils/storage";
import { V0_PokedexModeKey, V0_upgradePokedexModeKey } from "./versioned";

export type PokedexModeKey = v.InferOutput<typeof PokedexModeKey>;
export const PokedexModeKey = v.union([v.literal("icons"), v.literal("names"), v.literal("text")]);

const VAny_PokedexModeKey = v.union([
  PokedexModeKey,
  v.pipe(V0_PokedexModeKey, v.transform(V0_upgradePokedexModeKey)),
]);

RAW_DATA satisfies Record<PokedexModeKey, unknown>;

export const POKEDEX_MODES = (() => {
  const keys = Object.keys(RAW_DATA) as PokedexModeKey[];
  const defaultKey: PokedexModeKey = "icons";
  const options = keys.map((key) => ({ key, ...RAW_DATA[key] }));

  function initial() {
    const store = stored("stardex_pokedex_mode");
    const initialKey = v.parse(VAny_PokedexModeKey, store.load() ?? defaultKey);
    const [key, setKey] = createSignal(initialKey);

    return {
      get key() {
        return key();
      },
      set key(key: PokedexModeKey) {
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
      subscribe() {
        createEffect(() => {
          store.dump(key());
        });
      },
    };
  }

  return { keys, defaultKey, options, initial };
})();

export const pokedexMode = POKEDEX_MODES.initial();
