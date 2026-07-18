import * as v from "valibot";
import type { PokedexModeKey } from ".";

export const V0_PokedexModeKey = v.union([
  v.literal("icons"),
  v.literal("names"),
  v.literal("legacyText"),
]);

export function V0_upgradePokedexModeKey(
  key: v.InferOutput<typeof V0_PokedexModeKey>,
): PokedexModeKey {
  return key === "legacyText" ? "text" : key;
}
