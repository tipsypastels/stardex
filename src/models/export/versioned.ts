import * as v from "valibot";
import type { RawJSONExport } from ".";
import { V0_PokedexModeKey, V0_upgradePokedexModeKey } from "../pokedex/mode/versioned";
import { V0_RawPokemonList, V0_upgradeRawPokemonList } from "../pokemon/versioned";
import { RegionKey } from "../region";
import { StrictnessKey } from "../strictness";
import { EXCLUDED_TYPES_VERSION } from "../type/excluded";

export const JSON_EXPORT_VERSION = 1;

/**
 * Export V0:
 *  - No explicit version.
 *  - Pokemons is called pokemon.
 *  - Pokedex mode is called pokedex format.
 *  - Missing custom icons and excluded types.
 */

export const V0_RawJSONExport = v.object({
  pokemon: V0_RawPokemonList,
  regions: v.array(RegionKey),
  strictness: StrictnessKey,
  pokedexFormat: V0_PokedexModeKey,
});

export function V0_upgradeRawJSONExport(
  raw: v.InferOutput<typeof V0_RawJSONExport>,
): RawJSONExport {
  return {
    v: JSON_EXPORT_VERSION,
    pokemons: V0_upgradeRawPokemonList(raw.pokemon),
    regions: raw.regions,
    strictness: raw.strictness,
    pokedexMode: V0_upgradePokedexModeKey(raw.pokedexFormat),
    customIcons: { dataUrls: {} },
    excludedTypes: { v: EXCLUDED_TYPES_VERSION, all: [] },
  };
}
