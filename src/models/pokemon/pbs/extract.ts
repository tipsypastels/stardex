import type { RawPokemonList } from "../list";
import { POKEMON_LIST_VERSION } from "../versioned";
import type { PBSRecord } from "./parse";

export interface ExtractPBSPokemonRecordsToRawPokemonListOptions {
  records: PBSRecord[];
  shouldSkipRecordWithSection?(section: string): boolean;
}

export function extractPBSPokemonRecordsToRawPokemonList({
  records,
  shouldSkipRecordWithSection,
}: ExtractPBSPokemonRecordsToRawPokemonListOptions) {
  const raw: RawPokemonList = { v: POKEMON_LIST_VERSION, all: [] };

  for (const record of records) {
    if (shouldSkipRecordWithSection?.(record.section)) {
      continue;
    }

    const speciesName = record.fields.name;
    if (!speciesName) {
      continue;
    }

    // const species = getPBSRecordSectionSpecies(record.section, speciesName);
  }

  return raw;
}

// Remember to account for returning a known alt with modified types.
