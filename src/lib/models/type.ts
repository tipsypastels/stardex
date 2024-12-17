import DATA from "../data/types.json" with { type: "json" };
import randomColor from "randomcolor";

export interface Type {
  name: string;
  color: string;
  icon: string;
}

export function resolveType(key: string): Type {
  return (
    (DATA as Record<string, Type>)[key] || {
      name: key[0].toUpperCase() + key.slice(1).toLowerCase(),
      color: randomColor({ seed: key }),
      icon: "question-circle",
    }
  );
}
