import randomColor from "randomcolor";
import RAW_DATA from "../../data/types.json" with { type: "json" };
import { must } from "../../utils/assert";
import { capitalize, sortStrings } from "../../utils/string";
import type { Pokemon } from "../pokemon";
import { customTypeColors } from "./custom_colors";

export interface Type {
  key: string;
  name: string;
  color: string;
  icon: string;
  kind: "builtin" | "custom";
}

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

export const CUSTOM_TYPES = (() => {
  // Note: this is not used directly in the custom
  // editor because it's never cleared, so types exist
  // in it that are no longer actually present in dex.
  const cache = new Map<string, Type>();

  function of(key: string) {
    const cached = cache.get(key);
    if (cached) return cached;

    const made = make(key);
    cache.set(key, made);
    return made;
  }

  function make(key: string): Type {
    const name = capitalize(key);
    const defaultColor = randomColor({ seed: key });
    return {
      key,
      name,
      get color() {
        return customTypeColors.get(key) ?? defaultColor;
      },
      icon: "question-circle",
      kind: "custom",
    };
  }

  function onPokemons(pokemons: Pokemon[]) {
    const found = new Set<Type>();

    for (const pokemon of pokemons) {
      for (const type of pokemon.types) {
        if (type.kind === "custom") {
          found.add(type);
        }
      }
    }

    return [...found].sort((a, b) => sortStrings(a.name, b.name));
  }

  return {
    of,
    onPokemons,
  };
})();
