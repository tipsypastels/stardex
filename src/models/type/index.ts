import randomColor from "randomcolor";
import DATA from "../../data/types.json" with { type: "json" };
import { unwrap } from "../../utils/assert";
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
    return key in DATA ? BUILTIN_TYPES.of(key) : CUSTOM_TYPES.of(key);
  },
};

/* -------------------------------------------------------------------------- */
/*                                Builtin Types                               */
/* -------------------------------------------------------------------------- */

export type BuiltinType = Type & { kind: "builtin" };

export const BUILTIN_TYPES = (() => {
  const keys = Object.keys(DATA);
  const all = keys.map(make);
  const map = new Map(all.map((t) => [t.key, t]));

  function of(key: string) {
    return unwrap(map.get(key), `Unknown builtin type ${key}`);
  }

  function make(key: string): BuiltinType {
    const data = unwrap(DATA[key as keyof typeof DATA], `Unknown builtin type ${key}`);
    return { key, ...data, kind: "builtin" };
  }

  return { keys, all, map, of };
})();

/* -------------------------------------------------------------------------- */
/*                                Custom Types                                */
/* -------------------------------------------------------------------------- */

export type CustomType = Type & { kind: "custom" };

export const CUSTOM_TYPES = (() => {
  const cache = new Map<string, CustomType>();

  function of(key: string) {
    const cached = cache.get(key);
    if (cached) return cached;

    const made = make(key);
    cache.set(key, made);
    return made;
  }

  function make(key: string): CustomType {
    const name = capitalize(key);
    const color = randomColor({ seed: key });
    return { key, name, color, icon: "question-circle", kind: "custom" };
  }

  return { of };
})();
