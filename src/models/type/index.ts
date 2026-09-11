import { ReactiveSet } from "@solid-primitives/set";
import randomColor from "randomcolor";
import { createEffect, createRoot, createSignal } from "solid-js";
import * as v from "valibot";
import RAW_DATA from "../../data/types.json" with { type: "json" };
import { must } from "../../utils/assert";
import { stored } from "../../utils/storage";
import { capitalize, sortStrings } from "../../utils/string";
import type { Pokemon } from "../pokemon";
import { catchStartupError } from "../ui/error";

/* -------------------------------------------------------------------------- */
/*                                   Shared                                   */
/* -------------------------------------------------------------------------- */

export type Type = BuiltinType | CustomType;

export const TYPES = {
  of(key: string) {
    return key in RAW_DATA ? BUILTIN_TYPES.of(key) : CUSTOM_TYPES.of(key);
  },

  ordering(left: string, right: string) {
    const leftIsBuiltin = BUILTIN_TYPES.map.has(left);
    const rightIsBuiltin = BUILTIN_TYPES.map.has(right);

    if (leftIsBuiltin && !rightIsBuiltin) return -1;
    if (rightIsBuiltin && !leftIsBuiltin) return 1;
    if (leftIsBuiltin) {
      return BUILTIN_TYPES.keys.indexOf(left) - BUILTIN_TYPES.keys.indexOf(right);
    } else {
      return sortStrings(left, right);
    }
  },
};

/* -------------------------------------------------------------------------- */
/*                                   Builtin                                  */
/* -------------------------------------------------------------------------- */

export interface BuiltinType {
  readonly key: string;
  readonly name: string;
  readonly color: string;
  readonly icon: string;
  readonly kind: "builtin";
}

export const BUILTIN_TYPES = (() => {
  const keys = Object.keys(RAW_DATA);
  const all = keys.map(make);
  const map = new Map(all.map((t) => [t.key, t]));

  function of(key: string) {
    return must(map.get(key), `Unknown builtin type ${key}`);
  }

  function make(key: string): Type {
    const data = must(RAW_DATA[key as keyof typeof RAW_DATA], `Unknown builtin type ${key}`);
    return { key, ...data, kind: "builtin" };
  }

  return { keys, all, map, of };
})();

/* -------------------------------------------------------------------------- */
/*                                   Custom                                   */
/* -------------------------------------------------------------------------- */

export interface CustomType {
  readonly key: string;
  readonly name: string;
  readonly color: string;
  setColor(color: string): void;
  resetColor(): void;
  readonly icon: string;
  readonly kind: "custom";
}

export const CUSTOM_TYPES = createRoot(() => {
  // Note: this is not used directly in the custom
  // editor because it's never cleared, so types exist
  // in it that are no longer actually present in dex.
  const cache = new Map<string, CustomType>();
  const hasCustomColors = new ReactiveSet<string>();

  const store = stored("stardex_custom_type_colors");
  const caught = catchStartupError("customTypeColors", () => {
    const raw_ = store.load();
    if (!raw_) return;

    const raw = v.parse(v.record(v.string(), v.string()), raw_);

    for (const [key, color] of Object.entries(raw)) {
      of(key).setColor(color);
    }
  });

  if (!caught) {
    createEffect(() => {
      const record: Record<string, string> = {};
      for (const key of hasCustomColors) {
        const type = cache.get(key);
        if (type) record[key] = type.color;
      }
      store.dump(record);
    });
  }

  function of(key: string) {
    const cached = cache.get(key);
    if (cached) return cached;

    const made = make(key);
    cache.set(key, made);
    return made;
  }

  function make(key: string): CustomType {
    const name = capitalize(key);
    const [color, setColor] = createSignal(randomColor({ seed: key }));
    return {
      key,
      name,
      get color() {
        return color();
      },
      setColor(color) {
        setColor(color);
        hasCustomColors.add(key);
      },
      resetColor() {
        setColor(randomColor({ seed: key }));
        hasCustomColors.delete(key);
      },
      icon: "question-circle",
      kind: "custom",
    };
  }

  function onPokemons(pokemons: Pokemon[]) {
    const found = new Set<CustomType>();

    for (const pokemon of pokemons) {
      for (const type of pokemon.types) {
        if (type.kind === "custom") {
          found.add(type);
        }
      }
    }

    return [...found];
  }

  return { of, onPokemons };
});
