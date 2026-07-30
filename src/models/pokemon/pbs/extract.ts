import type { RawPokemon } from "..";
import { assert } from "../../../utils/assert";
import { id } from "../../../utils/id";
import type { RawPokemonList } from "../list";
import type { Species } from "../species";
import { POKEMON_LIST_VERSION, POKEMON_VERSION } from "../versioned";
import type { PBSFormFilterBucket, PBSFormFilterBucketEntry } from "./form";
import type { PBSRecord } from "./parse";
import { getPBSRecordSectionSpecies } from "./species";

export interface ExtractPBSPokemonRecordsToRawPokemonListOptions {
  records: PBSRecord[];
  sectionSpec?: string[];
  extractForms?(section: string, species: Species | undefined): ExtractedForms | undefined;
}

export function extractPBSPokemonRecordsToRawPokemonList(
  options: ExtractPBSPokemonRecordsToRawPokemonListOptions,
) {
  const out: RawPokemonList = { v: POKEMON_LIST_VERSION, all: [] };
  const records = options.sectionSpec
    ? applySectionSpec(options.records, options.sectionSpec)
    : options.records;

  for (const record of records) {
    const speciesName = record.fields.name;
    if (!speciesName) {
      continue;
    }

    const species = getPBSRecordSectionSpecies(record.section, speciesName);
    const forms = options.extractForms?.(record.section, species);

    if (!forms?.replaceBase) {
      // TODO: Account for type changes.
      if (species) {
        out.all.push({
          v: POKEMON_VERSION,
          id: id(),
          species: species.key,
        });
      } else if (record.fields.types) {
        const types = record.fields.types.toLowerCase().split(/\s*,\s*/);
        out.all.push({
          v: POKEMON_VERSION,
          id: id(),
          name: speciesName,
          types,
        });
      }
    }

    if (forms) {
      out.all.push(...forms.asPokemons);
    }
  }

  return out;
}

function applySectionSpec(records: PBSRecord[], sectionSpec: string[]) {
  const specIndicesMap = new Map(sectionSpec.map((s, i) => [s, i]));
  return records
    .filter((record) => specIndicesMap.has(record.section))
    .sort((left, right) => specIndicesMap.get(left.section)! - specIndicesMap.get(right.section)!);
}

/* -------------------------------------------------------------------------- */
/*                                    Forms                                   */
/* -------------------------------------------------------------------------- */

interface ExtractedForms {
  asPokemons: Iterable<RawPokemon>;
  replaceBase: boolean;
}

export function createPBSFormRecordsExtractor(_records: PBSRecord[]) {
  return () => undefined;
}

export function createPBSFormBucketsExtractor(
  buckets: PBSFormFilterBucket[],
  choices: ("add" | "replace" | "omit")[],
) {
  assert(
    buckets.length === choices.length,
    `Can't create a PBS form buckets extractor with length mismatches (${buckets.length} and ${choices.length})`,
  );

  interface SectionForms {
    entries: PBSFormFilterBucketEntry[];
    replaceBase: boolean;
  }

  const sectionsToSectionForms = new Map<string, SectionForms>();

  for (let i = 0; i < buckets.length; i++) {
    const bucket = buckets[i];
    const choice = choices[i];

    if (choice === "omit") {
      continue;
    }

    for (const entry of bucket.entries) {
      const sectionForms = sectionsToSectionForms.get(entry.section) ?? {
        entries: [],
        replaceBase: false,
      };

      sectionForms.entries.push(entry);
      sectionForms.replaceBase ||= choice === "replace";
      sectionsToSectionForms.set(entry.section, sectionForms);
    }
  }

  return (section: string): ExtractedForms | undefined => {
    const sectionForms = sectionsToSectionForms.get(section);
    if (!sectionForms) return;

    const asPokemons = sectionForms.entries.map((entry): RawPokemon => {
      switch (entry.resolutionInfo.kind) {
        case "known": {
          return {
            v: POKEMON_VERSION,
            id: id(),
            species: entry.resolutionInfo.speciesKey,
            alt: entry.resolutionInfo.altKind,
          };
        }
        case "known-custom-type-icon": {
          return {
            v: POKEMON_VERSION,
            id: id(),
            species: entry.resolutionInfo.speciesKey,
            types: entry.resolutionInfo.typeKeys,
          };
        }
        case "custom": {
          return {
            v: POKEMON_VERSION,
            id: id(),
            species: entry.resolutionInfo.speciesKey,
            customAltName: entry.formName,
          };
        }
        case "unknown": {
          throw new Error(
            "TODO: These need to specify types. Or fallback to the base case? But how to get it? Do it in the bucket builder.",
          );
          // return {
          //   v: POKEMON_VERSION,
          //   id: id(),
          //   name: entry.resolutionInfo.speciesName,
          // };
        }
      }
    });

    return { asPokemons, replaceBase: sectionForms.replaceBase };
  };
}
