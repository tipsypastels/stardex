import { createEffect, createRoot, createSignal } from "solid-js";
import * as v from "valibot";
import RAW_DATA from "../../../data/pokedex_modes.json" with { type: "json" };
import { stored } from "../../../utils/storage";
import { V0_PokedexModeKey, V0_upgradePokedexModeKey } from "./versioned";

const KEYS = Object.keys(RAW_DATA) as PokedexModeKey[];

RAW_DATA satisfies Record<PokedexModeKey, unknown>;

export type PokedexModeKey = keyof typeof RAW_DATA;
export const PokedexModeKey = v.picklist(KEYS);

const VAny_PokedexModeKey = v.union([
  PokedexModeKey,
  v.pipe(V0_PokedexModeKey, v.transform(V0_upgradePokedexModeKey)),
]);

export const POKEDEX_MODES = (() => {
  const keys = KEYS;
  const defaultKey: PokedexModeKey = "icons";
  const options = keys.map((key) => ({ key, ...RAW_DATA[key] }));

  function initial() {
    return createRoot(() => {
      const store = stored("stardex_pokedex_mode");
      const initialKey = v.parse(VAny_PokedexModeKey, store.load() ?? defaultKey);
      const [key, setKey] = createSignal(initialKey);

      createEffect(() => {
        store.dump(key());
      });

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
        get index() {
          return POKEDEX_MODES.keys.indexOf(key());
        },
      };
    });
  }

  return { keys, defaultKey, options, initial };
})();

export const pokedexMode = POKEDEX_MODES.initial();
