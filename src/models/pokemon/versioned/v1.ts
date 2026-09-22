import * as v from "valibot";

const Shared = v.object({
  v: v.literal(1),
  id: v.string(),
  exclude: v.optional(v.boolean()),
  comment: v.optional(v.string()),
});

export const V1_RawBuiltinPokemon = v.object({
  ...Shared.entries,
  species: v.string(),
  alt: v.optional(v.string()),
  customAltName: v.optional(v.string()),
  types: v.optional(v.array(v.string())),
});

export const V1_RawCustomPokemon = v.object({
  ...Shared.entries,
  name: v.string(),
  altName: v.optional(v.string()),
  types: v.array(v.string()),
});

export const V1_RawPokemon = v.union([V1_RawBuiltinPokemon, V1_RawCustomPokemon]);
