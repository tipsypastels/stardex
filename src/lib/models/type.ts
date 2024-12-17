import { capitalize } from "$lib/utils/strings";
import DATA from "../data/types.json" with { type: "json" };
import randomColor from "randomcolor";

export interface Type {
  name: string;
  color: string;
  icon: string;
}

export const BUILTIN_TYPE_KEYS = Object.keys(DATA) as (keyof typeof DATA)[];
export const BUILTIN_TYPES = Object.values(DATA) as Type[];

const CUSTOM_CACHE = new Map<string, Type>();

export function resolveType(key: string): Type {
  const builtin = (DATA as Record<string, Type>)[key];
  if (builtin) return builtin;

  const cached = CUSTOM_CACHE.get(key);
  if (cached) return cached;

  const type: Type = {
    name: capitalize(key),
    color: randomColor({ seed: key }),
    icon: "question-circle",
  };

  CUSTOM_CACHE.set(key, type);
  return type;
}

export function isTypeCustom(typeKey: string) {
  return !(typeKey in DATA);
}
