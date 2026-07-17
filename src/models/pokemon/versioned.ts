import * as v from "valibot";
import { RawCustomPokemon, type RawBuiltinPokemon, type RawPokemon } from ".";
import { id } from "../../utils/id";
import type { RawPokemonList } from "./list";
import { PokemonListTextDiffBuilder } from "./text/diff";

/**
 * Pokemon V0:
 *  - No explicit version.
 *  - No ID.
 *  - Had a key for custom forms.
 *  - Species is an object.
 *  - Types is called type.
 */

export const POKEMON_VERSION = 1;

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
): RawBuiltinPokemon {
  const { species, type, ...rest } = raw;
  return {
    v: POKEMON_VERSION,
    id: id(),
    species: species.key,
    types: type,
    ...rest,
  };
}

export function V0_upgradeRawCustomPokemon(
  raw: v.InferOutput<typeof V0_RawCustomPokemon>,
): RawCustomPokemon {
  const { key: _key, type, ...rest } = raw;
  return { v: POKEMON_VERSION, id: id(), types: type, ...rest };
}

export function V0_upgradeRawPokemon(raw: v.InferOutput<typeof V0_RawPokemon>): RawPokemon {
  return "species" in raw ? V0_upgradeRawBuiltinPokemon(raw) : V0_upgradeRawCustomPokemon(raw);
}

/**
 * Pokemon List V0:
 *  - No explicit version.
 *  - Was an array.
 *  - No notion of textDiff.
 */

export const POKEMON_LIST_VERSION = 1;

export const V0_RawPokemonList = v.array(v.union([V0_RawBuiltinPokemon, V0_RawCustomPokemon]));

export function V0_upgradeRawPokemonList(
  raws: v.InferOutput<typeof V0_RawPokemonList>,
): RawPokemonList {
  const all: RawPokemon[] = [];
  const textDiffBuilder = new PokemonListTextDiffBuilder();

  for (const raw of raws) {
    all.push(V0_upgradeRawPokemon(raw));

    if (raw.newlinesBefore) {
      textDiffBuilder.blank(raw.newlinesBefore);
    }
    if (raw.comment) {
      textDiffBuilder.verbatim(...raw.comment.split("\n").map((c) => `# ${c}`));
    }
    textDiffBuilder.entry();
  }

  const lastRaw = raws.at(-1);
  if (lastRaw?.newlinesAfterIfLast) {
    textDiffBuilder.blank(lastRaw.newlinesAfterIfLast);
  }

  const textDiff = textDiffBuilder.finish();
  return { v: POKEMON_LIST_VERSION, all, textDiff };
}
