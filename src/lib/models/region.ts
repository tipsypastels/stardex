import DATA from "../data/regions.json" with { type: "json" };

export interface Region {
  name: string;
  icon: string;
  pokemon: string[];
}

export type RegionKey = keyof typeof DATA;

export const ALL_REGION_KEYS = Object.keys(DATA) as RegionKey[];
export const INITIAL_REGION_KEYS = ALL_REGION_KEYS.filter((key) => key !== "kanto");

export function resolveRegion(key: keyof typeof DATA): Region {
  return DATA[key];
}
