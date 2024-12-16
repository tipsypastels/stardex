import DATA from "../data/regions.json" with { type: "json" };

export interface Region {
  name: string;
  icon: string;
  pokemon: string[];
}

export const ALL_REGION_KEYS = Object.keys(DATA);
export const INITIAL_REGION_KEYS = ALL_REGION_KEYS.filter((key) => key !== "kanto");

export function resolveRegion(key: keyof typeof DATA): Region;
export function resolveRegion(key: string): Region | undefined;
export function resolveRegion(key: string): Region | undefined {
  return (DATA as Record<string, Region>)[key];
}
