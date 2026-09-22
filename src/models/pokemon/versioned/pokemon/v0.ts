import * as v from "valibot";
import { makeId } from "../../../../utils/id";
import { V1_RawBuiltinPokemon, V1_RawCustomPokemon, V1_RawPokemon } from "./v1";

/**
 * Pokemon V0:
 *  - No explicit version.
 *  - No ID.
 *  - Had a key for custom forms.
 *  - Species is an object.
 *  - Types is called type.
 */

export const V0_RawBuiltinPokemon = v.object({
  species: v.object({ key: v.string() }),
  type: v.optional(v.array(v.string())),
  exclude: v.optional(v.boolean()),
  comment: v.optional(v.string()),
  newlinesBefore: v.optional(v.number()),
  newlinesAfterIfLast: v.optional(v.number()),
});

export const V0_RawCustomPokemon = v.object({
  key: v.string(),
  name: v.string(),
  type: v.array(v.string()),
  comment: v.optional(v.string()),
  newlinesBefore: v.optional(v.number()),
  newlinesAfterIfLast: v.optional(v.number()),
});

export const V0_RawPokemon = v.union([V0_RawBuiltinPokemon, V0_RawCustomPokemon]);

export function V0_upgradeRawBuiltinPokemon(
  raw: v.InferOutput<typeof V0_RawBuiltinPokemon>,
): v.InferOutput<typeof V1_RawBuiltinPokemon> {
  const { species, type, ...rest } = raw;
  return {
    v: 1,
    id: makeId(),
    species: species.key,
    types: type,
    ...rest,
  };
}

export function V0_upgradeRawCustomPokemon(
  raw: v.InferOutput<typeof V0_RawCustomPokemon>,
): v.InferOutput<typeof V1_RawCustomPokemon> {
  const { key: _key, type, ...rest } = raw;
  return { v: 1, id: makeId(), types: type, ...rest };
}

export function V0_upgradeRawPokemon(
  raw: v.InferOutput<typeof V0_RawPokemon>,
): v.InferOutput<typeof V1_RawPokemon> {
  return "species" in raw ? V0_upgradeRawBuiltinPokemon(raw) : V0_upgradeRawCustomPokemon(raw);
}
