import randomColor from "randomcolor";
import RAW_DATA from "../../data/types.json" with { type: "json" };
import { must } from "../../utils/assert";
import { capitalize } from "../../utils/string";

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
    const color = randomColor({ seed: key });
    return { key, name, color, icon: "question-circle", kind: "custom" };
  }

  return { of };
})();
