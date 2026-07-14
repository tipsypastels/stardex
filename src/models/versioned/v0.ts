import {
  CUSTOM_ICONS_METADATA_VERSION,
  EXCLUDED_TYPES_VERSION,
  POKEMON_LIST_VERSION,
  POKEMON_VERSION,
  PROJECT_VERSION,
  SAVE_VERSION,
} from ".";
import type { PokedexModeKey } from "../pokedex/mode";
import type { RawBuiltinPokemon, RawCustomPokemon, RawPokemon } from "../pokemon";
import type { RawPokemonList } from "../pokemon/list";
import { PokemonListTextDiffBuilder } from "../pokemon/text/diff";
import type { RawActiveProject, RawInactiveProject } from "../project";
import type { RegionKey } from "../region";
import type { RawSave } from "../save";
import type { StrictnessKey } from "../strictness";

/* -------------------------------------------------------------------------- */
/*                                   Pokemon                                  */
/* -------------------------------------------------------------------------- */

/**
 * Pokemon V0:
 *  - No explicit version.
 *  - Species is an object.
 *  - Types is called type.
 */

export interface V0_RawSharedPokemon {
  exclude?: boolean;
  comment?: string;
  newlinesBefore?: number;
  newlinesAfterIfLast?: number;
}

export interface V0_RawBuiltinPokemon extends V0_RawSharedPokemon {
  species: { key: string };
  type?: string[];
}

export interface V0_RawCustomPokemon extends V0_RawSharedPokemon {
  key: string;
  name: string;
  type: string[];
}

export type V0_RawPokemon = V0_RawBuiltinPokemon | V0_RawCustomPokemon;

export function V0_upgradeRawBuiltinPokemon(raw: V0_RawBuiltinPokemon): RawBuiltinPokemon {
  const { species, type, ...rest } = raw;
  return {
    v: POKEMON_VERSION,
    species: species.key,
    types: type,
    ...rest,
  };
}

export function V0_upgradeRawCustomPokemon(raw: V0_RawCustomPokemon): RawCustomPokemon {
  const { type, ...rest } = raw;
  return { v: POKEMON_VERSION, types: type, ...rest };
}

export function V0_upgradeRawPokemon(raw: V0_RawPokemon): RawPokemon {
  return "species" in raw ? V0_upgradeRawBuiltinPokemon(raw) : V0_upgradeRawCustomPokemon(raw);
}

/* -------------------------------------------------------------------------- */
/*                                Pokemon List                                */
/* -------------------------------------------------------------------------- */

/**
 * Pokemon List V0:
 *  - No explicit version.
 *  - Was an array.
 *  - No notion of textDiff.
 */

export type V0_RawPokemonList = V0_RawPokemon[];

export function V0_upgradeRawPokemonList(raws: V0_RawPokemonList): RawPokemonList {
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

/* -------------------------------------------------------------------------- */
/*                                   Project                                  */
/* -------------------------------------------------------------------------- */

/**
 * Project V0:
 *  - No explicit version.
 *  - Pokemons is called pokemon.
 *  - Models is called modelState.
 */

// Note: Same shape as V0_RawExport, but the upgraded
// versions are different.
export interface V0_RawProjectModels {
  pokemon: V0_RawPokemonList;
  regions: RegionKey[];
  strictness: StrictnessKey;
  pokedexFormat: V0_PokedexModeKey;
}

export interface V0_RawSharedProject {
  id: string;
  name: string;
}

export interface V0_RawActiveProject extends V0_RawSharedProject {
  active: true;
}

export interface V0_RawInactiveProject extends V0_RawSharedProject {
  active: false;
  modelState: V0_RawProjectModels;
}

export type V0_RawProject = V0_RawActiveProject | V0_RawInactiveProject;

export function V0_upgradeRawActiveProject(raw: V0_RawActiveProject): RawActiveProject {
  return {
    v: PROJECT_VERSION,
    ...raw,
  };
}

export function V0_upgradeRawInactiveProject(raw: V0_RawInactiveProject): RawInactiveProject {
  const {
    modelState: { pokemon, pokedexFormat, ...models },
    ...rest
  } = raw;
  return {
    v: PROJECT_VERSION,
    models: {
      ...models,
      pokemons: V0_upgradeRawPokemonList(pokemon),
      pokedexMode: V0_upgradePokedexModeKey(pokedexFormat),
      customIconsMetadata: { v: CUSTOM_ICONS_METADATA_VERSION, pokemonKeys: [] },
      excludedTypes: { v: EXCLUDED_TYPES_VERSION, all: [] },
    },
    ...rest,
  };
}

/* -------------------------------------------------------------------------- */
/*                                   Export                                   */
/* -------------------------------------------------------------------------- */

/**
 * Export V0:
 *  - No explicit version.
 *  - Pokemons is called pokemon.
 *  - Pokedex mode is called pokedex format.
 */

export interface V0_RawSave {
  pokemon: V0_RawPokemonList;
  regions: RegionKey[];
  strictness: StrictnessKey;
  pokedexFormat: V0_PokedexModeKey;
}

export function V0_upgradeRawSave(raw: V0_RawSave): RawSave {
  return {
    v: SAVE_VERSION,
    pokemons: V0_upgradeRawPokemonList(raw.pokemon),
    regions: raw.regions,
    strictness: raw.strictness,
    pokedexMode: V0_upgradePokedexModeKey(raw.pokedexFormat),
    customIcons: { all: {} },
  };
}

/* -------------------------------------------------------------------------- */
/*                                Pokedex Mode                                */
/* -------------------------------------------------------------------------- */

/**
 * Pokedex Mode V0:
 *  - Text is called legacyText.
 */

export type V0_PokedexModeKey = "icons" | "names" | "legacyText";

export function V0_upgradePokedexModeKey(raw: V0_PokedexModeKey): PokedexModeKey {
  return raw === "legacyText" ? "text" : raw;
}
